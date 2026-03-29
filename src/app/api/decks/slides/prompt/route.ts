import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabase } from "@/lib/supabase";
import { saveVersionSnapshot } from "@/app/decks/lib/slides-db";

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
- Use <img> for images
- No .map() or JS expressions
- The frontmatter is separate from the content
- Ensure all JSX tags are properly closed.`;

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

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullText = "";
        try {
          if (slideId) await saveVersionSnapshot(slideId, "ai_prompt");

          for await (const chunk of stream) {
            const text = chunk.text;
            fullText += text;
            controller.enqueue(encoder.encode(text));
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
            const supabase = getSupabase();
            if (supabase) {
              await supabase.from("deck_slides").update({
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
