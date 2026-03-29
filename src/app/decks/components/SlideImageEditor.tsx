"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { X, Crop, Maximize2 } from "lucide-react";

interface ImageState {
  width: number;       // percentage of container
  cropTop: number;     // inset percentages
  cropRight: number;
  cropBottom: number;
  cropLeft: number;
}

interface SlideImageEditorProps {
  src: string;
  initialState: ImageState;
  onSave: (state: ImageState) => void;
  onClose: () => void;
}

export function SlideImageEditor({ src, initialState, onSave, onClose }: SlideImageEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ImageState>(initialState);
  const [cropMode, setCropMode] = useState(false);
  const [localCrop, setLocalCrop] = useState<Partial<ImageState> | null>(null);
  const [localWidth, setLocalWidth] = useState<number | null>(null);

  const width = localWidth ?? state.width;
  const cTop = localCrop?.cropTop ?? state.cropTop;
  const cRight = localCrop?.cropRight ?? state.cropRight;
  const cBottom = localCrop?.cropBottom ?? state.cropBottom;
  const cLeft = localCrop?.cropLeft ?? state.cropLeft;
  const hasCrop = cTop > 0 || cRight > 0 || cBottom > 0 || cLeft > 0;

  // Escape to close crop mode or editor
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (cropMode) setCropMode(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [cropMode, onClose]);

  // ── Resize handler (corner drag) ──
  const handleResizeDown = useCallback(
    (e: React.PointerEvent, corner: "tl" | "tr" | "bl" | "br") => {
      e.stopPropagation();
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;
      const containerW = container.getBoundingClientRect().width;
      const startX = e.clientX;
      const startW = state.width;

      const compute = (clientX: number) => {
        const dx = ((clientX - startX) / containerW) * 100;
        if (corner === "br" || corner === "tr") return Math.max(10, startW + dx);
        return Math.max(10, startW - dx);
      };

      const onMove = (ev: PointerEvent) => setLocalWidth(Math.round(compute(ev.clientX) * 10) / 10);
      const onUp = (ev: PointerEvent) => {
        const final = Math.round(compute(ev.clientX) * 10) / 10;
        setLocalWidth(null);
        setState((s) => ({ ...s, width: final }));
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [state.width],
  );

  // ── Crop edge drag handler ──
  const handleCropEdgeDown = useCallback(
    (e: React.PointerEvent, edge: "top" | "right" | "bottom" | "left") => {
      e.stopPropagation();
      e.preventDefault();
      const el = containerRef.current?.querySelector("[data-image-wrapper]") as HTMLElement;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const startTop = state.cropTop;
      const startRight = state.cropRight;
      const startBottom = state.cropBottom;
      const startLeft = state.cropLeft;

      const compute = (clientX: number, clientY: number) => {
        const dx = ((clientX - startX) / rect.width) * 100;
        const dy = ((clientY - startY) / rect.height) * 100;
        const clamp = (v: number) => Math.round(Math.max(0, Math.min(90, v)) * 10) / 10;
        const crop: Partial<ImageState> = {
          cropTop: startTop,
          cropRight: startRight,
          cropBottom: startBottom,
          cropLeft: startLeft,
        };
        if (edge === "top") crop.cropTop = clamp(startTop + dy);
        else if (edge === "bottom") crop.cropBottom = clamp(startBottom - dy);
        else if (edge === "left") crop.cropLeft = clamp(startLeft + dx);
        else if (edge === "right") crop.cropRight = clamp(startRight - dx);
        return crop;
      };

      const onMove = (ev: PointerEvent) => setLocalCrop(compute(ev.clientX, ev.clientY));
      const onUp = (ev: PointerEvent) => {
        const final = compute(ev.clientX, ev.clientY);
        setLocalCrop(null);
        setState((s) => ({ ...s, ...final }));
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [state.cropTop, state.cropRight, state.cropBottom, state.cropLeft],
  );

  const corners = ["tl", "tr", "bl", "br"] as const;
  const cornerPos: Record<string, React.CSSProperties> = {
    tl: { top: -5, left: -5, cursor: "nwse-resize" },
    tr: { top: -5, right: -5, cursor: "nesw-resize" },
    bl: { bottom: -5, left: -5, cursor: "nesw-resize" },
    br: { bottom: -5, right: -5, cursor: "nwse-resize" },
  };

  const cropEdges = [
    { edge: "top" as const, style: { top: `${cTop}%`, left: "50%", transform: "translate(-50%, -50%)", cursor: "ns-resize" } },
    { edge: "right" as const, style: { top: "50%", right: `${cRight}%`, transform: "translate(50%, -50%)", cursor: "ew-resize" } },
    { edge: "bottom" as const, style: { bottom: `${cBottom}%`, left: "50%", transform: "translate(-50%, 50%)", cursor: "ns-resize" } },
    { edge: "left" as const, style: { top: "50%", left: `${cLeft}%`, transform: "translate(-50%, -50%)", cursor: "ew-resize" } },
  ];

  const borderColor = cropMode ? "#f97316" : "#7c5cfc";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70" onClick={onClose}>
      <div
        className="bg-[#16161a] rounded-xl border border-white/10 shadow-2xl flex flex-col max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">Edit Image</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCropMode(false)}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${!cropMode ? "bg-[#7c5cfc]/20 text-[#9b82fd]" : "text-slate-400 hover:bg-white/5"}`}
              >
                <Maximize2 className="w-3 h-3" />
                Resize
              </button>
              <button
                onClick={() => setCropMode(true)}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${cropMode ? "bg-orange-500/20 text-orange-400" : "text-slate-400 hover:bg-white/5"}`}
              >
                <Crop className="w-3 h-3" />
                Crop
              </button>
            </div>
            <span className="text-[11px] text-slate-500">
              Width: {Math.round(width)}%
              {hasCrop && ` • Crop: T${Math.round(cTop)} R${Math.round(cRight)} B${Math.round(cBottom)} L${Math.round(cLeft)}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setState({ width: 100, cropTop: 0, cropRight: 0, cropBottom: 0, cropLeft: 0 })}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => onSave(state)}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[#7c5cfc] text-white hover:bg-[#6b4de0] transition-colors"
            >
              Save
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image area */}
        <div ref={containerRef} className="relative p-8 flex items-center justify-center min-w-[500px] min-h-[400px]">
          <div
            data-image-wrapper
            className="relative"
            style={{
              width: `${width}%`,
              maxWidth: "100%",
              clipPath: hasCrop ? `inset(${cTop}% ${cRight}% ${cBottom}% ${cLeft}%)` : undefined,
              outline: `2px dashed ${borderColor}`,
              outlineOffset: 2,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="w-full h-auto select-none"
              draggable={false}
              style={{ pointerEvents: "none" }}
            />

            {/* Crop overlay (darkens cropped areas) */}
            {cropMode && hasCrop && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${cTop}%, ${cLeft}% ${cTop}%, ${cLeft}% ${100 - cBottom}%, ${100 - cRight}% ${100 - cBottom}%, ${100 - cRight}% ${cTop}%, 0% ${cTop}%)`,
                }}
              />
            )}

            {/* Resize corner handles */}
            {!cropMode && corners.map((c) => (
              <div
                key={c}
                className="absolute w-3.5 h-3.5 bg-white rounded-sm"
                style={{ ...cornerPos[c], zIndex: 10, border: `2px solid ${borderColor}` }}
                onPointerDown={(e) => handleResizeDown(e, c)}
              />
            ))}

            {/* Crop edge handles */}
            {cropMode && cropEdges.map(({ edge, style }) => (
              <div
                key={edge}
                className="absolute w-4 h-4 bg-white rounded-full"
                style={{ ...style, zIndex: 10, border: "2px solid #f97316" }}
                onPointerDown={(e) => handleCropEdgeDown(e, edge)}
              />
            ))}

            {/* Crop mode label */}
            {cropMode && (
              <div className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ zIndex: 11 }}>
                Drag edges to crop
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
