import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/** GET /api/decks/summary?deck=priyoshop-exec
 *
 * Returns a lightweight summary of all slides in a deck:
 * id, slide_order, frontmatter (title, variant, sectionLabel), and content_length.
 * Does NOT return mdx_content — use GET /api/decks/slides?deck=... for full content,
 * or PATCH /api/decks/slides to update a single slide by id.
 */
export async function GET(req: NextRequest) {
  const deck = req.nextUrl.searchParams.get("deck");
  if (!deck) return NextResponse.json({ error: "Missing deck param" }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const { data, error } = await supabase
    .from("deck_slides")
    .select("id, deck_slug, slide_order, frontmatter, updated_at")
    .eq("deck_slug", deck)
    .is("deleted_at", null)
    .order("slide_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const summary = (data ?? []).map((row, i) => ({
    index: i + 1,
    id: row.id,
    slide_order: row.slide_order,
    title: (row.frontmatter as Record<string, unknown>)?.title ?? null,
    variant: (row.frontmatter as Record<string, unknown>)?.variant ?? null,
    sectionLabel: (row.frontmatter as Record<string, unknown>)?.sectionLabel ?? null,
    updated_at: row.updated_at,
  }));

  return NextResponse.json({
    deck_slug: deck,
    total_slides: summary.length,
    slides: summary,
  });
}
