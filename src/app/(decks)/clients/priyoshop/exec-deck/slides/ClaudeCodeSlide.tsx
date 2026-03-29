import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

export function ClaudeCodeSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 5"
      title="Claude Code"
      subtitle="What happens when AI can actually write and run code."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
      topRight="~20 min"
    >
      <div className="flex flex-col items-center justify-center flex-1 gap-8 mt-4">
        <div className="max-w-xl text-center">
          <p className="text-[24px] font-light text-slate-300 leading-relaxed">
            Live demo &mdash; build something useful for PriyoShop in real time.
          </p>
          <p className="text-[18px] text-slate-500 mt-4 leading-relaxed">
            This is the future. Today it requires a developer, but soon everyone will have access.
          </p>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-8 max-w-lg w-full font-mono text-[14px] text-slate-400">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <p><span className="text-[#9b82fd]">$</span> claude</p>
          <p className="mt-2 text-slate-500">&gt; Build a PriyoShop sales dashboard</p>
          <p className="mt-1 text-slate-500">&gt; that reads from the weekly Excel reports...</p>
          <p className="mt-2 text-green-400/70">Creating project structure...</p>
        </div>
      </div>
    </SlideShell>
  );
}
