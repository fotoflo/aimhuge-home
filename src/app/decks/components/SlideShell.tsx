import type { SlideVariant } from "../lib/types";

interface SlideShellProps {
  variant: SlideVariant;
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  /** Optional top-left element (e.g. logo) */
  logo?: React.ReactNode;
  /** Optional top-right element (e.g. "Confidential") */
  topRight?: React.ReactNode;
  children: React.ReactNode;
}

export function SlideShell({
  variant,
  sectionLabel,
  title,
  subtitle,
  logo,
  topRight,
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
          {logo && <div className="absolute top-5 left-7">{logo}</div>}
          {topRight && (
            <div
              className={`absolute top-[22px] right-7 text-[10px] font-semibold uppercase tracking-[1.5px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              {topRight}
            </div>
          )}
        </>
      )}

      {sectionLabel && (
        <div
          className="text-[13px] font-bold uppercase tracking-[2px] mb-1.5"
          style={{ color: isDark ? "var(--deck-secondary)" : "var(--deck-primary)" }}
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
