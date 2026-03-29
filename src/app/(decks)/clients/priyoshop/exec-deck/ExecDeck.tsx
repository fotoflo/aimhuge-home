"use client";

import { DeckShell } from "@/app/decks/components/DeckShell";
import { TitleSlide } from "./slides/TitleSlide";
import { AgendaSlide } from "./slides/AgendaSlide";
import { SilentMeetingSlide } from "./slides/SilentMeetingSlide";
import { WhatIsAISlide } from "./slides/WhatIsAISlide";
import { VoiceFeaturesSlide } from "./slides/VoiceFeaturesSlide";
import { ScreenshotsPhotosSlide } from "./slides/ScreenshotsPhotosSlide";
import { PromptsFromOtherAIsSlide } from "./slides/PromptsFromOtherAIsSlide";
import { PastingDocumentsSlide } from "./slides/PastingDocumentsSlide";
import { SummarizingLongTextsSlide } from "./slides/SummarizingLongTextsSlide";
import { PromptsWritePromptsSlide } from "./slides/PromptsWritePromptsSlide";
import { PromptsExtractInfoSlide } from "./slides/PromptsExtractInfoSlide";
import { PushingBackSlide } from "./slides/PushingBackSlide";
import { ArtifactsSlide } from "./slides/ArtifactsSlide";
import { ContextSlide } from "./slides/ContextSlide";
import { ContextExerciseSlide } from "./slides/ContextExerciseSlide";
import { SetupCoworkSlide } from "./slides/SetupCoworkSlide";
import { SkillsSlide } from "./slides/SkillsSlide";
import { HandsOnWritingSlide } from "./slides/HandsOnWritingSlide";
import { HandsOnSpreadsheetsSlide } from "./slides/HandsOnSpreadsheetsSlide";
import { HandsOnDocumentsSlide } from "./slides/HandsOnDocumentsSlide";
import { HandsOnDataSlide } from "./slides/HandsOnDataSlide";
import { HandsOnEmailCalendarSlide } from "./slides/HandsOnEmailCalendarSlide";
import { HandsOnInterviewingSlide } from "./slides/HandsOnInterviewingSlide";
import { HandsOnPresentationsSlide } from "./slides/HandsOnPresentationsSlide";
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
    // Section 3 — Interacting with AI
    <VoiceFeaturesSlide key="voice" />,
    <ScreenshotsPhotosSlide key="screenshots" />,
    <PromptsFromOtherAIsSlide key="prompts-other-ais" />,
    <PastingDocumentsSlide key="pasting-docs" />,
    <SummarizingLongTextsSlide key="summarizing" />,
    <PromptsWritePromptsSlide key="prompts-write-prompts" />,
    <PromptsExtractInfoSlide key="prompts-extract" />,
    <PushingBackSlide key="pushing-back" />,
    // Section 4 — Artifacts
    <ArtifactsSlide key="artifacts" />,
    // Section 5 — Context
    <ContextSlide key="context" />,
    <ContextExerciseSlide key="context-exercise" />,
    // ── BREAK ──
    // Setup + Skills
    <SetupCoworkSlide key="setup" />,
    <SkillsSlide key="skills" />,
    // Section 7 — Hands-On
    <HandsOnWritingSlide key="writing" />,
    <HandsOnSpreadsheetsSlide key="spreadsheets" />,
    <HandsOnDocumentsSlide key="documents" />,
    <HandsOnDataSlide key="data" />,
    <HandsOnEmailCalendarSlide key="email-calendar" />,
    <HandsOnInterviewingSlide key="interviewing" />,
    <HandsOnPresentationsSlide key="presentations" />,
    // Section 8
    <ClaudeCodeSlide key="claude-code" />,
    <ClosingSlide key="closing" />,
  ];

  return <DeckShell slides={slides} />;
}
