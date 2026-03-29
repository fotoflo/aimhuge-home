"use client";

import { useEffect } from "react";

/**
 * Suppress React hydration-mismatch console errors in development.
 * MDX slides rendered via RSC can produce harmless style-attribute diffs
 * (e.g. cursor:pointer) that clutter the console but don't affect behavior.
 */
export function SuppressHydrationWarning() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const orig = console.error;
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === "string" ? args[0] : "";
      const detail = args.length > 1 && typeof args[1] === "string" ? args[1] : "";
      const full = msg + detail;
      if (
        full.includes("A tree hydrated but some attributes") &&
        full.includes("cursor")
      ) {
        return;
      }
      orig.apply(console, args);
    };

    return () => {
      console.error = orig;
    };
  }, []);

  return null;
}
