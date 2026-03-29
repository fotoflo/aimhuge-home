# 008 Iframe Loading Flashes
**Date**: 2026-03-29
**Severity**: Medium

## Symptom
When users switched slides in the editor sidebar, page 1 of the slide deck would flash for approximately 100ms before switching to the target slide. Additionally, on initial load of any slide other than the first, the preview would initially flash page 1 before switching.

## Root Cause
The `src` attribute of the iframe was previously hardcoded to `"/clients/priyoshop/exec-deck?edit=true#slide-1"` in `SlideEditor.tsx` to fix a "recursive rendering" issue caused by dynamically binding the full `current` state to the `src` prop. 
However, when the parent component re-rendered upon toggling the generic layout (e.g. from the code editor to the slide view, or handling `refreshKey` remounts), the iframe would mount using this hardcoded `src`. This caused it to initially load slide 1, wait for the `onLoad` event, and only *then* dispatch a `postMessage` with the actual `current` slide index, causing the visible ~100ms flicker.

## The Fix
Memoized the `iframeSrc` using `useMemo` with a dependency exclusively on `refreshKey` (and `deckSlug`), selectively disabling the React Hooks exhaustive-deps rule. 
```tsx
// Before
<iframe src="/clients/priyoshop/exec-deck?edit=true#slide-1" />

// After
const iframeSrc = useMemo(() => `/clients/${deckSlug.replace("-exec", "")}/exec-deck?edit=true#slide-${current + 1}`, [refreshKey, deckSlug]);
<iframe src={iframeSrc} />
```
This initializes the iframe tightly to the target slide on mount, eliminating the initial visual delay, while preventing the parent from updating the `src` string on simple side-channel slide switches (avoiding the recursive URL-hash rerender bugs from earlier).

## Key Rule
When embedding iframes containing synced React applications, avoid hardcoding `src` hashes if the initial load relies on it; instead, use a statically-captured state variable to preserve the correct first-paint URL without causing cascading prop diffs.

## Files Involved
- `src/app/(decks)/clients/priyoshop/exec-deck/edit/SlideEditor.tsx`
