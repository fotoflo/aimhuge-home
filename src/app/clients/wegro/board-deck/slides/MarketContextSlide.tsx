import { SlideShell } from "../components/SlideShell";
import { Card, CardTitle, CardList } from "../components/Card";
import { Stat } from "../components/Stat";

export function MarketContextSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Market Context"
      title="The Problem We Solve"
      subtitle="Bangladesh's agricultural sector suffers from systemic fragmentation at every layer."
    >
      <div className="flex gap-8 mb-6">
        <Stat value="$20B" label="Agricultural financing market" dark />
        <Stat value="$3.5B" label="Central bank lending mandate" dark />
        <Stat value="$2B" label="Seed market (fragmented)" dark />
        <Stat value="~0" label="Local seed R&D investment" dark />
      </div>
      <div className="grid grid-cols-4 gap-5 flex-1 min-h-0">
        <Card dark><CardTitle dark>Inputs Gap</CardTitle><CardList dark items={["No local seed R&D investment", "Fragmented $2B market, no dominant distributor", "Post-harvest drying infrastructure absent"]} /></Card>
        <Card dark><CardTitle dark>Financing Gap</CardTitle><CardList dark items={["Banks lend to factories, not farmers", "High NPLs from misallocated loans", "No credit scoring for smallholders"]} /></Card>
        <Card dark><CardTitle dark>Trade Gap</CardTitle><CardList dark items={["Farmers sell wet, low-value crops individually", "No aggregation layer to buyers", "Price discovery is opaque"]} /></Card>
        <Card dark><CardTitle dark>Data Gap</CardTitle><CardList dark items={["No farm-level data collection", "Banks can't assess ag risk", "No satellite/AI infrastructure"]} /></Card>
      </div>
    </SlideShell>
  );
}
