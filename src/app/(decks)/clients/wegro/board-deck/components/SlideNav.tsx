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
      <div className="fixed bottom-6 left-7 text-slate-500 text-sm font-medium z-50">
        {current + 1} / {total}
      </div>
      <div className="fixed bottom-5 right-7 flex gap-2 z-50">
        <button
          onClick={onPrev}
          className="bg-[#011412]/85 backdrop-blur-sm text-white border border-white/10 px-[18px] py-2 rounded-lg text-[14px] font-medium transition-all hover:bg-[#015546] hover:border-[#FF8F1C] cursor-pointer"
        >
          &larr; Prev
        </button>
        <button
          onClick={onNext}
          className="bg-[#011412]/85 backdrop-blur-sm text-white border border-white/10 px-[18px] py-2 rounded-lg text-[14px] font-medium transition-all hover:bg-[#015546] hover:border-[#FF8F1C] cursor-pointer"
        >
          Next &rarr;
        </button>
      </div>
    </>
  );
}
