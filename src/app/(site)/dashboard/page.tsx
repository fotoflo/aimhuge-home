"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";

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
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [decks, setDecks] = useState<DeckInfo[]>([]);
  const [fetching, setFetching] = useState(true);

  // New Deck Modal State
  const [showModal, setShowModal] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState({ slug: "", title: "", description: "", audience: "", wallOfText: "" });
  const [creating, setCreating] = useState(false);

  const handleOpenModal = () => {
    setForm({ slug: "", title: "", description: "", audience: "", wallOfText: "" });
    setSlugTouched(false);
    setShowModal(true);
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
      .then((data) => setDecks(data.decks ?? []))
      .finally(() => setFetching(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (form.wallOfText) {
        await fetch("/api/decks/generate/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deckSlug: data.deckSlug, context: form.wallOfText })
        });
      }

      router.push(`/decks/${data.deckSlug}/edit`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "An error occurred");
      setCreating(false);
    }
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
                className="rounded-xl border border-card-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
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
            
            <form onSubmit={handleCreate} className="flex flex-col flex-1 overflow-auto p-6 gap-5">
              
              <div className="grid grid-cols-2 gap-5">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-300">Internal Slug *</span>
                  <input required disabled={creating} type="text" value={form.slug} onChange={e => {
                    setSlugTouched(true);
                    setForm({...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')});
                  }} placeholder="e.g. pulsetech-training" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-accent" />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-300">Presentation Title *</span>
                  <input required disabled={creating} type="text" value={form.title} onChange={e => {
                    const newTitle = e.target.value;
                    setForm(prev => ({
                      ...prev,
                      title: newTitle,
                      slug: slugTouched ? prev.slug : newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                    }));
                  }} placeholder="e.g. Pulsetech Engineering Q3" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-accent" />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-300">Aimed Audience (Optional)</span>
                <input disabled={creating} type="text" value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} placeholder="e.g. Senior Backend Engineers" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-accent" />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-300">Short Description (Optional)</span>
                <textarea disabled={creating} value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} placeholder="Brief summary of the deck's purpose" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent resize-none" />
              </label>

              <label className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-accent">Auto-Generate &quot;Wall of Text&quot; (Optional)</span>
                  <span className="text-xs text-slate-400">Paste your raw notes, blog post, or article here. Our AI will automatically extract and construct the entire slide deck for you in the background.</span>
                </div>
                <textarea disabled={creating} value={form.wallOfText} onChange={e => setForm({...form, wallOfText: e.target.value})} rows={6} placeholder="Paste your massive wall of unstructured text here..." className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent resize-vertical font-mono text-sm" />
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-auto">
                <button type="button" disabled={creating} onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors flex items-center gap-2">
                  {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Provisioning</> : "Create & Launch Editor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
