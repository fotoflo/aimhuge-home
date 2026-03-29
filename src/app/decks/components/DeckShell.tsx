"use client";

import { useMemo, useSyncExternalStore, type ReactElement } from "react";
import { useSlideNavigation } from "../lib/useSlideNavigation";
import { useSlideControls } from "../lib/useSlideControls";

interface DeckShellProps {
  slides: ReactElement[];
  startAt?: number;
}

// ── Viewport scale store (tracks window resize) ──

function createViewportStore() {
  const listeners = new Set<() => void>();
  let zoom = 1;

  function getScale() {
    if (typeof window === "undefined") return 1;
    const scaleX = window.innerWidth / 1920;
    const scaleY = window.innerHeight / 1080;
    return Math.min(scaleX, scaleY) * zoom;
  }

  function subscribe(cb: () => void) {
    listeners.add(cb);
    const onResize = () => cb();
    window.addEventListener("resize", onResize);

    // Cmd+scroll zoom
    const onWheel = (e: WheelEvent) => {
      if (!e.metaKey && !e.ctrlKey) return;
      e.preventDefault();
      zoom = Math.max(0.25, Math.min(3, zoom - e.deltaY * 0.001));
      listeners.forEach((l) => l());
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      listeners.delete(cb);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
    };
  }

  return { subscribe, getSnapshot: getScale, getServerSnapshot: () => 1 };
}

/**
 * Renders slides at 1920x1080, scaled to fit the viewport.
 * Cmd+scroll to zoom. Click left/right half to navigate.
 */
export function DeckShell({ slides, startAt = 0 }: DeckShellProps) {
  const { current, next, prev, ready } = useSlideNavigation(slides.length, startAt);
  const { handleClick } = useSlideControls(next, prev);

  const viewportStore = useMemo(() => createViewportStore(), []);
  const scale = useSyncExternalStore(viewportStore.subscribe, viewportStore.getSnapshot, viewportStore.getServerSnapshot);

  return (
    <div
      className="slide-container"
      onClick={handleClick}
      style={{ visibility: ready ? "visible" : "hidden", cursor: "pointer" }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}>
        {slides[current]}
      </div>
      <div className="fixed bottom-4 right-6 text-xs text-slate-500 font-medium z-50 pointer-events-none">
        {current + 1} / {slides.length}
      </div>
    </div>
  );
}
