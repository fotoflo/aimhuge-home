import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabase } from "@/lib/supabase";
import { saveVersionSnapshot } from "@/app/decks/lib/slides-db";
import { DEFAULT_MODEL, IMAGE_MODEL } from "@/lib/gemini";

export const maxDuration = 60;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are an AI slide copilot. Explain your changes conversationally, then output the updated slide code.

Rules for output:
1. Start with a plain text conversational explanation of what you are doing.
2. Provide the NEW slide MDX content wrapped strictly inside a \`\`\`mdx code fence.
3. If frontmatter (variant, title, subtitle, sectionLabel) needs changing, provide it as a JSON object inside a \`\`\`json code fence.

Important MDX Rules:
- The slide canvas is strictly fixed at 1920x1080 resolution. Ensure typography scaling, spacing, and image alignment respect these grid bounds. Avoid excessive text wrapping.
- Use className (not class)
- Use <div> not <p> for text
- Available components: <Card accent="purple|blue|green|amber|red" small?>, <CardTitle>, <CardText>, <Stat>, <Tag>
- For icons, use <Icon name="Name" /> (where name is a valid lucide-react PascalCase icon name, like "Lock", "Unlock", "Shield"). DO NOT use <img> for icons, use <Icon />.
- Use <img> only for actual photos. You can call the generate_image tool to build these dynamically.
- No .map() or JS expressions
- The frontmatter is separate from the content
- Ensure all JSX tags are properly closed.`;

async function generateAndUploadImage(imgPrompt: string) {
  const fetch = globalThis.fetch;
  const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
  const finalPrompt = `${imgPrompt}. Aspect ratio 16:9. Realistic standard.`;

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: finalPrompt }] }],
      generationConfig: { responseModalities: ["IMAGE", "TEXT"], temperature: 0.8 },
    }),
  });
  
  if (!response.ok) throw new Error("Image gen failed");
  
  const data = await response.json();
  const partsArray = data.candidates?.[0]?.content?.parts || [];
  const imagePart = partsArray.find((p: { inlineData?: unknown }) => p.inlineData);
  if (!imagePart) throw new Error("No image data returned.");

  const buffer = Buffer.from(imagePart.inlineData.data, "base64");
  
  const supabaseServer = getSupabase();
  if (!supabaseServer) throw new Error("No supabase configured.");
  
  const path = `generated/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
  const { error } = await supabaseServer.storage
    .from("deck-assets")
    .upload(path, buffer, { contentType: "image/png" });
    
  if (error) throw new Error(error.message);
  
  const { data: { publicUrl } } = supabaseServer.storage.from("deck-assets").getPublicUrl(path);
  return publicUrl;
}

export async function POST(req: NextRequest) {
  const { slideId, currentContent, currentFrontmatter, prompt, image } = await req.json();

  if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

  const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [{ text: `${SYSTEM_PROMPT}\n\nCurrent frontmatter:\n${JSON.stringify(currentFrontmatter, null, 2)}\n\nCurrent slide content:\n${currentContent}\n\nUser request: ${prompt}` }];

  if (image) {
    try {
      const imgRes = await fetch(image);
      if (imgRes.ok) {
        const buffer = await imgRes.arrayBuffer();
        parts.push({
          inlineData: { data: Buffer.from(buffer).toString("base64"), mimeType: "image/webp" },
        });
      }
    } catch {}
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any[] = [{ role: "user", parts }];
  const tools = [{
    functionDeclarations: [{
      name: "generate_image",
      description: "Generate a custom photographic or detailed image to use inside the slide. Returns the public URL.",
      parameters: { type: "OBJECT", properties: { prompt: { type: "STRING", description: "Detailed visual description of the image to generate" } }, required: ["prompt"] }
    }]
  }];

  try {
    const stream = await ai.models.generateContentStream({
      model: DEFAULT_MODEL,
      contents: messages,
      tools
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          if (slideId) await saveVersionSnapshot(slideId, "ai_prompt");

          let fullText = "";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let toolCall: any = null;

          for await (const chunk of stream) {
            if (chunk.functionCalls && chunk.functionCalls.length > 0) {
               toolCall = chunk.functionCalls[0];
               break; // Stop streaming text if tool is invoked
            }
            if (chunk.text) {
              fullText += chunk.text;
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          
          if (toolCall && toolCall.name === "generate_image") {
            try {
              controller.enqueue(encoder.encode(`\n*Generating image: "${toolCall.args.prompt}"...*\n`));
              const url = await generateAndUploadImage(toolCall.args.prompt);
              
              messages.push({ role: "model", parts: [{ functionCall: toolCall }] });
              messages.push({ role: "tool", parts: [{ functionResponse: { name: toolCall.name, response: { url } } }] });
              
              const stream2 = await ai.models.generateContentStream({
                 model: DEFAULT_MODEL,
                 contents: messages,
                 tools
              });

              for await (const chunk of stream2) {
                if (chunk.text) {
                  fullText += chunk.text;
                  controller.enqueue(encoder.encode(chunk.text));
                }
              }
            } catch (err: unknown) {
               controller.enqueue(encoder.encode(`\n*(Image generation failed: ${err instanceof Error ? err.message : String(err)})*\n`));
            }
          }
          
          let finalMdx = currentContent;
          let finalFm = currentFrontmatter;
          
          const mdxMatch = fullText.match(/\`\`\`mdx\n([\s\S]*?)\`\`\`/);
          if (mdxMatch) finalMdx = mdxMatch[1].trim();
          
          const jsonMatch = fullText.match(/\`\`\`json\n([\s\S]*?)\`\`\`/);
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[1]);
              finalFm = { ...currentFrontmatter, ...parsed };
            } catch {}
          }
          
          if (slideId) {
            const supabaseServer = getSupabase();
            if (supabaseServer) {
              await supabaseServer.from("deck_slides").update({
                mdx_content: finalMdx,
                frontmatter: finalFm,
                updated_at: new Date().toISOString(),
              }).eq("id", slideId);
            }
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      }
    });

    return new Response(readable, { headers: { "Content-Type": "text/plain" } });
  } catch {
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
