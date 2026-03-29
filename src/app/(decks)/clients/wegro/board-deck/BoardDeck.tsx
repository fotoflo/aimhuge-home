"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Initiative } from "./lib/types";
import { SlideNav } from "./components/SlideNav";
import { TitleSlide } from "./slides/TitleSlide";
import { ExecSummarySlide } from "./slides/ExecSummarySlide";
import { MarketContextSlide } from "./slides/MarketContextSlide";
import { ArchitectureSlide } from "./slides/ArchitectureSlide";
import { InputsSlide } from "./slides/InputsSlide";
import { FinancingSlide } from "./slides/FinancingSlide";
import { TradingSlide } from "./slides/TradingSlide";
import { DataSlide } from "./slides/DataSlide";
import { FlywheelSlide } from "./slides/FlywheelSlide";
import { ScoringMatrixSlide } from "./slides/ScoringMatrixSlide";
import { PrioritySummarySlide } from "./slides/PrioritySummarySlide";
import { KPISlide } from "./slides/KPISlide";
import { Q2StrategySlide } from "./slides/Q2StrategySlide";
import { SayNoSlide } from "./slides/SayNoSlide";
import { BoardAlignmentSlide } from "./slides/BoardAlignmentSlide";
import { ClosingSlide } from "./slides/ClosingSlide";

interface BoardDeckProps {
  initialPriorities: Initiative[];
}

export function BoardDeck({ initialPriorities }: BoardDeckProps) {
  const [current, setCurrent] = useState(0);
  const [initiatives, setInitiatives] = useState(initialPriorities);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback((data: Initiative[]) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      fetch("/api/clients/wegro/priorities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {});
    }, 500);
  }, []);

  const handleReorder = useCallback(
    (items: Initiative[]) => {
      setInitiatives(items);
      save(items);
    },
    [save]
  );

  const handleScoreChange = useCallback(
    (id: string, field: keyof Initiative["scores"], value: number) => {
      setInitiatives((prev) => {
        const next = prev.map((i) =>
          i.id === id ? { ...i, scores: { ...i.scores, [field]: value } } : i
        );
        save(next);
        return next;
      });
    },
    [save]
  );

  const totalSlides = 16;

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % totalSlides),
    []
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + totalSlides) % totalSlides),
    []
  );

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

  const slides = [
    <TitleSlide key="title" />,
    <ExecSummarySlide key="exec" />,
    <MarketContextSlide key="market" />,
    <ArchitectureSlide key="arch" />,
    <InputsSlide key="inputs" />,
    <FinancingSlide key="financing" />,
    <TradingSlide key="trading" />,
    <DataSlide key="data" />,
    <FlywheelSlide key="flywheel" />,
    <ScoringMatrixSlide
      key="scoring"
      initiatives={initiatives}
      onReorder={handleReorder}
      onScoreChange={handleScoreChange}
    />,
    <PrioritySummarySlide key="summary" initiatives={initiatives} />,
    <KPISlide key="kpi" />,
    <Q2StrategySlide key="q2" />,
    <SayNoSlide key="sayno" />,
    <BoardAlignmentSlide key="board" />,
    <ClosingSlide key="closing" />,
  ];

  return (
    <>
      {slides[current]}
      <SlideNav current={current} total={totalSlides} onPrev={prev} onNext={next} />
    </>
  );
}
