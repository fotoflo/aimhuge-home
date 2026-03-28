"use client";

import { DeckShell } from "@/app/decks/components/DeckShell";
import { TitleSlide } from "./slides/TitleSlide";
import { ClosingSlide } from "./slides/ClosingSlide";
import type { DeckConfig } from "./lib/types";

interface ExecDeckProps {
  config: DeckConfig;
}

export function ExecDeck({ config }: ExecDeckProps) {
  const slides = [
    <TitleSlide key="title" config={config} />,
    <ClosingSlide key="closing" />,
  ];

  return <DeckShell slides={slides} />;
}
