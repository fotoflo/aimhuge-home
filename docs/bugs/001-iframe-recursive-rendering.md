# Bug 001: Iframe Recursive Rendering

**Date:** 2026-03-29
**Severity:** Critical — editor becomes unusable
**Fixed in:** `2caceb6`

## Symptom

The slide editor renders recursively — the entire editor UI appears nested inside its own iframe preview area, creating infinite nesting. The page becomes unusable. Triggered by clicking to change slides or double-clicking to edit text. Sometimes appears only after the second interaction, not on initial load.

## Root Cause

The editor embeds the deck viewer (`DeckShell`) in an iframe. To navigate slides without remounting the iframe, the editor called:

```ts
iframe.contentWindow.location.replace(`#slide-${i + 1}`);
```

Inside the iframe, `DeckShell` uses `useSlideNavigation`, which is built on `useSyncExternalStore`. The store subscribes to `hashchange` events:

```ts
function subscribe(callback) {
  window.addEventListener("hashchange", onHashChange);
  // ...
}

function getSnapshot() {
  // reads window.location.hash
}
```

`location.replace()` triggers `hashchange` → subscriber fires → React calls `getSnapshot()` → which reads the hash → React re-renders → which can trigger further hash changes or re-renders, creating a cascade that manifests as recursive rendering of the entire component tree.

## Why It Was Hard to Find

- Server-side HTML was correct (verified via curl and Puppeteer)
- The iframe URL correctly pointed to the viewer page, not the editor
- The recursion only appeared after user interaction (click/double-click), not on initial page load
- The bug was introduced in a massive 112-file commit that also restructured route groups, making bisection slow

## The Fix

Replace `location.replace()` with `postMessage` for cross-frame communication:

**Editor (parent) sends:**
```ts
iframe.contentWindow.postMessage({ type: "goToSlide", index: i }, "*");
```

**DeckShell (iframe) receives via `useSlideNavigation`:**
```ts
window.addEventListener("message", (e) => {
  if (e.data?.type === "goToSlide") {
    override = e.data.index;
    notify(); // triggers useSyncExternalStore update
  }
});
```

This sets an internal override variable and notifies subscribers directly, without touching the URL hash and without triggering `hashchange` events.

Also keep the iframe `src` and `key` static to prevent React from updating the DOM `src` attribute (which also triggers navigation):

```tsx
<iframe
  key={refreshKey}                                    // only changes on content edits
  src="/clients/priyoshop/exec-deck?edit=true#slide-1" // static, never changes
  onLoad={handleIframeLoad}
/>
```

## Key Rule

**Never use `location.replace()` or `location.hash` to communicate between a parent page and an iframe that uses `useSyncExternalStore` subscribed to `hashchange`.** Use `postMessage` instead. The hash-based external store pattern is fundamentally incompatible with external hash manipulation because it creates a feedback loop: hash change → subscriber fires → re-render → potential further hash changes.

## Files Involved

- `src/app/(decks)/clients/priyoshop/exec-deck/edit/SlideEditor.tsx` — editor `goTo` function
- `src/app/decks/lib/useSlideNavigation.ts` — added `message` event listener
- `src/app/decks/lib/hooks/useEditorKeyboard.ts` — keyboard nav also used `location.replace`
