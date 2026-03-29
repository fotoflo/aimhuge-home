import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { deck_slug, insert_index, slides } = body;

  if (!deck_slug || insert_index == null || !Array.isArray(slides)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const now = new Date().toISOString();

  // Phase 1: Set existing slides to temporary negative orders
  for (let i = 0; i < slides.length; i++) {
    const { id } = slides[i];
    const { error } = await supabase
      .from("deck_slides")
      .update({ slide_order: -(100000 + i), updated_at: now })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: `Failed phase 1 for ${id}: ${error.message}` }, { status: 500 });
    }
  }

  // Phase 2: Set final positive orders for existing slides
  for (const { id, slide_order } of slides) {
    const { error } = await supabase
      .from("deck_slides")
      .update({ slide_order, updated_at: now })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: `Failed phase 2 for ${id}: ${error.message}` }, { status: 500 });
    }
  }

  // Phase 3: Insert the new blank slide at the correct order
  // The client will have shifted slide_order of everything after `insert_index`
  // We'll insert the new slide with slide_order = insert_index
  const { data: newSlide, error: insertErr } = await supabase
    .from("deck_slides")
    .insert({
      deck_slug: deck_slug,
      slide_order: insert_index,
      frontmatter: { title: "New Slide", level: 0, variant: "dark" },
      mdx_content: "## New Slide\n\nEnter your content here.",
      updated_at: now,
      deleted_at: null,
    })
    .select()
    .single();

  if (insertErr) {
    return NextResponse.json({ error: `Failed to insert new slide: ${insertErr.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, newSlide });
}
