import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabase } from "@/lib/supabase";
import { saveVersionSnapshot } from "@/app/decks/lib/slides-db";
import { logAiUsage } from "@/lib/ai-telemetry";
import { DEFAULT_MODEL, IMAGE_MODEL } from "@/lib/gemini";

export const maxDuration = 60;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are an AI slide copilot focusing on BOLD, production-grade frontend aesthetics. Explain your changes conversationally, then output the updated slide code.

Rules for output:
1. Start with a plain text conversational explanation of what you are doing.
2. ALWAYS call the \`apply_slide_changes\` tool when you have finished generating the changes. Pass the final updated MDX and frontmatter for the current slide.
3. If you want to break the current slide into MULTIPLE slides: use the \`additional_slides\` array in the \`apply_slide_changes\` tool to provide the content for brand new slides that should be inserted immediately after!

Creative & Aesthetic Guidelines:
- Commit to a BOLD aesthetic direction (e.g. brutally minimal, editorial/magazine, brutalist/raw, geometric). Absolutely NO generic, cookie-cutter "AI slop" aesthetics.
- Spatial Composition: Break the grid creatively! Use unexpected layouts, asymmetry, overlapping elements, or generous negative space.
- Typography & Polish: Ensure refined typographic spacing, high-end visual details, and meticulous polish.

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
  const { deckSlug, slideId, currentContent, currentFrontmatter, prompt, image } = await req.json();

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tools: any[] = [{
    functionDeclarations: [{
      name: "generate_image",
      description: "Generate a custom photographic or detailed image to use inside the slide. Returns the public URL.",
      parameters: { type: "OBJECT", properties: { prompt: { type: "STRING", description: "Detailed visual description of the image to generate" } }, required: ["prompt"] }
    }, {
      name: "apply_slide_changes",
      description: "Apply the final MDX and frontmatter to the current slide. Optionally provide additional slides if splitting content.",
      parameters: {
        type: "OBJECT",
        properties: {
          current_slide_mdx: { type: "STRING", description: "The NEW updated MDX content for the current slide." },
          current_slide_frontmatter: { type: "OBJECT", description: "The NEW updated JSON frontmatter." },
          additional_slides: {
            type: "ARRAY",
            description: "Optional. Brand new slides to be created and inserted sequentially after the current one.",
            items: {
              type: "OBJECT",
              properties: {
                mdx_content: { type: "STRING" },
                frontmatter: { type: "OBJECT" }
              },
              required: ["mdx_content", "frontmatter"]
            }
          }
        },
        required: ["current_slide_mdx", "current_slide_frontmatter"]
      }
    }]
  }];

  try {
    const stream = await ai.models.generateContentStream({
      model: DEFAULT_MODEL,
      contents: messages,
      config: { tools }
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          if (slideId) await saveVersionSnapshot(slideId, "ai_prompt");

          let fullText = "";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let finalToolCall: any = null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let totalUsage: any = null;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          async function processStream(currentStream: any) {
            for await (const chunk of currentStream) {
              if (chunk.usageMetadata) {
                if (!totalUsage) totalUsage = chunk.usageMetadata;
                else {
                  totalUsage.promptTokenCount += chunk.usageMetadata.promptTokenCount || 0;
                  totalUsage.candidatesTokenCount += chunk.usageMetadata.candidatesTokenCount || 0;
                  totalUsage.totalTokenCount += chunk.usageMetadata.totalTokenCount || 0;
                }
              }
              if (chunk.functionCalls && chunk.functionCalls.length > 0) {
                const tCall = chunk.functionCalls[0];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tCallPart = chunk.candidates?.[0]?.content?.parts?.find((p: any) => p.functionCall);
                
                if (tCall.name === "generate_image") {
                  controller.enqueue(encoder.encode(`\n*Generating image: "${tCall.args.prompt}"...*\n`));
                  try {
                    const url = await generateAndUploadImage(tCall.args.prompt);
                    logAiUsage({ endpoint: "generate_image_tool_api", model: IMAGE_MODEL, imagesGenerated: 1, slideId, deckSlug });
                    messages.push({ role: "model", parts: [tCallPart || { functionCall: tCall }] });
                    messages.push({ role: "tool", parts: [{ functionResponse: { name: tCall.name, response: { url } } }] });
                    const nextStream = await ai.models.generateContentStream({ model: DEFAULT_MODEL, contents: messages, config: { tools } });
                    await processStream(nextStream);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } catch (err: any) {
                    controller.enqueue(encoder.encode(`\n*(Image generation failed: ${err?.message})*\n`));
                    messages.push({ role: "model", parts: [tCallPart || { functionCall: tCall }] });
                    messages.push({ role: "tool", parts: [{ functionResponse: { name: tCall.name, response: { error: err?.message } } }] });
                    const nextStream = await ai.models.generateContentStream({ model: DEFAULT_MODEL, contents: messages, config: { tools } });
                    await processStream(nextStream);
                  }
                  break;
                } else if (tCall.name === "apply_slide_changes") {
                  finalToolCall = tCall;
                  break;
                }
              }
              if (chunk.text) {
                fullText += chunk.text;
                controller.enqueue(encoder.encode(chunk.text));
              }
            }
          }

          await processStream(stream);
          
          if (slideId) {
            const supabaseServer = getSupabase();
            if (supabaseServer) {
              let mdxBlocks = [...fullText.matchAll(/```mdx\n([\s\S]*?)```/g)].map(m => m[1].trim());
              let jsonBlocks = [...fullText.matchAll(/```json\n([\s\S]*?)```/g)].map(m => m[1].trim());

              if (finalToolCall) {
                const { current_slide_mdx, current_slide_frontmatter, additional_slides } = finalToolCall.args;
                
                // Emulate the markdown streaming output so the frontend parses it flawlessly
                controller.enqueue(encoder.encode(`\n\`\`\`json\n${JSON.stringify(current_slide_frontmatter, null, 2)}\n\`\`\`\n`));
                controller.enqueue(encoder.encode(`\n\`\`\`mdx\n${current_slide_mdx}\n\`\`\`\n`));
                mdxBlocks = [current_slide_mdx];
                jsonBlocks = [JSON.stringify(current_slide_frontmatter)];

                if (additional_slides) {
                  for (const slide of additional_slides) {
                    controller.enqueue(encoder.encode(`\n\`\`\`json\n${JSON.stringify(slide.frontmatter, null, 2)}\n\`\`\`\n`));
                    controller.enqueue(encoder.encode(`\n\`\`\`mdx\n${slide.mdx_content}\n\`\`\`\n`));
                    mdxBlocks.push(slide.mdx_content);
                    jsonBlocks.push(JSON.stringify(slide.frontmatter));
                  }
                }
              }

              if (mdxBlocks.length === 0) {
                 // Fallback if formatting isn't perfect
                 let finalMdx = currentContent;
                 let finalFm = currentFrontmatter;
                 const mdxMatch = fullText.match(/```mdx\n([\s\S]*?)```/);
                 if (mdxMatch) finalMdx = mdxMatch[1].trim();
                 const jsonMatch = fullText.match(/```json\n([\s\S]*?)```/);
                 if (jsonMatch) {
                   try { finalFm = { ...currentFrontmatter, ...JSON.parse(jsonMatch[1]) }; } catch {}
                 }
                 
                 await supabaseServer.from("deck_slides").update({
                   mdx_content: finalMdx,
                   frontmatter: finalFm,
                   updated_at: new Date().toISOString(),
                 }).eq("id", slideId);
              } else {
                 // Update the primary slide
                 let firstFm = currentFrontmatter;
                 if (jsonBlocks[0]) {
                   try { firstFm = { ...currentFrontmatter, ...JSON.parse(jsonBlocks[0]) }; } catch {}
                 }
                 await supabaseServer.from("deck_slides").update({
                   mdx_content: mdxBlocks[0],
                   frontmatter: firstFm,
                   updated_at: new Date().toISOString(),
                 }).eq("id", slideId);
                 
                 // If the AI returned multiple slides, insert them dynamically
                 if (mdxBlocks.length > 1) {
                    const { data: allSlides } = await supabaseServer
                      .from("deck_slides")
                      .select("id, slide_order")
                      .eq("deck_slug", deckSlug)
                      .order("slide_order", { ascending: true });
                      
                    if (allSlides) {
                       const targetIdx = allSlides.findIndex(s => s.id === slideId);
                       if (targetIdx !== -1) {
                          const newSlides = [];
                          for (let i = 1; i < mdxBlocks.length; i++) {
                             let newFm = currentFrontmatter;
                             if (jsonBlocks[i]) {
                               try { newFm = { ...currentFrontmatter, ...JSON.parse(jsonBlocks[i]) }; } catch {}
                             }
                             newSlides.push({
                               id: crypto.randomUUID(),
                               deck_slug: deckSlug,
                               slide_order: 0,
                               frontmatter: newFm,
                               mdx_content: mdxBlocks[i],
                               updated_at: new Date().toISOString(),
                               deleted_at: null
                             });
                          }
                          
                          const combined = [...allSlides];
                          combined.splice(targetIdx + 1, 0, ...newSlides);
                          
                          const payload = combined.map((s, i) => ({ ...s, slide_order: (i + 1) * 10 }));
                          
                          // 1. Shift old slides to temporary negative orders to avoid uniqueness conflict
                          for (const s of allSlides) {
                             await supabaseServer.from("deck_slides").update({ slide_order: -(100000 + s.slide_order) }).eq("id", s.id);
                          }
                          // 2. Insert new slides
                          for (const newSlide of newSlides) {
                             newSlide.slide_order = payload.find(p => p.id === newSlide.id)?.slide_order || 0;
                             await supabaseServer.from("deck_slides").insert(newSlide);
                          }
                          // 3. Restore final new orders to old slides
                          for (const s of allSlides) {
                             const finalOrder = payload.find(p => p.id === s.id)?.slide_order || 0;
                             await supabaseServer.from("deck_slides").update({ slide_order: finalOrder }).eq("id", s.id);
                          }
                       }
                    }
                 }
              }
            }
          }
          if (totalUsage) {
            logAiUsage({
              endpoint: "copilot_prompt",
              model: DEFAULT_MODEL,
              promptTokens: totalUsage.promptTokenCount,
              completionTokens: totalUsage.candidatesTokenCount,
              totalTokens: totalUsage.totalTokenCount,
              slideId: slideId,
              deckSlug: deckSlug,
            });
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
