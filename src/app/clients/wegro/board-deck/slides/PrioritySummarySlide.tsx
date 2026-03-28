import { SlideShell } from "../components/SlideShell";
import { Initiative, totalScore, tierForScore } from "../lib/types";

interface PrioritySummarySlideProps {
  initiatives: Initiative[];
}

export function PrioritySummarySlide({ initiatives }: PrioritySummarySlideProps) {
  const tier1 = initiatives.filter((i) => tierForScore(totalScore(i)) === 1);
  const tier2 = initiatives.filter((i) => tierForScore(totalScore(i)) === 2);
  const tier3 = initiatives.filter((i) => tierForScore(totalScore(i)) === 3);

  return (
    <SlideShell
      variant="dark"
      sectionLabel="Initiative Prioritisation"
      title="Where We Focus, Where We Wait"
      subtitle={`${initiatives.length} initiatives distilled into three tiers. ${tier1.length} initiatives earn the right to consume resources now.`}
    >
      <div className="grid grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Tier 1 */}
        <div className="flex flex-col gap-4">
          <div className="text-center p-4">
            <div className="text-5xl font-black text-[#015546]">{tier1.length}</div>
            <div className="text-xs text-slate-400 font-medium">Execute Now</div>
          </div>
          <div className="flex-1 rounded-[14px] p-5 pl-6 border-l-4 border-[#015546] bg-[#015546]/[0.08]">
            <h4 className="text-base font-bold text-[#FF8F1C] mb-2.5">Tier 1 — Score 20-22</h4>
            <ul className="list-none p-0">
              {tier1.map((i) => (
                <li key={i.id} className="py-[3px] pl-3 relative text-[14px] text-slate-300 before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1 before:h-1 before:rounded-full before:bg-[#FF8F1C]">
                  {i.name}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-3 text-[13px] text-slate-500">Strong margins, fast time to market, low cost, and high mission alignment. They form the flywheel core.</p>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="flex flex-col gap-4">
          <div className="text-center p-4">
            <div className="text-5xl font-black text-amber-500">{tier2.length}</div>
            <div className="text-xs text-slate-400 font-medium">Develop Next</div>
          </div>
          <div className="flex-1 rounded-[14px] p-5 pl-6 border-l-4 border-amber-500 bg-amber-500/[0.05]">
            <h4 className="text-base font-bold text-amber-500 mb-2.5">Tier 2 �� Score 16-19</h4>
            <ul className="list-none p-0">
              {tier2.map((i) => (
                <li key={i.id} className="py-[3px] pl-3 relative text-[14px] text-slate-300 before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1 before:h-1 before:rounded-full before:bg-amber-500">
                  {i.name}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-3 text-[13px] text-slate-500">High potential but require validation, capital, or capability-building. Advance to Tier 1 as conditions improve.</p>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="flex flex-col gap-4">
          <div className="text-center p-4">
            <div className="text-5xl font-black text-slate-500">{tier3.length}</div>
            <div className="text-xs text-slate-400 font-medium">Defer / Monitor</div>
          </div>
          <div className="flex-1 rounded-[14px] p-5 pl-6 border-l-4 border-slate-600 bg-slate-400/[0.05]">
            <h4 className="text-base font-bold text-slate-400 mb-2.5">Tier 3 — Score &le;15</h4>
            <ul className="list-none p-0">
              {tier3.map((i) => (
                <li key={i.id} className="py-[3px] pl-3 relative text-[14px] text-slate-400 before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1 before:h-1 before:rounded-full before:bg-slate-500">
                  {i.name}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-3 text-[13px] text-slate-500">High effort, high cost, or low alignment today. Re-score in 6 months.</p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
