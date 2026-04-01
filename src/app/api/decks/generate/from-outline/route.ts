import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_MODEL } from "@/lib/gemini";
import { upsertSlide, updateEmbeddingForSlide } from "@/app/decks/lib/slides-db";

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
        .select("name, guidelines, scraped_context, images")
        .eq("slug", deck.brand_slug)
        .single();
      
      if (brand) {
        brandContext = `
[MANDATORY BRAND GUIDELINES - ${brand.name}]
${brand.guidelines || "No explicit styling guidelines provided."}

[BRAND SCRAPED CONTEXT & KNOWLEDGE]
${brand.scraped_context || "No contextual background knowledge provided."}

[BRAND SCRAPED IMAGES]
${brand.images && brand.images.length > 0 ? JSON.stringify(brand.images) : "No brand images available."}

CRITICAL INSTRUCTION: You MUST apply the brand guidelines and tone to the content. Use the brand's specific language style, structural rules, and aesthetic directives outlined above.
If the visual prompt or content suggests a visual or background image, you MUST pick an appropriate image from the [BRAND SCRAPED IMAGES] provided above and use it.
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
- \`frontmatter\`: an object with \`title\` (string), \`level\` (number, 0 for main, 1 for sub), \`variant\` (string: either "dark", "light", or "accent"). 
  If the visual prompt suggests a background image, you MUST add a \`backgroundImage\` key to this object, selecting the most appropriate image URL from the [BRAND SCRAPED IMAGES]. You can also specify a \`backgroundOverlay\` (e.g., "bg-black/50" or "bg-[#111114]/80").
- \`mdx_content\`: a string containing the markdown content of the slide (must include an H2 heading representing the slide, followed by bullets or paragraphs. e.g. \`## Slide Title\\n\\nContent\`). 
  If the visual prompt suggests placing an image inline instead of as a background, you MUST embed it using standard markdown syntax or an HTML \`<img>\` tag, picking an appropriate image from the [BRAND SCRAPED IMAGES].

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

    // Generate embeddings in parallel for all newly created slides
    await Promise.allSettled(insertedIds.map(id => updateEmbeddingForSlide(id)));

    return NextResponse.json({ success: true, slides: insertedIds.length });
  } catch (err: unknown) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
