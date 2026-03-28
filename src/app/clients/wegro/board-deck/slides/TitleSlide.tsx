import Image from "next/image";

export function TitleSlide() {
  return (
    <div className="slide slide-hero">
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/images/wegro/logo-white.png"
          alt="WeGro"
          width={180}
          height={48}
          className="mb-6"
        />
        <div className="text-sm font-semibold text-[#FF8F1C] uppercase tracking-[3px] mb-5">
          Board of Directors &mdash; March 2026
        </div>
        <h1 className="text-[72px] font-black text-white tracking-tight leading-none">
          Agriculture Simplified.
        </h1>
        <div className="text-[22px] font-light text-[#e6f2ef] mt-5 max-w-[640px] leading-relaxed">
          Building the operating system for Bangladesh&apos;s agricultural economy &mdash; from seed to sale.
        </div>
        <div className="mt-14 text-sm text-slate-500">
          Business Model Overview &nbsp;&bull;&nbsp; Confidential
        </div>
      </div>
    </div>
  );
}
