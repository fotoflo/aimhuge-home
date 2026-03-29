import { NextRequest, NextResponse } from "next/server";
import { getSlides, upsertSlide, updateSlideContent, softDeleteSlide } from "@/app/decks/lib/slides-db";

/** GET /api/decks/slides?deck=priyoshop-exec */
export async function GET(req: NextRequest) {
  const deck = req.nextUrl.searchParams.get("deck");
  if (!deck) return NextResponse.json({ error: "Missing deck param" }, { status: 400 });

  const slides = await getSlides(deck);
  return NextResponse.json(slides);
}

/** PUT /api/decks/slides — upsert a slide */
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { deck_slug, slide_order, frontmatter, mdx_content } = body;

  if (!deck_slug || slide_order == null || !mdx_content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await upsertSlide(deck_slug, slide_order, frontmatter, mdx_content);
  return NextResponse.json({ ok: true });
}

/** PATCH /api/decks/slides — update slide content by id */
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, mdx_content } = body;

  if (!id || mdx_content == null) {
    return NextResponse.json({ error: "Missing id or mdx_content" }, { status: 400 });
  }

  await updateSlideContent(id, mdx_content);
  return NextResponse.json({ ok: true });
}

/** DELETE /api/decks/slides — soft-delete a slide */
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await softDeleteSlide(id);
  return NextResponse.json({ ok: true });
}
