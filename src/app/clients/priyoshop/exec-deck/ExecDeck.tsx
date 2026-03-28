"use client";

import { DeckShell } from "@/app/decks/components/DeckShell";
import { TitleSlide } from "./slides/TitleSlide";
import { AgendaSlide } from "./slides/AgendaSlide";
import { SilentMeetingSlide } from "./slides/SilentMeetingSlide";
import { WhatIsAISlide } from "./slides/WhatIsAISlide";
import { ContextSlide } from "./slides/ContextSlide";
import { ContextExerciseSlide } from "./slides/ContextExerciseSlide";
import { SkillsSlide } from "./slides/SkillsSlide";
import { ArtifactsSlide } from "./slides/ArtifactsSlide";
import { HandsOnSlide } from "./slides/HandsOnSlide";
import { ClaudeCodeSlide } from "./slides/ClaudeCodeSlide";
import { ClosingSlide } from "./slides/ClosingSlide";
import type { DeckConfig } from "./lib/types";

interface ExecDeckProps {
  config: DeckConfig;
}

export function ExecDeck({ config }: ExecDeckProps) {
  const slides = [
    <TitleSlide key="title" config={config} />,
    <AgendaSlide key="agenda" />,
    <SilentMeetingSlide key="silent" />,
    <WhatIsAISlide key="what-is-ai" />,
    <ContextSlide key="context" />,
    <ContextExerciseSlide key="context-exercise" />,
    <SkillsSlide key="skills" />,
    <ArtifactsSlide key="artifacts" />,
    <HandsOnSlide key="hands-on" />,
    <ClaudeCodeSlide key="claude-code" />,
    <ClosingSlide key="closing" />,
  ];

  return <DeckShell slides={slides} />;
}
