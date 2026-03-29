"use client";

import { useEffect, useCallback, type RefObject } from "react";
import type { SlideRow } from "@/app/decks/lib/slides-db";
import type { SlideFrontmatter } from "@/app/decks/lib/mdx-types";
import { computeIndent } from "@/app/decks/lib/editor-utils";

interface UseEditorKeyboardOptions {
  slides: SlideRow[];
  current: number;
  total: number;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setShowCode: React.Dispatch<React.SetStateAction<boolean>>;
  setSlides: React.Dispatch<React.SetStateAction<SlideRow[]>>;
}

/**
 * Keyboard shortcuts for the slide editor:
 * - ArrowUp / ArrowDown: navigate slides
 * - Tab / Shift+Tab: indent / outdent slide level
 */
export function useEditorKeyboard({
  slides,
  current,
  total,
  iframeRef,
  setCurrent,
  setShowCode,
  setSlides,
}: UseEditorKeyboardOptions) {
  const handleIndent = useCallback(async (direction: "indent" | "outdent") => {
    const s = slides[current];
    if (!s) return;
    const fm = s.frontmatter as SlideFrontmatter;
    const newLevel = computeIndent(direction, current, fm);
    if (newLevel === null) return;

    const newFrontmatter = { ...fm, level: newLevel };

    setSlides((prev) =>
      prev.map((sl) => sl.id === s.id ? { ...sl, frontmatter: newFrontmatter } : sl),
    );

    await fetch("/api/decks/slides", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id, frontmatter: newFrontmatter }),
    });
  }, [slides, current, setSlides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.contentEditable === "true") return;

      if (e.key === "Tab") {
        e.preventDefault();
        handleIndent(e.shiftKey ? "outdent" : "indent");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCurrent((c) => {
          const next = Math.max(0, c - 1);
          if (next !== c) {
            setShowCode(false);
            const iframe = iframeRef.current;
            if (iframe?.contentWindow) iframe.contentWindow.postMessage({ type: "goToSlide", index: next }, "*");
          }
          return next;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setCurrent((c) => {
          const next = Math.min(total - 1, c + 1);
          if (next !== c) {
            setShowCode(false);
            const iframe = iframeRef.current;
            if (iframe?.contentWindow) iframe.contentWindow.postMessage({ type: "goToSlide", index: next }, "*");
          }
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleIndent, total, setCurrent, setShowCode, iframeRef]);
}
