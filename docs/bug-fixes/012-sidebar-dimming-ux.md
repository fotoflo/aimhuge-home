---
date: 2026-03-30
severity: Medium
---

# 012 - Sidebar Dimming UX

**Symptom**: When users searched for a string matching a slide further down in a deck (e.g., slide 80 out of 85), the sidebar appeared unchanged except the first visible slides were greyed out. Users believed "the results aren't showing" because they had to manually scroll to find the un-dimmed match.

**Root Cause**: 
The search implementation used CSS dimming (`opacity: 0.15; filter: grayscale(100%)`) on unmatched slides instead of filtering them from the DOM. This preserved the original layout sequence for drag-and-drop, but created a confusing UX for large lists where matched items were hidden out of the overflow viewport.
```tsx
// Before
<SortableSlide
  isDimmed={matchedIds !== null && !matchedIds.has(s.id)}
/>
```

**The Fix**:
Modified `visibleIndices` to aggressively filter out unmatched slides when a search is active. This instantly shrinks the massive sidebar list to display *only* the matching thumbnails. We also introduced progressive enhancement where local string matches render instantly (150ms debounce) while remote semantic search matches are gracefully appended later.
```tsx
// After
const visibleIndices: number[] = [];
if (matchedIds !== null && searchQuery.trim() !== "") {
  slides.forEach((s, idx) => {
    if (matchedIds.has(s.id)) visibleIndices.push(idx); // Filter, don't dim
  });
}
```

**Key Rule**:
Search interfaces on large datasets MUST filter result positions into the immediate viewport, restricting visibility rather than just styling unmatched elements differently.

**Files Involved**:
- `src/app/(decks)/clients/priyoshop/exec-deck/edit/components/SlideSidebar.tsx`
