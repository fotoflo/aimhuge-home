"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, PanelLeftOpen, PanelRightOpen, Maximize, Minimize, LayoutGrid, RefreshCw } from "lucide-react";

const ZOOM_OPTIONS: { label: string; value: number | "fit" }[] = [
  { label: "25%", value: 25 },
  { label: "50%", value: 50 },
  { label: "75%", value: 75 },
  { label: "100%", value: 100 },
  { label: "125%", value: 125 },
  { label: "150%", value: 150 },
  { label: "200%", value: 200 },
  { label: "Fit Slide", value: "fit" },
];

interface EditorTopBarProps {
  deckSlug: string;
  current: number;
  total: number;
  showLeftPanel: boolean;
  showRightPanel: boolean;
  showAssets: boolean;
  zoom: number | "fit";
  onZoomChange: (zoom: number | "fit") => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleAssets: () => void;
  onShowLeftPanel: () => void;
  onShowRightPanel: () => void;
  lightTable: boolean;
  onToggleLightTable: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onSignOut: () => void;
}

export function EditorTopBar({
  deckSlug, current, total, showLeftPanel, showRightPanel, showAssets,
  zoom, onZoomChange, onPrev, onNext, onToggleAssets, onShowLeftPanel, onShowRightPanel,
  lightTable, onToggleLightTable, isFullscreen, onToggleFullscreen, onSignOut,
}: EditorTopBarProps) {
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  const zoomLabel = zoom === "fit" ? "Fit" : `${zoom}%`;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0e0e12] shrink-0">
      <div className="flex items-center gap-4">
        {!showLeftPanel && (
          <button onClick={onShowLeftPanel} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors" title="Show slides">
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-400">{deckSlug}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onPrev} disabled={current === 0} className="p-1 rounded hover:bg-white/10 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 w-16 text-center">{current + 1} / {total}</span>
          <button onClick={onNext} disabled={current === total - 1} className="p-1 rounded hover:bg-white/10 disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Zoom menu */}
        <div className="relative">
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border border-white/10 text-slate-300 hover:bg-white/5 transition-colors min-w-[60px] justify-center"
          >
            {zoomLabel}
            <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {showZoomMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowZoomMenu(false)} />
              <div className="absolute top-full left-0 mt-1 z-50 bg-[#1a1a1e] rounded-lg border border-white/10 shadow-xl py-1 min-w-[120px]">
                {ZOOM_OPTIONS.map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => { onZoomChange(opt.value); setShowZoomMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      zoom === opt.value ? "text-[#9b82fd] bg-[#7c5cfc]/10" : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    {zoom === opt.value && <span className="mr-1">&#10003;</span>}
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleLightTable}
          className={`p-1.5 rounded-lg border transition-colors ${lightTable ? "border-[#7c5cfc] text-[#9b82fd] bg-[#7c5cfc]/10" : "border-white/10 text-slate-400 hover:bg-white/5"}`}
          title="Light Table"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleAssets}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${showAssets ? "border-[#7c5cfc] text-[#9b82fd] bg-[#7c5cfc]/10" : "border-white/10 text-slate-300 hover:bg-white/5"}`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Assets
        </button>
        <a
          href={`/clients/priyoshop/exec-deck#slide-${current + 1}`}
          target="_blank"
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"
        >
          Present
        </a>
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
        {!showRightPanel && (
          <button onClick={onShowRightPanel} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors" title="Show AI panel">
            <PanelRightOpen className="w-4 h-4" />
          </button>
        )}
        <button onClick={onSignOut} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          Sign out
        </button>
      </div>
    </div>
  );
}
