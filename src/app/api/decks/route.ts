import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("deck_slides")
    .select("deck_slug, slide_order")
    .is("deleted_at", null)
    .order("deck_slug");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group by deck_slug and count slides
  const deckMap = new Map<string, number>();
  for (const row of data ?? []) {
    deckMap.set(row.deck_slug, (deckMap.get(row.deck_slug) ?? 0) + 1);
  }

  const decks = Array.from(deckMap.entries()).map(([slug, slideCount]) => ({
    slug,
    slideCount,
  }));

  return NextResponse.json({ decks });
}
