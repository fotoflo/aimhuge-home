export function Stat({
  value,
  label,
  dark,
}: {
  value: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div
        className={`text-[46px] font-black tracking-tight ${dark ? "text-[#FF8F1C]" : "text-[#015546]"}`}
      >
        {value}
      </div>
      <div
        className={`text-[14px] font-medium mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}
      >
        {label}
      </div>
    </div>
  );
}

export function MetricRow({
  label,
  value,
  dark,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex justify-between py-2.5 ${dark ? "border-b border-white/[0.06]" : "border-b border-slate-100"} last:border-b-0`}
    >
      <span className={`text-[15px] font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
        {label}
      </span>
      <span className={`text-[15px] font-bold ${dark ? "text-white" : "text-slate-900"}`}>
        {value}
      </span>
    </div>
  );
}
