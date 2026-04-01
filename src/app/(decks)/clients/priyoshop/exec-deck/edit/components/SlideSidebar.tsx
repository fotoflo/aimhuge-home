"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { PanelLeftClose, ChevronRight, ChevronDown, Plus, SplitSquareHorizontal, Eye, EyeOff, Trash2, RefreshCw, Search, X, Sparkles } from "lucide-react";
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
  type Modifier,
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
  onDeleteSlides?: (ids: string[]) => void;
  onToggleSkips?: (ids: string[], skip: boolean) => void;
}

function SortableSlide({
  slide,
  index,
  isCurrent,
  thumbnail,
  generatingThumbs,
  hasChildren,
  isCollapsed,
  isMenuOpen,
  isSelected,
  isDimmed,
  isRegenerating,
  onToggleCollapse,
  onContextMenu,
  onClick,
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
  isMenuOpen: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  isRegenerating: boolean;
  onToggleCollapse: (e: React.MouseEvent, id: string) => void;
  onContextMenu: (e: React.MouseEvent, slide: SlideRow, index: number) => void;
  onClick: (e: React.MouseEvent, id: string, index: number) => void;
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    opacity: isDimmed ? 0.15 : (isDragging ? 0.5 : (skip ? 0.4 : 1)),
    filter: isDimmed ? "grayscale(100%) blur(1px)" : undefined,
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
      onClick={(e) => onClick(e, slide.id, index)}
      onContextMenu={(e) => onContextMenu(e, slide, index)}
      className={`relative w-full text-left py-2 border-b border-white/5 transition-colors cursor-grab active:cursor-grabbing outline-none ${
        isCurrent || isMenuOpen ? "bg-[#7c5cfc]/15 border-l-2 border-l-[#7c5cfc]" : 
        isSelected ? "bg-white/10 border-l-2 border-l-white/30" : "hover:bg-white/5 border-l-2 border-l-transparent"
      }`}
    >
      {hasChildren && (
        <button
          onClick={(e) => onToggleCollapse(e, slide.id)}
          className="absolute -left-1.5 top-5 p-0.5 rounded-sm text-slate-400 bg-[#0a0a0e] border border-white/10 hover:text-white hover:bg-[#7c5cfc] hover:border-[#7c5cfc] shadow-sm transition-all z-10"
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
            className={`w-full h-full object-cover transition-all duration-300 ${skip ? "grayscale" : ""} ${isRegenerating ? "opacity-20 blur-sm brightness-50" : ""}`}
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
            {imgState === "fixing" || isRegenerating ? (
               <div className="flex flex-col items-center gap-1.5">
                 <RefreshCw className="w-3.5 h-3.5 text-[#7c5cfc] animate-spin" />
                 <span className="text-[#7c5cfc] uppercase tracking-wider text-[9px] font-bold">Regenerating</span>
               </div>
            ) : imgState === "failed" ? "Preview failed" : (generatingThumbs ? "..." : "No preview")}
          </div>
        )}
        
        {(isRegenerating && thumbnail && imgState === "idle") && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="flex flex-col items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <RefreshCw className="w-4 h-4 text-[#7c5cfc] animate-spin" />
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#7c5cfc]">Regenerating</span>
            </div>
          </div>
        )}

        {skip && !isRegenerating && (
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

const restrictToVerticalAxis: Modifier = ({ transform }) => {
  return {
    ...transform,
    x: 0,
  };
};

export function SlideSidebar({ slides, current, thumbnails, generatingThumbs, onGoTo, onReorder, onTitleEdit, onClose, onRegenerateThumbnails, onAddSlide, onDeleteSlides, onToggleSkips }: SlideSidebarProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [menu, setMenu] = useState<{ x: number; y: number; slide: SlideRow; index: number; isCmdClick?: boolean } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [matchedIds, setMatchedIds] = useState<Set<string> | null>(null);
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    // Clear selection if navigating to a new slide organically
    if (selectedIds.size <= 1) {
      setSelectedIds(new Set([slides[current]?.id]));
      setLastSelectedIndex(current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, slides.length]); // Intentionally not including selectedIds or slides to avoid overriding multiselect

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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setMatchedIds(null);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    let isCancelled = false;

    const delayDebounceFn = setTimeout(() => {
      if (isCancelled) return;

      const q = searchQuery.toLowerCase();
      // 1. Instant local string match
      const matched = slides.filter(s => {
        const sfm = s.frontmatter as SlideFrontmatter;
        const titleString = (sfm.title || "").toLowerCase();
        const contentString = (s.mdx_content || "").toLowerCase();
        return titleString.includes(q) || contentString.includes(q);
      }).map(s => s.id);
      
      setMatchedIds(new Set(matched));

      // 2. Progressive enhancement: Fire backend semantic search in the background
      const currentDeckSlug = slides[0]?.deck_slug || "priyoshop-exec";
      fetch(`/api/decks/search?q=${encodeURIComponent(searchQuery)}&deck=${currentDeckSlug}`)
        .then(res => res.json())
        .then(json => {
          if (isCancelled) return;
          if (json.results && json.results.length > 0) {
            setMatchedIds(prev => {
              if (!prev) return prev; // Should not happen given search state
              const next = new Set(prev);
              json.results.forEach((r: { id: string }) => next.add(r.id));
              return next;
            });
          }
        })
        .catch(console.error)
        .finally(() => {
          if (!isCancelled) setIsSearching(false);
        });

    }, 150); // Snappy local search trigger

    return () => {
      isCancelled = true;
      clearTimeout(delayDebounceFn);
    };
  }, [searchQuery, slides]);

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
    
    // Approximate menu dimensions to prevent overflow
    const menuWidth = 220; // w-52 + padding
    const menuHeight = 240; // Total height + safety margin
    
    const x = Math.min(e.clientX, window.innerWidth - menuWidth);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight);
    
    const isCmdClick = e.metaKey || e.ctrlKey;

    // If we right-click a slide not in the selection, make it the only selection
    if (!selectedIds.has(slide.id)) {
      setSelectedIds(new Set([slide.id]));
      setLastSelectedIndex(index);
    }
    
    setMenu({ x, y, slide, index, isCmdClick });
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

  // Compute visible slides (accordion & search logic)
  const visibleIndices: number[] = [];
  if (matchedIds !== null && searchQuery.trim() !== "") {
    slides.forEach((s, idx) => {
      if (matchedIds.has(s.id)) {
        visibleIndices.push(idx);
      }
    });
  } else {
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
  }

  const handleSlideClick = (e: React.MouseEvent, id: string, index: number) => {
    if (e.shiftKey && lastSelectedIndex !== null) {
      // Prevent text selection
      e.preventDefault();
      
      const startPos = visibleIndices.indexOf(lastSelectedIndex);
      const endPos = visibleIndices.indexOf(index);
      
      if (startPos !== -1 && endPos !== -1) {
        const start = Math.min(startPos, endPos);
        const end = Math.max(startPos, endPos);
        
        const newSelection = new Set(selectedIds);
        for (let i = start; i <= end; i++) {
          newSelection.add(slides[visibleIndices[i]].id);
        }
        setSelectedIds(newSelection);
        return;
      }
    } else if (e.metaKey || e.ctrlKey) {
      e.preventDefault(); // Prevent text selection
      const newSelection = new Set(selectedIds);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      setSelectedIds(newSelection);
      setLastSelectedIndex(index);
      return;
    } 
    
    // Normal click
    setSelectedIds(new Set([id]));
    setLastSelectedIndex(index);
    onGoTo(index);
  };

  const targetIds = menu ? (selectedIds.has(menu.slide.id) && selectedIds.size > 1 ? Array.from(selectedIds) : [menu.slide.id]) : [];
  const multipleSelected = targetIds.length > 1;

  return (
    <>
      <div className="w-52 border-r border-white/10 bg-[#0a0a0e] shrink-0 flex flex-col relative h-full max-h-screen">
        
        {/* Aesthetic Search & Top Bar */}
        <div className="flex flex-col gap-2 p-3 border-b border-white/5 shrink-0 relative bg-[#0a0a0e] z-20">
          <div className="flex items-center gap-2">
            <div className="relative group flex-1">
              <div className={`absolute inset-0 bg-[#7c5cfc]/20 blur-md rounded-full transition-opacity duration-500 ${searchQuery ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`} />
              <div className="relative flex items-center bg-[#15151a] border border-white/10 focus-within:border-[#7c5cfc]/50 rounded text-xs overflow-hidden transition-colors">
                <Search className={`w-3.5 h-3.5 ml-2 mr-1 transition-colors ${searchQuery ? "text-[#7c5cfc]" : "text-slate-500"}`} />
                <input 
                  type="text" 
                  placeholder="Semantic search..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-1 py-1.5 outline-none text-slate-200 placeholder:text-slate-600 font-medium"
                />
                {isSearching ? (
                  <div className="pr-2 pl-1"><RefreshCw className="w-3 h-3 text-[#7c5cfc] animate-spin" /></div>
                ) : searchQuery ? (
                  <button onClick={() => setSearchQuery("")} className="pr-2 pl-1 hover:text-white text-slate-400">
                    <X className="w-3 h-3" />
                  </button>
                ) : null}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 shrink-0 rounded hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-colors"
              title="Hide slides"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Thumbnails List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
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
                  isMenuOpen={menu?.slide.id === s.id}
                  isSelected={selectedIds.has(s.id)}
                  isDimmed={matchedIds !== null && !matchedIds.has(s.id)}
                  isRegenerating={regeneratingIds.has(s.id)}
                  onToggleCollapse={toggleCollapse}
                  onContextMenu={handleContextMenu}
                  onClick={handleSlideClick}
                  onTitleEdit={onTitleEdit}
                  onRegenerateThumbnails={onRegenerateThumbnails}
                />
              );
            })}
          </SortableContext>
        </DndContext>
        </div>
      </div>

      {menu && (
        <div
          className="fixed z-50 w-52 bg-[#0d0d12]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-xl p-1.5 text-xs text-slate-300 animate-in fade-in zoom-in-95 duration-100 ease-out"
          style={{ top: menu.y, left: menu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-1.5 mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-500 flex items-center justify-between border-b border-white/5 pb-2">
            <span>{multipleSelected ? `${targetIds.length} Slides` : `Slide ${menu.index + 1}`}</span>
            {!multipleSelected && <span className="font-mono text-slate-700">{menu.slide.id.split('-')[0]}</span>}
          </div>
          
          <button
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-[#7c5cfc]/20 hover:text-white transition-colors focus:outline-none group disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-500"
            disabled={multipleSelected}
            onClick={() => { onAddSlide?.(menu.index, "before"); setMenu(null); }}
          >
            <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#7c5cfc] transition-colors group-disabled:group-hover:text-slate-500" />
            <span className="font-medium">New Slide Before</span>
          </button>
          
          <button
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-[#7c5cfc]/20 hover:text-white transition-colors focus:outline-none group disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-500"
            disabled={multipleSelected}
            onClick={() => { onAddSlide?.(menu.index, "after"); setMenu(null); }}
          >
            <SplitSquareHorizontal className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#7c5cfc] transition-colors group-disabled:group-hover:text-slate-500" />
            <span className="font-medium">New Slide After</span>
          </button>

          <div className="my-1 h-px bg-white/5 mx-2" />
          
          <button
            className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md transition-colors focus:outline-none group ${(menu.slide.frontmatter as SlideFrontmatter).skip ? 'hover:bg-green-500/10 hover:text-white' : 'hover:bg-amber-500/10 hover:text-white'}`}
            onClick={() => { onToggleSkips?.(targetIds, !!menu.slide.frontmatter.skip); setMenu(null); }}
          >
            {(menu.slide.frontmatter as SlideFrontmatter).skip ? (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-500 group-hover:text-green-400 transition-colors" />
                <span className="font-medium">{multipleSelected ? "Include Slides" : "Include Slide"}</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                <span className="font-medium">{multipleSelected ? "Skip Slides" : "Skip Slide"}</span>
              </>
            )}
          </button>
          
          <div className="my-1 h-px bg-white/5 mx-2" />
          
          {menu.isCmdClick && onRegenerateThumbnails && (
            <>
              <button
                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-slate-300 hover:bg-[#7c5cfc]/20 hover:text-[#7c5cfc] transition-colors focus:outline-none group"
                onClick={() => { 
                  const targetIdsArray = [...targetIds];
                  setRegeneratingIds(prev => {
                    const next = new Set(prev);
                    targetIdsArray.forEach(id => next.add(id));
                    return next;
                  });
                  Promise.resolve(onRegenerateThumbnails(targetIdsArray)).finally(() => {
                    setRegeneratingIds(prev => {
                      const next = new Set(prev);
                      targetIdsArray.forEach(id => next.delete(id));
                      return next;
                    });
                  });
                  setMenu(null); 
                }}
              >
                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-medium">{multipleSelected ? `Regenerate ${targetIds.length} Thumbnails` : "Regenerate Thumbnail"}</span>
              </button>
              <div className="my-1 h-px bg-white/5 mx-2" />
            </>
          )}

          <button
            className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-red-500/80 hover:bg-red-500/10 hover:text-red-400 transition-colors focus:outline-none group"
            onClick={() => { onDeleteSlides?.(targetIds); setMenu(null); }}
          >
            <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">{multipleSelected ? `Delete ${targetIds.length} Slides` : "Delete Slide"}</span>
          </button>
        </div>
      )}
    </>
  );
}
