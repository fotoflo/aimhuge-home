# 010 - Supabase Reorder Unique Constraint Timeout

**Date:** 2026-03-30
**Severity:** Medium

## Symptom
Reordering slides locally by hitting `/api/decks/slides/reorder` caused the backend API to hang for several minutes and eventually time out without updating the slides. When checked directly, the remote Supabase instance returned a `23505` duplicate key error (`deck_slides_deck_slug_slide_order_key`).

## Root Cause
The `POST /api/decks/slides/reorder` route looped over the submitted slides arrays, executing sequential `await supabase.from("deck_slides").update(...)` queries to apply the reordered indices. Doing 134 separate API requests sequentially via HTTP to a remote Supabase instance took too long (~250ms per query over the internet). This massive chain of promises sometimes stalled entirely or timed out the local framework / execution context before reaching Phase 2, which then left slides in their negative temporary state from Phase 1. Subsequent runs hit a unique constraint error because Phase 1 attempted to assign slide_orders that were temporarily blocked by stuck slides.

```typescript
// Problematic Pattern
for (let i = 0; i < slides.length; i++) {
  // 134 sequential network round trips
  await supabase.from("deck_slides").update({ slide_order: -(100000 + i) }).eq("id", id);
}
```

## The Fix
Refactored the API route to map all updates into parallel promises and await them concurrently using `Promise.all`. This parallelization cuts the latency constraint completely, letting Supabase handle all standard HTTP requests in a single large burst.

```typescript
// Fixed Pattern
const phase1Promises = slides.map((slide, i) => 
  supabase.from("deck_slides").update({ slide_order: -(100000 + i), updated_at: now }).eq("id", slide.id)
);
await Promise.all(phase1Promises);
```

## Key Rule
Always batch or use `Promise.all()` for loops involving remote database mutations to prevent network-bound timeouts and connection resource exhaustion.

## Files Involved
- `src/app/api/decks/slides/reorder/route.ts`
