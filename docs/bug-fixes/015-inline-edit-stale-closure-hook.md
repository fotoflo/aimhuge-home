# 015: Inline Edit Stale Closure Hook

**Date:** 2026-03-31
**Severity:** Medium

**Symptom:**
Inline editing of text on slides "only saves sometimes". Edits on the initially loaded slide work fine, but after navigating to another slide and double-clicking a text block to edit, the changes fail to save or incorrectly patch the originally loaded slide's MDX.

**Root Cause:**
The `useInlineEditing` hook set up double-click event listeners on the `iframe.contentDocument` when the iframe first loaded. The `slide` state was captured in a closure at that specific point in time. Because the application uses `postMessage` to navigate between slides without fully reloading the iframe (to prevent blinking and recursive `useSyncExternalStore` rendering), the `load` event never fired again. Consequently, the event listeners retained the stale `slide` object (i.e., Slide 1). When an edit occurred on Slide 2, the code attempted to `replace()` the text inside Slide 1's MDX and dispatch a PATCH request for Slide 1. If the text didn't match anything in Slide 1, the edit silently failed.

```typescript
// Problematic pattern: Closure captures initial 'slide' because handleIframeLoad runs only once
export function useInlineEditing({ slide, iframeRef, setSlides }) {
  const handleIframeLoad = useCallback(() => {
    const doc = iframeRef.current.contentDocument;
    doc.addEventListener("dblclick", (e) => {
      // ...
      const finish = async () => {
         // 'slide' here is permanently stuck as the initial slide
         const updatedContent = slide.mdx_content.replace(originalText, newText);
         // ...
      }
    });
  }, [slide]); 
  // slide updates, but iframe doesn't reload, so the event listener is never rebound
}
```

**The Fix:**
Replaced the direct closure dependency with `useRef` hooks to retain the latest React state for `slide`, `setSlides`, and `setImageEditor`. The event listener now reads `slideRef.current`, ensuring it always acts upon the currently active slide regardless of when the listener was initially attached.

```typescript
  const slideRef = useRef(slide);
  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  // Inside the event listener:
  const currentSlide = slideRef.current;
  const updatedContent = currentSlide.mdx_content.replace(originalText, newText);
```

**Key Rule:**
When attaching vanilla DOM event listeners to elements that persist across React state changes (like an iframe document), always use `useRef` to access the latest state rather than relying on closures.

**Files Involved:**
- `src/app/decks/lib/hooks/useInlineEditing.ts`
