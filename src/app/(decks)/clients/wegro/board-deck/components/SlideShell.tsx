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
          <div className="absolute top-5 left-7">
            <Image
              src={isDark ? "/images/wegro/logo-white.png" : "/images/wegro/logo-color.png"}
              alt="WeGro"
              width={60}
              height={20}
              className={isDark ? "" : ""}
            />
          </div>
          <div
            className={`absolute top-[22px] right-7 text-[10px] font-semibold uppercase tracking-[1.5px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            Confidential
          </div>
        </>
      )}

      {sectionLabel && (
        <div
          className={`text-[13px] font-bold uppercase tracking-[2px] mb-1.5 ${isDark ? "text-[#FF8F1C]" : "text-[#015546]"}`}
        >
          {sectionLabel}
        </div>
      )}

      {title && (
        <h2
          className={`text-[46px] font-extrabold tracking-tight mb-1 leading-tight ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          className={`text-lg font-normal leading-relaxed mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
