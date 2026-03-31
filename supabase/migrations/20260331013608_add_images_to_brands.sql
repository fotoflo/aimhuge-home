ALTER TABLE public.brands
ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;
