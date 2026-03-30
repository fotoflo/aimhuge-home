-- Add ai_tips column to securely store array of suggestion strings
ALTER TABLE public.deck_slides ADD COLUMN IF NOT EXISTS ai_tips jsonb DEFAULT '[]'::jsonb;
