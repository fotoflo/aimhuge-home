import { SlideShell } from "../components/SlideShell";
import { Card, CardTitle, CardList } from "../components/Card";

export function ArchitectureSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Business Architecture"
      title="How the Four Divisions Interconnect"
      subtitle="Each division creates leverage for the others — a compounding, defensible ecosystem."
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-[920px] w-full">
          <div className="grid grid-cols-4 gap-3.5 mb-6">
            {[
              { icon: "🌱", name: "INPUTS", desc: "Farmer acquisition\nHigh-margin products", color: "green" as const, arrow: "text-[#015546]" },
              { icon: "💰", name: "FINANCING", desc: "Farmer retention\nWorking capital access", color: "blue" as const, arrow: "text-blue-500" },
              { icon: "🚚", name: "TRADING", desc: "Yield aggregation\nPrice optimisation", color: "amber" as const, arrow: "text-[#FF8F1C]" },
              { icon: "📊", name: "DATA", desc: "Intelligence layer\nB2B monetisation", color: "purple" as const, arrow: "text-violet-500" },
            ].map((d) => (
              <Card key={d.name} accent={d.color} className="text-center !p-[18px]">
                <div className="text-[24px] mb-1.5">{d.icon}</div>
                <CardTitle>{d.name}</CardTitle>
                <p className="text-[13px] text-slate-600 whitespace-pre-line">{d.desc}</p>
                <div className={`mt-2.5 text-xl ${d.arrow}`}>{d.name === "DATA" ? "↻" : "→"}</div>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3.5">
            <Card small className="!bg-[#e6f2ef] !border-[#015546]/20">
              <CardTitle><span className="text-[#015546] text-[15px]">Key Partners</span></CardTitle>
              <CardList items={["Global seed companies", "Banks & financial institutions", "Industrial crop buyers"]} />
            </Card>
            <Card small className="!bg-[#e6f2ef] !border-[#015546]/20">
              <CardTitle><span className="text-[#015546] text-[15px]">Revenue Streams</span></CardTitle>
              <CardList items={["Product margins on inputs (40-80%)", "Financing fees & interest spread", "Trading spread on aggregated crops"]} />
            </Card>
            <Card small className="!bg-[#e6f2ef] !border-[#015546]/20">
              <CardTitle><span className="text-[#015546] text-[15px]">Competitive Moats</span></CardTitle>
              <CardList items={["Exclusive seed partnerships", "Proprietary farmer data & credit scores", "Integrated value chain"]} />
            </Card>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
