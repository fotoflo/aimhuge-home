import Image from "next/image";
import type { DeckConfig } from "../lib/types";

export function TitleSlide({ config }: { config: DeckConfig }) {
  return (
    <div className="slide slide-hero">
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/images/logo-white.png"
          alt="AimHuge"
          width={160}
          height={42}
          className="mb-6"
        />
        <div className="text-sm font-semibold text-[#9b82fd] uppercase tracking-[3px] mb-5">
          Executive Training &mdash; {config.workshopDate}
        </div>
        <h1 className="text-[68px] font-black text-white tracking-tight leading-none">
          AI Productivity
          <br />
          for Leadership
        </h1>
        <div className="text-[22px] font-light text-slate-400 mt-5 max-w-[640px] leading-relaxed">
          A full-day immersive session for Priyoshop&apos;s {config.audience.toLowerCase()}.
          <br />
          Reduce time waste. Improve decisions. Increase speed.
        </div>
        <div className="mt-14 text-sm text-slate-600">
          Prepared for Priyoshop &nbsp;&bull;&nbsp; Confidential
        </div>
      </div>
    </div>
  );
}
