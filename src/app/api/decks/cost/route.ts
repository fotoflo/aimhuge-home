import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deckSlug = searchParams.get("deckSlug");
  const slideId = searchParams.get("slideId");

  if (!deckSlug) {
    return NextResponse.json({ error: "deckSlug is required" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "No DB" }, { status: 500 });

  let query = supabase.from("ai_usage_logs").select("estimated_cost_usd").eq("deck_slug", deckSlug);

  if (slideId) {
    query = query.eq("slide_id", slideId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const totalCost = data.reduce((acc, row) => acc + (Number(row.estimated_cost_usd) || 0), 0);

  return NextResponse.json({ cost: totalCost });
}
