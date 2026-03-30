import { getSupabase } from "./supabase";
import { AI_MODELS } from "./gemini";

/**
 * Log AI tracking details mapped to cost estimating.
 */
export async function logAiUsage({
  endpoint,
  model,
  promptTokens,
  completionTokens,
  totalTokens,
  deckSlug,
  slideId,
  imagesGenerated
}: {
  endpoint: string;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  deckSlug?: string;
  slideId?: string;
  imagesGenerated?: number;
}) {
  const supabase = getSupabase();
  if (!supabase) return;

  let estimatedCostUsd = 0;

  const modelConfig = AI_MODELS[model];
  if (modelConfig) {
    if (modelConfig.type === 'multimodal' || modelConfig.type === 'text' || modelConfig.type === 'embedding') {
      const costIn = (promptTokens || 0) * ((modelConfig.costPer1mInputTokens || 0) / 1000000);
      const costOut = (completionTokens || 0) * ((modelConfig.costPer1mOutputTokens || 0) / 1000000);
      estimatedCostUsd = costIn + costOut;
    } else if (modelConfig.type === 'image') {
      estimatedCostUsd = (imagesGenerated || 0) * (modelConfig.costPerImage || 0);
    }
  }

  try {
    await supabase.from("ai_usage_logs").insert({
      endpoint,
      model,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      estimated_cost_usd: estimatedCostUsd,
      deck_slug: deckSlug,
      slide_id: slideId
    });
  } catch (err) {
    console.error("Failed to log AI usage", err);
  }
}
