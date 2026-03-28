"use client";

interface SlideNavProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  /** Override button styling */
  className?: string;
}

export function SlideNav({ current, total, onPrev, onNext, className }: SlideNavProps) {
  const btn =
    className ??
    "bg-black/70 backdrop-blur-sm text-white border border-white/10 px-[18px] py-2 rounded-lg text-[14px] font-medium transition-all hover:bg-black/90 hover:border-white/25 cursor-pointer";

  return (
    <>
      <div className="fixed bottom-6 left-7 text-slate-500 text-sm font-medium z-50">
        {current + 1} / {total}
      </div>
      <div className="fixed bottom-5 right-7 flex gap-2 z-50">
        <button onClick={onPrev} className={btn}>
          &larr; Prev
        </button>
        <button onClick={onNext} className={btn}>
          Next &rarr;
        </button>
      </div>
    </>
  );
}
