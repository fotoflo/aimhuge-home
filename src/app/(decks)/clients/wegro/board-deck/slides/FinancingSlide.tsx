import { SlideShell } from "../components/SlideShell";
import { Card, CardTitle, CardList } from "../components/Card";
import { Tag } from "../components/Tag";
import { Stat } from "../components/Stat";

export function FinancingSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Division Deep Dive"
      title="Financing — The Lock-In"
      subtitle="Solving agriculture's capital gap while deepening farmer relationships."
    >
      <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
        <Card dark>
          <div className="text-2xl mb-2">📦</div>
          <CardTitle dark>Crop Collateralised Financing</CardTitle>
          <CardList dark items={[
            "Farmer stores harvest in partner warehouse",
            "Electronic Warehouse Receipt generated",
            "Farmer receives loan against stored crop",
            "Crop sold when market price improves",
            "Buyer pays directly — no collections",
          ]} />
          <div className="mt-auto pt-3"><Tag color="blue">Core Product</Tag></div>
        </Card>
        <Card dark>
          <div className="text-2xl mb-2">📄</div>
          <CardTitle dark>Trade Financing (Factoring)</CardTitle>
          <CardList dark items={[
            "Factories have capacity but lack working capital",
            "WeGro finances against confirmed buyer orders",
            "Asset-light: doesn't hold inventory",
            "Low risk: backed by real purchase commitments",
          ]} />
          <div className="mt-auto pt-3"><Tag color="blue">Asset-Light</Tag></div>
        </Card>
        <Card dark>
          <div className="text-2xl mb-2">💪</div>
          <CardTitle dark>Risk Mitigation</CardTitle>
          <CardList dark items={[
            "Geo-tagged land verification via app",
            "Satellite imagery every 7 days",
            "AI yield prediction flags at-risk loans",
            "Weather data for loss forecasting",
            "Buyer-pays-farmer eliminates collection risk",
          ]} />
          <div className="mt-auto pt-3"><Tag color="blue">Tech-Enabled</Tag></div>
        </Card>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <Stat value="$20B" label="Total ag financing market" dark />
        <Stat value="$3.5B" label="Annual central bank mandate" dark />
        <Stat value="Lower" label="Farmer default rate vs. factory NPLs" dark />
        <Stat value="5x" label="Bank ROI on WeGro data" dark />
      </div>
    </SlideShell>
  );
}
