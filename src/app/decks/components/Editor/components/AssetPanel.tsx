"use client";

import { X } from "lucide-react";

interface AssetPanelProps {
  assets: { name: string; url: string }[];
  onCopyUrl: (url: string) => void;
  onClose: () => void;
}

export function AssetPanel({ assets, onCopyUrl, onClose }: AssetPanelProps) {
  return (
    <div className="w-56 border-l border-white/10 bg-[#0a0a0e] overflow-y-auto shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-xs font-semibold text-slate-400">Assets</span>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-2 grid grid-cols-2 gap-2">
        {assets.map((a) => (
          <button
            key={a.url}
            onClick={() => onCopyUrl(a.url)}
            className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-[#7c5cfc]/50 transition-colors"
            title={`Click to copy URL: ${a.name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
          </button>
        ))}
        {assets.length === 0 && (
          <div className="col-span-2 text-xs text-slate-500 text-center py-8">
            No assets yet.<br />Paste or drag to upload.
          </div>
        )}
      </div>
    </div>
  );
}
