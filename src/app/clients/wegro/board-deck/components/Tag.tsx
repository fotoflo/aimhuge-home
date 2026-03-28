const tagColors = {
  green: "bg-[#e6f2ef] text-[#015546]",
  blue: "bg-blue-100 text-blue-800",
  amber: "bg-[#FFF3E6] text-[#92400e]",
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
      className={`inline-block px-3 py-[3px] rounded-full text-[12px] font-semibold mr-1 mb-1 ${tagColors[color]}`}
    >
      {children}
    </span>
  );
}
