import type { CardAccent } from "../lib/types";

interface CardProps {
  accent?: CardAccent;
  small?: boolean;
  dark?: boolean;
  className?: string;
  children: React.ReactNode;
}

const accentBorder: Record<CardAccent, string> = {
  green: "border-t-[3px] border-t-emerald-600",
  blue: "border-t-[3px] border-t-blue-500",
  amber: "border-t-[3px] border-t-amber-500",
  purple: "border-t-[3px] border-t-violet-500",
  red: "border-t-[3px] border-t-red-500",
};

export function Card({ accent, small, dark, className = "", children }: CardProps) {
  const base = dark
    ? "bg-white/[0.04] border border-white/[0.08] rounded-[14px] flex flex-col"
    : "bg-white border border-slate-200 rounded-[14px] flex flex-col";

  const padding = small ? "p-[18px]" : "p-6";
  const accentClass = accent ? accentBorder[accent] : "";

  return (
    <div className={`${base} ${padding} ${accentClass} ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h3 className={`text-[20px] font-bold mb-2 ${dark ? "text-white" : "text-slate-900"}`}>
      {children}
    </h3>
  );
}

export function CardText({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`text-[15px] leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>
      {children}
    </p>
  );
}

export function CardList({ items, dark }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="list-none p-0">
      {items.map((item, i) => (
        <li
          key={i}
          className={`py-[3px] pl-3.5 relative text-[15px] leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"} before:content-[''] before:absolute before:left-0 before:top-[11px] before:w-[5px] before:h-[5px] before:rounded-full ${dark ? "before:bg-[var(--deck-secondary)]" : "before:bg-[var(--deck-primary)]"}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
