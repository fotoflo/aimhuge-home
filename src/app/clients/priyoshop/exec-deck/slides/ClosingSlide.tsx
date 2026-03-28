import Image from "next/image";

export function ClosingSlide() {
  return (
    <div className="slide slide-close">
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/images/logo-white.png"
          alt="AimHuge"
          width={140}
          height={38}
          className="mb-8"
        />
        <h2 className="text-[56px] font-black text-white tracking-tight leading-none mb-4">
          Thank You.
        </h2>
        <div className="text-[20px] font-light text-slate-400 max-w-[500px] leading-relaxed">
          Let&apos;s build something extraordinary together.
        </div>
        <div className="mt-12 flex flex-col items-center gap-2 text-sm text-slate-500">
          <span>Alex Miller &mdash; fotoflo@gmail.com</span>
          <span>calendly.com/fotoflo/30min</span>
        </div>
      </div>
    </div>
  );
}
