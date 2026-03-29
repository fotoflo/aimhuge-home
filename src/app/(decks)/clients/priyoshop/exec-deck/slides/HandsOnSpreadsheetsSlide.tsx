import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const tasks = [
  { task: "Upload & analyze", desc: "Upload an Excel file. Ask: \"What are the top 3 insights from this data?\"" },
  { task: "Generate formulas", desc: "Describe what you need in plain language. Get VLOOKUP, SUMIF, pivot tables — explained." },
  { task: "Create from scratch", desc: "\"Build me a monthly budget tracker for 8 departments\" → download as .xlsx" },
  { task: "Clean messy data", desc: "Paste raw data with duplicates, errors, mixed formats. Claude fixes it." },
];

export function HandsOnSpreadsheetsSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 7 — Hands-On"
      title="Spreadsheets"
      subtitle="Upload your real Excel files. Let Claude do the formula work."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
      topRight="10 min"
    >
      <div className="grid grid-cols-2 gap-5 mt-4 flex-1">
        {tasks.map((t, i) => (
          <div key={t.task} className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#9b82fd] font-mono text-[13px] font-bold">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[18px] font-bold text-white">{t.task}</h3>
            </div>
            <p className="text-[14px] text-slate-400 leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/[0.06]">
        <p className="text-[15px] text-slate-500">
          <strong className="text-slate-300">Majundar&apos;s challenge:</strong> Upload a real PriyoShop report with VLOOKUPs. Ask Claude to add a COUNTIF summary row.
        </p>
      </div>
    </SlideShell>
  );
}
