export type Division = "inputs" | "financing" | "trading" | "data";

export interface Initiative {
  id: string;
  name: string;
  division: Division;
  scores: {
    impact: number;
    lowEffort: number;
    lowCost: number;
    speed: number;
    alignment: number;
  };
}

export function totalScore(i: Initiative): number {
  const s = i.scores;
  return s.impact + s.lowEffort + s.lowCost + s.speed + s.alignment;
}

export function tierForScore(score: number): 1 | 2 | 3 {
  if (score >= 20) return 1;
  if (score >= 16) return 2;
  return 3;
}

export function barClass(score: number): string {
  if (score >= 20) return "bg-emerald-500";
  if (score >= 16) return "bg-amber-500";
  return "bg-red-500";
}

export function tierBadgeClass(tier: 1 | 2 | 3): string {
  if (tier === 1) return "bg-emerald-100 text-emerald-800";
  if (tier === 2) return "bg-amber-100 text-amber-800";
  return "bg-slate-200 text-slate-600";
}

export function divisionColor(div: Division) {
  const map = {
    inputs: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-500" },
    financing: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-500" },
    trading: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-500" },
    data: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-500" },
  };
  return map[div];
}
