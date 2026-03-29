CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_slug TEXT,
  slide_id UUID,
  endpoint TEXT NOT NULL,         -- 'copilot_prompt' or 'suggestions'
  model TEXT NOT NULL,            -- e.g. 'gemini-2.5-flash'
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  estimated_cost_usd NUMERIC(10, 6),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_deck_slug ON ai_usage_logs(deck_slug);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON ai_usage_logs(created_at DESC);
