"use client";

import type { SlideRow } from "@/app/decks/lib/slides-db";
import type { SlideFrontmatter } from "@/app/decks/lib/mdx-types";

interface LightTableProps {
  slides: SlideRow[];
  current: number;
  thumbnails: Record<string, string>;
  onSelect: (index: number) => void;
}

export function LightTable({ slides, current, thumbnails, onSelect }: LightTableProps) {
  return (
    <div className="flex-1 overflow-auto bg-[#111114] p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="grid grid-cols-3 gap-5 max-w-[1200px] mx-auto">
        {slides.map((s, i) => {
          const fm = s.frontmatter as SlideFrontmatter;
          const isSelected = i === current;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(i)}
              className={`text-left rounded-lg overflow-hidden transition-all ${
                isSelected
                  ? "ring-2 ring-[#7c5cfc] ring-offset-2 ring-offset-[#111114]"
                  : "hover:ring-1 hover:ring-white/20 hover:ring-offset-1 hover:ring-offset-[#111114]"
              }`}
            >
              <div
                className="w-full aspect-video rounded-t-lg overflow-hidden"
                style={{ background: fm.variant === "light" ? "#f8fafc" : "#08080a" }}
              >
                {thumbnails[s.id] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={thumbnails[s.id]}
                    alt={fm.title ?? `Slide ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-slate-600">
                    No preview
                  </div>
                )}
              </div>
              <div className="bg-[#0a0a0e] px-3 py-2 flex items-center gap-2 rounded-b-lg">
                <span className={`text-xs font-bold ${isSelected ? "text-[#9b82fd]" : "text-slate-500"}`}>
                  {i + 1}
                </span>
                <span className="text-xs text-slate-300 truncate">
                  {fm.title ?? fm.sectionLabel ?? "Untitled"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
