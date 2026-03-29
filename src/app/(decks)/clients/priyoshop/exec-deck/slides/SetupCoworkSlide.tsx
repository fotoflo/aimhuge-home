import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Open Claude in your browser",
    desc: "Go to claude.ai — sign in with your Google account",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9b82fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Connect Google Drive",
    desc: "Settings → Integrations → Google Drive. This lets Claude read your docs and sheets directly.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9b82fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Connect Google Calendar",
    desc: "Settings → Integrations → Google Calendar. Claude can see your schedule and help you plan.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9b82fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Create your first document",
    desc: "Ask Claude to write something → click \"Open in Docs\" → it appears in your Google Drive",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9b82fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
];

export function SetupCoworkSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Setup"
      title="Connect Your Workspace"
      subtitle="Let's get everyone set up. Claude works best when it can see your real documents and calendar."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
      topRight="~15 min"
    >
      <div className="flex flex-col gap-2 mt-4 flex-1">
        {steps.map((s) => (
          <div key={s.num} className="flex items-center gap-6 py-5 border-b border-white/[0.06] last:border-b-0">
            <span className="text-[#9b82fd] font-mono text-sm font-bold shrink-0 w-6">{s.num}</span>
            <div className="w-12 h-12 rounded-xl bg-[#7c5cfc]/10 flex items-center justify-center shrink-0">
              {s.icon}
            </div>
            <div className="flex-1">
              <span className="text-[20px] font-bold text-white">{s.title}</span>
              <p className="text-[15px] text-slate-400 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
