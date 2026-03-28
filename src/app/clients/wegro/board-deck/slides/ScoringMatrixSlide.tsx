"use client";

import { SlideShell } from "../components/SlideShell";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Initiative,
  totalScore,
  tierForScore,
  barClass,
  tierBadgeClass,
  divisionColor,
} from "../lib/types";

interface ScoringMatrixSlideProps {
  initiatives: Initiative[];
  onReorder: (items: Initiative[]) => void;
  onScoreChange: (id: string, field: keyof Initiative["scores"], value: number) => void;
}

function SortableRow({
  item,
  onScoreChange,
}: {
  item: Initiative;
  onScoreChange: (field: keyof Initiative["scores"], value: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const score = totalScore(item);
  const tier = tierForScore(score);
  const divColor = divisionColor(item.division);
  const pct = (score / 25) * 100;

  const scoreFields: (keyof Initiative["scores"])[] = [
    "impact", "lowEffort", "lowCost", "speed", "alignment",
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-[22%_9%_9%_9%_9%_9%_7%_17%_9%] items-center border-b border-slate-100 hover:bg-emerald-50/50 transition-colors ${tier === 3 ? "opacity-60" : ""}`}
    >
      <div className="px-4 py-2 font-semibold text-slate-900 text-xs flex items-center gap-2">
        <span
          {...attributes}
          {...listeners}
          className="drag-handle text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
        >
          ⠿
        </span>
        {item.name}
      </div>
      <div className="px-3 py-2">
        <span className={`inline-block px-2 py-[2px] rounded text-[10px] font-semibold ${divColor.bg} ${divColor.text}`}>
          {item.division.charAt(0).toUpperCase() + item.division.slice(1)}
        </span>
      </div>
      {scoreFields.map((field) => (
        <div key={field} className="px-3 py-2 text-center">
          <input
            type="number"
            min={1}
            max={5}
            value={item.scores[field]}
            onChange={(e) => onScoreChange(field, Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-8 text-center text-xs bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none rounded py-0.5"
          />
        </div>
      ))}
      <div className="px-3 py-2 text-center">
        <span className={`inline-flex items-center justify-center w-8 h-[22px] rounded-md font-extrabold text-xs ${tierBadgeClass(tier)}`}>
          {score}
        </span>
      </div>
      <div className="px-3 py-2">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full score-bar ${barClass(score)}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

export function ScoringMatrixSlide({
  initiatives,
  onReorder,
  onScoreChange,
}: ScoringMatrixSlideProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = initiatives.findIndex((i) => i.id === active.id);
      const newIndex = initiatives.findIndex((i) => i.id === over.id);
      onReorder(arrayMove(initiatives, oldIndex, newIndex));
    }
  }

  return (
    <SlideShell
      variant="light"
      sectionLabel="Initiative Prioritisation"
      title="Scoring All Initiatives"
      subtitle="Each initiative scored 1–5 on five dimensions. Composite score (max 25) determines tier placement. Drag to reorder."
    >
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[22%_9%_9%_9%_9%_9%_7%_17%_9%] bg-slate-800 text-white text-[11px] font-semibold uppercase tracking-wide border-b-2 border-emerald-500">
            <div className="px-4 py-2.5">Initiative</div>
            <div className="px-3 py-2.5">Division</div>
            <div className="px-3 py-2.5 text-center">Impact</div>
            <div className="px-3 py-2.5 text-center">Low Effort</div>
            <div className="px-3 py-2.5 text-center">Low Cost</div>
            <div className="px-3 py-2.5 text-center">Speed</div>
            <div className="px-3 py-2.5 text-center">Alignment</div>
            <div className="px-3 py-2.5 text-center">Score</div>
            <div className="px-3 py-2.5">Composite</div>
          </div>
          {/* Rows */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={initiatives.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {initiatives.map((item) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  onScoreChange={(field, value) => onScoreChange(item.id, field, value)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </SlideShell>
  );
}
