import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const scenarios = [
  {
    title: "Stress-test a decision",
    prompt: "\"I'm planning to open 3 new warehouses. Interview me about this plan and challenge my assumptions.\"",
    outcome: "Claude asks tough questions → you discover blind spots before committing resources",
  },
  {
    title: "Prep for a presentation",
    prompt: "\"Pretend you're a skeptical board member. Ask me the hardest questions about our Q2 results.\"",
    outcome: "Practice handling objections → walk in confident with prepared answers",
  },
  {
    title: "Find root causes",
    prompt: "\"Our delivery success rate dropped 12% last month. Interview me to find out why.\"",
    outcome: "Structured 5-whys questioning → get from symptom to root cause",
  },
];

export function HandsOnInterviewingSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 7 — Hands-On"
      title="AI Interviews You"
      subtitle="The most powerful technique: let Claude ask the questions."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
      topRight="10 min"
    >
      <div className="flex flex-col gap-5 mt-4 flex-1">
        {scenarios.map((s) => (
          <div key={s.title} className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
            <div className="flex items-start gap-5">
              <div className="flex-1">
                <h3 className="text-[18px] font-bold text-white mb-2">{s.title}</h3>
                <p className="text-[15px] text-[#9b82fd] italic mb-3">{s.prompt}</p>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="text-[14px] text-slate-400">{s.outcome}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
