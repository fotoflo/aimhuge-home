import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_MODEL } from "@/lib/gemini";
import { upsertSlide } from "@/app/decks/lib/slides-db";

export async function POST(req: NextRequest) {
  try {
    const { deckSlug, outline } = await req.json();
    if (!deckSlug || !Array.isArray(outline)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase error");

    const { data: deck } = await supabase
      .from("decks")
      .select("brand_slug")
      .eq("deck_slug", deckSlug)
      .single();

    let brandContext = "";
    if (deck?.brand_slug) {
      const { data: brand } = await supabase
        .from("brands")
        .select("name, guidelines, scraped_context")
        .eq("slug", deck.brand_slug)
        .single();
      
      if (brand) {
        brandContext = `
[MANDATORY BRAND GUIDELINES - ${brand.name}]
${brand.guidelines || "No explicit styling guidelines provided."}

[BRAND SCRAPED CONTEXT & KNOWLEDGE]
${brand.scraped_context || "No contextual background knowledge provided."}

CRITICAL INSTRUCTION: You MUST apply the brand guidelines and tone to the content. Use the brand's specific language style, structural rules, and aesthetic directives outlined above.
`;
      }
    }

    // Pass the whole array to one prompt for holistic consistency and speed
    const prompt = `You are an expert executive presentation designer.
Read the following approved slide outline and generate the finalized MDX presentation.
Transform the content into highly impactful, minimal slides.
Do NOT output "wall of text" slides. Keep them punchy with 1-3 crisp bullet points or a single powerful statement.

OUTPUT FORMAT:
Output a strictly formatted JSON array of slide objects corresponding exactly to the provided outline length and order. Each object MUST have:
- \`frontmatter\`: an object with \`title\` (string), \`level\` (number, 0 for main, 1 for sub), \`variant\` (string: either "dark", "light", or "accent"). Use the provided visual prompts to determine variants.
- \`mdx_content\`: a string containing the markdown content of the slide (must include an H2 heading representing the slide, followed by bullets or paragraphs. e.g. \`## Slide Title\\n\\nContent\`).

${brandContext}

APPROVED OUTLINE (Adhere strictly to these slides):
${JSON.stringify(outline, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    const parsedSlides = JSON.parse(text);

    if (!Array.isArray(parsedSlides)) throw new Error("Invalid format from AI");

    const insertedIds = [];
    for (let i = 0; i < parsedSlides.length; i++) {
        const outlineSlide = outline[i];
        const s = parsedSlides[i] || {};
        
        // Ensure robust structure parsing
        const orderToUse = outlineSlide?.order || (i + 1) * 10;
        const frontmatter = s.frontmatter || { title: outlineSlide?.title || "Untitled", level: 0, variant: "dark" };
        const mdxContent = s.mdx_content || `## ${outlineSlide?.title || "Content"}\n\nCould not generate.`;
        
        const inserted = await upsertSlide(deckSlug, orderToUse, frontmatter, mdxContent);
        insertedIds.push(inserted.id);
    }

    return NextResponse.json({ success: true, slides: insertedIds.length });
  } catch (err: unknown) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
