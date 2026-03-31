import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { DEFAULT_MODEL, generateSlideEmbedding } from "@/lib/gemini";
import { logAiUsage } from "@/lib/ai-telemetry";
import { getSimilarSlides, updateSlideTips } from "@/app/decks/lib/slides-db";
import { getSupabase } from "@/lib/supabase";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const getSystemPrompt = (style: string = "premium") => {
  let styleInstructions = "";
  
  switch (style) {
    case "edgy":
      styleInstructions = `Focus entirely on avant-garde, boundary-pushing layout design:
- Suggest BOLD, radically creative ideas (e.g., editorial magazine layouts, brutalist geometry, unconventional asymmetry, dramatic overlapping elements).
- Do not hold back: push the aesthetic to be hyper-modern and completely unexpected, while still being beautiful.`;
      break;
    case "minimalist":
      styleInstructions = `Focus entirely on extreme minimalism and visual clarity:
- Suggest layouts with massive amounts of negative space, hyper-focused single focal points, and absolute reduction of clutter.
- Strip away all non-essential decorative elements. Think high-fashion lookbooks or Swiss design posters.`;
      break;
    case "analytical":
      styleInstructions = `Focus entirely on data-heavy, analytical presentation:
- Suggest highly structured layouts: dense but legible multi-column metric dashboards, clear infographic-style data points, and precision alignment.
- Keep the aesthetic sharp, trustworthy, and firmly professional like an elite financial report or Bloomberg terminal.`;
      break;
    case "punchy":
      styleInstructions = `Focus entirely on making the written content razor-sharp and punchy:
- Suggest rewriting the text to be significantly shorter and more impactful, using active voice and power verbs.
- Eliminate filler words, corporate jargon, and long paragraphs. Suggest replacing dense text with sharp, punchy statements.`;
      break;
    case "expand":
      styleInstructions = `Focus entirely on elaborating and enriching the written content:
- Suggest adding more strategic depth, specific examples, or explanatory text to flesh out the current points.
- Identify areas where the narrative is too brief or assumes too much, and suggest specific deep-dives, data points, or analogies to add.`;
      break;
    case "storytelling":
      styleInstructions = `Focus entirely on elevating the narrative and storytelling:
- Suggest framing the slide's content around a compelling narrative arc, user journey, or emotional hook.
- Recommend specific metaphors, anecdotes, or narrative structures to make the dry points more relatable, human, and deeply memorable.`;
      break;
    case "premium":
      styleInstructions = `Focus entirely on clean, highly-polished, and structural layout refinements:
- Suggest elegant multi-column grids, sophisticated typography hierarchies, precise card-based groupings, strategic use of whitespace, and balanced, professional composition.
- Avoid overly radical, "edgy", or messy "avant-garde" designs. Keep the aesthetic sharp, trustworthy, and firmly professional. Think Apple or Stripe design language.`;
      break;
    default:
      if (!style || style.trim() === "premium" || style.trim() === "") {
        styleInstructions = `Focus entirely on clean, highly-polished, and structural layout refinements:
- Suggest elegant multi-column grids, sophisticated typography hierarchies, precise card-based groupings, strategic use of whitespace, and balanced, professional composition.
- Avoid overly radical, "edgy", or messy "avant-garde" designs. Keep the aesthetic sharp, trustworthy, and firmly professional. Think Apple or Stripe design language.`;
      } else {
        styleInstructions = `Focus on the following custom instruction:
- ${style}`;
      }
      break;
  }

  return `You are a visionary presentation expert. Given a slide's current layout, MDX content, and narrative context, provide 3 to 5 actionable, zero-fluff suggestions to elevate the slide.

${styleInstructions}

Do not suggest generic, boring corporate formatting like "add a bullet point" or "make the title larger". Ensure all suggestions maintain a premium standard.
If the slide is dense or tries to cover too many points, you MUST forcefully suggest breaking it down into 2 or 3 separate, highly impactful slides.

Important Capabilities & Constraints:
- The slide canvas is fixed at 1920x1080.
- Leverage the narrative context (TOC, Before/After slides) AND the Semantically Related Slides (if provided) to ensure this slide doesn't repeat points made earlier. If this slide is highly similar to a related slide, suggest maintaining visual consistency with its layout or strongly differentiating the narrative focus.
- Suggest high-end architectural treatments using components like <Card>, <Stat>, <Tag>, and <Icon name="IconName" /> (\`lucide-react\`).
- Explicitly suggest using the \`generate_image\` AI tool for specific background imagery OR, if actual 'Approved Image Assets (Gallery)' URLs are provided in the brand context below, explicitly prefer suggesting those URLs (e.g. "Use the real brand photo https://... for the hero section") over generating fake AI images or keeping placeholders.
- The editor features a built-in AI image generator. You can suggest adding realistic, generated photos to illustrate points.

Return your suggestions as a strict JSON array of strings, with NO markdown formatting or additional text. Example:
["Since the next slide covers the specific skills, shorten these bullet points to focus only on the organizational timeline", "Use the <Icon name='Vault' /> component instead of bullet points to emphasize security", "Add a realistic generated photo of a server room to the right column"]`;
};

