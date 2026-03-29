import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const ideas = [
  { title: "Brief → Outline", desc: "\"I need a 10-slide deck on Q2 results for the board. Here are my notes...\"" },
  { title: "Report → Slides", desc: "\"Turn this 20-page report into a 5-slide executive summary with key charts\"" },
  { title: "Speaker notes", desc: "\"Write speaker notes for each slide — what should I say out loud?\"" },
  { title: "Design suggestions", desc: "\"What visuals or charts would make each slide more compelling?\"" },
];

export function HandsOnPresentationsSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Section 7 — Hands-On"
      title="Presentations"
      subtitle="Turn reports and briefs into slide outlines, speaker notes, and structured decks."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} className="invert" />}
      topRight="10 min"
    >
      <div className="grid grid-cols-2 gap-5 mt-4 flex-1">
        {ideas.map((t) => (
          <div key={t.title} className="bg-white border border-slate-200 rounded-[14px] p-6 flex flex-col border-t-[3px] border-t-violet-500">
            <h3 className="text-[18px] font-bold text-slate-900 mb-2">{t.title}</h3>
            <p className="text-[14px] text-slate-600 leading-relaxed italic">{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-5 border-t border-slate-200">
        <p className="text-[14px] text-slate-500">
          Claude can&apos;t create PowerPoint directly — but it can create the content, structure, and speaker notes.
          Copy into your template.
        </p>
      </div>
    </SlideShell>
  );
}
