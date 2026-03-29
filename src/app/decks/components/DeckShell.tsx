"use client";

import type { ReactElement } from "react";
import { useSlideNavigation } from "../lib/useSlideNavigation";
import { useSlideControls } from "../lib/useSlideControls";

interface DeckShellProps {
  slides: ReactElement[];
  /** Starting slide index (0-based) */
  startAt?: number;
}

/**
 * Top-level deck container.
 *
 * Renders one slide at a time and wires up navigation:
 * - URL hash sync (refresh preserves position)
 * - Keyboard (arrow keys, spacebar)
 * - Click (left half = back, right half = forward)
 */
export function DeckShell({ slides, startAt = 0 }: DeckShellProps) {
  const { current, next, prev } = useSlideNavigation(slides.length, startAt);
  const { handleClick } = useSlideControls(next, prev);

  return (
    <div onClick={handleClick} className="relative cursor-pointer">
      {slides[current]}
      <div className="fixed bottom-4 right-6 text-xs text-slate-500 font-medium z-50 pointer-events-none">
        {current + 1} / {slides.length}
      </div>
    </div>
  );
}
