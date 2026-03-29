import { SlideShell } from "@/app/decks/components/SlideShell";
import { Card, CardTitle, CardText } from "@/app/decks/components/Card";
import Image from "next/image";

const formats = [
  { title: "CSV / TSV", desc: "Sales data, exports from ERP, transaction logs", accent: "purple" as const },
  { title: "Excel", desc: "Upload .xlsx files directly — formulas, multiple sheets", accent: "blue" as const },
  { title: "PDF", desc: "Contracts, invoices, reports — AI reads them all", accent: "green" as const },
  { title: "Plain Text", desc: "Emails, meeting notes, copy-paste from anywhere", accent: "amber" as const },
];

export function PastingDocumentsSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Section 3 — Interacting with AI"
      title="Paste Whole Documents"
      subtitle="Don't summarize for the AI — give it the raw data. Claude can read up to 200,000 words in one conversation."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} className="invert" />}
    >
      <div className="flex gap-10 mt-4 flex-1 items-start">
        {/* Left — format cards */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {formats.map((f) => (
            <Card key={f.title} accent={f.accent}>
              <CardTitle>{f.title}</CardTitle>
              <CardText>{f.desc}</CardText>
            </Card>
          ))}
        </div>

        {/* Right — big visual tip */}
        <div className="w-[320px] shrink-0">
          <div className="bg-[#7c5cfc]/[0.06] border-2 border-dashed border-[#7c5cfc]/30 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7c5cfc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div>
              <p className="text-[18px] font-bold text-slate-900">Drag &amp; drop</p>
              <p className="text-[14px] text-slate-500 mt-1">
                or paste with ⌘V / Ctrl+V
              </p>
            </div>
            <div className="text-[13px] text-[#7c5cfc] font-semibold mt-2">
              CSV &bull; XLSX &bull; PDF &bull; TXT &bull; JSON
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-5 border-t border-slate-200">
        <p className="text-[14px] text-slate-500 italic">
          Exercise: Export a report from your system. Paste it into Claude. Ask: &ldquo;Summarize the key findings and flag anything unusual.&rdquo;
        </p>
      </div>
    </SlideShell>
  );
}
