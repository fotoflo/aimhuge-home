import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const tasks = [
  { task: "Rewrite a bad email", desc: "Paste a real email you wrote. Ask Claude to make it clearer, shorter, and more professional." },
  { task: "Translate a memo", desc: "Write in Bangla, get English — or vice versa. Keep the tone and meaning intact." },
  { task: "Turn bullet points into a report", desc: "Give Claude your rough notes. Get back a polished document ready to send." },
  { task: "Write from a template", desc: "\"Write a weekly update email in the same format as this example...\"" },
];

export function HandsOnWritingSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Section 7 — Hands-On"
      title="Writing"
      subtitle="Emails, memos, reports, translations — start with something real from your work."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} className="invert" />}
      topRight="10 min"
    >
      <div className="grid grid-cols-2 gap-5 mt-4 flex-1">
        {tasks.map((t) => (
          <div key={t.task} className="bg-white border border-slate-200 rounded-[14px] p-6 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-[#7c5cfc]/[0.08] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c5cfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-1">{t.task}</h3>
            <p className="text-[14px] text-slate-600 leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
