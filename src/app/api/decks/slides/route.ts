import { NextRequest, NextResponse } from "next/server";
import { getSlides, upsertSlide, updateSlideContent, updateSlideFrontmatter, softDeleteSlide, getSlideById, updateEmbeddingForSlide } from "@/app/decks/lib/slides-db";

/** GET /api/decks/slides?deck=priyoshop-exec OR ?id=slide-uuid */
export async function GET(req: NextRequest) {
  const deck = req.nextUrl.searchParams.get("deck");
  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    const slide = await getSlideById(id);
    if (!slide) return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    return NextResponse.json(slide);
  }

  if (!deck) return NextResponse.json({ error: "Missing deck or id param" }, { status: 400 });

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

  const slide = await upsertSlide(deck_slug, slide_order, frontmatter, mdx_content);
  // Fire and forget the embedding generation
  updateEmbeddingForSlide(slide.id).catch(console.error);
  return NextResponse.json({ ok: true, slide });
}

/** PATCH /api/decks/slides — update slide content and/or frontmatter by id */
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, mdx_content, frontmatter } = body;

  if (!id || (mdx_content == null && frontmatter == null)) {
    return NextResponse.json({ error: "Missing id or update fields" }, { status: 400 });
  }

  if (mdx_content != null) await updateSlideContent(id, mdx_content);
  if (frontmatter != null) await updateSlideFrontmatter(id, frontmatter);
  
  // Fire and forget the embedding generation
  updateEmbeddingForSlide(id).catch(console.error);
  
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
