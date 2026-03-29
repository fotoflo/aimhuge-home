import Image from "next/image";

const prompts = [
  "What did you learn in the last 2 days?",
  "What surprised you?",
  "What confused you?",
];

export function SilentMeetingSlide() {
  return (
    <div className="slide" style={{ background: "none" }}>
      <Image
        src="/images/hallwaybg.jpg"
        alt=""
        fill
        className="object-cover z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Logo — bottom left */}
      <div className="absolute bottom-6 left-7 z-10">
        <Image src="/images/logo-white.png" alt="AimHuge" width={150} height={50} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div
          className="text-[13px] font-bold uppercase tracking-[2px] mb-1.5"
          style={{ color: "var(--deck-secondary)" }}
        >
          Section 1
        </div>

        <h2 className="text-[46px] font-extrabold tracking-tight mb-1 leading-tight text-white">
          Silent Meeting
        </h2>

        <p className="text-lg font-normal leading-relaxed mb-6 text-slate-300">
          Everyone writes simultaneously in a shared doc — then we read and discuss.
        </p>

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
      </div>
    </div>
  );
}
