"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyCurlButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 bg-card-bg/50 hover:bg-card-bg border border-card-border text-muted hover:text-foreground rounded-lg transition-colors flex items-center justify-center group z-20"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
      <span className="absolute right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono bg-card-bg border border-card-border px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}
