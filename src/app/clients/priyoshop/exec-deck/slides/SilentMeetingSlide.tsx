import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const prompts = [
  "What did you learn in the last 2 days?",
  "What surprised you?",
  "What confused you?",
];

export function SilentMeetingSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 1"
      title="Silent Meeting"
      subtitle="Everyone writes simultaneously in a shared doc — then we read and discuss."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
      topRight="~20 min"
    >
      <div className="flex flex-col gap-6 mt-8 max-w-2xl">
        {prompts.map((p, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#7c5cfc]/15 flex items-center justify-center shrink-0">
              <span className="text-[#9b82fd] font-bold text-lg">{i + 1}</span>
            </div>
            <p className="text-[28px] font-light text-white leading-snug">{p}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
