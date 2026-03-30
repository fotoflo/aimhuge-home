# AI Slide Embeddings

## Overview

The AimHuge platform (and specifically the `.deck` editing environment) converts each slide's content into a 768-dimensional mathematical vector (an "embedding") using Google's `gemini-embedding-001` model. This allows for semantic search, slide deduplication, and Retrieval-Augmented Generation (RAG) by the AI Copilot.

## Architecture

Embeddings are seamlessly embedded into the normal CRUD cycle of the Next.js slide API.

### Database Schema
The `deck_slides` table has an `embedding` column defined as `vector(768)`. The migration uses the Supabase `pgvector` extension and creates a corresponding `hnsw` index for fast vector-cosine similarity matching:

```sql
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
ALTER TABLE deck_slides ADD COLUMN IF NOT EXISTS embedding vector(768);
CREATE INDEX IF NOT EXISTS deck_slides_embedding_idx ON deck_slides USING hnsw (embedding vector_cosine_ops);
```

### Generation Hook
Instead of relying on a Supabase Database Webhook (which would introduce architectural separation), embedding generation is handled locally within the Next.js API lifecycle in `src/app/decks/lib/slides-db.ts` via `updateEmbeddingForSlide(id: string)`.

When a slide's content or frontmatter is updated:
1. The slide is physically updated on disk via `upsertSlide` or `updateSlideContent/Frontmatter`.
2. The `POST / PATCH / PUT` API route (`api/decks/slides/route.ts`) acts as the entrypoint. It completes the slide update asynchronously, firing `updateEmbeddingForSlide(id).catch(console.error)`.
3. It immediately returns `200 OK` to the web client. The editor UI remains instantly reactive (fire-and-forget architecture).
4. The background process queries the full text of the slide—combining the title, subtitle, and pure MDX content—and requests a fresh `gemini-embedding-001` vector from Google's Gen AI SDK.
5. The mathematical vector is injected into the `embedding` column on the Supabase `deck_slides` table.

## Telemetry
Tracking the embedding API cost is hooked up to the local `ai_usage_logs` system via `logAiUsage` (in `src/lib/ai-telemetry.ts`). Since embeddings are very cheap ($0.02 / 1M input tokens), the `costPer1mInputTokens` property for `gemini-embedding-001` automatically associates costs in the `estimated_cost_usd` column.

## Backfilling
If you define a new database or need to perform a mass re-indexing across all client decks, you can simply run the script located at `scripts/backfill-embeddings.ts`:

```bash
npx tsx scripts/backfill-embeddings.ts
```

This script detects all slides `WHERE embedding IS NULL` and sequentially queues up generation requests to the Gemini API, respecting common rate limits.
