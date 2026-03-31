"use client";

import { useState } from "react";
import { X, Loader2, Sparkles, Upload } from "lucide-react";

interface BrandStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (brandSlug: string) => void;
  initialSlug?: string;
}

export default function BrandStudioModal({ isOpen, onClose, onSaved, initialSlug }: BrandStudioModalProps) {
  const [slug, setSlug] = useState(initialSlug || "");
  const [url, setUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [guidelines, setGuidelines] = useState("");
  const [primary, setPrimary] = useState("#7c5cfc");
  const [bgDark, setBgDark] = useState("#161622");

  if (!isOpen) return null;

  const handleScrape = async () => {
    if (!url || !slug) return alert("Please enter a slug and a website URL first.");
    setScraping(true);
    try {
      const res = await fetch("/api/brands/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setName(data.brand.name || "");
      setGuidelines(data.brand.guidelines || "");
      if (data.brand.colors) {
        setPrimary(data.brand.colors.primary || "#7c5cfc");
        setBgDark(data.brand.colors.bgDark || "#161622");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setScraping(false);
    }
  };

  const handleSave = async () => {
    if (!slug || !name) return alert("Slug and Name are required.");
    setSaving(true);
    try {
      const payload = {
        slug,
        name,
        website_url: url,
        guidelines,
        colors: { primary, secondary: "#ffffff", bgDark, bgLight: "#f8f9fa" }
      };

      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onSaved(data.brand.slug);
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f0f13] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#12121a]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg border border-accent/30 text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Brand Studio</h2>
              <p className="text-xs text-slate-400 mt-0.5">Automated Client Identity Engine</p>
            </div>
          </div>
          <button disabled={scraping || saving} onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col flex-1 overflow-auto p-6 gap-8">
          
          {/* Section 1: Auto Fill */}
          <div className="p-5 rounded-xl border border-accent/20 bg-accent/5">
            <h3 className="text-sm font-semibold text-accent mb-4">Magic Auto-Scrape</h3>
            <div className="flex gap-4">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <input required type="text" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="Client Slug (e.g. acme-corp)" className="w-full bg-[#161622] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-accent" />
                <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="Website URL (e.g. https://acme.com)" className="w-full bg-[#161622] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-accent" />
              </div>
              <button disabled={scraping} onClick={handleScrape} className="px-6 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition flex items-center gap-2 shrink-0">
                {scraping ? <><Loader2 className="w-4 h-4 animate-spin" /> Crawling...</> : <><Sparkles className="w-4 h-4" /> Autofill Brand</>}
              </button>
            </div>
          </div>

          {/* Section 2: Manual Tuning */}
          <div className="grid grid-cols-[1fr_300px] gap-8">
            <div className="flex flex-col gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-300">Brand Name</span>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Acme Corporation" className="bg-[#161622] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-accent" />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-300">Design & Layout Guidelines</span>
                <span className="text-xs text-slate-500 mb-1">These instructions are sent directly to the AI Copilot to govern aesthetic decisions.</span>
                <textarea value={guidelines} onChange={e => setGuidelines(e.target.value)} rows={5} placeholder="e.g. Clean and sterile medical UI. Never use red. Use lots of white space and small crisp fonts." className="bg-[#161622] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent resize-none shadow-inner text-sm" />
              </label>
            </div>

            <div className="flex flex-col gap-6 border-l border-white/5 pl-8">
              <div>
                <span className="text-sm font-medium text-slate-300 block mb-3">Core Aesthetics</span>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex cursor-pointer border border-white/10 rounded-lg overflow-hidden h-12 hover:border-accent/50 transition">
                    <input type="color" value={primary} onChange={e => setPrimary(e.target.value)} className="w-12 h-14 -ml-2 -mt-2 p-0 border-0" />
                    <div className="flex items-center px-3 bg-[#161622] flex-1 text-xs text-slate-400 uppercase">{primary}</div>
                  </label>
                  <label className="flex cursor-pointer border border-white/10 rounded-lg overflow-hidden h-12 hover:border-accent/50 transition">
                    <input type="color" value={bgDark} onChange={e => setBgDark(e.target.value)} className="w-12 h-14 -ml-2 -mt-2 p-0 border-0" />
                    <div className="flex items-center px-3 bg-[#161622] flex-1 text-xs text-slate-400 uppercase">{bgDark}</div>
                  </label>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-slate-300 block mb-3">Brand Logos</span>
                <div className="border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 bg-[#161622]/50 hover:bg-[#161622] transition group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Upload primary logo</p>
                    <p className="text-[10px] text-slate-500 mt-1">SVG, PNG, or WEBP (Max 2MB)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-white/5 bg-[#12121a]">
          <button type="button" disabled={saving || scraping} onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving || scraping} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-slate-200 transition-colors flex items-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving Rules...</> : "Lock Brand Identity"}
          </button>
        </div>
      </div>
    </div>
  );
}