export async function POST(req: NextRequest) {
  try {
    const { deckSlug, slideId, image, currentSlide, previousSlide, nextSlide, toc, style } = await req.json();

    let similarSlidesContext = "";
    try {
      if (currentSlide?.content && deckSlug) {
        const title = currentSlide.frontmatter?.title || "Untitled";
        const subtitle = currentSlide.frontmatter?.subtitle || "";
        const textToEmbed = `Title: ${title}\nSubtitle: ${subtitle}\nContent:\n${currentSlide.content}`;
        const queryEmbedding = await generateSlideEmbedding(textToEmbed);
        
        // Fetch up to 2 related slides, excluding the current one, similarity > 0.75
        const similarSlides = await getSimilarSlides(queryEmbedding, deckSlug, slideId, 0.75, 2);
        if (similarSlides.length > 0) {
          similarSlidesContext = `\n--- SEMANTICALLY RELATED SLIDES ---\nThese structurally/thematically related slides exist elsewhere in the deck:\n`;
          similarSlides.forEach((s) => {
            similarSlidesContext += `\n[Related Slide: ${s.frontmatter?.title || 'Untitled'} (Similarity: ${Math.round(s.similarity * 100)}%)]:\n`;
            similarSlidesContext += `Frontmatter: ${JSON.stringify(s.frontmatter)}\n`;
            similarSlidesContext += `Content:\n${s.mdx_content}\n`;
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch similar slides for suggestions context", e);
    }

    // Connect to Brands Table
    const supabase = getSupabase();
    let brandContext = "";
    if (supabase && deckSlug) {
      const { data: deck } = await supabase.from("decks").select("brand_slug").eq("deck_slug", deckSlug).single();
      if (deck?.brand_slug) {
        const { data: brand } = await supabase.from("brands").select("*").eq("slug", deck.brand_slug).single();
        if (brand) {
           brandContext = `
--- GLOBAL BRAND DESIGN SYSTEM ---
Client/Brand: ${brand.name}
Approved Color Palette: ${JSON.stringify(brand.colors)}
Company Narrative / Tone (Scraped): ${brand.scraped_context}
Mandatory Slide Formatting Guidelines: ${brand.guidelines}
Approved Image Assets (Gallery): ${JSON.stringify(brand.images || [])}
----------------------------------
`;
        }
      }
    }

    const contextText = `
${getSystemPrompt(style)}
${brandContext}
--- THE PRESENTATION NARRATIVE ---
Table of Contents:
${JSON.stringify(toc, null, 2)}

${previousSlide ? `[Previous Slide]:
Frontmatter: ${JSON.stringify(previousSlide.frontmatter)}
Content:
${previousSlide.content}` : "[Previous Slide]: None (This is the first slide)"}

${nextSlide ? `[Next Slide]:
Frontmatter: ${JSON.stringify(nextSlide.frontmatter)}
Content:
${nextSlide.content}` : "[Next Slide]: None (This is the last slide)"}
${similarSlidesContext}
--- CURRENT SLIDE ---
Frontmatter: ${JSON.stringify(currentSlide.frontmatter)}
Content:
${currentSlide.content}
`;

    const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [
      { text: contextText }
    ];

    if (image) {
      try {
        const imgRes = await fetch(image);
        if (imgRes.ok) {
          const buffer = await imgRes.arrayBuffer();
          parts.push({
            inlineData: { data: Buffer.from(buffer).toString("base64"), mimeType: "image/webp" },
          });
        }
      } catch { /* ignore fetch errors for optional image */ }
    }

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text?.trim() ?? "[]";

    if (response.usageMetadata) {
      logAiUsage({
        endpoint: "suggestions",
        model: DEFAULT_MODEL,
        promptTokens: response.usageMetadata.promptTokenCount,
        completionTokens: response.usageMetadata.candidatesTokenCount,
        totalTokens: response.usageMetadata.totalTokenCount,
        slideId,
        deckSlug
      });
    }

    let suggestions: string[] = [];
    try {
      suggestions = JSON.parse(text);
      if (!Array.isArray(suggestions)) suggestions = [];
    } catch {
      console.warn("Invalid suggestion JSON:", text);
    }

    if (suggestions.length > 0) {
      // Fire and forget updating the tips in DB
      updateSlideTips(slideId, suggestions).catch((err) => 
        console.error("Failed to save suggestions to DB:", err)
      );
    }

    return NextResponse.json({ suggestions });
  } catch (error: unknown) {
    console.error("Suggestions error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
