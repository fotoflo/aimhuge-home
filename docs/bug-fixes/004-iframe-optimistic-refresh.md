# Iframe Optimistic Refresh (Slide Deletion)

- **Date:** 2026-03-30
- **Severity:** Medium

## Symptom
When a user multiselected slides in the sidebar and clicked "Delete", the UI visually removed the slides from the left sidebar instantly (optimistic). However, the main preview iframe (which fetches the slides independently) flashed and re-rendered the **deleted** slides for another second or so, making it seem like the deletion failed or was reverted. 

## Root Cause
The `executeDelete` function in `SlideEditor.tsx` optimistically removed the slides from the React state (`setSlides(newSlides)`) and immediately called `setRefreshKey(k => k + 1)`. The iframe reloaded synchronously *before* the `fetch("/api/decks/slides", { method: "DELETE" })` Promise resolved. As a result, the Next.js API in the iframe re-queried the database and retrieved the old slides, visually overriding the intended optimistic deletion state until another refresh was triggered.

```javascript
    // Problematic code
    setRefreshKey(k => k + 1); // Fired too early
    
    try {
      await Promise.all(ids.map(id => fetch("...", { method: "DELETE" })));
    } catch (err) { ... }
```

## The Fix
Deferred `setRefreshKey` until *after* the `Promise.all` deletion block resolved. The sidebar retains its fast, optimistic update (via `setSlides`), but the iframe correctly yields until the DB confirms the deletion so it won't query stale data.

```javascript
    // Fixed code
    try {
      await Promise.all(ids.map(id => fetch("...", { method: "DELETE" })));
      // Refresh iframe only after database is updated to reflect deletion
      setRefreshKey(k => k + 1);
    } catch (err) { ... }
```

## Key Rule
When executing asynchronous backend mutations (like DELETE/POST), defer triggering global data refreshes (e.g. `refreshKey` bindings) until the API promises have fully resolved to prevent fetching stale states.

## Files Involved
- `src/app/(decks)/clients/priyoshop/exec-deck/edit/SlideEditor.tsx`
