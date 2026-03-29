import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const tasks = [
  {
    title: "Batch draft emails",
    desc: "\"Write follow-up emails to these 5 partners based on our last meeting notes\"",
    icon: "✉️",
  },
  {
    title: "Plan your week",
    desc: "\"Look at my calendar for next week and suggest time blocks for deep work\"",
    icon: "📅",
  },
  {
    title: "Meeting prep",
    desc: "\"I have a meeting with [person] tomorrow. Draft an agenda based on our last 3 email threads\"",
    icon: "📋",
  },
  {
    title: "Smart scheduling",
    desc: "\"Find a 1-hour slot next week where both my calendar and Asan's are free\"",
    icon: "🕐",
  },
];

export function HandsOnEmailCalendarSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Section 7 — Hands-On"
      title="Email & Calendar"
      subtitle="Connect Gmail and Google Calendar. Let Claude handle the scheduling and drafting."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} className="invert" />}
      topRight="10 min"
    >
      <div className="flex flex-col gap-4 mt-4 flex-1">
        {tasks.map((t) => (
          <div key={t.title} className="flex items-center gap-5 bg-white border border-slate-200 rounded-[14px] px-6 py-5">
            <span className="text-3xl">{t.icon}</span>
            <div className="flex-1">
              <h3 className="text-[18px] font-bold text-slate-900">{t.title}</h3>
              <p className="text-[14px] text-slate-500 mt-0.5 italic">{t.desc}</p>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
