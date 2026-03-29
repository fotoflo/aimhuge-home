# Bug 002: MDX cursor:pointer Hydration Mismatch

**Date:** 2026-03-29
**Severity:** Low — console noise only, no visual or functional impact
**Fixed in:** this session

## Symptom

React hydration mismatch console error: "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties" — always related to `cursor:pointer` style on `<img>` elements inside MDX slides.

## Root Cause

MDX content stored in the database contained inline `cursor:pointer` styles on `<img>` elements in two forms:

```html
<!-- HTML syntax -->
<img style="cursor:pointer" src="..." />

<!-- JSX syntax -->
<img style={{cursor:"pointer"}} src="..." />
```

During SSR, `MDXRemote` rendered these styles into HTML. On client hydration, React detected a mismatch because the inline style attribute differed between server and client representations (HTML style strings vs React style objects serialize differently).

The `cursor:pointer` was redundant anyway — `.slide-container` in deck.css already applies `cursor: pointer` via CSS.

## The Fix

Two sanitization steps applied to MDX content before passing it to `<MDXRemote>`:

1. **Modified `fixStringStyles()`** in MDXSlide.tsx to filter out `cursor` properties when converting HTML style strings to JSX style objects.

2. **Added `stripCursorPointer()`** function to strip `cursor:pointer` from JSX-syntax style objects in MDX source.

Also removed the `SuppressHydrationWarning` component from the decks layout — it was a band-aid that monkey-patched `console.error` to hide the warnings rather than fixing the root cause.

## Key Rule

**Don't add inline styles in MDX content that duplicate CSS already applied by parent containers.** They cause hydration mismatches (server HTML string vs client React style object) and are redundant. If a parent container already sets `cursor: pointer`, individual elements inside it don't need it again.

## Files Involved

- `src/app/decks/components/MDXSlide.tsx` — `fixStringStyles()` modified, `stripCursorPointer()` added
- `src/app/(decks)/layout.tsx` — removed `SuppressHydrationWarning` import/usage
- `src/app/(decks)/SuppressHydrationWarning.tsx` — now dead code (was the band-aid)
