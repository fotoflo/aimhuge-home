"use client";

interface SlideNavProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export function SlideNav({ current, total, onPrev, onNext }: SlideNavProps) {
  return (
    <>
      <div className="fixed bottom-6 left-9 text-slate-500 text-xs font-medium z-50">
        {current + 1} / {total}
      </div>
      <div className="fixed bottom-5 right-8 flex gap-2 z-50">
        <button
          onClick={onPrev}
          className="bg-slate-800/85 backdrop-blur-sm text-white border border-white/10 px-[18px] py-2 rounded-lg text-[13px] font-medium transition-all hover:bg-emerald-700 hover:border-emerald-500 cursor-pointer"
        >
          &larr; Prev
        </button>
        <button
          onClick={onNext}
          className="bg-slate-800/85 backdrop-blur-sm text-white border border-white/10 px-[18px] py-2 rounded-lg text-[13px] font-medium transition-all hover:bg-emerald-700 hover:border-emerald-500 cursor-pointer"
        >
          Next &rarr;
        </button>
      </div>
    </>
  );
}
