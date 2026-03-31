"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Mic, Square, Trash2, Archive, ArchiveRestore, ArrowUp, ArrowDown } from "lucide-react";
import BrandStudioModal from "@/app/decks/components/BrandStudioModal";
import { useDictation } from "@/lib/hooks/useDictation";

const ALLOWED_EMAIL = "fotoflo@gmail.com";

// Known deck routes mapped by slug
const DECK_ROUTES: Record<string, { name: string; path: string; editPath?: string }> = {
  "priyoshop-exec": {
    name: "Priyoshop Executive Training",
    path: "/clients/priyoshop/exec-deck",
    editPath: "/clients/priyoshop/exec-deck/edit",
  },
  "wegro-board": {
    name: "WeGro Board Deck",
    path: "/clients/wegro/board-deck",
  },
};

interface DeckInfo {
  slug: string;
  title: string;
  description: string;
  targetAudience?: string;
  slideCount: number;
  archivedAt?: string | null;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [decks, setDecks] = useState<DeckInfo[]>([]);
  const [fetching, setFetching] = useState(true);

  // New Deck Modal State
  const [showModal, setShowModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [brands, setBrands] = useState<{ slug: string; name: string }[]>([]);
  const [form, setForm] = useState({ slug: "", title: "", description: "", audience: "", wallOfText: "", brand: "", slideCount: 10 });
  const [creating, setCreating] = useState(false);
  const [outline, setOutline] = useState<any[] | null>(null);
  const [generatingOutline, setGeneratingOutline] = useState(false);

  const { isRecording, toggleRecording, volume, interimTranscript } = useDictation({
    onResult: (text) => setForm(prev => ({ ...prev, wallOfText: prev.wallOfText + (prev.wallOfText ? " " : "") + text })),
    enableShortcut: showModal && !showBrandModal // only enable when main modal is active
  });

  // Load brands
  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/brands");
      const data = await res.json();
      if (data.brands) setBrands(data.brands);
    } catch {}
  };

  const handleOpenModal = () => {
    setForm({ slug: "", title: "", description: "", audience: "", wallOfText: "", brand: "", slideCount: 10 });
    setOutline(null);
    setShowModal(true);
    fetchBrands();
  };

  const email = user?.email ?? "";
  const isAllowed = email === ALLOWED_EMAIL;

  useEffect(() => {
    if (!isAllowed) return;
    refreshDecks();
  }, [isAllowed]);

  const refreshDecks = () => {
    setFetching(true);
    fetch("/api/decks")
      .then((r) => r.json())
      .then((data) => {
        const d = data.decks ?? [];
        d.sort((a: DeckInfo, b: DeckInfo) => {
          if (a.archivedAt && !b.archivedAt) return 1;
          if (!a.archivedAt && b.archivedAt) return -1;
          return 0;
        });
        setDecks(d);
      })
      .finally(() => setFetching(false));
  };

  const generateOutline = async () => {
    setGeneratingOutline(true);
    try {
      const res = await fetch("/api/decks/generate/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          context: form.wallOfText, 
          slideCount: form.slideCount, 
          brandSlug: form.brand 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutline(data.outline);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGeneratingOutline(false);
    }
  };

  const moveSlide = (index: number, direction: number) => {
    if (!outline) return;
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= outline.length) return;
    const newOutline = [...outline];
    const [moved] = newOutline.splice(index, 1);
    newOutline.splice(newIdx, 0, moved);
    setOutline(newOutline);
  };

  const editSlide = (index: number, field: string, value: string) => {
    if (!outline) return;
    const newOutline = [...outline];
    newOutline[index] = { ...newOutline[index], [field]: value };
    setOutline(newOutline);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.wallOfText && !outline) {
       await generateOutline();
       return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, wallOfText: outline ? "" : form.wallOfText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (outline) {
        await fetch("/api/decks/generate/from-outline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deckSlug: data.deckSlug, outline })
        });
      }

      router.push(`/decks/${data.deckSlug}/edit`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "An error occurred");
      setCreating(false);
    }
  };

  const handleArchive = async (slug: string, isArchived: boolean) => {
    if (!confirm(isArchived ? "Unarchive this deck?" : "Archive this deck?")) return;
    try {
      const res = await fetch(`/api/decks/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: !isArchived })
      });
      if (!res.ok) throw new Error("Failed to toggle archive");
      refreshDecks();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : String(e)); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you SURE you want to delete this deck? This action will hide it from the dashboard.")) return;
    try {
      const res = await fetch(`/api/decks/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete deck");
      refreshDecks();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : String(e)); }
  };

  if (loading) {
    return <div className="mx-auto max-w-6xl px-6 py-24 text-muted">Loading...</div>;
  }

  if (!user || !isAllowed) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted">You must be logged in as an authorized user to view this page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-24 relative">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <a
            href="/tokens"
            className="rounded-full border border-accent text-accent px-4 py-2 text-sm font-medium hover:bg-accent/10 transition-colors"
          >
            Token Terminal
          </a>
          <button 
            onClick={handleOpenModal}
            className="rounded-full bg-accent text-white px-5 py-2 text-sm font-medium hover:bg-accent-hover transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Deck
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">Presentations</h2>

      {fetching ? (
        <p className="text-muted">Loading decks...</p>
      ) : decks.length === 0 ? (
        <p className="text-muted">No decks found in the database.</p>
      ) : (
        <div className="grid gap-4">
          {decks.map((deck) => {
            const hasStaticRoute = DECK_ROUTES[deck.slug];
            const viewPath = hasStaticRoute ? hasStaticRoute.path : `/decks/${deck.slug}`;
            const editPath = hasStaticRoute && hasStaticRoute.editPath ? hasStaticRoute.editPath : `/decks/${deck.slug}/edit`;
            const displayTitle = deck.title === deck.slug && hasStaticRoute ? hasStaticRoute.name : deck.title;

            return (
              <div
                key={deck.slug}
                className={`rounded-xl border ${deck.archivedAt ? 'border-white/5 bg-white/[0.02] opacity-75' : 'border-card-border'} p-6 flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {displayTitle}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 mb-2">
                    Slug: <code className="text-accent bg-accent/10 px-1 py-0.5 rounded">{deck.slug}</code>
                    {" · "}
                    {deck.slideCount} slide{deck.slideCount !== 1 ? "s" : ""}
                  </p>
                  {deck.description && (
                    <p className="text-sm text-slate-500 line-clamp-1">{deck.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleArchive(deck.slug, !!deck.archivedAt)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title={deck.archivedAt ? "Unarchive" : "Archive"}
                  >
                    {deck.archivedAt ? <ArchiveRestore className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(deck.slug)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors mr-2"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <a
                    href={viewPath}
                    className="rounded-full border border-card-border px-4 py-2 text-sm hover:bg-white/5 transition-colors text-white"
                  >
                    View Mode
                  </a>
                  <a
                    href={editPath}
                    className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all hover:-translate-y-0.5"
                  >
                    Launch Editor
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Deck Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f0f13] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold">Create New Deck</h2>
              <button disabled={creating} onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {outline ? (
              <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-6 gap-4 scrollbar-hide">
                <div className="flex flex-col gap-1 mb-2">
                  <h3 className="text-lg font-bold text-white">Review Slide Plan</h3>
                  <p className="text-sm text-slate-400">Edit content or reorder. When ready, approve to generate MDX.</p>
                </div>
                
                {outline.map((slide, index) => (
                  <div key={slide.id} className="flex gap-4 p-4 border border-white/10 rounded-xl bg-white/5 relative group">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <button type="button" onClick={() => moveSlide(index, -1)} disabled={index === 0} className="p-1 text-slate-500 hover:text-white disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                      <span className="text-xs font-bold text-slate-500 w-6 text-center">{index + 1}</span>
                      <button type="button" onClick={() => moveSlide(index, 1)} disabled={index === outline.length - 1} className="p-1 text-slate-500 hover:text-white disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1 flex flex-col gap-3 min-w-0">
                      <input type="text" value={slide.title} onChange={e => editSlide(index, 'title', e.target.value)} className="bg-transparent text-white font-bold text-lg outline-none border-b border-transparent hover:border-white/20 focus:border-accent w-full" />
                      <textarea value={slide.content} onChange={e => editSlide(index, 'content', e.target.value)} className="bg-transparent text-sm text-slate-300 outline-none border-b border-transparent hover:border-white/20 focus:border-accent resize-vertical w-full" rows={2} />
                      <div className="bg-[#111114] p-2.5 rounded-lg border border-white/5">
                        <span className="text-xs text-accent font-medium mb-1 block">Visual Prompt</span>
                        <textarea value={slide.visualPrompt} onChange={e => editSlide(index, 'visualPrompt', e.target.value)} className="bg-transparent text-xs text-slate-400 outline-none w-full resize-vertical" rows={1} />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-4">
                  <button type="button" disabled={creating} onClick={() => setOutline(null)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                    Back to Config
                  </button>
                  <button type="button" onClick={handleCreate} disabled={creating} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors flex items-center gap-2">
                    {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Provisioning</> : "Approve & Generate"}
                  </button>
                </div>
              </div>
            ) : (
            <form onSubmit={handleCreate} className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-6 gap-5 scrollbar-hide">
              
              <div className="flex items-end gap-3 mb-1">
                <label className="flex flex-col gap-2 flex-1">
                  <span className="text-sm font-medium text-slate-300">Client Brand *</span>
                  <select required disabled={creating} value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="bg-[#161622] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-accent border-r-8 border-transparent cursor-pointer">
                     <option value="" disabled>Select a required Brand...</option>
                     {brands.map(b => (
                       <option key={b.slug} value={b.slug}>{b.name}</option>
                     ))}
                  </select>
                </label>
                <button type="button" onClick={() => setShowBrandModal(true)} className="px-5 py-2.5 whitespace-nowrap bg-accent/10 text-accent border border-accent/20 rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors shrink-0 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Brand
                </button>
              </div>

              <label className="flex flex-col gap-2 mt-2">
                <span className="text-sm font-medium text-slate-300">Presentation Title *</span>
                <input required disabled={creating} type="text" value={form.title} onChange={e => {
                  const newTitle = e.target.value;
                  setForm(prev => ({
                    ...prev,
                    title: newTitle,
                    slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                  }));
                }} placeholder="e.g. Pulsetech Engineering Q3" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-accent" />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-300">Aimed Audience (Optional)</span>
                <input disabled={creating} type="text" value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} placeholder="e.g. Senior Backend Engineers" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-accent" />
              </label>

              <div className="flex gap-4">
                <label className="flex flex-col gap-2 flex-1">
                  <span className="text-sm font-medium text-slate-300">Short Description (Optional)</span>
                  <textarea disabled={creating} value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} placeholder="Brief summary of the deck's purpose" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent resize-none w-full" />
                </label>

                <label className="flex flex-col gap-2 w-32 shrink-0">
                  <span className="text-sm font-medium text-slate-300">Target Slides</span>
                  <input required disabled={creating} type="number" min={1} max={100} value={form.slideCount} onChange={e => setForm({...form, slideCount: parseInt(e.target.value) || 10})} className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-accent w-full h-full text-center font-bold" />
                </label>
              </div>

              <label className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-accent">Auto-Generate &quot;Wall of Text&quot; (Optional)</span>
                  <span className="text-xs text-slate-400">Paste your raw notes, blog post, or article here. Or <span className="text-slate-200 font-bold border border-white/10 px-1 py-0.5 rounded bg-white/5">double-tap Ctrl</span> to dictate.</span>
                </div>
                <div className="relative flex flex-col group">
                  <textarea disabled={creating} value={form.wallOfText} onChange={e => setForm({...form, wallOfText: e.target.value})} rows={6} placeholder="Paste your massive wall of unstructured text here..." className={`bg-white/5 border border-white/10 rounded-lg px-4 py-3 pb-12 text-white placeholder-slate-500 focus:outline-none focus:border-accent resize-vertical font-mono text-sm transition-all ${isRecording ? 'border-[#7c5cfc] ring-1 ring-[#7c5cfc]' : ''}`} />
                  
                  {isRecording && (
                    <div className="absolute inset-x-4 bottom-12 top-4 pointer-events-none overflow-hidden flex flex-col justify-end">
                      {interimTranscript && (
                        <div className="text-[#7c5cfc] font-medium text-sm mb-2 opacity-80 animate-in fade-in slide-in-from-bottom-2 drop-shadow-md">
                          {interimTranscript}
                        </div>
                      )}
                      <div className="flex items-end gap-[3px] h-8 opacity-40">
                        {Array.from({ length: 40 }).map((_, i) => (
                           <div key={i} className="w-[3px] bg-[#7c5cfc] rounded-t-sm transition-all duration-75" style={{ height: `${Math.max(10, volume * 100 * (0.3 + Math.random() * 0.7))}%` }} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 flex items-center">
                    {isRecording && (
                      <div className="flex items-center gap-1.5 text-[#7c5cfc] mr-3 shadow-sm bg-[#0f0f13] px-2 py-1 rounded">
                        <span className="text-xs font-medium animate-pulse">Listening...</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-ping" />
                      </div>
                    )}
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); toggleRecording(); }}
                      className={`p-1.5 rounded-md transition-all flex items-center justify-center ${isRecording ? 'bg-[#7c5cfc] text-white shadow-[0_0_15px_rgba(124,92,252,0.5)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'}`}
                      title="Double-tap Ctrl to dictate"
                    >
                      {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-auto">
                <button type="button" disabled={creating || generatingOutline} onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating || generatingOutline} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors flex items-center gap-2">
                  {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Provisioning</> : 
                   generatingOutline ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Plan</> : 
                   form.wallOfText ? "Generate Slide Plan" : "Create & Launch Editor"}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}

      {/* Brand Studio Over-Modal */}
      <BrandStudioModal 
        isOpen={showBrandModal} 
        onClose={() => setShowBrandModal(false)}
        initialSlug=""
        onSaved={async (slug) => {
          await fetchBrands();
          setForm(prev => ({ ...prev, brand: slug }));
        }} 
      />
    </div>
  );
}
