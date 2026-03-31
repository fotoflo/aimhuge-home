# 001 Missing Unmigrated Decks on Dashboard

**Date:** 2026-03-31
**Severity:** High

## Symptom
The user reported that the `priyoshop-exec` deck was missing from the `/dashboard`.

## Root Cause
When the `/api/decks/route.ts` API was refactored to fetch deck slides strictly using an `.in()` query on `activeDeckSlugs` (where `activeDeckSlugs` only included explicit rows in the new `decks` table), any "legacy" unmigrated deck slides were ignored. Since `priyoshop-exec` existed purely as slides in `deck_slides` without a corresponding row in the `decks` table, it failed to load.

## The Fix
Reverted the limitation on querying the slides. The API now fetches all `deck_slug` parameters regardless of the active decks to successfully discover missing/unmigrated legacy decks from the `deck_slides` table, assigning them `archivedAt: null` to conform with TS updates.

## Key Rule
Always maintain legacy fallback mechanisms when filtering data that has an incomplete or un-enforced foreign key migration history.

## Files Involved
- `src/app/api/decks/route.ts`
