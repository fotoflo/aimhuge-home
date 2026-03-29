import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const examples = [
  { input: "40-page quarterly report", output: "5 bullet executive summary", color: "#7c5cfc" },
  { input: "200 customer support tickets", output: "Top 5 themes with counts", color: "#3b82f6" },
  { input: "Hour-long meeting transcript", output: "Action items + decisions", color: "#10b981" },
  { input: "Legal contract (50 pages)", output: "Key terms + risks flagged", color: "#f59e0b" },
];

export function SummarizingLongTextsSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 3 — Interacting with AI"
      title="Summarize Anything"
      subtitle="Give AI the full document. Ask for exactly the format you need."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
    >
      <div className="flex flex-col gap-4 mt-6 flex-1">
        {examples.map((e) => (
          <div key={e.input} className="flex items-center gap-0">
            {/* Input */}
            <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-l-xl px-6 py-4">
              <p className="text-[17px] text-slate-300">{e.input}</p>
            </div>

            {/* Arrow */}
            <div className="w-20 flex items-center justify-center" style={{ color: e.color }}>
              <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
                <path d="M0 10h32M26 4l8 6-8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Output */}
            <div
              className="flex-1 rounded-r-xl px-6 py-4"
              style={{
                background: `${e.color}10`,
                borderLeft: `3px solid ${e.color}`,
              }}
            >
              <p className="text-[17px] font-semibold text-white">{e.output}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/[0.06]">
        <p className="text-[15px] text-slate-500 italic">
          Pro tip: Tell Claude the format — &ldquo;Give me bullet points, max 5 lines&rdquo; or &ldquo;Write it as an email to my boss.&rdquo;
        </p>
      </div>
    </SlideShell>
  );
}
