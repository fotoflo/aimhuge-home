import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_MODEL } from "@/lib/gemini";
import { upsertSlide } from "@/app/decks/lib/slides-db";

export async function POST(req: NextRequest) {
  try {
    const { deckSlug, context } = await req.json();
    if (!deckSlug || !context) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase error");
    
    const { data: slides } = await supabase
      .from("deck_slides")
      .select("slide_order")
      .eq("deck_slug", deckSlug)
      .order("slide_order", { ascending: false })
      .limit(1);
    
    let nextOrder = 10;
    if (slides && slides.length > 0) {
      nextOrder = slides[0].slide_order + 10;
    }

    const prompt = `You are an expert executive presentation designer.
Read the following context and extract a logically ordered presentation.
Transform the content into highly impactful, minimal slides.
Do NOT output "wall of text" slides. Keep them punchy with 1-3 crisp bullet points or a single powerful statement.

Output a strictly formatted JSON array of slide objects. Each object MUST have:
- \`frontmatter\`: an object with \`title\` (string), \`level\` (number, 0 for main, 1 for sub), \`variant\` (string: either "dark", "light", or "accent").
- \`mdx_content\`: a string containing the markdown content of the slide (must include an H2 heading representing the slide, followed by bullets or paragraphs. e.g. \`## Slide Title\\n\\nContent\`).

Input Text:
${context}
`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "";
    const parsedSlides = JSON.parse(text);

    if (!Array.isArray(parsedSlides)) throw new Error("Invalid format from AI");

    const insertedIds = [];
    for (const s of parsedSlides) {
      const inserted = await upsertSlide(
        deckSlug, 
        nextOrder, 
        s.frontmatter || { title: "Untitled", level: 0, variant: "dark" }, 
        s.mdx_content || "## Content"
      );
      insertedIds.push(inserted.id);
      nextOrder += 10;
    }

    return NextResponse.json({ success: true, slides: insertedIds.length });
  } catch (err: unknown) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
