import Image from "next/image";

export function ClosingSlide() {
  return (
    <div className="slide slide-close">
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/images/wegro/logo-white.png"
          alt="WeGro"
          width={120}
          height={32}
          className="mb-8"
        />
        <h2 className="text-white text-[44px] font-extrabold tracking-tight mb-3">
          Bangladesh First.<br />Then Scale.
        </h2>
        <div className="text-xl text-[#FF8F1C] font-light max-w-[600px] leading-relaxed">
          Win the home market. Build the data moat. Export the model.
        </div>
        <div className="mt-12 flex gap-5 justify-center">
          <div className="px-7 py-2.5 rounded-xl text-base font-semibold bg-[#015546] text-white">
            Q2 Execution Begins April 2026
          </div>
          <div className="px-7 py-2.5 rounded-xl text-base font-semibold bg-white/[0.08] text-slate-300 border border-white/[0.12]">
            Next Board Review: July 2026
          </div>
        </div>
        <div className="mt-14 text-xs text-slate-600">
          WeGro &nbsp;&bull;&nbsp; Confidential &nbsp;&bull;&nbsp; March 2026
        </div>
      </div>
    </div>
  );
}
