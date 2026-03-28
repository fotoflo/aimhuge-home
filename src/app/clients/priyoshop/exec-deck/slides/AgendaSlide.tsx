import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const sections = [
  { num: "01", time: "~20 min", title: "Silent Meeting", desc: "Reflect on what you learned, what surprised you, what confused you" },
  { num: "02", time: "~20 min", title: "What is AI?", desc: "Language models, frontier models, and why this matters now" },
  { num: "03", time: "~1 hour", title: "Skills & Context", desc: "Context, saved skills, and artifacts — the three power tools" },
  { num: "04", time: "~1 hour", title: "Hands-On Cowork", desc: "Writing, spreadsheets, data, presentations, email, and interviewing" },
  { num: "05", time: "~20 min", title: "Claude Code Demo", desc: "See what happens when AI can actually write and run code" },
];

export function AgendaSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Day 2"
      title="Today's Agenda"
      subtitle="~3.5 hours including breaks"
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
      topRight="Confidential"
    >
      <div className="flex flex-col gap-4 mt-4">
        {sections.map((s) => (
          <div key={s.num} className="flex items-start gap-5">
            <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">{s.num}</span>
            <div className="flex-1">
              <div className="flex items-baseline gap-3">
                <span className="text-[20px] font-bold text-white">{s.title}</span>
                <span className="text-sm text-slate-500">{s.time}</span>
              </div>
              <p className="text-[15px] text-slate-400 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
