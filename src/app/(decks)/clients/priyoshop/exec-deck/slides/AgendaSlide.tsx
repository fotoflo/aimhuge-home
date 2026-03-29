"use client";

import { SlideShell } from "@/app/decks/components/SlideShell";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

const DECK_URL = "https://aimhuge.com/clients/priyoshop/exec-deck";

const sections = [
  { num: "01", time: "~20 min", title: "Silent Meeting", desc: "Reflect on what you learned, what surprised you, what confused you" },
  { num: "02", time: "~20 min", title: "What is AI?", desc: "Language models, frontier models, and why this matters now" },
  { num: "03", time: "~45 min", title: "Interacting with AI", desc: "Voice, screenshots, pasting documents, prompts that write prompts, pushing back" },
  { num: "04", time: "~20 min", title: "Artifacts & Context", desc: "What AI can create for you, and how to give it the right context" },
  { num: "—", time: "", title: "Break", desc: "" },
  { num: "05", time: "~15 min", title: "Setup & Skills", desc: "Connect Google Drive & Calendar, learn to save reusable skills" },
  { num: "06", time: "~1 hour", title: "Hands-On Exercises", desc: "Writing, spreadsheets, documents, data, email, interviewing, presentations" },
  { num: "07", time: "~20 min", title: "Claude Code Demo", desc: "See what happens when AI can actually write and run code" },
];

function PhoneMockup() {
  return (
    <div className="relative w-[280px] h-[580px]">
      {/* Phone body */}
      <div className="absolute inset-0 rounded-[40px] border-[3px] border-white/20 bg-gradient-to-b from-[#111114] to-[#0c0c0e] shadow-2xl shadow-black/50 overflow-hidden">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-20" />

        {/* Screen content */}
        <div className="absolute inset-[3px] top-[44px] bottom-[20px] rounded-b-[36px] overflow-hidden px-4 py-3">
          {/* Mini header */}
          <div className="flex items-center gap-2 mb-4">
            <Image src="/images/logo-white.png" alt="" width={36} height={12} />
            <span className="text-[7px] text-slate-500 uppercase tracking-wider">Day 2</span>
          </div>
          <div className="text-[11px] font-extrabold text-white mb-3 tracking-tight">
            Today&apos;s Agenda
          </div>

          {/* Mini agenda items */}
          <div className="flex flex-col gap-[6px]">
            {sections.map((s) => (
              <div key={s.num} className="flex items-start gap-2">
                <span className="text-[#9b82fd] font-mono text-[7px] font-bold mt-[2px] shrink-0 w-3">{s.num}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[8px] font-bold text-white truncate">{s.title}</span>
                    <span className="text-[6px] text-slate-500 shrink-0">{s.time}</span>
                  </div>
                  {s.desc && (
                    <p className="text-[6px] text-slate-500 mt-[1px] leading-tight truncate">{s.desc}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/20 rounded-full" />
      </div>
    </div>
  );
}

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
      <div className="flex gap-8 mt-4 flex-1">
        {/* Left — full agenda list */}
        <div className="flex flex-col gap-4 flex-1">
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

        {/* Right — phone mockup + QR code */}
        <div className="shrink-0 flex items-center gap-8">
          <PhoneMockup />

          <div className="flex flex-col items-center gap-4">
            <div className="bg-white rounded-2xl p-4">
              <QRCodeSVG
                value={DECK_URL}
                size={140}
                level="M"
                fgColor="#08080a"
                bgColor="#ffffff"
              />
            </div>
            <div className="text-center">
              <p className="text-[13px] text-slate-400">Follow along</p>
              <p className="text-[13px] text-slate-400">on your phone</p>
              <p className="text-[10px] text-slate-600 font-mono mt-2">aimhuge.com/.../exec-deck</p>
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
