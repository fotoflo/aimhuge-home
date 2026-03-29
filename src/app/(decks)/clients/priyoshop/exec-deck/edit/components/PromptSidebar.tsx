"use client";

import { Sparkles, PanelRightClose } from "lucide-react";
import type { SlideFrontmatter } from "@/app/decks/lib/mdx-types";

const EXAMPLE_PROMPTS = [
  "Add a 4th prompt: 'What will you do differently?'",
  "Change the subtitle to mention 15 minutes",
  "Add a background image",
  "Make the title bigger",
  "Switch to light variant",
];

interface PromptSidebarProps {
  current: number;
  frontmatter: SlideFrontmatter;
  prompt: string;
  prompting: boolean;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function PromptSidebar({
  current, frontmatter: fm, prompt, prompting,
  onPromptChange, onSubmit, onClose,
}: PromptSidebarProps) {
  return (
    <div className="w-80 border-l border-white/10 bg-[#0a0a0e] flex flex-col shrink-0 relative">
      <button
        onClick={onClose}
        className="absolute top-2 left-2 z-10 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-colors"
        title="Hide AI panel"
      >
        <PanelRightClose className="w-3.5 h-3.5" />
      </button>

      {/* Slide info */}
      <div className="p-3 border-b border-white/10">
        <div className="text-xs text-slate-500 mb-2">Slide {current + 1}</div>
        <div className="text-sm font-bold text-white mb-1">{fm?.title ?? "Untitled"}</div>
        {fm?.subtitle && (
          <div className="text-xs text-slate-400 leading-relaxed">{fm.subtitle}</div>
        )}
        <div className="flex gap-2 mt-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
            {fm?.variant}
          </span>
          {fm?.sectionLabel && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
              {fm.sectionLabel}
            </span>
          )}
        </div>
      </div>

      {/* Example prompts */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-3">
          AI Assistant
        </div>
        <div className="text-xs text-slate-500 leading-relaxed">
          Describe changes you want to make to this slide. Examples:
        </div>
        <div className="mt-2 flex flex-col gap-1.5">
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex}
              onClick={() => onPromptChange(ex)}
              className="text-left text-[11px] text-slate-400 hover:text-[#9b82fd] px-2 py-1.5 rounded hover:bg-white/5 transition-colors"
            >
              &ldquo;{ex}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Prompt input */}
      <div className="p-3 border-t border-white/10">
        <div className="flex flex-col gap-2">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder="Describe the change..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#7c5cfc]/50 resize-none"
            rows={3}
            disabled={prompting}
          />
          <button
            onClick={onSubmit}
            disabled={prompting || !prompt.trim()}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-lg bg-[#7c5cfc] text-white hover:bg-[#6b4de0] transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {prompting ? "Thinking..." : "Update Slide"}
          </button>
        </div>
      </div>
    </div>
  );
}
