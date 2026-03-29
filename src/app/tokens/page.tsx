"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { LogIn, Zap, Database, ArrowRight, LayoutList, Layers, ChevronLeft } from "lucide-react";

type StatData = {
  totalCostUsd: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  costPerDeck: { deckSlug: string; cost: number }[];
  recentLogs: {
    id: string;
    deck_slug: string;
    slide_id: string;
    endpoint: string;
    model: string;
    total_tokens: number;
    estimated_cost_usd: string;
    created_at: string;
  }[];
};

export default function TokensDashboard() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [stats, setStats] = useState<StatData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      fetch("/api/tokens/stats")
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) setStats(data);
        })
        .finally(() => setLoadingStats(false));
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#7c5cfc]/30 border-t-[#7c5cfc] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center font-mono">
        <div className="max-w-md w-full p-8 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7c5cfc]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="w-12 h-12 rounded-xl bg-[#7c5cfc]/10 border border-[#7c5cfc]/30 flex items-center justify-center">
              <Database className="w-6 h-6 text-[#7c5cfc]" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Telemetry</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect your account to access the AI generation telemetry and token usage dashboard.
              </p>
            </div>

            <button
              onClick={() => signInWithGoogle(window.location.pathname)}
              className="flex items-center justify-between w-full px-5 py-4 bg-white hover:bg-slate-100 text-black rounded-lg font-bold transition-all active:scale-[0.98]"
            >
              <span className="flex items-center gap-3">
                <LogIn className="w-5 h-5" />
                Authenticate via Google
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 selection:bg-[#7c5cfc]/30 font-sans antialiased overflow-x-hidden">
      {/* Brutalist ambient background mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#7c5cfc]/20 to-[#050508] blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[#12121a] to-transparent blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-2">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#7c5cfc] hover:text-[#9b82fd] font-mono text-xs uppercase tracking-widest mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Go back
            </Link>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase font-mono">
              Token <span className="text-[#7c5cfc]">Terminal</span>
            </h1>
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest mt-2">
              System Telemetry & Billing Reconnaissance
            </p>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 rounded-full border border-emerald-500 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="font-mono text-xs text-slate-300 uppercase tracking-widest">System Online</span>
          </div>
        </header>

        {loadingStats ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 rounded-sm border-[3px] border-[#7c5cfc]/20 border-t-[#7c5cfc] animate-spin" />
            <span className="font-mono text-xs text-[#7c5cfc] uppercase tracking-widest animate-pulse">Syncing Database...</span>
          </div>
        ) : !stats ? (
          <div className="py-20 text-center font-mono text-red-400 border border-red-500/20 bg-red-500/5 rounded-xl">
            Critical error retrieving telemetry packets.
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* KPI OVERVIEW - BRUTALIST GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0b0b12] border border-white/10 p-6 rounded-2xl flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 ease-out">
                  <Zap className="w-24 h-24" />
                </div>
                <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">Aggregate Cost</h3>
                <div className="flex items-baseline gap-1 relative z-10">
                  <span className="text-3xl font-bold text-slate-400">$</span>
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {stats.totalCostUsd.toFixed(3)}
                  </span>
                </div>
              </div>

              <div className="bg-[#0b0b12] border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">Total Tokens</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white tracking-tighter font-mono">
                    {stats.totalTokens.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-[#0b0b12] border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">Prompt Tokens</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-300 tracking-tighter font-mono">
                    {stats.totalPromptTokens.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-[#0b0b12] border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">Completion Tokens</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#7c5cfc] tracking-tighter font-mono">
                    {stats.totalCompletionTokens.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* DECK BILLING RANKING */}
              <div className="lg:col-span-1 border border-white/10 rounded-2xl bg-[#0b0b12] overflow-hidden flex flex-col">
                <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <h2 className="font-mono text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#7c5cfc]" /> Distribution by Project
                  </h2>
                </div>
                <div className="p-2 flex-1 overflow-y-auto max-h-[500px]">
                  {stats.costPerDeck.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-mono text-sm">No project data logged.</div>
                  ) : (
                    <ul className="space-y-1">
                      {stats.costPerDeck.map((d, i) => (
                        <li key={d.deckSlug} className="flex flex-col gap-2 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono text-slate-600 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                #{i + 1}
                              </span>
                              <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{d.deckSlug}</span>
                            </div>
                            <span className="font-mono text-emerald-400 font-bold text-sm">${d.cost.toFixed(4)}</span>
                          </div>
                          <div className="w-full bg-[#161622] h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-[#7c5cfc] to-[#4facfe] h-full rounded-full" 
                              style={{ width: `${Math.max(2, (d.cost / stats.totalCostUsd) * 100)}%` }} 
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* RECENT EVENT LOGS */}
              <div className="lg:col-span-2 border border-white/10 rounded-2xl bg-[#0b0b12] overflow-hidden flex flex-col">
                <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <h2 className="font-mono text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <LayoutList className="w-4 h-4 text-[#7c5cfc]" /> Terminal Stream
                  </h2>
                  <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-white">LATEST {stats.recentLogs.length} LOGS</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/40">
                        <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-slate-500">Timestamp</th>
                        <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-slate-500">Operation</th>
                        <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-slate-500">Target</th>
                        <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-slate-500 text-right">Tokens</th>
                        <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-slate-500 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-xs">
                      {stats.recentLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-12 text-center text-slate-500">No logs intercepted.</td>
                        </tr>
                      ) : (
                        stats.recentLogs.map((log) => {
                          const date = new Date(log.created_at);
                          return (
                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                                {date.toLocaleDateString()} <span className="text-slate-600">{date.toLocaleTimeString()}</span>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded border ${
                                  log.endpoint === 'suggestions' 
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                    : 'bg-[#7c5cfc]/10 border-[#7c5cfc]/20 text-[#7c5cfc]'
                                }`}>
                                  {log.endpoint}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-slate-300 font-sans font-medium">{log.deck_slug || "—"}</span>
                                  {log.slide_id && <span className="text-[9px] text-slate-600 truncate max-w-[120px]" title={log.slide_id}>{log.slide_id}</span>}
                                </div>
                              </td>
                              <td className="px-5 py-4 text-right text-slate-300 gap-1 justify-end flex items-center">
                                {log.total_tokens ? log.total_tokens.toLocaleString() : "—"}
                              </td>
                              <td className="px-5 py-4 text-right align-middle">
                                <span className="text-emerald-400">
                                  ${Number(log.estimated_cost_usd).toFixed(5)}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
