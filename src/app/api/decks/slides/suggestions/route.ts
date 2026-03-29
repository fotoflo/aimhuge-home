import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { DEFAULT_MODEL } from "@/lib/gemini";
import { logAiUsage } from "@/lib/ai-telemetry";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT_PREFIX = `You are a visionary, highly opinionated presentation layout designer. Given a slide's current layout, MDX content, and narrative context, provide 3 to 5 BOLD, radically creative, zero-fluff suggestions to elevate the aesthetic.
Do not suggest generic corporate formatting like "add a bullet point" or "make the title larger". Instead, push boundaries: suggest editorial/magazine layouts, brutalist geometry, dramatic overlapping elements, unconventional asymmetry, rich gradient meshes, complex multi-column grid breaks, or massive atmospheric imagery.
If the slide is dense or tries to cover too many points, you MUST forcefully suggest breaking it down into 2 or 3 separate, highly impactful slides.

Important Capabilities & Constraints:
- The slide canvas is fixed at 1920x1080.
- Leverage the narrative context (TOC, Before/After slides) to ensure this slide doesn't repeat points made earlier.
- Suggest high-end architectural treatments using components like <Card>, <Stat>, <Tag>, and <Icon name="IconName" /> (\`lucide-react\`).
- Explicitly suggest using the \`generate_image\` AI tool for specific, atmospheric, or photorealistic background imagery or side-column accents (e.g. "Generate a moody, neon-lit server room for the left column...").
- The editor features a built-in AI image generator. You can suggest adding realistic, generated photos to illustrate points.

Return your suggestions as a strict JSON array of strings, with NO markdown formatting or additional text. Example:
["Since the next slide covers the specific skills, shorten these bullet points to focus only on the organizational timeline", "Use the <Icon name='Vault' /> component instead of bullet points to emphasize security", "Add a realistic generated photo of a server room to the right column"]`;

export async function POST(req: NextRequest) {
  try {
    const { deckSlug, slideId, image, currentSlide, previousSlide, nextSlide, toc } = await req.json();

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
