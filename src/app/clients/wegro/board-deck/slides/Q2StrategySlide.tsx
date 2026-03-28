import { SlideShell } from "../components/SlideShell";

const lanes = [
  {
    icon: "🌱", title: "Scale Seed Distribution", color: "border-l-[#015546]",
    rationale: "\"Highest margin, lowest effort, strongest acquisition channel. Scored 21-22 — best use of every dollar we have.\"",
    actions: ["Sign 2 new exclusive global seed partnerships", "Expand white-label SKUs to 3 new crops", "Grow farmer base 40% via seed-led acquisition", "Bundle micronutrients with seeds for higher AOV"],
  },
  {
    icon: "📊", title: "Monetise the Data Platform", color: "border-l-[#FF8F1C]",
    rationale: "\"Banks need this data to meet a $3.5B mandate. Proven value for free — time to charge. Scored 20-21, near-zero marginal cost.\"",
    actions: ["Convert 2 pilot banks to paid licensing", "Ship credit scoring v1 to first paying customer", "Reach 10,000 farmer profiles"],
  },
  {
    icon: "🚚", title: "Grow Contract Aggregation", color: "border-l-[#FF8F1C]",
    rationale: "\"Already operational, low cost, and scored 22. More volume = more data = stronger flywheel. This is the engine.\"",
    actions: ["Secure 3 new industrial buyer contracts", "Increase monthly aggregation volume by 50%", "Establish quality-checking protocols at 2 warehouses"],
  },
  {
    icon: "💰", title: "Launch Crop Collateral Lending", color: "border-l-blue-500",
    rationale: "\"Scored 20. The missing piece: farmers store crops, get capital, sell higher, and generate the data that powers everything.\"",
    actions: ["Sign 1 warehouse partner for collateral storage", "Pilot EWR-backed loans with 50 farmers", "Validate buyer-pays-farmer settlement flow"],
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
            <h4 className="text-[18px] font-bold text-slate-900 mb-1.5">{lane.icon} {lane.title}</h4>
            <div className="text-[13px] text-slate-500 italic mb-2.5 pl-3 border-l-2 border-[#015546]/40">{lane.rationale}</div>
            <div className="flex flex-col gap-1.5">
              {lane.actions.map((action) => (
                <div key={action} className="flex items-center gap-2 text-[14px] text-slate-700 py-1.5 px-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[#015546] font-bold text-sm">✓</span>
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
