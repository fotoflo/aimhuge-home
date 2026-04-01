# Deck Deletion Not Removing Slides (Legacy Slide State)

**Date**: 2026-03-31
**Severity**: Medium

## Symptom
Deleting a deck from the dashboard would seem to work optimistically, but upon refreshing the page, the deleted deck would still appear in the list (though now labeled as a "Legacy unmigrated deck").

## Root Cause
The `DELETE` API handler in `/api/decks/[slug]/route.ts` was only updating the `deleted_at` timestamp on the `decks` table record. It ignored the associated slides in the `deck_slides` table. 

Because `/api/decks/route.ts` automatically discovers "legacy" decks by grouping all active `deck_slides` rows that don't belong to a known deck, it saw the orphaned slides (which still had `deleted_at: null`) and re-listed them as a placeholder legacy deck with the exact same slug.

## The Fix
Updated the `DELETE` API route to CASCADE the software delete by explicitly updating `deleted_at: new Date().toISOString()` on all rows in `deck_slides` where `deck_slug == slug` before marking the parent deck as deleted. Also updated the Dashboard page to include proper optimistic UI filtering on deletion and replaced all browser-native `window.confirm` dialogues with a unified generic `React` modal.

## Key Rule
Always cascade soft deletes (`deleted_at`) to foreign-key dependent active rows if your aggregation queries dynamically group orphaned rows.

## Files Involved
- `src/app/api/decks/[slug]/route.ts`
- `src/app/(site)/dashboard/page.tsx`
