import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

const contextTypes = [
  { label: "Who you are", desc: "Role, department, responsibilities" },
  { label: "What you're working on", desc: "The specific task, the data, the situation" },
  { label: "Who it's for", desc: "Your boss, a partner, a customer" },
  { label: "What good looks like", desc: "Format, tone, length, examples" },
];

export function ContextSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 3A"
      title="Context"
      subtitle="The most important concept. Claude doesn't know you, your company, or your job — unless you tell it."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
      topRight="~1 hour"
    >
      <div className="mt-6 flex flex-col gap-0">
        {contextTypes.map((c, i) => (
          <div key={i} className="flex items-start gap-5 py-4 border-b border-white/[0.06] last:border-b-0">
            <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <span className="text-[20px] font-bold text-white">{c.label}</span>
              <p className="text-[15px] text-slate-400 mt-0.5">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/[0.06]">
        <p className="text-[15px] text-slate-500 italic">
          Exercise: Everyone writes a &ldquo;context paragraph&rdquo; about their role at PriyoShop and saves it as a reusable prompt.
        </p>
      </div>
    </SlideShell>
  );
}
