"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Sparkles, PanelRightClose, History, Undo, Lightbulb, RefreshCw, CheckCircle2 } from "lucide-react";
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

const backgroundInProgress = new Set<string>();



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
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [tipStyle, setTipStyle] = useState("premium");
  const [customTipStyle, setCustomTipStyle] = useState("");
  const isFetchingTipsRef = useRef(false);
  const [manualHeight, setManualHeight] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fmKey = JSON.stringify(fm);

  const loadingPhrases = [
    "Synthesizing aesthetics...",
    "Scanning layout geometry...",
    "Analyzing narrative context...",
    "Refining graphic details..."
  ];

  useEffect(() => {
    setMode("editor");
  }, [slideId]);

  useEffect(() => {
    const savedCustom = localStorage.getItem("customTipStyle");
    if (savedCustom) setCustomTipStyle(savedCustom);
  }, []);

  useEffect(() => {
    if (customTipStyle) {
      localStorage.setItem("customTipStyle", customTipStyle);
    }
  }, [customTipStyle]);

  useEffect(() => {
    const currentSlide = slides.find(s => s.id === slideId);
    if (!currentSlide) {
      setSuggestions([]);
      return;
    }
    
    if (currentSlide.ai_tips && currentSlide.ai_tips.length > 0) {
      setSuggestions(currentSlide.ai_tips);
    } else {
      setSuggestions([]);
    }
  }, [slideId, slides]);

  useEffect(() => {
    const handleTipsGenerated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.slideId === slideId && customEvent.detail?.suggestions) {
        setSuggestions(customEvent.detail.suggestions);
      }
    };
    
    window.addEventListener("tipsGenerated", handleTipsGenerated);
    return () => window.removeEventListener("tipsGenerated", handleTipsGenerated);
  }, [slideId]);

  // Background tips generator for the entire deck
  useEffect(() => {
    if (!deckSlug || slides.length === 0) return;
    let active = true;

    const generateMissingTips = async () => {
      const toc = slides.map((s, i) => ({ index: i + 1, title: (s.frontmatter as SlideFrontmatter)?.title || "Untitled" }));
      
      for (let i = 0; i < slides.length; i++) {
        if (!active) break;
        const s = slides[i];
        const cacheKey = `tips_${deckSlug}_${s.id}`;
        
        // Skip if DB already has tips
        if ((!s.ai_tips || s.ai_tips.length === 0) && !backgroundInProgress.has(cacheKey)) {
          backgroundInProgress.add(cacheKey);
          
          const previousSlide = i > 0 ? slides[i - 1] : null;
          const nextSlide = i < slides.length - 1 ? slides[i + 1] : null;
          
          const payload = {
            deckSlug,
            slideId: s.id,
            image: undefined,
            currentSlide: { frontmatter: s.frontmatter, content: s.mdx_content },
            previousSlide: previousSlide ? { frontmatter: previousSlide.frontmatter, content: previousSlide.mdx_content } : null,
            nextSlide: nextSlide ? { frontmatter: nextSlide.frontmatter, content: nextSlide.mdx_content } : null,
            toc,
            style: "premium"
          };

          try {
            const res = await fetch("/api/decks/slides/suggestions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (active && data.suggestions && data.suggestions.length > 0) {
              window.dispatchEvent(new CustomEvent('tipsGenerated', { detail: { slideId: s.id, suggestions: data.suggestions } }));
            }
          } catch (e) {
            console.error("Background tips generation error:", e);
          } finally {
            backgroundInProgress.delete(cacheKey);
          }
        }
      }
    };
    
    generateMissingTips();

    return () => { active = false; };
  }, [deckSlug, slides]);

  useEffect(() => {
    if (loadingSuggestions) {
      const int = setInterval(() => setLoadingPhase(p => (p + 1) % loadingPhrases.length), 3000);
      return () => clearInterval(int);
    }
  }, [loadingSuggestions, loadingPhrases.length]);

  const fetchSuggestions = useCallback(async (force = false) => {
    if (!slideId || !deckSlug) return;
    if (!force && suggestions.length > 0) return;
    if (isFetchingTipsRef.current) return;
    
    isFetchingTipsRef.current = true;
    setLoadingSuggestions(true);
    setLoadingPhase(0);
    if (force) setSuggestions([]);

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
        toc,
        style: tipStyle === "custom" ? customTipStyle : tipStyle
      };

      const res = await fetch("/api/decks/slides/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } finally {
      isFetchingTipsRef.current = false;
      setLoadingSuggestions(false);
    }
  }, [deckSlug, slideId, screenshot, slides, current, suggestions.length, tipStyle, customTipStyle]);

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
  }, [mode, slideId, deckSlug, screenshot, fmKey, suggestions.length, current, slides, fetchSuggestions]);

  const handleRevert = async (id: string) => {
    setRevertingId(id);
    await onRevert(id);
    setRevertingId(null);
  };

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = textareaRef.current?.getBoundingClientRect().height || 80;
    
    const onMove = (me: MouseEvent) => {
      const delta = startY - me.clientY;
      setManualHeight(Math.max(80, Math.min(window.innerHeight * 0.6, startH + delta)));
    };
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  useEffect(() => {
    if (textareaRef.current) {
      if (manualHeight && prompt.trim()) {
        textareaRef.current.style.height = `${manualHeight}px`;
      } else {
        textareaRef.current.style.height = "auto";
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${scrollHeight}px`;
      }
    }
  }, [prompt, manualHeight]);

  return (
    <div className="w-80 border-l border-white/10 bg-[#0a0a0e] flex flex-col shrink-0 relative">
      <button
        onClick={onClose}
        className="absolute top-2 left-2 z-10 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-colors"
        title="Hide AI panel"
      >
        <PanelRightClose className="w-3.5 h-3.5" />
      </button>

      <div className="flex border-b border-white/10 pt-10 px-3 pb-0 overflow-hidden">
        <button
          onClick={() => setMode("editor")}
          className={`flex-1 text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-colors focus:outline-none focus-visible:ring-0 ${
            mode === "editor" ? "border-[#7c5cfc] text-[#7c5cfc]" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setMode("suggestions")}
          className={`flex-1 text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-0 ${
            mode === "suggestions" ? "border-[#7c5cfc] text-[#7c5cfc]" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          Tips
        </button>
        <button
          onClick={() => setMode("history")}
          className={`flex-1 text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-0 ${
            mode === "history" ? "border-[#7c5cfc] text-[#7c5cfc]" : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          History
        </button>
      </div>

      {mode === "editor" ? (
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
      ) : mode === "suggestions" ? (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 min-w-0 relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#7c5cfc]/10 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-[#7c5cfc]/10 rounded-md border border-[#7c5cfc]/20">
                <Lightbulb className="w-3.5 h-3.5 text-[#7c5cfc]" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300">
                AI Tips
              </span>
            </div>
            {suggestions.length > 0 && !loadingSuggestions && (
              <button 
                onClick={() => fetchSuggestions(true)}
                className="p-1.5 rounded hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors"
                title="Generate new tips"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative z-10 mb-6">
            <select
              value={tipStyle}
              onChange={(e) => setTipStyle(e.target.value)}
              className="w-full bg-[#161622] border border-[#7c5cfc]/30 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-[#7c5cfc] appearance-none cursor-pointer transition-colors hover:border-[#7c5cfc]/60"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%237c5cfc%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right .7em top 50%", backgroundSize: "10px auto" }}
            >
              <optgroup label="Layout Aesthetics" className="bg-[#12121a]">
                <option value="premium">Premium Corporate (Apple/Stripe)</option>
                <option value="edgy">Edgy & Avant-Garde</option>
                <option value="minimalist">Pure Minimalist</option>
                <option value="analytical">Data-Heavy & Analytical</option>
              </optgroup>
              <optgroup label="Content Editing" className="bg-[#12121a]">
                <option value="punchy">Punchy & Concise</option>
                <option value="expand">Expand & Elaborate</option>
                <option value="storytelling">Narrative Storytelling</option>
              </optgroup>
              <optgroup label="Custom" className="bg-[#12121a]">
                <option value="custom">Other (Custom Prompt)...</option>
              </optgroup>
            </select>
            {tipStyle === "custom" && (
              <textarea
                value={customTipStyle}
                onChange={(e) => setCustomTipStyle(e.target.value)}
                placeholder="Enter custom layout or content instructions..."
                className="w-full mt-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#7c5cfc]/50 resize-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shadow-inner"
                rows={3}
              />
            )}
          </div>
          
          {loadingSuggestions ? (
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-ping" />
                <span className="text-[9px] font-mono tracking-widest text-[#7c5cfc] uppercase">
                  {loadingPhrases[loadingPhase]}
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
              <div className="w-12 h-12 rounded-full border border-[#7c5cfc]/20 flex items-center justify-center bg-[#7c5cfc]/5 mb-4 shadow-[0_0_15px_rgba(124,92,252,0.1)]">
                <Lightbulb className="w-5 h-5 text-[#7c5cfc]" />
              </div>
              <div className="text-sm font-medium text-slate-300">No layout tips yet</div>
              <div className="text-xs text-slate-500 mt-1 mb-6 text-center max-w-[200px]">Generate custom AI layout suggestions for this slide.</div>
              <button
                onClick={() => fetchSuggestions(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#7c5cfc] hover:bg-[#6b4de0] text-white text-xs font-semibold rounded-lg transition-colors shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate Tips
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 relative z-10">
              {suggestions.map((suggestion, idx) => {
                const isSelected = prompt.includes(suggestion);
                return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isSelected) {
                      let newPrompt = prompt.replace(suggestion, "").trim();
                      newPrompt = newPrompt.replace(/\n{3,}/g, "\n\n");
                      onPromptChange(newPrompt);
                    } else {
                      const newPrompt = prompt.trim() ? prompt.trim() + "\n\n" + suggestion : suggestion;
                      onPromptChange(newPrompt);
                    }
                  }}
                  className={`group relative block w-full text-left rounded-xl transition-all duration-400 transform animate-fade-up shadow-lg ${
                    isSelected
                      ? "bg-gradient-to-b from-[#7c5cfc]/20 to-[#7c5cfc]/5 border border-[#7c5cfc]/50 ring-1 ring-[#7c5cfc]/30 shadow-[0_0_20px_rgba(124,92,252,0.15)] scale-[0.98]"
                      : "bg-gradient-to-b from-[#161622] to-[#0e0e15] overflow-hidden border border-white/5 hover:border-[#7c5cfc]/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(124,92,252,0.15)]"
                  }`}
                  style={{ animationFillMode: "both", animationDelay: `${idx * 120}ms` }}
                >
                  {!isSelected && (
                    <>
                      {/* Neon Left Strike */}
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#7c5cfc] to-[#4facfe] scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 transition-all origin-top duration-300 ease-out" />
                      
                      {/* Interactive abstract geometric highlight */}
                      <div className="absolute -inset-24 bg-gradient-to-r from-transparent via-[#7c5cfc]/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                    </>
                  )}

                  <div className="p-4 relative z-10">
                    <div className="flex items-center justify-between mb-3">
                       <span className={`text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-sm border uppercase transition-colors ${
                         isSelected ? "text-[#7c5cfc] bg-[#7c5cfc]/20 border-[#7c5cfc]/40 font-bold" : "text-[#7c5cfc] bg-[#7c5cfc]/10 border-[#7c5cfc]/20"
                       }`}>
                         Tip 0{idx + 1}
                       </span>
                       {isSelected && (
                         <div className="text-[#7c5cfc] drop-shadow-[0_0_8px_rgba(124,92,252,0.5)] animate-in zoom-in spin-in-12 duration-300">
                           <CheckCircle2 className="w-4 h-4" />
                         </div>
                       )}
                    </div>
                    <p className={`text-[12.5px] font-medium leading-[1.6] tracking-wide transition-colors ${
                      isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                    }`}>
                      {suggestion}
                    </p>
                  </div>
                </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      {mode !== "history" && (
        <div className="p-3 border-t border-white/10 relative bg-[#0a0a0e] z-20 shrink-0">
          <div 
            className="absolute top-0 left-0 right-0 h-2 -translate-y-1 cursor-ns-resize group"
            onMouseDown={handleDrag}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-white/10 group-hover:bg-[#7c5cfc]/50 rounded-full transition-colors" />
          </div>
          <div className="flex flex-col gap-2 pt-1">
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#7c5cfc]/50 resize-none overflow-y-auto max-h-[50vh] min-h-[80px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
      )}
    </div>
  );
}
