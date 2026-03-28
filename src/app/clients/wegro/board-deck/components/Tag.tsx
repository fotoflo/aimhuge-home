const tagColors = {
  green: "bg-emerald-100 text-emerald-800",
  blue: "bg-blue-100 text-blue-800",
  amber: "bg-amber-100 text-amber-800",
  slate: "bg-slate-200 text-slate-700",
  purple: "bg-purple-100 text-purple-800",
  red: "bg-red-100 text-red-800",
};

export function Tag({
  color,
  children,
}: {
  color: keyof typeof tagColors;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold mr-1 mb-1 ${tagColors[color]}`}
    >
      {children}
    </span>
  );
}
