import { SlideShell } from "../components/SlideShell";
import { Card, CardTitle, CardList } from "../components/Card";

export function ArchitectureSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Business Architecture"
      title="How the Four Divisions Interconnect"
      subtitle="Each division creates leverage for the others — forming a defensible, compounding ecosystem."
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-[880px] w-full">
          <div className="grid grid-cols-4 gap-3.5 mb-7">
            {[
              { icon: "🌱", name: "INPUTS", desc: "Farmer acquisition\nHigh-margin products", color: "green" as const, arrow: "text-emerald-500" },
              { icon: "💰", name: "FINANCING", desc: "Farmer retention\nWorking capital access", color: "blue" as const, arrow: "text-blue-500" },
              { icon: "🚚", name: "TRADING", desc: "Yield aggregation\nPrice optimisation", color: "amber" as const, arrow: "text-amber-500" },
              { icon: "📊", name: "DATA", desc: "Intelligence layer\nB2B monetisation", color: "purple" as const, arrow: "text-violet-500" },
            ].map((d) => (
              <Card key={d.name} accent={d.color} className="text-center !p-[18px]">
                <div className="text-[22px] mb-1.5">{d.icon}</div>
                <CardTitle>{d.name}</CardTitle>
                <p className="text-[11px] text-slate-600 whitespace-pre-line">{d.desc}</p>
                <div className={`mt-2.5 text-xl ${d.arrow}`}>{d.name === "DATA" ? "↻" : "→"}</div>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3.5">
            <Card small className="!bg-emerald-50 !border-emerald-200">
              <CardTitle><span className="text-emerald-800 text-[13px]">Key Partners</span></CardTitle>
              <CardList items={["Global seed companies", "Warehouse operators", "Banks & financial institutions", "Industrial crop buyers"]} />
            </Card>
            <Card small className="!bg-emerald-50 !border-emerald-200">
              <CardTitle><span className="text-emerald-800 text-[13px]">Revenue Streams</span></CardTitle>
              <CardList items={["Product margins on inputs (40-80%)", "Financing fees & interest spread", "Trading spread on aggregated crops", "Per-farmer data licensing"]} />
            </Card>
            <Card small className="!bg-emerald-50 !border-emerald-200">
              <CardTitle><span className="text-emerald-800 text-[13px]">Competitive Moats</span></CardTitle>
              <CardList items={["Exclusive seed partnerships", "Proprietary farmer data & credit scores", "Integrated value chain", "Buyer network & aggregation"]} />
            </Card>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
