"use client";

import { useState, useEffect } from "react";
import { Sparkles, PanelRightClose, History, Undo } from "lucide-react";
import type { SlideFrontmatter } from "@/app/decks/lib/mdx-types";

// Keep this type minimal for our UI needs
interface SlideVersion {
  id: string;
  version_number: number;
  change_source: string | null;
  created_at: string;
  thumbnail_url?: string;
}

const EXAMPLE_PROMPTS = [
  "Add a 4th prompt: 'What will you do differently?'",
  "Change the subtitle to mention 15 minutes",
  "Add a background image",
  "Make the title bigger",
  "Switch to light variant",
];

interface PromptSidebarProps {
  slideId?: string;
  current: number;
  frontmatter: SlideFrontmatter;
  prompt: string;
  prompting: boolean;
  screenshot?: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onRevert: (versionId: string) => Promise<void>;
  onClose: () => void;
}

export function PromptSidebar({
  slideId, current, frontmatter: fm, prompt, prompting, screenshot,
  onPromptChange, onSubmit, onRevert, onClose,
}: PromptSidebarProps) {
  const [mode, setMode] = useState<"editor" | "history">("editor");
  const [versions, setVersions] = useState<SlideVersion[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [revertingId, setRevertingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (mode === "history" && slideId) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const res = await fetch(`/api/decks/slides/versions?slideId=${slideId}`);
          const data = await res.json();
          if (active && data.versions) setVersions(data.versions);
        } finally {
          if (active) setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
    return () => { active = false; };
  }, [mode, slideId]);

  const handleRevert = async (id: string) => {
    setRevertingId(id);
    await onRevert(id);
    setRevertingId(null);
  };

  return (
    <div className="w-80 border-l border-white/10 bg-[#0a0a0e] flex flex-col shrink-0 relative">
      <button
        onClick={onClose}
        className="absolute top-2 left-2 z-10 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-colors"
        title="Hide AI panel"
      >
        <PanelRightClose className="w-3.5 h-3.5" />
      </button>

      {/* Tabs */}
      <div className="flex border-b border-white/10 pt-10 px-3 pb-0 overflow-hidden">
        <button
          onClick={() => setMode("editor")}
          className={`flex-1 text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-colors ${
            mode === "editor" ? "border-[#7c5cfc] text-[#7c5cfc]" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setMode("history")}
          className={`flex-1 text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
            mode === "history" ? "border-[#7c5cfc] text-[#7c5cfc]" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          History
        </button>
      </div>

      {mode === "editor" ? (
        <>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
            {/* Screenshot context */}
            {screenshot && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-2">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                  Context
                </div>
                <img
                  src={screenshot}
                  alt="Slide Context"
                  className="w-full aspect-video object-cover rounded shadow ring-1 ring-white/10"
                />
              </div>
            )}

            {/* Slide info */}
            <div>
              <div className="text-xs text-slate-500 mb-1">Slide {current + 1}</div>
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
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-2">
                Quick Prompts
              </div>
              <div className="flex flex-col gap-1.5">
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
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-3">
          {loadingHistory ? (
            <div className="text-center text-xs text-slate-500 py-10">Loading history...</div>
          ) : versions.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-10">No previous versions found.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {versions.map((v) => {
                const isReverting = revertingId === v.id;
                const d = new Date(v.created_at);
                const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={v.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">#{v.version_number}</span>
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-black/20">
                          {v.change_source || "manual"}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{time}</span>
                    </div>
                    {v.thumbnail_url && (
                      <div className="mb-3 rounded overflow-hidden border border-white/10 bg-black/50">
                        <img
                          src={v.thumbnail_url}
                          alt={`Version ${v.version_number}`}
                          className="w-full h-full object-cover aspect-video"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <button
                      onClick={() => handleRevert(v.id)}
                      disabled={revertingId !== null}
                      className="w-full flex items-center justify-center gap-1.5 mt-2 py-1.5 px-3 rounded text-xs font-medium bg-white/10 hover:bg-white/20 text-slate-300 transition-colors disabled:opacity-50"
                    >
                      <Undo className="w-3.5 h-3.5" />
                      {isReverting ? "Reverting..." : "Revert Settings"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
