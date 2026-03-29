"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { PanelLeftClose, ChevronRight, ChevronDown } from "lucide-react";
import type { SlideRow } from "@/app/decks/lib/slides-db";
import type { SlideFrontmatter } from "@/app/decks/lib/mdx-types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SlideSidebarProps {
  slides: SlideRow[];
  current: number;
  thumbnails: Record<string, string>;
  generatingThumbs: boolean;
  onGoTo: (i: number) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onTitleEdit: (slideId: string, newTitle: string) => void;
  onClose: () => void;
  onRegenerateThumbnails?: (slideIds?: string[]) => Promise<void> | void;
  onAddSlide?: (index: number, position: "before" | "after") => void;
  onDeleteSlide?: (id: string) => void;
  onToggleSkip?: (id: string, skip: boolean) => void;
}

function SortableSlide({
  slide,
  index,
  isCurrent,
  thumbnail,
  generatingThumbs,
  hasChildren,
  isCollapsed,
  onToggleCollapse,
  onContextMenu,
  onGoTo,
  onTitleEdit,
  onRegenerateThumbnails,
}: {
  slide: SlideRow;
  index: number;
  isCurrent: boolean;
  thumbnail?: string;
  generatingThumbs: boolean;
  hasChildren: boolean;
  isCollapsed: boolean;
  onToggleCollapse: (e: React.MouseEvent, id: string) => void;
  onContextMenu: (e: React.MouseEvent, slide: SlideRow, index: number) => void;
  onGoTo: (i: number) => void;
  onTitleEdit: (slideId: string, newTitle: string) => void;
  onRegenerateThumbnails?: (slideIds?: string[]) => Promise<void> | void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const sfm = slide.frontmatter as SlideFrontmatter;
  const level = sfm.level ?? 0;
  const skip = sfm.skip;

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [imgState, setImgState] = useState<"idle" | "fixing" | "failed">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setRefs = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    containerRef.current = node;
  };

  useEffect(() => {
    if (isCurrent && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isCurrent]);

  useEffect(() => {
    setImgState("idle");
  }, [thumbnail]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(sfm.title ?? "");
    setEditing(true);
  };

  const commitEdit = () => {
    setEditing(false);
    const trimmed = editValue.trim();
    if (trimmed !== (sfm.title ?? "")) {
      onTitleEdit(slide.id, trimmed);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : (skip ? 0.4 : 1),
    zIndex: isDragging ? 10 : undefined,
    paddingLeft: `${8 + level * 16}px`,
    paddingRight: "8px",
  };

  return (
    <div
      ref={setRefs}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onGoTo(index)}
      onContextMenu={(e) => onContextMenu(e, slide, index)}
      className={`relative w-full text-left py-2 border-b border-white/5 transition-colors cursor-grab active:cursor-grabbing outline-none ${
        isCurrent ? "bg-[#7c5cfc]/10 border-l-2 border-l-[#7c5cfc]" : "hover:bg-white/5 border-l-2 border-l-transparent"
      }`}
    >
      {hasChildren && (
        <button
          onClick={(e) => onToggleCollapse(e, slide.id)}
          className="absolute left-[-4px] top-6 p-0.5 rounded text-slate-400 hover:text-white hover:bg-white/10 z-10"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      )}

      <div className="w-full aspect-video rounded overflow-hidden mb-1.5 relative border border-white/10 group" style={{ background: sfm.variant === "light" ? "#f8fafc" : "#08080a" }}>
        {thumbnail && imgState === "idle" ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnail}
            alt={sfm.title ?? `Slide ${index + 1}`}
            className={`w-full h-full object-cover ${skip ? "grayscale" : ""}`}
            loading="lazy"
            onError={() => {
              if (imgState === "idle") {
                setImgState("fixing");
                if (onRegenerateThumbnails) {
                  Promise.resolve(onRegenerateThumbnails([slide.id]))
                    .then(() => {
                      setTimeout(() => setImgState((prev) => prev === "fixing" ? "failed" : prev), 2000);
                    })
                    .catch(() => setImgState("failed"));
                } else {
                  setImgState("failed");
                }
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">
            {imgState === "fixing" ? "Regenerating..." : imgState === "failed" ? "Preview failed" : (generatingThumbs ? "..." : "No preview")}
          </div>
        )}
        {skip && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase backdrop-blur-sm">Skipped</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`text-[10px] ${skip ? "text-slate-500 line-through" : "text-slate-600"}`}>{index + 1}</span>
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
              if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
            }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="text-xs font-medium bg-white/10 text-slate-200 rounded px-1 py-0.5 outline-none border border-[#7c5cfc]/50 w-full min-w-0"
          />
        ) : (
          <span
            className={`text-xs font-medium truncate cursor-text ${skip ? "text-slate-500 line-through" : level > 0 ? "text-slate-400" : "text-slate-300"}`}
            onClick={startEditing}
            onPointerDown={(e) => e.stopPropagation()}
            title="Click to edit title"
          >
            {sfm.title ?? sfm.sectionLabel ?? "Untitled"}
          </span>
        )}
      </div>
    </div>
  );
}

