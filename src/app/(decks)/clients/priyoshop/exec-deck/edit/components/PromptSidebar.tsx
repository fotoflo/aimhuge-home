"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, PanelRightClose, History, Undo, Lightbulb, Zap } from "lucide-react";
import type { SlideFrontmatter } from "@/app/decks/lib/mdx-types";
import type { SlideRow } from "@/app/decks/lib/slides-db";

// Keep this type minimal for our UI needs
interface SlideVersion {
  id: string;
  version_number: number;
  change_source: string | null;
  created_at: string;
  thumbnail_url?: string;
}



interface PromptSidebarProps {
  slides: SlideRow[];
  slideId?: string;
  deckSlug?: string;
  current: number;
  frontmatter: SlideFrontmatter;
  prompt: string;
  prompting: boolean;
  copilotText?: string;
  userPrompt?: string;
  screenshot?: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onRevert: (versionId: string) => Promise<void>;
  onClose: () => void;
}

export function PromptSidebar({
  slides, slideId, deckSlug, current, frontmatter: fm, prompt, prompting, copilotText, userPrompt, screenshot,
  onPromptChange, onSubmit, onRevert, onClose,
}: PromptSidebarProps) {
  const [mode, setMode] = useState<"editor" | "suggestions" | "history">("editor");
  const [versions, setVersions] = useState<SlideVersion[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [revertingId, setRevertingId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [slideCost, setSlideCost] = useState<number | null>(null);
  const suggestionCacheRef = useRef<Record<string, string[]>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fmKey = JSON.stringify(fm);

  // Fetch slide cost
  useEffect(() => {
    let active = true;
    if (slideId && deckSlug) {
      fetch(`/api/decks/cost?deckSlug=${deckSlug}&slideId=${slideId}`)
        .then(res => res.json())
        .then(data => {
          if (active && data.cost !== undefined) setSlideCost(data.cost);
        })
        .catch(console.error);
    } else {
      setSlideCost(null);
    }
    return () => { active = false; };
  }, [slideId, deckSlug, prompting]); // Re-fetch after prompting completes

  // Reset state when the active slide changes
  useEffect(() => {
    setMode("editor");
    if (slideId && suggestionCacheRef.current[slideId]) {
      setSuggestions(suggestionCacheRef.current[slideId]);
    } else {
      setSuggestions([]);
    }
  }, [slideId]);

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
    
    if (mode === "suggestions" && slideId && suggestions.length === 0) {
      const fetchSuggestions = async () => {
        setLoadingSuggestions(true);
        try {
          const currentSlide = slides[current];
          const previousSlide = current > 0 ? slides[current - 1] : null;
          const nextSlide = current < slides.length - 1 ? slides[current + 1] : null;
          const toc = slides.map((s, i) => ({ index: i + 1, title: (s.frontmatter as SlideFrontmatter)?.title || "Untitled" }));
          
          const payload = {
            deckSlug,
            slideId,
            image: screenshot,
            currentSlide: { frontmatter: currentSlide?.frontmatter, content: currentSlide?.mdx_content },
            previousSlide: previousSlide ? { frontmatter: previousSlide.frontmatter, content: previousSlide.mdx_content } : null,
            nextSlide: nextSlide ? { frontmatter: nextSlide.frontmatter, content: nextSlide.mdx_content } : null,
            toc
          };

          const res = await fetch("/api/decks/slides/suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (active && data.suggestions) {
            suggestionCacheRef.current[slideId] = data.suggestions;
            setSuggestions(data.suggestions);
          }
        } finally {
          if (active) setLoadingSuggestions(false);
        }
      };
      fetchSuggestions();
    }
    
    return () => { active = false; };
  }, [mode, slideId, deckSlug, screenshot, fmKey, suggestions.length, current, slides]);

  const handleRevert = async (id: string) => {
    setRevertingId(id);
    await onRevert(id);
    setRevertingId(null);
  };

  // Auto-resize the textarea when prompt changes
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to compute actual scrollHeight
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 250)}px`;
    }
  }, [prompt]);

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
          onClick={() => setMode("suggestions")}
          className={`flex-1 text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
            mode === "suggestions" ? "border-[#7c5cfc] text-[#7c5cfc]" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          Tips
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
                <div className="relative w-full aspect-video rounded overflow-hidden shadow ring-1 ring-white/10">
                  <Image
                    src={screenshot}
                    alt="Slide Context"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            )}

            {/* Slide info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs text-slate-500">Slide {current + 1}</div>
                {slideCost !== null && slideCost > 0 && (
                  <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                    <Zap className="w-2.5 h-2.5" />
                    ${slideCost.toFixed(4)}
                  </div>
                )}
              </div>
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

            {/* AI Copilot */}
            {(prompting || copilotText || userPrompt) && (
              <div className="flex flex-col gap-3">
                {userPrompt && (
                  <div className="bg-[#1b1b24] p-3 rounded-lg border border-white/10 self-end ml-4 shadow">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">You</div>
                    <div className="text-xs text-slate-300">{userPrompt}</div>
                  </div>
                )}
                {(prompting || copilotText) && (
                  <div className="bg-[#1b1b24] p-3 rounded-lg border border-[#7c5cfc]/30 shadow-[0_0_15px_rgba(124,92,252,0.1)] mr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#7c5cfc] animate-pulse" />
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#7c5cfc]">AI Copilot</span>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {copilotText || "Analyzing slide and generating changes..."}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Prompt input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex flex-col gap-2">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                placeholder="Describe the change..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#7c5cfc]/50 resize-none overflow-y-auto"
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
      ) : mode === "suggestions" ? (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 min-w-0 relative">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#7c5cfc]/10 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-1.5 bg-[#7c5cfc]/10 rounded-md border border-[#7c5cfc]/20">
              <Lightbulb className="w-3.5 h-3.5 text-[#7c5cfc]" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300">
              AI Layout Tips
            </span>
          </div>
          
          {loadingSuggestions ? (
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-ping" />
                <span className="text-[9px] font-mono tracking-widest text-[#7c5cfc] uppercase">
                  Synthesizing aesthetics...
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="relative w-full rounded-xl bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-white/5 p-4 overflow-hidden">
                    {/* Geometric skeleton styling */}
                    <div className="w-14 h-3 bg-[#7c5cfc]/10 rounded-sm animate-pulse mb-4" />
                    <div className="space-y-2.5">
                      <div className="h-1 bg-white/10 rounded-full w-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                      <div className="h-1 bg-white/10 rounded-full w-[78%]" style={{ animationDelay: `${i * 300}ms` }} />
                      <div className="h-1 bg-white/10 rounded-full w-[45%]" style={{ animationDelay: `${i * 450}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center z-10 relative">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] mb-4">
                <Lightbulb className="w-5 h-5 text-slate-600" />
              </div>
              <div className="text-sm font-medium text-slate-400">Layout Canvas Empty</div>
              <div className="text-xs text-slate-600 mt-1">Waiting for slide context...</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 relative z-10">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onPromptChange(suggestion);
                    setMode("editor");
                  }}
                  className="group relative block w-full text-left rounded-xl bg-gradient-to-b from-[#161622] to-[#0e0e15] overflow-hidden border border-white/5 hover:border-[#7c5cfc]/40 transition-all duration-400 transform hover:-translate-y-1 shadow-lg hover:shadow-[0_8px_30px_rgba(124,92,252,0.15)] animate-fade-up"
                  style={{ animationFillMode: "both", animationDelay: `${idx * 120}ms` }}
                >
                  {/* Neon Left Strike */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#7c5cfc] to-[#4facfe] scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 transition-all origin-top duration-300 ease-out" />
                  
                  {/* Interactive abstract geometric highlight */}
                  <div className="absolute -inset-24 bg-gradient-to-r from-transparent via-[#7c5cfc]/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                  <div className="p-4 relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                       <span className="text-[9px] font-mono tracking-widest text-[#7c5cfc] px-2 py-0.5 rounded-sm bg-[#7c5cfc]/10 border border-[#7c5cfc]/20 uppercase">
                         Tip 0{idx + 1}
                       </span>
                    </div>
                    <p className="text-[12.5px] font-medium text-slate-300 group-hover:text-white leading-[1.6] tracking-wide transition-colors">
                      {suggestion}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
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
                      <div className="mb-3 rounded overflow-hidden border border-white/10 bg-black/50 relative aspect-video">
                        <Image
                          src={v.thumbnail_url}
                          alt={`Version ${v.version_number}`}
                          fill
                          className="object-cover"
                          unoptimized
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
