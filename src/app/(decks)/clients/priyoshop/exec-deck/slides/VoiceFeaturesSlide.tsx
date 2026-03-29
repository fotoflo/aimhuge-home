import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const tips = [
  { icon: "🎙️", title: "Whisper to your phone", desc: "Voice input is faster than typing — talk to Claude like a colleague" },
  { icon: "🔄", title: "Think out loud", desc: "Ramble, correct yourself, add context — AI handles messy input well" },
  { icon: "🌍", title: "Any language works", desc: "Speak in Bangla, English, or mix — Claude understands both" },
  { icon: "⚡", title: "Voice → text → edit", desc: "Dictate a rough draft, then ask Claude to clean it up" },
];

export function VoiceFeaturesSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 3 — Interacting with AI"
      title="Voice Input"
      subtitle="You don't have to type everything. Your phone's microphone is the fastest input device you own."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
    >
      <div className="flex gap-10 mt-6 flex-1 items-center">
        {/* Left — illustration */}
        <div className="w-[340px] shrink-0 flex items-center justify-center">
          <div className="relative w-[280px] h-[360px]">
            {/* Phone shape */}
            <div className="absolute inset-0 rounded-[36px] border-2 border-white/10 bg-white/[0.03] backdrop-blur-sm" />
            {/* Sound waves */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-[38%] -translate-x-1/2 rounded-full border border-[#9b82fd]"
                style={{
                  width: `${80 + i * 50}px`,
                  height: `${80 + i * 50}px`,
                  opacity: 0.4 - i * 0.08,
                  animation: `pulse ${2 + i * 0.3}s ease-in-out infinite`,
                }}
              />
            ))}
            {/* Mic icon center */}
            <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#7c5cfc]/20 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9b82fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            {/* Label */}
            <div className="absolute bottom-10 left-0 right-0 text-center text-sm text-slate-500">
              tap &amp; speak
            </div>
          </div>
        </div>

        {/* Right — tips */}
        <div className="flex flex-col gap-5 flex-1">
          {tips.map((t) => (
            <div key={t.title} className="flex items-start gap-4">
              <span className="text-2xl mt-0.5">{t.icon}</span>
              <div>
                <div className="text-[20px] font-bold text-white">{t.title}</div>
                <p className="text-[15px] text-slate-400 mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
