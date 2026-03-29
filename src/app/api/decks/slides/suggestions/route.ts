import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { DEFAULT_MODEL } from "@/lib/gemini";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT_PREFIX = `You are an expert presentation designer. Given a slide's current layout, its MDX content, the overall Table of Contents, and the adjacent slides, provide 3 to 5 highly specific, actionable suggestions to improve the slide. 
Your suggestions should focus on both visual layout and narrative coherence.

Important Capabilities & Constraints:
- The slide canvas is fixed at 1920x1080 resolution. Ensure typography scaling, spacing, and image alignment respect these bounds. Avoid excessive text wrapping.
- Leverage the narrative context (TOC, Before/After slides) to ensure this slide doesn't repeat points made earlier or steal thunder from upcoming slides.
- You can suggest adding \`lucide-react\` icons using the \`<Icon name="IconName" />\` component.
- The editor features a built-in AI image generator. You can suggest adding realistic, generated photos to illustrate points.

Return your suggestions as a strict JSON array of strings, with NO markdown formatting or additional text. Example:
["Since the next slide covers the specific skills, shorten these bullet points to focus only on the organizational timeline", "Use the <Icon name='Vault' /> component instead of bullet points to emphasize security", "Add a realistic generated photo of a server room to the right column"]`;

export async function POST(req: NextRequest) {
  try {
    const { image, currentSlide, previousSlide, nextSlide, toc } = await req.json();

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
    let suggestions: string[] = [];
    try {
      suggestions = JSON.parse(text);
      if (!Array.isArray(suggestions)) suggestions = [];
    } catch {
      console.warn("Invalid suggestion JSON:", text);
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Suggestions error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
