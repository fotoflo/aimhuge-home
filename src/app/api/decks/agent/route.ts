import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabase } from "@/lib/supabase";
import { logAiUsage } from "@/lib/ai-telemetry";
import { DEFAULT_MODEL } from "@/lib/gemini";

// Use Next.js 14 maximum duration since AI can take a while
export const maxDuration = 60;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are an expert Presentation Copilot. You have a god's-eye view of the entire deck.
Your job is to discuss the narrative arc, flow, and content of the slides.
You have tools to perform CRUD operations on the deck. Use them when the user asks you to modify the deck.
IMPORTANT RULES:
1. Be concise. The user wants quick action.
2. If the user asks you to move slides, use the reorder_deck tool. Provide ALL slide IDs in the new order.
3. If the user asks you to delete slides, use delete_slides.
4. If the user asks you to rewrite a slide's content, use update_slides.
5. You can use tools to perform actions immediately, but ALWAYS provide a short text response confirming what you did.

Never use Markdown code blocks to provide the slide MDX to the user if you can just use the update_slides tool instead.`;

export async function POST(req: NextRequest) {
  try {
    const { deckSlug, history, currentDeckState } = await req.json();

    if (!deckSlug || !history) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Format deck state for the LLM
    const formattedState = currentDeckState.map((s: Record<string, unknown>) => 
      `--- Slide ID: ${s.id} (Order: ${s.order}) ---\nFrontmatter: ${JSON.stringify(s.frontmatter)}\nContent:\n${s.content}\n`
    ).join("\n");

    const systemParts = [
      { text: SYSTEM_PROMPT },
      { text: `\n\nCURRENT DECK STATE:\n${formattedState}` }
    ];

    const messages = [];
    messages.push({ role: "user", parts: systemParts });
    
    // Append the actual history
    for (const msg of history) {
      messages.push({
        role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }]
      });
    }

    const tools = [{
      functionDeclarations: [
        {
          name: "reorder_deck",
          description: "Reorder slides in the deck.",
          parameters: {
            type: "OBJECT",
            properties: {
              slide_ids: { type: "ARRAY", items: { type: "STRING" }, description: "Array of slide IDs in the exact new order. YOU MUST include all slide IDs you want to keep." }
            },
            required: ["slide_ids"]
          }
        },
        {
          name: "delete_slides",
          description: "Delete one or more slides from the deck.",
          parameters: {
            type: "OBJECT",
            properties: {
              slide_ids: { type: "ARRAY", items: { type: "STRING" }, description: "Array of slide IDs to delete." }
            },
            required: ["slide_ids"]
          }
        },
        {
          name: "create_slides",
          description: "Create brand new slides at specific indices.",
          parameters: {
            type: "OBJECT",
            properties: {
              slides: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    insert_index: { type: "INTEGER", description: "The array index to insert the slide at (0 = beginning)." },
                    title: { type: "STRING" },
                    mdx_content: { type: "STRING", description: "The full MDX content for the new slide." }
                  },
                  required: ["insert_index", "title", "mdx_content"]
                }
              }
            },
            required: ["slides"]
          }
        },
        {
          name: "update_slides",
          description: "Update the MDX content and frontmatter of existing slides.",
          parameters: {
            type: "OBJECT",
            properties: {
              updates: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    slide_id: { type: "STRING" },
                    new_mdx: { type: "STRING", description: "The completely updated MDX content for the slide." },
                    title: { type: "STRING", description: "Optional updated title" }
                  },
                  required: ["slide_id", "new_mdx"]
                }
              }
            },
            required: ["updates"]
          }
        }
      ]
    }];

    // Execute the initial prompt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contents: messages as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: { tools: tools as any, temperature: 0.2 }
    });

    let finalResponseText = response.text || "";
    let needsRefresh = false;

    // Track usage
    if (response.usageMetadata) {
      logAiUsage({
        endpoint: "deck_agent_api",
        model: DEFAULT_MODEL,
        promptTokens: response.usageMetadata.promptTokenCount,
        completionTokens: response.usageMetadata.candidatesTokenCount,
        deckSlug
      });
    }

    // Process function calls if any
    if (response.functionCalls && response.functionCalls.length > 0) {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Database not connected");

      const toolResults = [];

      for (const call of response.functionCalls) {
        try {
          const args = call.args as Record<string, unknown>;
          if (!args) continue;

          if (call.name === "reorder_deck") {
            const ids: string[] = (args.slide_ids as string[]) || [];
            // Update the orders in the db
            for (let i = 0; i < ids.length; i++) {
              await supabase.from("deck_slides")
                .update({ slide_order: (i + 1) * 10, updated_at: new Date().toISOString() })
                .eq("id", ids[i])
                .eq("deck_slug", deckSlug);
            }
            needsRefresh = true;
            toolResults.push({ functionCall: { name: call.name, response: { success: true } } });
          } 
          else if (call.name === "delete_slides") {
            const ids: string[] = (args.slide_ids as string[]) || [];
            for (const id of ids) {
              await supabase.from("deck_slides")
                .update({ deleted_at: new Date().toISOString() })
                .eq("id", id)
                .eq("deck_slug", deckSlug);
            }
            needsRefresh = true;
            toolResults.push({ functionCall: { name: call.name, response: { success: true } } });
          }
          else if (call.name === "update_slides") {
            const updates: Record<string, unknown>[] = (args.updates as Record<string, unknown>[]) || [];
            for (const update of updates) {
              const slideId = update.slide_id as string;
              const newMdx = update.new_mdx as string;
              const updateTitle = update.title as string | undefined;
              
              const { data: row } = await supabase.from("deck_slides").select("frontmatter").eq("id", slideId).single();
              if (row) {
                const fm = (row.frontmatter as Record<string, unknown>) || {};
                if (updateTitle) fm.title = updateTitle;
                await supabase.from("deck_slides")
                  .update({ mdx_content: newMdx, frontmatter: fm, updated_at: new Date().toISOString() })
                  .eq("id", slideId);
              }
            }
            needsRefresh = true;
            toolResults.push({ functionCall: { name: call.name, response: { success: true } } });
          }
          else if (call.name === "create_slides") {
            const slides: Record<string, unknown>[] = (args.slides as Record<string, unknown>[]) || [];
            for (const s of slides) {
              const insertIndex = typeof s.insert_index === 'number' ? s.insert_index : 0;
              const title = typeof s.title === 'string' ? s.title : "New Slide";
              const mdxContent = typeof s.mdx_content === 'string' ? s.mdx_content : "";

              await supabase.from("deck_slides").insert({
                id: crypto.randomUUID(),
                deck_slug: deckSlug,
                slide_order: (insertIndex * 10) + 5, // Just put it somewhere in between, the user can reorder later, or we run reorder
                frontmatter: { title, variant: "dark", level: 0 },
                mdx_content: mdxContent,
                updated_at: new Date().toISOString()
              });
            }
            needsRefresh = true;
            toolResults.push({ functionCall: { name: call.name, response: { success: true } } });
          }
        } catch (e: unknown) {
          const err = e as Error;
          toolResults.push({ functionCall: { name: call.name, response: { error: err.message } } });
        }
      }

      // Instead of making the agent do a second round trip which is slow, we will just echo back the response text we got.
      // Often the agent provides a conversation summary ALONG with the function call!
      if (!finalResponseText) {
        finalResponseText = "I have updated the deck as requested.";
      }
    }

    return NextResponse.json({
      text: finalResponseText,
      needsRefresh
    });

  } catch (err: unknown) {
    const error = err as Error;
    console.error("Agent error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
