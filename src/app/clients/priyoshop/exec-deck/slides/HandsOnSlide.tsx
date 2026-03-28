import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const exercises = [
  { num: "4A", title: "Writing", desc: "Emails, memos, translations — give Claude a bad first draft and watch it improve", time: "10 min" },
  { num: "4B", title: "Spreadsheets", desc: "Upload Excel, add formulas, generate trackers, clean messy data", time: "10 min" },
  { num: "4C", title: "Database & Data", desc: "Find patterns, write SQL queries, generate charts, cross-reference datasets", time: "10 min" },
  { num: "4D", title: "Presentations", desc: "Slide outlines from a brief, turn reports into decks, speaker notes", time: "10 min" },
  { num: "4E", title: "Email & Calendar", desc: "Batch draft emails, plan your week, connect Gmail and Calendar", time: "10 min" },
  { num: "4F", title: "Interviewing", desc: "Claude interviews you — stress-test decisions, prep for presentations, find root causes", time: "10 min" },
];

export function HandsOnSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 4"
      title="Hands-On Cowork"
      subtitle="~1 hour of exercises with Claude. Work on real PriyoShop tasks."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
      topRight="~1 hour"
    >
      <div className="grid grid-cols-2 gap-4 mt-4 flex-1">
        {exercises.map((e) => (
          <div key={e.num} className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-5 flex flex-col">
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="text-[#9b82fd] font-mono text-[13px] font-bold">{e.num}</span>
              <span className="text-[18px] font-bold text-white">{e.title}</span>
              <span className="text-[12px] text-slate-500 ml-auto">{e.time}</span>
            </div>
            <p className="text-[14px] text-slate-400 leading-relaxed">{e.desc}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
