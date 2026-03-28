import { SlideShell } from "../components/SlideShell";
import { Card, CardTitle, CardText } from "../components/Card";

export function TradingSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Division Deep Dive"
      title="Trading — The Volume Engine"
      subtitle="Aggregating smallholder yields to serve industrial demand at scale."
    >
      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="flex flex-col gap-3.5">
          <Card accent="amber"><CardTitle>Contract Growing</CardTitle><CardText>Large buyers place orders (e.g., 100T maize). WeGro aggregates from many smallholders (each 10-20T) to fill demand.</CardText></Card>
          <Card accent="amber"><CardTitle>Commodity Stockpiling</CardTitle><CardText>Stockpile crops when prices are low, sell when they recover. Price prediction models guide timing. Futures-style contracts with expiry.</CardText></Card>
          <Card accent="amber"><CardTitle>Price Discovery</CardTitle><CardText>Building commodity pricing models. Long-term: a transparent price discovery mechanism for Bangladesh agriculture.</CardText></Card>
        </div>
        <div className="flex flex-col gap-3.5">
          <Card className="!bg-slate-800 !border-slate-700">
            <CardTitle dark>How a Trade Works</CardTitle>
            <div className="flex flex-col gap-2.5">
              {["Buyer places order (e.g., 100T maize)", "WeGro sources from farmer network", "Crop aggregated & quality-checked", "Delivered to buyer or stockpiled", "WeGro captures trading spread"].map((step, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 min-w-[24px] rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">{i + 1}</div>
                  <p className="text-slate-300 text-xs">{step}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card small className="!bg-emerald-50 !border-emerald-200">
            <CardTitle><span className="text-emerald-800 text-[13px]">Key Advantage</span></CardTitle>
            <CardText>Farmer relationships (Inputs) and crop visibility (Data) create an information advantage over traditional commodity traders who lack farm-level intelligence.</CardText>
          </Card>
        </div>
      </div>
    </SlideShell>
  );
}
