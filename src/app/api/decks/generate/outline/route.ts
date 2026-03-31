import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_MODEL } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { context, slideCount, brandSlug } = await req.json();
    if (!context) {
      return NextResponse.json({ error: "Context is required" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const supabase = getSupabase();
    
    let brandContext = "";
    if (supabase && brandSlug) {
      const { data: brand } = await supabase
        .from("brands")
        .select("name, guidelines, scraped_context")
        .eq("slug", brandSlug)
        .single();
      
      if (brand) {
        brandContext = `
[MANDATORY BRAND GUIDELINES - ${brand.name}]
${brand.guidelines || "No explicit styling guidelines provided."}

[BRAND KNOWLEDGE]
${brand.scraped_context || "No context provided."}
`;
      }
    }

    const prompt = `You are an expert executive presentation designer.
Read the following raw context and extract a logically ordered presentation outline.
TARGET SLIDE COUNT: ${slideCount || 'auto (best fit)'} slides.

${brandContext}

You MUST output your response as a JSON array of slide objects. Each object MUST exactly match this schema:
- "title": (string) A punchy, executive title for the slide.
- "content": (string) The approximate content or key bullet points to cover.
- "visualPrompt": (string) Suggestions for the look and feel, layout, or imagery based on brand guidelines.

Input Text:
${context}
`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              visualPrompt: { type: Type.STRING }
            },
            required: ["title", "content", "visualPrompt"],
          }
        }
      }
    });

    const text = response.text || "";
    const parsedOutline = JSON.parse(text);

    if (!Array.isArray(parsedOutline)) throw new Error("Invalid format from AI");

    // Map to include a client-side ID for dragging
    const outlineWithIds = parsedOutline.map((slide, idx) => ({
      ...slide,
      id: crypto.randomUUID(),
      order: (idx + 1) * 10
    }));

    return NextResponse.json({ success: true, outline: outlineWithIds });
  } catch (err: unknown) {
    console.error("Outline generate error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
