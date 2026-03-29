# 005 Sidebar Horizontal Scroll and Drag

**Date**: 2026-03-30
**Severity**: Low

## Symptom
The left slide sidebar (`SlideSidebar.tsx`) allowed horizontal dragging of slide items via `dnd-kit`, and horizontal scrolling, which created a sloppy user experience on narrower screens or trackpads.

## Root Cause
The `dnd-kit` `<DndContext>` was unbounded, allowing items to freely float in both X and Y directions. The sidebar container strictly handled `overflow-y-auto` but `overflow-x` was implicitly auto/visible.

## The Fix
1. Added `overflow-x-hidden` to the container to safely clip horizontal overflow.
2. Created and applied a custom `restrictToVerticalAxis` modifier for `<DndContext>` to zero-out horizontal transforms during dragging.

```tsx
// Before
<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>

// After
const restrictToVerticalAxis: Modifier = ({ transform }) => {
  return {
    ...transform,
    x: 0,
  };
};

<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
```

## Key Rule
Always apply `restrictToVerticalAxis` (or equivalent horizontal modifier) to 1D lists in `dnd-kit` to avoid unintentional multi-axis dragging.

## Files Involved
- `src/app/(decks)/clients/priyoshop/exec-deck/edit/components/SlideSidebar.tsx`
