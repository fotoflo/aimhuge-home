import { SlideShell } from "../components/SlideShell";
import { Card, CardTitle, CardList, CardText } from "../components/Card";
import { MetricRow } from "../components/Stat";

export function InputsSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Division Deep Dive"
      title="Inputs — The Entry Point"
      subtitle="High-margin products that bring farmers into the WeGro ecosystem."
    >
      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="flex flex-col gap-3.5">
          <Card accent="green">
            <CardTitle>Seeds</CardTitle>
            <MetricRow label="White-label seeds" value="60–80% margin" />
            <MetricRow label="Exclusive global distribution" value="40–50% margin" />
            <MetricRow label="Bangladesh seed market" value="~$2B (fragmented)" />
            <MetricRow label="Unit economics (maize)" value="~$200 / hectare" />
            <p className="mt-2.5 text-xs text-slate-500">Global companies invest billions in seed R&D. Bangladesh invests nearly zero. WeGro bridges this gap via exclusive distribution — capturing margin without bearing R&D cost.</p>
          </Card>
          <Card accent="green">
            <CardTitle>Fertilisers &amp; Micronutrients</CardTitle>
            <CardList items={[
              "Own biofertiliser line — compost factory operational",
              "Liquid chemical fertilisers — in development; reduces runoff",
              "Coco peat as growing medium — 10x performance vs. soil",
              "Micronutrients (S, Mg, Zn) — 5-10 kg/hectare",
            ]} />
          </Card>
        </div>
        <div className="flex flex-col gap-3.5">
          <Card accent="green">
            <CardTitle>Machinery</CardTitle>
            <CardList items={[
              "Multi-crop dryers — highest-impact opportunity. Buyers discount wet crops; sun-drying wastes fertile land.",
              "Drones — planned for precision agriculture",
            ]} />
          </Card>
          <Card accent="green">
            <CardTitle>Protected Agriculture</CardTitle>
            <CardList items={[
              "Seedlings — better germination, higher yield",
              "Net houses — no pesticides; GAP-certified for US/EU export",
              "Soilless growing (coco peat + biofertilisers)",
            ]} />
          </Card>
          <Card small className="!bg-emerald-50 !border-emerald-200">
            <CardTitle><span className="text-emerald-800 text-[13px]">Why This Division Matters</span></CardTitle>
            <CardText>Inputs are the farmer acquisition channel. Every seed bag sold creates a relationship that feeds financing, trading, and data. Margins sustain operations while building the downstream flywheel.</CardText>
          </Card>
        </div>
      </div>
    </SlideShell>
  );
}
