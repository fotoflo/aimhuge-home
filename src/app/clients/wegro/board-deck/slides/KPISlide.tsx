import { SlideShell } from "../components/SlideShell";

const kpis = [
  { division: "Inputs", color: "text-emerald-700", metrics: [
    { metric: "Active farmer count", measures: "Ecosystem reach", target: "To be set" },
    { metric: "Gross margin by product line", measures: "Product economics", target: "Seeds: 40-80%" },
    { metric: "Repeat purchase rate", measures: "Retention / satisfaction", target: "To be set" },
  ]},
  { division: "Financing", color: "text-blue-500", metrics: [
    { metric: "Loans disbursed (vol & count)", measures: "Scale of operations", target: "To be set" },
    { metric: "NPL rate", measures: "Portfolio quality", target: "< factory benchmark" },
    { metric: "Warehouse utilisation", measures: "Infrastructure leverage", target: "To be set" },
  ]},
  { division: "Trading", color: "text-amber-500", metrics: [
    { metric: "Volume aggregated (tons)", measures: "Trading scale", target: "To be set" },
    { metric: "Trading spread (%)", measures: "Margin per transaction", target: "To be set" },
    { metric: "Buyer fill rate", measures: "Supply reliability", target: "To be set" },
  ]},
  { division: "Data", color: "text-violet-500", metrics: [
    { metric: "Farmer profiles generated", measures: "Data asset growth", target: "To be set" },
    { metric: "Bank / FI customers", measures: "B2B pipeline", target: "To be set" },
    { metric: "Yield prediction accuracy", measures: "Model credibility", target: "To be set" },
  ]},
];

export function KPISlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Performance Tracking"
      title="Key Metrics & KPIs"
      subtitle="Proposed board-level metrics across each division."
    >
      <div className="flex-1 flex items-center">
        <table className="w-full text-[13px] rounded-xl overflow-hidden border border-slate-200">
          <thead>
            <tr>
              <th className="text-left px-3.5 py-2.5 bg-slate-100 font-semibold text-slate-700 border-b-2 border-slate-200 w-[16%]">Division</th>
              <th className="text-left px-3.5 py-2.5 bg-slate-100 font-semibold text-slate-700 border-b-2 border-slate-200 w-[28%]">Metric</th>
              <th className="text-left px-3.5 py-2.5 bg-slate-100 font-semibold text-slate-700 border-b-2 border-slate-200 w-[28%]">What It Measures</th>
              <th className="text-left px-3.5 py-2.5 bg-slate-100 font-semibold text-slate-700 border-b-2 border-slate-200 w-[28%]">Target / Baseline</th>
            </tr>
          </thead>
          <tbody>
            {kpis.map((group) =>
              group.metrics.map((m, i) => (
                <tr key={`${group.division}-${i}`} className={i === 0 && group.division !== "Inputs" ? "border-t-2 border-slate-200" : ""}>
                  {i === 0 && (
                    <td rowSpan={3} className={`px-3.5 py-2.5 font-semibold ${group.color} border-b border-slate-100`}>
                      {group.division}
                    </td>
                  )}
                  <td className="px-3.5 py-2.5 border-b border-slate-100 text-slate-600">{m.metric}</td>
                  <td className="px-3.5 py-2.5 border-b border-slate-100 text-slate-600">{m.measures}</td>
                  <td className="px-3.5 py-2.5 border-b border-slate-100 text-slate-600">{m.target}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </SlideShell>
  );
}
