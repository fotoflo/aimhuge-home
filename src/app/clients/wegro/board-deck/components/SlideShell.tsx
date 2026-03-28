import Image from "next/image";

interface SlideShellProps {
  variant: "dark" | "light" | "hero" | "close";
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SlideShell({
  variant,
  sectionLabel,
  title,
  subtitle,
  children,
}: SlideShellProps) {
  const slideClass =
    variant === "hero"
      ? "slide slide-hero"
      : variant === "close"
        ? "slide slide-close"
        : variant === "dark"
          ? "slide slide-dark"
          : "slide slide-light";

  const showChrome = variant !== "hero" && variant !== "close";
  const isDark = variant === "dark";

  return (
    <div className={slideClass}>
      {showChrome && (
        <>
          <div className="absolute top-6 left-9">
            <Image
              src="/images/wegro/logo-white.png"
              alt="WeGro"
              width={60}
              height={20}
              className={isDark ? "brightness-150" : "brightness-0"}
            />
          </div>
          <div
            className={`absolute top-[26px] right-9 text-[10px] font-semibold uppercase tracking-[1.5px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            Confidential
          </div>
        </>
      )}

      {sectionLabel && (
        <div
          className={`text-[11px] font-bold uppercase tracking-[2px] mb-1.5 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
        >
          {sectionLabel}
        </div>
      )}

      {title && (
        <h2
          className={`text-[34px] font-extrabold tracking-tight mb-1 leading-tight ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          className={`text-[15px] font-normal leading-relaxed mb-8 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
