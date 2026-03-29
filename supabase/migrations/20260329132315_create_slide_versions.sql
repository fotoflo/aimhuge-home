-- Run this in the Supabase SQL Editor to create the slide_versions table.

CREATE TABLE slide_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slide_id UUID NOT NULL REFERENCES deck_slides(id) ON DELETE CASCADE,
  deck_slug TEXT NOT NULL,
  slide_order INTEGER NOT NULL,
  frontmatter JSONB NOT NULL,
  mdx_content TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  change_source TEXT,  -- 'manual', 'ai_prompt', 'upsert'
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_slide_versions_slide_id ON slide_versions(slide_id);
CREATE INDEX idx_slide_versions_lookup ON slide_versions(slide_id, created_at DESC);
CREATE UNIQUE INDEX idx_slide_versions_unique ON slide_versions(slide_id, version_number);
