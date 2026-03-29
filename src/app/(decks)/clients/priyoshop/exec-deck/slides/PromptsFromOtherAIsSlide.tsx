import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Start anywhere",
    desc: "Use ChatGPT, Gemini, or Claude to brainstorm an idea or draft a prompt",
  },
  {
    num: "02",
    title: "Copy the output",
    desc: "Take the AI's response — even if it's rough — and paste it into a different AI",
  },
  {
    num: "03",
    title: "Ask AI to improve it",
    desc: "\"Make this prompt better\" or \"Write a more detailed version of this instruction\"",
  },
  {
    num: "04",
    title: "Cross-pollinate",
    desc: "Different AIs have different strengths — use one to check or enhance another's work",
  },
];

export function PromptsFromOtherAIsSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 3 — Interacting with AI"
      title="Prompts Between AIs"
      subtitle="Use one AI to create inputs for another. They don't compete — they collaborate."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
    >
      <div className="flex gap-12 mt-6 flex-1">
        {/* Left — flow diagram */}
        <div className="w-[300px] shrink-0 flex flex-col items-center justify-center gap-3">
          {["ChatGPT", "Gemini", "Claude"].map((name, i) => (
            <div key={name} className="flex items-center gap-3 w-full">
              <div
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center"
                style={{ borderLeftColor: "#9b82fd", borderLeftWidth: "3px" }}
              >
                <span className="text-[16px] font-semibold text-white">{name}</span>
              </div>
              {i < 2 && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 rotate-90">
                  <path d="M12 5v14M19 12l-7 7-7-7" stroke="#9b82fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
          <div className="text-[13px] text-slate-500 mt-2 text-center">
            output → input → output → input
          </div>
        </div>

        {/* Right — numbered steps */}
        <div className="flex flex-col gap-0 flex-1">
          {steps.map((s) => (
            <div key={s.num} className="flex items-start gap-5 py-4 border-b border-white/[0.06] last:border-b-0">
              <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">{s.num}</span>
              <div>
                <span className="text-[20px] font-bold text-white">{s.title}</span>
                <p className="text-[15px] text-slate-400 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
