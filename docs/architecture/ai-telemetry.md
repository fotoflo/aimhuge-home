# AI Telemetry Architecture

## Overview
Tracks token usage and cost for all generative AI interactions within the platform, enabling cost monitoring and per-project billing breakdowns.

## Key Files
- `src/lib/ai-telemetry.ts`: Contains `logAiUsage` function which intercepts token metadata, calculates local USD estimation, and pushes async to Supabase.
- `src/app/api/decks/cost/route.ts`: Exposes read-only API endpoint for retrieving global or slide-specific cost aggregations.
- `src/app/tokens/page.tsx`: A self-contained Next.js dashboard visualizer.
- `supabase/migrations/20260329181542_create_ai_usage_logs.sql`: The database schema tracking `deck_slug`, `slide_id`, and tokens.

## Data Flow
Frontend (Editor/Prompt) -> Next.js API Routes -> Google GenAI Stream -> Response Usage Extraction -> `logAiUsage()` -> Supabase `ai_usage_logs` -> `/tokens` Dashboard.

## Important Patterns
- `deckSlug` is the mandatory primary key for grouping costs. It must be piped all the way down from the URL bounds into the backend fetch requests.
- Log insertion is fire-and-forget; we NEVER block the UX or error out the main generator streams if the telemetry insert fails.
