import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_MODEL } from "@/lib/gemini";
import * as cheerio from "cheerio";

export const maxDuration = 60; // Allow enough time for LLM generation

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are an elite brand strategist and designer.
I will give you the raw text of a company's website homepage, along with the most frequently used CSS hex colors from their source code.
Your job is to thoroughly analyze the brand and return a highly structured JSON object.

Extract or infer the following:
- name: The company name.
- colors: Return a JSON object mapping descriptive color names to strict 7-character CSS hex codes (e.g., { "Primary": "#1e824c", "Vibrant Orange": "#ff8a00", "Dark Text": "#161622" }). You MUST return at least 3 colors, but up to 8 if the brand uses a broader palette. ALWAYS use the raw css hexes provided, but creatively name them based on the brand's vibe.
- contact_email: Find any public support/contact email (or leave empty).
- contact_phone: Find any public phone number (or leave empty).
- guidelines: Write a 3-4 sentence robust design guideline for this specific brand. Mention the tone, the types of typography they likely use, their core aesthetic (e.g. bold, minimal, highly corporate), and rules for laying out slides.
- scraped_context: Write a dense 2-3 paragraph summary of exactly what this company does, what their platform/product offers, and who their target audience is. This will be used as a RAG context for future slide generation.

IMPORTANT: Return ONLY a raw JSON object. Do NOT wrap it in markdown blockquotes like \`\`\`json.`;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Missing required field: url" }, { status: 400 });
    }

    const fetchConfigStr = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html"
      }
    };

    // 1. Fetch the homepage
    const res = await fetch(url, fetchConfigStr);
    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${res.statusText}` }, { status: 400 });
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // 2. Extract potential logos directly from DOM using precise selectors
    let extractedLogo = $('link[rel="logo"]').attr('href')
      || $('img[src*="logo" i]').attr('src')
      || $('img[alt*="logo" i]').attr('src')
      || $('img[class*="logo" i]').attr('src')
      || $('header img').attr('src')
      || $('link[rel="apple-touch-icon"]').attr('href')
      || $('link[rel="icon"]').attr('href')
      || $('meta[property="og:image"]').attr('content');
      
    let absoluteLogoUrl = "";
    if (extractedLogo) {
      if (extractedLogo.startsWith('http')) absoluteLogoUrl = extractedLogo;
      else if (extractedLogo.startsWith('//')) absoluteLogoUrl = 'https:' + extractedLogo;
      else try { absoluteLogoUrl = new URL(extractedLogo, url).toString(); } catch {}
    }

    // 3. Find top level navigation links (up to 4)
    const navLinks = new Set<string>();
    $('nav a[href], header a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        try {
          const absUrl = new URL(href, url).toString();
          // Only crawl pages on the exact same origin to stay on brand
          if (absUrl.startsWith(new URL(url).origin)) {
             navLinks.add(absUrl);
          }
        } catch {}
      }
    });

    const pageUrlsToCrawl = [url, ...Array.from(navLinks).slice(0, 4)];
    
    // 4. Crawl the pages and gather text + images simultaneously
    let combinedText = "";
    const gallerySet = new Set<string>();
    const colorFreq = new Map<string, number>();

    const pageResults = await Promise.allSettled(
      pageUrlsToCrawl.map(async (pageUrl) => {
         const pRes = await fetch(pageUrl, fetchConfigStr);
         if (!pRes.ok) return null;
         const pHtml = await pRes.text();
         
         // Extract Hex Colors
         const hexes = pHtml.match(/#([0-9a-fA-F]{6})\b/g);
         if (hexes) {
           hexes.forEach(h => {
             const hb = h.toLowerCase();
             // Ignore pure white/black to avoid skewing palette toward generic shadows/text
             if (hb !== "#ffffff" && hb !== "#000000" && hb !== "#111111" && hb !== "#222222") {
               colorFreq.set(hb, (colorFreq.get(hb) || 0) + 1);
             }
           });
         }

         const _$ = cheerio.load(pHtml);

         // Collect a CSS Stylesheet if available on the homepage
         if (pageUrl === url) {
           const cssHref = _$('link[rel="stylesheet"]').first().attr('href');
           if (cssHref) {
             try {
                const absCss = new URL(cssHref, url).toString();
                const cssRes = await fetch(absCss, fetchConfigStr);
                if (cssRes.ok) {
                  const cssText = await cssRes.text();
                  const cssHexes = cssText.match(/#([0-9a-fA-F]{6})\b/g);
                  if (cssHexes) {
                    cssHexes.forEach(h => {
                       const hb = h.toLowerCase();
                       if (hb !== "#ffffff" && hb !== "#000000" && hb !== "#111111" && hb !== "#222222") {
                         colorFreq.set(hb, (colorFreq.get(hb) || 0) + 1);
                       }
                    });
                  }
                }
             } catch {}
           }
         }

         // Collect images
         _$('img[src]').each((_, el) => {
           let src = _$(el).attr('src');
           if (!src) return;
           if (src.startsWith('data:')) return; // ignore base64 blobs
           if (src.endsWith('.svg') || src.includes('icon')) return; // Try to ignore small icons

           try {
             if (src.startsWith('//')) src = 'https:' + src;
             else if (!src.startsWith('http')) src = new URL(src, pageUrl).toString();
             gallerySet.add(src);
           } catch {}
         });

         // Remove noise and extract text
         _$("script, style, noscript, svg, iframe").remove();
         return _$("body").text().replace(/\s+/g, " ").trim();
      })
    );

    for (const result of pageResults) {
      if (result.status === "fulfilled" && result.value) {
        combinedText += `\n\n--- PAGE ---\n${result.value}`;
      }
    }

    // Cap the text size to avoid completely blowing out context limits
    combinedText = combinedText.substring(0, 100000);
    const galleryArray = Array.from(gallerySet).slice(0, 30);
    
    // Sort and get top 20 colors
    const topColors = Array.from(colorFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(e => e[0]);

    // 5. Ask Gemini to analyze the brand
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [
        { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\nURL: ${url}\n\nMOST FREQUENT SOURCE CODE HEX COLORS:\n${JSON.stringify(topColors)}\n\nRAW WEBSITE TEXT:\n${combinedText}` }] }
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
      // Fallback
      try {
         parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch (e) {
         console.error("Failed to parse AI brand JSON response:", text);
         return NextResponse.json({ error: "AI returned invalid format." }, { status: 500 });
      }
    }

    // 6. Save to DB
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

    const brandName = parsed.name || new URL(url).hostname.replace('www.', '').split('.')[0];
    const generatedSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    let validatedColors: Record<string, string> = {};
    if (parsed.colors && typeof parsed.colors === 'object') {
      for (const [key, val] of Object.entries(parsed.colors)) {
        if (typeof val === 'string' && val.startsWith('#')) {
           validatedColors[key] = val;
        }
      }
    }
    if (Object.keys(validatedColors).length === 0) {
      validatedColors = { "Primary": "#7c5cfc", "Background": "#161622" };
    }

    const brandData = {
      slug: generatedSlug,
      name: brandName,
      website_url: url,
      contact_email: parsed.contact_email || "",
      contact_phone: parsed.contact_phone || "",
      colors: validatedColors,
      guidelines: parsed.guidelines || "Use clean, highly-polished layout refinements.",
      scraped_context: parsed.scraped_context || "No context was able to be generated.",
      logos: { light: absoluteLogoUrl, dark: absoluteLogoUrl, icon: absoluteLogoUrl },
      images: galleryArray
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

  } catch (err: any) {
    console.error("Brand Scrape Error:", err);
    return NextResponse.json({ error: err.message || "Server caught error during sequence." }, { status: 500 });
  }
}
