import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { getChromiumLaunchConfig } from "@/lib/chromium-launcher";
import { getSupabase } from "@/lib/supabase";
import { getSlides } from "@/app/decks/lib/slides-db";

const BUCKET = "deck-assets";

/**
 * POST /api/decks/thumbnails?deck=priyoshop-exec
 *
 * Generates thumbnail images for all slides in a deck.
 * Screenshots each slide via headless Chrome, converts to WebP,
 * uploads to Supabase Storage, and returns URLs.
 *
 * Optional body: { slideIds: ["uuid-1", "uuid-2"] } to regenerate specific slides only.
 */
export async function POST(req: NextRequest) {
  const deck = req.nextUrl.searchParams.get("deck");
  if (!deck) return NextResponse.json({ error: "Missing deck param" }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const slideIds = body.slideIds as string[] | undefined;

  const allSlides = await getSlides(deck);
  const slides = slideIds
    ? allSlides.filter((s) => slideIds.includes(s.id))
    : allSlides;

  if (slides.length === 0) {
    return NextResponse.json({ error: "No slides found" }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4000";
  const { executablePath, args } = await getChromiumLaunchConfig();

  const browser = await puppeteer.launch({
    args,
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
    executablePath,
    headless: true,
  });

  const results: { id: string; slide_order: number; thumbnail_url: string }[] = [];

  try {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      "x-puppeteer-auth": process.env.SUPABASE_SERVICE_ROLE_KEY || "local-dev-secret",
    });

    for (const slide of slides) {
      const slideIndex = allSlides.findIndex((s) => s.id === slide.id) + 1;
      const url = `${baseUrl}/clients/priyoshop/exec-deck?edit=true#slide-${slideIndex}`;

      await page.goto(url, { waitUntil: "networkidle0", timeout: 15_000 });
      await page.waitForSelector(".slide", { timeout: 10_000 });
      // Small delay for images/fonts to load
      await new Promise((r) => setTimeout(r, 500));

      const pngBuffer = await page.screenshot({ type: "png", fullPage: false });

      const webpBuffer = await sharp(Buffer.from(pngBuffer))
        .resize(384, 216)
        .webp({ quality: 75 })
        .toBuffer();

      const path = `thumbnails/${deck}/${slide.id}.webp`;
      await supabase.storage
        .from(BUCKET)
        .upload(path, webpBuffer, { contentType: "image/webp", upsert: true });

      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

      results.push({
        id: slide.id,
        slide_order: slide.slide_order,
        thumbnail_url: `${publicUrl}?t=${new Date(slide.updated_at).getTime()}`,
      });
    }

    await page.close();
  } finally {
    await browser.close();
  }

  return NextResponse.json({ deck, generated: results.length, thumbnails: results });
}

/**
 * GET /api/decks/thumbnails?deck=priyoshop-exec
 *
 * Returns cached thumbnail URLs for all slides (from Supabase Storage).
 */
export async function GET(req: NextRequest) {
  const deck = req.nextUrl.searchParams.get("deck");
  if (!deck) return NextResponse.json({ error: "Missing deck param" }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const slides = await getSlides(deck);

  const thumbnails = slides.map((s) => {
    const path = `thumbnails/${deck}/${s.id}.webp`;
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return {
      id: s.id,
      slide_order: s.slide_order,
      thumbnail_url: `${publicUrl}?t=${new Date(s.updated_at).getTime()}`,
    };
  });

  return NextResponse.json({ deck, thumbnails });
}
