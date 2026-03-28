import { SlideShell } from "../components/SlideShell";

const lanes = [
  {
    icon: "🌱", title: "Scale Seed Distribution", color: "border-l-emerald-500",
    rationale: "\"Highest margin, lowest effort, strongest acquisition channel. Seeds scored 21-22 — the single best use of every dollar and hour we have.\"",
    actions: ["Sign 2 new exclusive global seed partnerships", "Expand white-label SKU range to 3 new crops", "Grow farmer base by 40% through seed-led acquisition", "Bundle micronutrients with seed packages for higher AOV"],
  },
  {
    icon: "📊", title: "Monetise the Data Platform", color: "border-l-violet-500",
    rationale: "\"Banks need this data to meet a $3.5B mandate. We've proven value for free — it's time to charge. Scored 20-21 with near-zero marginal cost.\"",
    actions: ["Convert 2 pilot banks to paid licensing agreements", "Ship farmer credit scoring v1 to first paying customer", "Reach 10,000 farmer profiles in the platform"],
  },
  {
    icon: "🚚", title: "Grow Contract Aggregation", color: "border-l-amber-500",
    rationale: "\"Already operational, low cost, and scored 22. More volume = more data = stronger flywheel. This is the engine.\"",
    actions: ["Secure 3 new industrial buyer contracts", "Increase monthly aggregation volume by 50%", "Establish quality-checking protocols at 2 warehouses"],
  },
  {
    icon: "💰", title: "Launch Crop Collateral Lending", color: "border-l-blue-500",
    rationale: "\"Scored 20. The missing piece that closes the loop: farmers store crops, get capital, sell at higher prices, and generate the data that powers everything else.\"",
    actions: ["Sign 1 warehouse partner for collateral storage", "Pilot EWR-backed loans with 50 farmers", "Validate buyer-pays-farmer settlement flow end-to-end"],
  },
];

export function Q2StrategySlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Strategic Priorities"
      title="Q2 2026: Four Bets That Move the Needle"
      subtitle="From the scoring matrix, four strategic lanes emerge for the next quarter."
    >
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        {lanes.map((lane) => (
          <div key={lane.title} className={`bg-white rounded-[14px] p-5 pl-6 border border-slate-200 border-l-4 ${lane.color} flex flex-col`}>
            <h4 className="text-[15px] font-bold text-slate-900 mb-1.5">{lane.icon} {lane.title}</h4>
            <div className="text-xs text-slate-500 italic mb-2.5 pl-3 border-l-2 border-emerald-300">{lane.rationale}</div>
            <div className="flex flex-col gap-1.5">
              {lane.actions.map((action) => (
                <div key={action} className="flex items-center gap-2 text-xs text-slate-700 py-1.5 px-2.5 bg-slate-50 rounded-lg">
                  <span className="text-emerald-500 font-bold text-sm">✓</span>
                  {action}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
