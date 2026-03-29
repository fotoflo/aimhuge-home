import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const useCases = [
  {
    prompt: "Interview me about my department's biggest bottleneck",
    result: "AI asks targeted questions → you discover root causes you hadn't articulated",
  },
  {
    prompt: "Ask me questions to write my performance review",
    result: "AI pulls out accomplishments, metrics, and growth areas through guided Q&A",
  },
  {
    prompt: "Help me prepare for my board presentation by questioning my assumptions",
    result: "AI stress-tests your logic, finds gaps, and helps you rehearse tough questions",
  },
];

export function PromptsExtractInfoSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 3 — Interacting with AI"
      title="Let AI Interview You"
      subtitle="Instead of writing everything yourself — tell Claude to ask you questions. It pulls the knowledge out of your head."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
    >
      <div className="flex flex-col gap-6 mt-6 flex-1">
        {useCases.map((u, i) => (
          <div key={i} className="flex gap-5 items-stretch">
            {/* You say */}
            <div className="flex-1 bg-[#7c5cfc]/[0.08] border border-[#7c5cfc]/20 rounded-xl p-5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#7c5cfc]/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[14px]">👤</span>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9b82fd] block mb-1">You say</span>
                <p className="text-[16px] text-white italic">&ldquo;{u.prompt}&rdquo;</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                <path d="M0 10h24M18 4l8 6-8 6" stroke="#9b82fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* What happens */}
            <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[14px]">✨</span>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">What happens</span>
                <p className="text-[15px] text-slate-300">{u.result}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/[0.06]">
        <p className="text-[15px] text-slate-500 italic">
          Key phrase: &ldquo;Don&apos;t write it for me — ask me questions first, then write it from my answers.&rdquo;
        </p>
      </div>
    </SlideShell>
  );
}
