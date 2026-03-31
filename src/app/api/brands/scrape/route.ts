import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_MODEL } from "@/lib/gemini";
import * as cheerio from "cheerio";

export const maxDuration = 60; // Allow enough time for LLM generation

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are an elite brand strategist and designer.
I will give you the raw text of a company's website homepage.
Your job is to thoroughly analyze the brand and return a highly structured JSON object.

Extract or infer the following:
- name: The company name.
- colors: Return exactly 4 hex codes (primary, secondary, bgDark, bgLight). Infer from the website's tone if specific CSS hexes aren't obvious in the text.
- contact_email: Find any public support/contact email (or leave empty).
- contact_phone: Find any public phone number (or leave empty).
- guidelines: Write a 3-4 sentence robust design guideline for this specific brand. Mention the tone, the types of typography they likely use, their core aesthetic (e.g. bold, minimal, highly corporate), and rules for laying out slides.
- scraped_context: Write a dense 2-3 paragraph summary of exactly what this company does, what their platform/product offers, and who their target audience is. This will be used as a RAG context for future slide generation.

IMPORTANT: Return ONLY a raw JSON object. Do NOT wrap it in markdown blockquotes like \`\`\`json.`;

export async function POST(req: NextRequest) {
  try {
    const { url, slug } = await req.json();

    if (!url || !slug) {
      return NextResponse.json({ error: "Missing required fields: url and slug" }, { status: 400 });
    }

    // 1. Fetch the raw HTML from the target URL
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html"
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${res.statusText}` }, { status: 400 });
    }

    const html = await res.text();

    // 2. Strip the HTML to raw legible text using Cheerio to save tokens
    const $ = cheerio.load(html);
    // Remove scripts, styles, svgs, empty tags
    $("script, style, noscript, svg, img, iframe").remove();
    const rawText = $("body").text().replace(/\s+/g, " ").trim();

    // 3. Ask Gemini to analyze the brand
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [
        { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\nURL: ${url}\n\nRAW WEBSITE TEXT:\n${rawText.substring(0, 30000)}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const text = response.text?.trim() ?? "{}";
    
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Fallback if the model still wrapped it in markdown
      try {
         parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch (e) {
         console.error("Failed to parse AI brand JSON response:", text);
         return NextResponse.json({ error: "AI returned invalid format." }, { status: 500 });
      }
    }

    // 4. Save to the database
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

    const brandData = {
      slug,
      name: parsed.name || slug,
      website_url: url,
      contact_email: parsed.contact_email || "",
      contact_phone: parsed.contact_phone || "",
      colors: {
        primary: parsed.colors?.primary || "#7c5cfc",
        secondary: parsed.colors?.secondary || "#ffffff",
        bgDark: parsed.colors?.bgDark || "#161622",
        bgLight: parsed.colors?.bgLight || "#f8f9fa",
      },
      guidelines: parsed.guidelines || "Use clean, highly-polished layout refinements.",
      scraped_context: parsed.scraped_context || "No context was able to be generated.",
      logos: { light: "", dark: "", icon: "" }
    };

    const { error, data } = await supabase
      .from("brands")
      .upsert(brandData)
      .select()
      .single();

    if (error) {
       console.error("Failed to save brand to DB:", error);
       return NextResponse.json({ error: "DB Error" }, { status: 500 });
    }

    return NextResponse.json({ brand: data });

  } catch (err: unknown) {
    console.error("Brand Scrape Error:", err);
    return NextResponse.json({ error: "Server caught error during sequence." }, { status: 500 });
  }
}
