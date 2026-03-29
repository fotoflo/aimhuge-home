"use client";

import { useState, useRef, useEffect } from "react";
import { PanelLeftClose } from "lucide-react";
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
}

function SortableSlide({
  slide,
  index,
  isCurrent,
  thumbnail,
  generatingThumbs,
  onGoTo,
  onTitleEdit,
}: {
  slide: SlideRow;
  index: number;
  isCurrent: boolean;
  thumbnail?: string;
  generatingThumbs: boolean;
  onGoTo: (i: number) => void;
  onTitleEdit: (slideId: string, newTitle: string) => void;
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

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
    paddingLeft: `${8 + level * 16}px`,
    paddingRight: "8px",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onGoTo(index)}
      className={`w-full text-left py-2 border-b border-white/5 transition-colors cursor-grab active:cursor-grabbing outline-none ${
        isCurrent ? "bg-[#7c5cfc]/10 border-l-2 border-l-[#7c5cfc]" : "hover:bg-white/5 border-l-2 border-l-transparent"
      }`}
    >
      <div className="w-full aspect-video rounded overflow-hidden mb-1.5 relative" style={{ background: sfm.variant === "light" ? "#f8fafc" : "#08080a" }}>
        {thumbnail ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnail}
            alt={sfm.title ?? `Slide ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">
            {generatingThumbs ? "..." : "No preview"}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-slate-600">{index + 1}</span>
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
            className={`text-xs font-medium truncate cursor-text ${level > 0 ? "text-slate-400" : "text-slate-300"}`}
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

export function SlideSidebar({ slides, current, thumbnails, generatingThumbs, onGoTo, onReorder, onTitleEdit, onClose }: SlideSidebarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <div className="w-52 border-r border-white/10 overflow-y-auto bg-[#0a0a0e] shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-colors"
        title="Hide slides"
      >
        <PanelLeftClose className="w-3.5 h-3.5" />
      </button>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {slides.map((s, i) => (
            <SortableSlide
              key={s.id}
              slide={s}
              index={i}
              isCurrent={i === current}
              thumbnail={thumbnails[s.id]}
              generatingThumbs={generatingThumbs}
              onGoTo={onGoTo}
              onTitleEdit={onTitleEdit}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
