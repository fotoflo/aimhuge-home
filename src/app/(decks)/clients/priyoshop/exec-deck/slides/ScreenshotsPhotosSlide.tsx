import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const methods = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9b82fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Screenshot → Paste",
    desc: "⌘+Shift+4 on Mac, then paste directly into Claude. Grab error messages, charts, anything on screen.",
    tag: "Setup required",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9b82fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <circle cx="12" cy="18" r="1" />
      </svg>
    ),
    title: "Phone Photo → AI",
    desc: "Take a photo of a whiteboard, receipt, or printed doc. Upload it and let AI extract the text.",
    tag: "Try it now",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9b82fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "OCR Extraction",
    desc: "AI reads text from images — handwriting, printed pages, even blurry photos. No more retyping.",
    tag: "Any language",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9b82fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: "Analyze Images",
    desc: "Paste a chart, dashboard, or diagram — ask Claude to explain it, find issues, or extract data.",
    tag: "Power move",
  },
];

export function ScreenshotsPhotosSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Section 3 — Interacting with AI"
      title="Screenshots & Photos"
      subtitle="Your camera is an input device. Stop retyping — just show AI what you see."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} className="invert" />}
    >
      <div className="grid grid-cols-2 gap-5 mt-4 flex-1">
        {methods.map((m) => (
          <div
            key={m.title}
            className="bg-white border border-slate-200 rounded-[14px] p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#7c5cfc]/[0.08] flex items-center justify-center">
                {m.icon}
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7c5cfc] bg-[#7c5cfc]/[0.08] px-2.5 py-1 rounded-full">
                {m.tag}
              </span>
            </div>
            <h3 className="text-[20px] font-bold text-slate-900 mb-1.5">{m.title}</h3>
            <p className="text-[15px] text-slate-600 leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-5 border-t border-slate-200">
        <p className="text-[14px] text-slate-500">
          <strong>Quick setup:</strong> On Mac, go to Screenshot settings and enable &ldquo;Copy to Clipboard.&rdquo; On Windows: Win+Shift+S.
        </p>
      </div>
    </SlideShell>
  );
}
