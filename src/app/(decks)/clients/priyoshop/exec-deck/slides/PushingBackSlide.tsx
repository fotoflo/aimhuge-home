import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const tactics = [
  {
    myth: "\"I can't access the internet\"",
    reality: "It can still analyze data, write code, generate reports — most tasks don't need live web access",
    response: "\"I know you can't browse, but you can still analyze this data I'm pasting\"",
  },
  {
    myth: "\"I can't do that\"",
    reality: "Often it's being cautious. Rephrase, break the task into steps, or provide more context",
    response: "\"Let's break this into smaller steps. Start with just the first part.\"",
  },
  {
    myth: "\"I don't have enough information\"",
    reality: "Give it permission to make assumptions, then correct what's wrong",
    response: "\"Make your best guess based on what I've given you. I'll correct anything that's off.\"",
  },
  {
    myth: "\"That's not something I should help with\"",
    reality: "Rephrase the business context — AI is cautious but can handle legitimate work tasks",
    response: "\"This is for an internal business report. Here's the context...\"",
  },
];

export function PushingBackSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Section 3 — Interacting with AI"
      title="When AI Says No"
      subtitle="AI is cautious by default. You often need to push back, rephrase, or give it permission."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} className="invert" />}
    >
      <div className="flex flex-col gap-3 mt-2 flex-1">
        {tactics.map((t, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-[14px] p-5 flex gap-6 items-start">
            {/* Left — the myth */}
            <div className="w-[220px] shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-500 block mb-1">AI says</span>
              <p className="text-[16px] font-mono text-slate-900 font-semibold">{t.myth}</p>
            </div>

            {/* Middle — reality */}
            <div className="flex-1 border-l-2 border-slate-100 pl-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Reality</span>
              <p className="text-[14px] text-slate-600">{t.reality}</p>
            </div>

            {/* Right — your response */}
            <div className="w-[280px] shrink-0 bg-[#7c5cfc]/[0.06] rounded-lg p-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c5cfc] block mb-1">You respond</span>
              <p className="text-[13px] text-slate-700 italic">{t.response}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
