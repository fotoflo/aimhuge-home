ALTER TABLE public.decks 
ADD COLUMN IF NOT EXISTS brand_slug text REFERENCES public.brands(slug) ON DELETE SET NULL;
