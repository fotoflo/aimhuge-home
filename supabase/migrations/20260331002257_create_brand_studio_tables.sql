-- uuid extension not needed since we use built-in gen_random_uuid()

CREATE TABLE IF NOT EXISTS public.brands (
    slug text PRIMARY KEY,
    name text NOT NULL,
    website_url text,
    contact_email text,
    contact_phone text,
    colors jsonb DEFAULT '{"primary": "", "secondary": "", "bgDark": "", "bgLight": ""}'::jsonb,
    logos jsonb DEFAULT '{"light": "", "dark": "", "icon": ""}'::jsonb,
    guidelines text,
    scraped_context text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Store chunked embeddings from the brand's scraped context
CREATE TABLE IF NOT EXISTS public.brand_knowledge_chunks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_slug text REFERENCES public.brands(slug) ON DELETE CASCADE,
    content text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    embedding vector(768),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Index for semantic similarity search
CREATE INDEX IF NOT EXISTS brand_knowledge_chunks_embedding_idx ON public.brand_knowledge_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS brand_knowledge_chunks_brand_slug_idx ON public.brand_knowledge_chunks(brand_slug);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_brands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add Trigger
DROP TRIGGER IF EXISTS update_brands_updated_at ON public.brands;
CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON public.brands
    FOR EACH ROW
    EXECUTE PROCEDURE update_brands_updated_at();

-- RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Allow RLS access for authenticated users (or anonymous if app needs generic access for now)
-- The app mostly runs server side anyway using Service Role, but we leave permissive authenticated rules in case client SDK handles it.
CREATE POLICY "Allow read access on brands" ON public.brands FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow insert access on brands" ON public.brands FOR INSERT TO authenticated, anon WITH CHECK (true);
CREATE POLICY "Allow update access on brands" ON public.brands FOR UPDATE TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete access on brands" ON public.brands FOR DELETE TO authenticated, anon USING (true);

CREATE POLICY "Allow read access on chunks" ON public.brand_knowledge_chunks FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow insert access on chunks" ON public.brand_knowledge_chunks FOR INSERT TO authenticated, anon WITH CHECK (true);
CREATE POLICY "Allow update access on chunks" ON public.brand_knowledge_chunks FOR UPDATE TO authenticated, anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete access on chunks" ON public.brand_knowledge_chunks FOR DELETE TO authenticated, anon USING (true);
