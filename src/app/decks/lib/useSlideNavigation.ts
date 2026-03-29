"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Core slide navigation hook.
 *
 * Manages the current slide index with wrap-around navigation
 * and two-way URL hash sync (`#slide-1`, `#slide-2`, …).
 *
 * - On mount, reads the hash to restore the slide position (survives refresh).
 * - On navigation, updates the hash without pushing history entries.
 * - Responds to browser back/forward hash changes.
 */
export function useSlideNavigation(total: number, startAt = 0) {
  // Initialize from hash if available (client-only, safe in useState initializer)
  const [current, setCurrent] = useState(() => {
    if (typeof window === "undefined") return startAt;
    const hash = window.location.hash;
    const match = hash.match(/^#slide-(\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10) - 1;
      if (idx >= 0 && idx < total) return idx;
    }
    return startAt;
  });
  const initialized = useRef(false);

  // Sync hash to URL on every slide change
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      // Don't overwrite hash on first render — we already read it in useState
      return;
    }
    window.location.replace(`#slide-${current + 1}`);
  }, [current]);

  // Listen for browser back/forward hash changes
  useEffect(() => {
    function handleHashChange() {
      const match = window.location.hash.match(/^#slide-(\d+)$/);
      if (match) {
        const idx = parseInt(match[1], 10) - 1;
        if (idx >= 0 && idx < total) setCurrent(idx);
      }
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [total]);

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  return { current, next, prev };
}
