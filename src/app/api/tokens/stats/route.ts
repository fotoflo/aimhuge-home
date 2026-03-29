import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "No DB" }, { status: 500 });

  try {
    // 1. Get recent logs
    const { data: recentLogs, error: recentError } = await supabase
      .from("ai_usage_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
      
    if (recentError) throw recentError;

    // 2. Get all logs for aggregation (for a bigger app, use RPC, but it's okay for small datasets)
    const { data: allLogs, error: allError } = await supabase
      .from("ai_usage_logs")
      .select("deck_slug, estimated_cost_usd, prompt_tokens, completion_tokens, total_tokens");

    if (allError) throw allError;

    let totalCostUsd = 0;
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    const deckCosts: Record<string, number> = {};

    for (const log of allLogs || []) {
      const cost = Number(log.estimated_cost_usd) || 0;
      totalCostUsd += cost;
      totalPromptTokens += log.prompt_tokens || 0;
      totalCompletionTokens += log.completion_tokens || 0;
      
      const slug = log.deck_slug || "unknown";
      deckCosts[slug] = (deckCosts[slug] || 0) + cost;
    }

    const costPerDeck = Object.entries(deckCosts)
      .map(([deckSlug, cost]) => ({ deckSlug, cost }))
      .sort((a, b) => b.cost - a.cost);

    return NextResponse.json({
      totalCostUsd,
      totalPromptTokens,
      totalCompletionTokens,
      totalTokens: totalPromptTokens + totalCompletionTokens,
      costPerDeck,
      recentLogs: recentLogs || [],
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
