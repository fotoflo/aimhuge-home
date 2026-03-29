import { SlideShell } from "@/app/decks/components/SlideShell";
import Image from "next/image";

export function PromptsWritePromptsSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Section 3 — Interacting with AI"
      title="Prompts That Write Prompts"
      subtitle="You don't need to be a prompt engineer. Just ask AI to write the prompt for you."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} className="invert" />}
    >
      <div className="flex gap-8 mt-4 flex-1 items-center">
        {/* Left — the inception visual */}
        <div className="flex-1 flex flex-col items-center">
          {/* Nested prompt windows */}
          <div className="relative w-full max-w-[480px]">
            {/* Outer prompt */}
            <div className="bg-white border-2 border-[#7c5cfc]/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#7c5cfc]" />
                <span className="text-[12px] font-mono text-slate-400">You say:</span>
              </div>
              <p className="text-[16px] text-slate-700 italic">
                &ldquo;Write me a prompt that will help me analyze my weekly sales data&rdquo;
              </p>

              {/* Middle prompt */}
              <div className="mt-5 bg-slate-50 border border-[#7c5cfc]/20 rounded-xl p-5 ml-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#9b82fd]" />
                  <span className="text-[12px] font-mono text-slate-400">Claude generates:</span>
                </div>
                <p className="text-[14px] text-slate-600 font-mono leading-relaxed">
                  &ldquo;You are a sales analyst for PriyoShop. Each week I will paste a CSV of regional sales.
                  Compare to the previous week. Flag any region that dropped more than 10%...&rdquo;
                </p>

                {/* Inner prompt */}
                <div className="mt-4 bg-[#7c5cfc]/[0.06] border border-[#7c5cfc]/15 rounded-lg p-4 ml-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#7c5cfc]/50" />
                    <span className="text-[11px] font-mono text-slate-400">Use it every week →</span>
                  </div>
                  <p className="text-[13px] text-[#7c5cfc] font-semibold">
                    Consistent, high-quality output every time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — key takeaways */}
        <div className="w-[300px] shrink-0 flex flex-col gap-5">
          <div className="bg-white border border-slate-200 rounded-[14px] p-5 border-t-[3px] border-t-violet-500">
            <h3 className="text-[18px] font-bold text-slate-900 mb-1">Meta-prompting</h3>
            <p className="text-[14px] text-slate-600">&ldquo;Write me a prompt for...&rdquo; is the most underused technique in AI.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-[14px] p-5 border-t-[3px] border-t-blue-500">
            <h3 className="text-[18px] font-bold text-slate-900 mb-1">Save &amp; reuse</h3>
            <p className="text-[14px] text-slate-600">Once the prompt works, save it. Use it every week. This is how you build a personal AI toolkit.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-[14px] p-5 border-t-[3px] border-t-emerald-600">
            <h3 className="text-[18px] font-bold text-slate-900 mb-1">Iterate</h3>
            <p className="text-[14px] text-slate-600">&ldquo;That prompt is good but also add a section for...&rdquo; — refine until it&apos;s perfect.</p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
