import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

export function HandsOnDocumentsSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Section 7 — Hands-On"
      title="Documents"
      subtitle="Create a document from a prompt and open it directly in Google Docs."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} className="invert" />}
      topRight="10 min"
    >
      <div className="flex gap-8 mt-4 flex-1 items-start">
        {/* Left — the exercise */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="bg-white border-2 border-[#7c5cfc]/20 rounded-2xl p-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c5cfc] block mb-2">Try this prompt</span>
            <p className="text-[17px] text-slate-800 leading-relaxed italic">
              &ldquo;Write a one-page proposal for expanding PriyoShop into a new district.
              Include: market opportunity, required investment, expected timeline, and key risks.
              Format it as a professional memo.&rdquo;
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-[15px] font-bold text-slate-900 mb-1">Then try</h4>
              <p className="text-[13px] text-slate-600">&ldquo;Make it more concise&rdquo;</p>
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-[15px] font-bold text-slate-900 mb-1">Then try</h4>
              <p className="text-[13px] text-slate-600">&ldquo;Add a budget table&rdquo;</p>
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-[15px] font-bold text-slate-900 mb-1">Then</h4>
              <p className="text-[13px] text-slate-600">&ldquo;Open in Google Docs&rdquo;</p>
            </div>
          </div>
        </div>

        {/* Right — flow visual */}
        <div className="w-[260px] shrink-0 flex flex-col items-center gap-4">
          {[
            { label: "Prompt", color: "#7c5cfc" },
            { label: "Draft", color: "#3b82f6" },
            { label: "Refine", color: "#8b5cf6" },
            { label: "Google Docs", color: "#10b981" },
          ].map((step, i) => (
            <div key={step.label} className="flex flex-col items-center">
              <div
                className="w-[200px] rounded-xl px-5 py-3 text-center text-white font-semibold text-[15px]"
                style={{ background: `${step.color}20`, border: `2px solid ${step.color}40` }}
              >
                <span style={{ color: step.color }}>{step.label}</span>
              </div>
              {i < 3 && (
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none" className="my-1">
                  <path d="M10 0v18M4 14l6 6 6-6" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