export function SlideSidebar({ slides, current, thumbnails, generatingThumbs, onGoTo, onReorder, onTitleEdit, onClose, onRegenerateThumbnails, onAddSlide, onDeleteSlide, onToggleSkip }: SlideSidebarProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [menu, setMenu] = useState<{ x: number; y: number; slide: SlideRow; index: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    const handleClickOutside = () => setMenu(null);
    const handleScroll = () => setMenu(null);
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(oldIndex, newIndex);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, slide: SlideRow, index: number) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, slide, index });
  };

  const toggleCollapse = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Compute visible slides (accordion logic)
  const visibleIndices: number[] = [];
  let collapseLevel: number | null = null;
  
  slides.forEach((s, idx) => {
    const lvl = (s.frontmatter as SlideFrontmatter).level ?? 0;
    
    if (collapseLevel !== null && lvl <= collapseLevel) {
      collapseLevel = null;
    }
    
    if (collapseLevel === null) {
      visibleIndices.push(idx);
    }
    
    if (collapsedIds.has(s.id) && collapseLevel === null) {
      collapseLevel = lvl;
    }
  });

  return (
    <>
      <div className="w-52 border-r border-white/10 overflow-y-auto bg-[#0a0a0e] shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-colors"
          title="Hide slides"
        >
          <PanelLeftClose className="w-3.5 h-3.5" />
        </button>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleIndices.map((idx) => slides[idx].id)} strategy={verticalListSortingStrategy}>
            {visibleIndices.map((i) => {
              const s = slides[i];
              const sLevel = (s.frontmatter as SlideFrontmatter).level ?? 0;
              const nextLevel = i + 1 < slides.length ? ((slides[i + 1].frontmatter as SlideFrontmatter).level ?? 0) : 0;
              const hasChildren = nextLevel > sLevel;
              const isCollapsed = collapsedIds.has(s.id);

              return (
                <SortableSlide
                  key={s.id}
                  slide={s}
                  index={i}
                  isCurrent={i === current}
                  thumbnail={thumbnails[s.id]}
                  generatingThumbs={generatingThumbs}
                  hasChildren={hasChildren}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={toggleCollapse}
                  onContextMenu={handleContextMenu}
                  onGoTo={onGoTo}
                  onTitleEdit={onTitleEdit}
                  onRegenerateThumbnails={onRegenerateThumbnails}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>

      {menu && (
        <div
          className="fixed z-50 w-48 bg-[#111114] border border-white/10 shadow-xl rounded-md py-1 text-sm text-slate-300"
          style={{ top: menu.y, left: menu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-3 py-1.5 hover:bg-white/10 hover:text-white"
            onClick={() => { onAddSlide?.(menu.index, "before"); setMenu(null); }}
          >
            New Slide Before
          </button>
          <button
            className="w-full text-left px-3 py-1.5 hover:bg-white/10 hover:text-white"
            onClick={() => { onAddSlide?.(menu.index, "after"); setMenu(null); }}
          >
            New Slide After
          </button>
          <div className="my-1 h-px bg-white/10" />
          <button
            className="w-full text-left px-3 py-1.5 hover:bg-white/10 hover:text-white"
            onClick={() => { onToggleSkip?.(menu.slide.id, !!menu.slide.frontmatter.skip); setMenu(null); }}
          >
            {(menu.slide.frontmatter as SlideFrontmatter).skip ? "Unskip Slide" : "Skip Slide"}
          </button>
          <div className="my-1 h-px bg-white/10" />
          <button
            className="w-full text-left px-3 py-1.5 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => { onDeleteSlide?.(menu.slide.id); setMenu(null); }}
          >
            Delete Slide
          </button>
        </div>
      )}
    </>
  );
}
