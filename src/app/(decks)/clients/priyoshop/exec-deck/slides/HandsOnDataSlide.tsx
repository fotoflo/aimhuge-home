import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const exercises = [
  {
    title: "Find patterns",
    desc: "Upload a dataset. Ask: \"What patterns do you see? What's unusual?\"",
    tag: "Analysis",
    tagColor: "#7c5cfc",
  },
  {
    title: "Write SQL queries",
    desc: "Describe your database in plain language. Claude writes the query.",
    tag: "Database",
    tagColor: "#3b82f6",
  },
  {
    title: "Generate charts",
    desc: "\"Make a bar chart of monthly sales by region\" — Claude creates it as an artifact.",
    tag: "Visualization",
    tagColor: "#10b981",
  },
  {
    title: "Cross-reference",
    desc: "Paste two datasets. Ask Claude to find mismatches, duplicates, or correlations.",
    tag: "Comparison",
    tagColor: "#f59e0b",
  },
];

export function HandsOnDataSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 7 — Hands-On"
      title="Data & Analysis"
      subtitle="Upload real PriyoShop data. Find patterns. Generate charts. Write queries."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
      topRight="10 min"
    >
      <div className="grid grid-cols-2 gap-5 mt-4 flex-1">
        {exercises.map((e) => (
          <div key={e.title} className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[18px] font-bold text-white">{e.title}</h3>
              <span
                className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ color: e.tagColor, background: `${e.tagColor}15` }}
              >
                {e.tag}
              </span>
            </div>
            <p className="text-[14px] text-slate-400 leading-relaxed">{e.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/[0.06]">
        <p className="text-[15px] text-slate-500">
          <strong className="text-slate-300">Shahid&apos;s challenge:</strong> Upload KPI data from two regions. Ask Claude to compare performance and flag the biggest gap.
        </p>
      </div>
    </SlideShell>
  );
}
