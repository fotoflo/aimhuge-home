import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { DEFAULT_MODEL, generateSlideEmbedding } from "@/lib/gemini";
import { logAiUsage } from "@/lib/ai-telemetry";
import { getSimilarSlides } from "@/app/decks/lib/slides-db";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT_PREFIX = `You are a premium, high-end presentation layout designer. Given a slide's current layout, MDX content, and narrative context, provide 3 to 5 actionable, zero-fluff suggestions to elevate the aesthetic.

Focus entirely on clean, highly-polished, and structural layout refinements:
- Suggest elegant multi-column grids, sophisticated typography hierarchies, precise card-based groupings, strategic use of whitespace, and balanced, professional composition.
- Avoid overly radical, "edgy", or messy "avant-garde" designs (no brutalist geometry or chaotic asymmetry). Keep the aesthetic sharp, trustworthy, and firmly professional. Think Apple or Stripe design language.

Do not suggest generic, boring corporate formatting like "add a bullet point" or "make the title larger". Ensure all suggestions maintain a premium, state-of-the-art design standard.
If the slide is dense or tries to cover too many points, you MUST forcefully suggest breaking it down into 2 or 3 separate, highly impactful slides.

Important Capabilities & Constraints:
- The slide canvas is fixed at 1920x1080.
- Leverage the narrative context (TOC, Before/After slides) AND the Semantically Related Slides (if provided) to ensure this slide doesn't repeat points made earlier. If this slide is highly similar to a related slide, suggest maintaining visual consistency with its layout or strongly differentiating the narrative focus.
- Suggest high-end architectural treatments using components like <Card>, <Stat>, <Tag>, and <Icon name="IconName" /> (\`lucide-react\`).
- Explicitly suggest using the \`generate_image\` AI tool for specific, atmospheric, or photorealistic background imagery or side-column accents (e.g. "Generate a moody, neon-lit server room for the left column...").
- The editor features a built-in AI image generator. You can suggest adding realistic, generated photos to illustrate points.

Return your suggestions as a strict JSON array of strings, with NO markdown formatting or additional text. Example:
["Since the next slide covers the specific skills, shorten these bullet points to focus only on the organizational timeline", "Use the <Icon name='Vault' /> component instead of bullet points to emphasize security", "Add a realistic generated photo of a server room to the right column"]`;

export async function POST(req: NextRequest) {
  try {
    const { deckSlug, slideId, image, currentSlide, previousSlide, nextSlide, toc } = await req.json();

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

    const contextText = `
${SYSTEM_PROMPT_PREFIX}

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

    return NextResponse.json({ suggestions });
  } catch (error: unknown) {
    console.error("Suggestions error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
