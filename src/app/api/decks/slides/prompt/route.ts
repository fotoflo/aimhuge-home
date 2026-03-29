import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabase } from "@/lib/supabase";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are a slide content editor for presentation decks. You edit MDX/JSX content for slides.

The slides use these conventions:
- Use className (not class) for CSS classes
- Use <div> not <p> for text (to avoid HTML nesting issues)
- Tailwind CSS classes for styling
- Available components: <Card accent="purple|blue|green|amber|red" small?>, <CardTitle>, <CardText>, <Stat>, <Tag>
- Use <img> for images (not next/image)
- No .map() or JS expressions — write out each element explicitly
- The frontmatter (variant, title, subtitle, sectionLabel, etc.) is separate from the content

When given a prompt, return ONLY the updated MDX content (the body, not frontmatter).
If the user asks to change frontmatter fields (title, subtitle, variant, etc.), return a JSON object with "frontmatter" and "content" keys.

Return raw content only, no markdown code fences.`;

export async function POST(req: NextRequest) {
  const { slideId, currentContent, currentFrontmatter, prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${SYSTEM_PROMPT}\n\nCurrent frontmatter:\n${JSON.stringify(currentFrontmatter, null, 2)}\n\nCurrent slide content:\n${currentContent}\n\nUser request: ${prompt}` }],
        },
      ],
    });

    const text = response.text?.trim() ?? "";

    // Check if response includes frontmatter changes
    let updatedContent = text;
    let updatedFrontmatter = currentFrontmatter;

    if (text.startsWith("{")) {
      try {
        const parsed = JSON.parse(text);
        if (parsed.content) {
          updatedContent = parsed.content;
          updatedFrontmatter = { ...currentFrontmatter, ...parsed.frontmatter };
        }
      } catch {
        // Not JSON, treat as raw content
      }
    }

    // Save to Supabase if slideId provided
    if (slideId) {
      const supabase = getSupabase();
      if (supabase) {
        await supabase
          .from("deck_slides")
          .update({
            mdx_content: updatedContent,
            frontmatter: updatedFrontmatter,
            updated_at: new Date().toISOString(),
          })
          .eq("id", slideId);
      }
    }

    return NextResponse.json({
      content: updatedContent,
      frontmatter: updatedFrontmatter,
    });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 },
    );
  }
}
