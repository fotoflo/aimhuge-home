# 007 - MDX Paragraph Hydration Mismatch

**Date**: 2026-03-29
**Severity**: Medium

## Symptom
The React hydration error: `In HTML, <div> cannot be a descendant of <p>` triggered on the slide editor and viewer when content was wrapped inside `<CardText>`. This caused visual flickering or completely broke the layout during SSR hydration to the client code.

## Root Cause
In `next-mdx-remote`, the markdown parser auto-wraps standard markdown text with a `<p>` tag. To circumvent invalid HTML nesting when using other markdown elements, the `MDXSlide.tsx` file defines a custom MDX component mapping: `p: (props) => <div {...props} />`.

However, the `CardText` component in `Card.tsx` natively rendered `<p>{children}</p>`. When users put multi-line markdown inside a `CardText` block:
1. `CardText` rendered `<p>`
2. The MDX parser generated an inner paragraph and replaced it with `<div>` (via the custom mapping)
3. The result became `<p><div>...</div></p>`, which violates HTML spec, causing Next.js to throw a hydration error since the DOM automatically closes the `<p>` when it encounters a `<div>`.

```tsx
// Before (Card.tsx)
export function CardText({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className="...">
      {children}
    </p>
  );
}
```

## The Fix
Modified `CardText` to render its children within a `<div className="...">` instead of `<p>`. This makes the DOM structurally robust, regardless of how `next-mdx-remote` parses the internal child blocks.

```tsx
// After
export function CardText({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="...">
      {children}
    </div>
  );
}
```

## Key Rule
Never use structural block elements like `<p>` as a generic wrapper for `children` inside MDX components. Always prefer `<div>` when an element may contain parsed markdown content that could itself be mapped to `<div>` elements.

## Files Involved
- `src/app/decks/components/Card.tsx`
