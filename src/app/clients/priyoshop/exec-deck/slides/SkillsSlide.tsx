import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const skillIdeas = [
  { name: "Asan", skill: "Expansion proposal generator", desc: "Input territory data → formatted proposal with unit economics" },
  { name: "Shahid", skill: "KPI weekly digest", desc: "Input raw numbers → performance summary with flags" },
  { name: "Mashi", skill: "Cash flow narrator", desc: "Input inflow/outflow data → finance summary for Asikul" },
  { name: "Romel", skill: "Offer letter drafter", desc: "Input role/salary/start date → formatted offer letter" },
  { name: "Dipty", skill: "Social media post generator", desc: "Input product/promo details → posts for multiple platforms" },
];

export function SkillsSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 3B"
      title="Skills"
      subtitle="A skill is a saved instruction that tells Claude how to do a specific task your way. It turns a 10-minute back-and-forth into a 1-message task."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
    >
      <div className="mt-4 flex flex-col gap-0">
        {skillIdeas.map((s, i) => (
          <div key={i} className="flex items-start gap-5 py-3.5 border-b border-white/[0.06] last:border-b-0">
            <span className="text-[#9b82fd] font-semibold text-[14px] shrink-0 w-20 mt-0.5">{s.name}</span>
            <div>
              <span className="text-[18px] font-bold text-white">{s.skill}</span>
              <p className="text-[14px] text-slate-400 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/[0.06]">
        <p className="text-[15px] text-slate-500 italic">
          Live exercise: Pick one person&apos;s recurring task. Break it down — input, output, rules. Write it. Test it. Refine it.
        </p>
      </div>
    </SlideShell>
  );
}
