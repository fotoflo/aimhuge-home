import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const team = [
  { name: "Asikul", context: "CEO, head of finance, oversees 1,500 employees, weekly reporting from department heads" },
  { name: "Asan", context: "Partnerships, expansion proposals, business projections for new territories" },
  { name: "Shahid", context: "KPI monitoring, business performance tracking across regions" },
  { name: "Ropik", context: "Operations, day-to-day delivery, manages field teams" },
  { name: "Dipty", context: "Marketing/design, brand assets, WordPress, social media" },
  { name: "Majundar", context: "Data analysis, Excel (vlookups, countifs), reporting" },
  { name: "Mashi", context: "Finance, working capital, cash flow, reconciliation" },
  { name: "Romel", context: "HR, payroll, HRIS, people & culture" },
  { name: "Irfan", context: ".NET/SQL development, system maintenance" },
  { name: "Hadasa", context: "Marketing, branding, production coordination" },
];

export function ContextExerciseSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Exercise"
      title="Write Your Context"
      subtitle="Paste this at the start of every conversation with Claude."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} className="invert" />}
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 text-[14px]">
        {team.map((t) => (
          <div key={t.name} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-b-0">
            <span className="font-bold text-[#7c5cfc] shrink-0 w-20">{t.name}</span>
            <span className="text-slate-600">{t.context}</span>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
