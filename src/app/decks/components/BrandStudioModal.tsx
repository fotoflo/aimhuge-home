"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Sparkles, Upload, Plus } from "lucide-react";

const STATUS_MESSAGES = [
  "Spinning up scraper payload...",
  "Crawling top-level navigation...",
  "Extracting source code hex profiles...",
  "Harvesting marketing media gallery...",
  "Feeding raw DOM to Gemini 3 Flash...",
  "Synthesizing corporate identity rules..."
];

interface BrandStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (brandSlug: string) => void;
  initialSlug?: string;
}

export default function BrandStudioModal({ isOpen, onClose, onSaved, initialSlug }: BrandStudioModalProps) {
  const [url, setUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [saving, setSaving] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [guidelines, setGuidelines] = useState("");
  const [colors, setColors] = useState<Record<string, string>>({
    "Primary": "#7c5cfc",
    "Secondary": "#ffffff",
    "Base Dark": "#161622",
    "Base Light": "#f8f9fa"
  });
  const [logoUrl, setLogoUrl] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  const [statusIndex, setStatusIndex] = useState(0);

  // Rotate status message every 1.8s
  useEffect(() => {
    if (!scraping) {
      setStatusIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev < STATUS_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [scraping]);

  if (!isOpen) return null;

  const handleScrape = async () => {
    if (!url) return alert("Please enter a website URL first.");
    setScraping(true);
    try {
      const res = await fetch("/api/brands/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setName(data.brand.name || "");
      setGuidelines(data.brand.guidelines || "");
      if (data.brand.colors && typeof data.brand.colors === 'object' && Object.keys(data.brand.colors).length > 0) {
        setColors(data.brand.colors);
      }
      if (data.brand.logos?.dark) {
        setLogoUrl(data.brand.logos.dark);
      }
      if (data.brand.images) {
        setGallery(data.brand.images);
      }
      setUnlocked(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setScraping(false);
    }
  };

  const handleSave = async () => {
    if (!name) return alert("Name is required.");
    setSaving(true);
    try {
      const generatedSlug = initialSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        slug: generatedSlug,
        name,
        website_url: url,
        guidelines,
        colors,
        logos: { dark: logoUrl, light: logoUrl, icon: logoUrl },
        images: gallery
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
        
        <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar p-6 gap-8 relative z-0">
          
          {/* Section 1: Auto Fill */}
          <div className="p-5 rounded-xl border border-accent/20 bg-accent/5">
            <h3 className="text-sm font-semibold text-accent mb-4">Magic Auto-Scrape</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <input 
                  type="url" 
                  value={url} 
                  onChange={e => setUrl(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !scraping) {
                      e.preventDefault();
                      handleScrape();
                    }
                  }}
                  placeholder="Enter Website URL (e.g. https://acme.com) to instantly configure brand..." 
                  className="w-full bg-[#161622] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent" 
                />
              </div>
              <button disabled={scraping} onClick={handleScrape} className="px-6 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition flex items-center gap-2 shrink-0">
                {scraping ? <><Loader2 className="w-4 h-4 animate-spin" /> Crawling...</> : <><Sparkles className="w-4 h-4" /> Autofill Brand</>}
              </button>
            </div>
            
            <div className="h-6 mt-3">
              {scraping ? (
                <div className="flex items-center gap-2 text-xs text-accent animate-in fade-in slide-in-from-top-1 duration-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span className="font-mono tracking-tight">{STATUS_MESSAGES[statusIndex]}</span>
                </div>
              ) : !unlocked ? (
                <button type="button" onClick={() => setUnlocked(true)} className="text-xs text-slate-500 hover:text-white underline decoration-white/20 underline-offset-4 transition-colors">
                  Or skip and configure brand manually
                </button>
              ) : null}
            </div>
          </div>

          {/* Section 2: Manual Tuning */}
          <div className={`grid grid-cols-[1fr_300px] gap-8 transition-all duration-700 ${unlocked ? "opacity-100" : "opacity-30 blur-[2px] pointer-events-none select-none grayscale"}`}>
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
                  {Object.entries(colors).map(([key, hex]) => (
                    <label key={key} className="flex flex-col gap-1 cursor-pointer group relative">
                      <div className="flex justify-between items-center pr-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest pl-1 overflow-hidden text-ellipsis whitespace-nowrap" title={key}>{key}</span>
                        {Object.keys(colors).length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const newColors = { ...colors };
                              delete newColors[key];
                              setColors(newColors);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="flex border border-white/10 rounded-lg overflow-hidden h-10 group-hover:border-accent/50 transition">
                        <input type="color" value={hex} onChange={e => {
                          setColors(prev => ({ ...prev, [key]: e.target.value }));
                        }} className="w-10 h-12 -ml-2 -mt-2 p-0 border-0 shrink-0" />
                        <div className="flex items-center px-3 bg-[#161622] flex-1 text-xs text-slate-400 capitalize">{hex}</div>
                      </div>
                    </label>
                  ))}
                  
                  {/* Add Color Button */}
                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => {
                        const newColor = prompt("Enter a name for the new color (e.g. 'Tertiary Accent'):");
                        if (newColor && !colors[newColor]) {
                          setColors(prev => ({ ...prev, [newColor]: "#ffffff" }));
                        }
                      }}
                      className="border border-dashed border-white/20 rounded-lg h-10 w-full group hover:border-accent/50 hover:bg-white/5 transition flex items-center justify-center text-[10px] text-slate-400 group-hover:text-accent uppercase font-medium tracking-widest"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Color
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-slate-300 block mb-3">Brand Logos</span>
                {logoUrl ? (
                  <div className="border border-white/10 rounded-xl overflow-hidden bg-[#161622] h-28 flex items-center justify-center relative group p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                    <button type="button" onClick={() => setLogoUrl("")} className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black rounded-lg text-white opacity-0 group-hover:opacity-100 transition"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div className="border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 bg-[#161622]/50 hover:bg-[#161622] transition group cursor-pointer h-28">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-accent" />
                    </div>
                    <div className="hidden">
                      <p className="text-sm text-slate-300">Upload primary logo</p>
                      <p className="text-[10px] text-slate-500 mt-1">SVG, PNG, or WEBP (Max 2MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Extracted Gallery */}
          {unlocked && gallery.length > 0 && (
            <div className="border-t border-white/5 pt-8 animate-in fade-in duration-500">
              <span className="text-sm font-medium text-slate-300 block mb-3">Extracted Asset Gallery ({gallery.length})</span>
              <div className="flex flex-wrap gap-3">
                {gallery.map((src, i) => (
                  <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-[#161622]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Extracted brand asset" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="flex flex-shrink-0 justify-end gap-3 p-6 border-t border-white/5 bg-[#12121a]">
          <button type="button" disabled={saving || scraping} onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving || scraping || !unlocked} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-white transition-colors flex items-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving Rules...</> : "Lock Brand Identity"}
          </button>
        </div>
      </div>
    </div>
  );
}
