"use client";

import { useEffect, useRef } from "react";

/**
 * Keyboard and click controls for slide navigation.
 *
 * - Arrow keys: Right/Space advance, Left goes back.
 * - Click: left half of viewport goes back, right half advances.
 * - Disabled when `?edit` query param is present (editor iframe).
 */
export function useSlideControls(next: () => void, prev: () => void) {
  const isEditMode = useRef(
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("edit")
  );

  // Keyboard navigation (disabled in edit mode)
  useEffect(() => {
    if (isEditMode.current) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  // Click handler — disabled in edit mode
  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode.current) return;
    if (e.clientX < window.innerWidth / 2) {
      prev();
    } else {
      next();
    }
  };

  return { handleClick };
}
