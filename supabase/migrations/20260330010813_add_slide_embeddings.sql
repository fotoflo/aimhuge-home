CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

ALTER TABLE deck_slides ADD COLUMN IF NOT EXISTS embedding vector(768);

CREATE INDEX IF NOT EXISTS deck_slides_embedding_idx ON deck_slides USING hnsw (embedding vector_cosine_ops);
