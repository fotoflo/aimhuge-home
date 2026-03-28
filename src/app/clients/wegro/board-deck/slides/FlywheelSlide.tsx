import { SlideShell } from "../components/SlideShell";

const steps = [
  { bold: "Inputs drive farmer acquisition.", rest: "Seeds & fertilisers create a commercial relationship. High margins fund operations." },
  { bold: "Financing deepens lock-in.", rest: "Crop loans and trade financing make WeGro essential. Switching costs rise." },
  { bold: "Trading captures yield.", rest: "Aggregating harvests from locked-in farmers gives volume leverage with buyers." },
  { bold: "Data monetises intelligence.", rest: "Every interaction generates farm-level data that banks will pay for." },
  { bold: "Data improves everything.", rest: "Yield predictions inform inputs, financing risk, and trade timing. The cycle accelerates.", special: true },
];

const nodes = [
  { icon: "🌱", label: "INPUTS", sub: "Acquire Farmers", pos: "top-[-10px] left-1/2 -translate-x-1/2" },
  { icon: "💰", label: "FINANCING", sub: "Deepen Lock-In", pos: "top-1/2 right-[-15px] -translate-y-1/2" },
  { icon: "🚚", label: "TRADING", sub: "Capture Yield", pos: "bottom-[-10px] left-1/2 -translate-x-1/2" },
  { icon: "📊", label: "DATA", sub: "Monetise Intel", pos: "top-1/2 left-[-15px] -translate-y-1/2" },
];

export function FlywheelSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Strategic Architecture"
      title="The WeGro Flywheel"
      subtitle="Each division compounds the value of the others."
    >
      <div className="flex items-center justify-center flex-1 gap-14">
        <div className="relative w-[380px] h-[380px] flex-shrink-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110px] h-[110px] bg-emerald-700 rounded-full flex items-center justify-center text-white font-extrabold text-sm text-center shadow-[0_0_0_6px_rgba(5,150,105,0.12),0_0_0_16px_rgba(5,150,105,0.05)]">
            WeGro<br />Farmer<br />Network
          </div>
          <div className="fw-ring" />
          {nodes.map((n) => (
            <div key={n.label} className={`absolute w-[120px] h-[100px] bg-white rounded-xl border-2 border-slate-200 flex flex-col items-center justify-center text-center p-2.5 shadow-sm ${n.pos}`}>
              <div className="text-xl mb-1">{n.icon}</div>
              <div className="text-[11px] font-bold text-slate-800">{n.label}</div>
              <div className="text-[9px] text-slate-500 mt-px">{n.sub}</div>
            </div>
          ))}
        </div>
        <div className="max-w-[360px]">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 mb-4 items-start">
              <div className={`w-6 h-6 min-w-[24px] rounded-full text-white text-[11px] font-bold flex items-center justify-center ${step.special ? "bg-amber-500" : "bg-emerald-600"}`}>
                {step.special ? "↻" : i + 1}
              </div>
              <div className="text-[13px] text-slate-700 leading-relaxed">
                <strong className="text-slate-900">{step.bold}</strong> {step.rest}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
