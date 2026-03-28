"use client";

import { useState, useEffect, useCallback, ReactElement } from "react";
import { SlideNav } from "./SlideNav";

interface DeckShellProps {
  slides: ReactElement[];
  /** Starting slide index (0-based) */
  startAt?: number;
  /** Custom nav button colors — defaults to semi-transparent dark */
  navClassName?: string;
}

export function DeckShell({ slides, startAt = 0, navClassName }: DeckShellProps) {
  const total = slides.length;
  const [current, setCurrent] = useState(startAt);

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
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

  return (
    <>
      {slides[current]}
      <SlideNav
        current={current}
        total={total}
        onPrev={prev}
        onNext={next}
        className={navClassName}
      />
    </>
  );
}
