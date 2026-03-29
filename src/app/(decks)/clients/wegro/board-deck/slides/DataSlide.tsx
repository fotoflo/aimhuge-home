import { SlideShell } from "../components/SlideShell";
import { Card, CardTitle, CardList, CardText } from "../components/Card";
import { MetricRow } from "../components/Stat";

export function DataSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Division Deep Dive"
      title="Data — The Intelligence Layer"
      subtitle="Monetising farm-level data to unlock agricultural lending at scale."
    >
      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="flex flex-col gap-3.5">
          <Card dark>
            <CardTitle dark>The Bank&apos;s Problem</CardTitle>
            <CardList dark items={[
              "Central bank mandates $3.5B annual ag lending",
              "Banks lend to factories — easier due diligence",
              "Factory loans generate high NPLs",
              "Farmer loans have lower default risk but no data to underwrite",
              "Collecting from 500 farmers is operationally prohibitive",
            ]} />
          </Card>
          <Card dark>
            <CardTitle dark>Revenue Model</CardTitle>
            <MetricRow label="Price per farmer profile" value="~$10" dark />
            <MetricRow label="Bank ROI on data" value="~5x" dark />
            <MetricRow label="Model" value="B2B licensing" dark />
            <MetricRow label="Customers" value="Banks & FIs" dark />
            <p className="mt-2.5 text-[13px] text-slate-500">Currently free to build trust. Monetisation imminent.</p>
          </Card>
        </div>
        <div className="flex flex-col gap-3.5">
          <Card dark>
            <CardTitle dark>WeGro&apos;s Data Stack</CardTitle>
            <div className="flex flex-col gap-3 mt-1">
              {[
                { icon: "📡", title: "Geo-Tagged Verification", desc: "Tamper-proof photos with GPS via mobile app" },
                { icon: "🛰", title: "Satellite Monitoring", desc: "7-day imaging cycle tracks crop health" },
                { icon: "🤖", title: "AI Yield Prediction", desc: "Predicts outcomes, flags at-risk loans" },
                { icon: "🎯", title: "Farmer Credit Scoring", desc: "Non-monetary data creates credit profiles. Core IP." },
              ].map((item) => (
                <div key={item.title} className="flex gap-2.5 items-start">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-white text-[15px]">{item.title}</p>
                    <p className="text-[13px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card small dark className="!bg-[#015546]/[0.15] !border-[#015546]/[0.25]">
            <CardTitle><span className="text-[#FF8F1C] text-[13px]">Collections Innovation</span></CardTitle>
            <CardText dark>Buyer-pays-farmer model means the buyer settles directly at harvest. Banks never chase individual farmers. This single structural change makes smallholder lending viable.</CardText>
          </Card>
        </div>
      </div>
    </SlideShell>
  );
}
