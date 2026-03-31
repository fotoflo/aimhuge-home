"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Mic, Square, Trash2, Archive, ArchiveRestore, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
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

// Helper component for Provisioning animated progress
const ProvisioningStatusTexts = () => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Initializing AI workspace...",
    "Configuring brand tokens...",
    "Analyzing your outline...",
    "Drafting slides via Gemini...",
    "Applying aesthetics & polish...",
    "Finalizing presentation..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(v => {
        const target = 95;
        return v + (target - v) * 0.08;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const textInt = setInterval(() => {
      setTextIndex(i => Math.min(i + 1, texts.length - 1));
    }, 3000);
    return () => clearInterval(textInt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500">
      <p className="text-slate-400 font-medium h-6 text-lg">{texts[textIndex]}</p>
      <div className="w-full h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden p-0.5">
          <div 
              className="h-full bg-accent rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }} />
          </div>
      </div>
      <p className="text-xs text-accent/70 font-mono tracking-wider">{Math.round(progress)}% COMPLETE · PLEASE WAIT</p>
    </div>
  );
};

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [outline, setOutline] = useState<any[] | null>(null);
  const [generatingOutline, setGeneratingOutline] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, index: number } | null>(null);

  // Generic Dialog State
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: "alert" | "confirm";
    onConfirm?: () => void;
  }>({ isOpen: false, title: "", description: "", type: "alert" });

  const showAlert = (title: string, description: string) => {
    setDialogState({ isOpen: true, title, description, type: "alert" });
  };

  const showConfirm = (title: string, description: string, onConfirm: () => void) => {
    setDialogState({ isOpen: true, title, description, type: "confirm", onConfirm });
  };

  const closeDialog = () => setDialogState(prev => ({ ...prev, isOpen: false }));

  const STORAGE_KEY = "aimhuge_new_deck_draft";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.form) setForm(parsed.form);
        if (parsed.outline) setOutline(parsed.outline);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (form.title || form.wallOfText || form.brand || outline) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, outline }));
      }
    } catch {}
  }, [form, outline]);

  const handleClearDraft = () => {
    showConfirm("Clear Draft", "Are you sure you want to completely clear your drafted deck progress?", () => {
      setForm({ slug: "", title: "", description: "", audience: "", wallOfText: "", brand: "", slideCount: 10 });
      setOutline(null);
      localStorage.removeItem(STORAGE_KEY);
    });
  };

  const { isRecording, toggleRecording, volume, interimTranscript } = useDictation({
    onResult: (text) => {
      if (!text) return;
      const activeEl = document.activeElement as HTMLElement;
      const slideIndex = activeEl?.getAttribute('data-slide-index');
      const slideField = activeEl?.getAttribute('data-slide-field');
      const formField = activeEl?.getAttribute('data-form-field');

      if (slideIndex && slideField && outline) {
        const idx = parseInt(slideIndex);
        const newOutline = [...outline];
        const currentVal = newOutline[idx][slideField] || "";
        newOutline[idx][slideField] = currentVal + (currentVal ? " " : "") + text;
        setOutline(newOutline);
      } else if (formField) {
        setForm(prev => {
          const key = formField as keyof typeof prev;
          const currentVal = prev[key] || "";
          const newVal = currentVal + (currentVal ? " " : "") + text;
          
          if (key === 'title') {
             return { ...prev, title: newVal as string, slug: (newVal as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') };
          }
          return { ...prev, [key]: newVal };
        });
      } else if (!outline) {
        setForm(prev => ({ ...prev, wallOfText: prev.wallOfText + (prev.wallOfText ? " " : "") + text }));
      }
    },
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
    } catch (err: unknown) {
      showAlert("Error", err instanceof Error ? err.message : String(err));
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

  const addSlide = (index: number, position: 'before' | 'after' = 'after') => {
    if (!outline) return;
    const newSlide = { id: crypto.randomUUID(), title: "", content: "", visualPrompt: "", order: 0 };
    const newOutline = [...outline];
    const insertIdx = position === 'before' ? index : index + 1;
    newOutline.splice(insertIdx, 0, newSlide);
    setOutline(newOutline);
    setContextMenu(null);
  };

  const deleteSlide = (index: number) => {
    if (!outline) return;
    if (outline.length <= 1) return showAlert("Cannot delete", "Must have at least one slide.");
    const newOutline = [...outline];
    newOutline.splice(index, 1);
    setOutline(newOutline);
    setContextMenu(null);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    const newOutline = [...(outline || [])];
    const [moved] = newOutline.splice(draggedIdx, 1);
    newOutline.splice(index, 0, moved);
    setOutline(newOutline);
    setDraggedIdx(null);
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

      localStorage.removeItem("aimhuge_new_deck_draft");
      setForm({ slug: "", title: "", description: "", audience: "", wallOfText: "", brand: "", slideCount: 10 });
      setOutline(null);

      router.push(`/decks/${data.deckSlug}/edit`);
    } catch (err: unknown) {
      showAlert("Error", err instanceof Error ? err.message : "An error occurred");
      setCreating(false);
    }
  };

  const handleArchive = async (slug: string, isArchived: boolean) => {
    showConfirm(
      isArchived ? "Unarchive Deck" : "Archive Deck",
      isArchived ? "Unarchive this deck?" : "Archive this deck?",
      async () => {
        try {
          const res = await fetch(`/api/decks/${slug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ archived: !isArchived })
          });
          if (!res.ok) throw new Error("Failed to toggle archive");
          refreshDecks();
        } catch (e: unknown) { showAlert("Error", e instanceof Error ? e.message : String(e)); }
      }
    );
  };

  const handleDelete = async (slug: string) => {
    showConfirm(
      "Delete Deck",
      "Are you SURE you want to delete this deck? This action will hide it from the dashboard.",
      async () => {
        const previousDecks = [...decks];
        setDecks(decks.filter(d => d.slug !== slug)); // Optimistic UI update
        try {
          const res = await fetch(`/api/decks/${slug}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete deck");
          refreshDecks();
        } catch (e: unknown) { 
          setDecks(previousDecks); // Revert optimistic update
          showAlert("Error", e instanceof Error ? e.message : String(e)); 
        }
      }
    );
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
          <div className="bg-[#0f0f13] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] relative">
            
            {/* INJECT PROVISIONING OVERLAY HERE */}
            {creating && (
              <div className="absolute inset-0 z-[100] bg-[#0f0f13]/90 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
                <div className="w-full max-w-md flex flex-col items-center gap-6 text-center">
                    <div className="relative flex items-center justify-center mb-4">
                      <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full scale-150" />
                      <Loader2 className="w-16 h-16 text-accent animate-spin relative z-10" />
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Provisioning Deck
                    </h3>
                    <ProvisioningStatusTexts />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold">Create New Deck</h2>
              <button disabled={creating} onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {outline ? (
              <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-6 gap-4 custom-scrollbar">
                <div className="flex flex-col gap-1 mb-2">
                  <h3 className="text-lg font-bold text-white">Review Slide Plan</h3>
                  <p className="text-sm text-slate-400">Edit content or reorder. When ready, approve to generate MDX.</p>
                </div>
                
                <div className="border border-white/10 rounded-xl overflow-y-auto bg-white/5 custom-scrollbar flex-1">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-[#111114] border-b border-white/10 text-xs text-slate-400 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 font-medium w-12 text-center border-r border-white/5">#</th>
                        <th className="px-5 py-3 font-medium min-w-[250px] border-r border-white/5">Title & Content</th>
                        <th className="px-5 py-3 font-medium w-[220px]">Visual Prompt</th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {outline.map((slide, index) => (
                        <tr 
                          key={slide.id} 
                          className={`group hover:bg-white/[0.02] transition-colors relative ${draggedIdx === index ? "opacity-30" : ""}`}
                          draggable
                          onDragStart={(e) => { setDraggedIdx(index); e.dataTransfer.effectAllowed = 'move'; }}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={() => setDraggedIdx(null)}
                          onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, index }); }}
                        >
                          <td className="px-2 py-4 align-top text-center w-12 border-r border-white/5 cursor-grab active:cursor-grabbing">
                            <div className="flex flex-col items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="w-4 h-4 text-slate-500 mb-1" />
                              <span className="text-xs font-bold text-slate-500 block">{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top border-r border-white/5">
                            <input 
                              type="text" 
                              data-slide-index={index}
                              data-slide-field="title"
                              value={slide.title} 
                              onChange={e => editSlide(index, 'title', e.target.value)} 
                              className="bg-transparent text-white font-semibold outline-none border-b border-transparent hover:border-white/20 focus:border-accent w-full mb-2 pb-1" 
                              placeholder="Slide Title"
                            />
                            <textarea 
                              data-slide-index={index}
                              data-slide-field="content"
                              value={slide.content} 
                              onChange={e => editSlide(index, 'content', e.target.value)} 
                              className="bg-transparent text-xs text-slate-300 outline-none border-b border-transparent hover:border-white/20 focus:border-accent resize-y w-full leading-relaxed block custom-scrollbar" 
                              rows={3} 
                              placeholder="Slide bullet points..."
                            />
                          </td>
                          <td className="px-4 py-3 align-top">
                            <textarea 
                              data-slide-index={index}
                              data-slide-field="visualPrompt"
                              value={slide.visualPrompt} 
                              onChange={e => editSlide(index, 'visualPrompt', e.target.value)} 
                              className="bg-transparent text-xs text-accent/80 outline-none border-b border-transparent hover:border-accent/40 focus:border-accent resize-y w-full leading-relaxed mt-1 custom-scrollbar" 
                              rows={4} 
                              placeholder="Visual layout instructions..."
                            />
                          </td>
                          <td className="px-2 py-2 align-middle text-center">
                            <div className="flex flex-col items-center gap-2 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button type="button" onClick={() => moveSlide(index, -1)} disabled={index === 0} className="p-1 text-slate-500 hover:text-white hover:bg-white/5 rounded disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => moveSlide(index, 1)} disabled={index === outline.length - 1} className="p-1 text-slate-500 hover:text-white hover:bg-white/5 rounded disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => deleteSlide(index)} className="p-1 mt-1 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="p-4 flex justify-center border-t border-white/5">
                     <button type="button" onClick={() => addSlide(outline.length - 1, 'after')} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Slide
                     </button>
                  </div>
                </div>

                {contextMenu && (
                  <>
                     <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }} />
                     <div className="fixed z-[60] bg-[#161622] border border-white/10 rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.8)] py-1.5 w-48 text-sm text-slate-300" style={{ top: Math.min(contextMenu.y, window.innerHeight - 150), left: Math.min(contextMenu.x, window.innerWidth - 200) }}>
                        <button type="button" onClick={() => addSlide(contextMenu.index, 'before')} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">Add slide before</button>
                        <button type="button" onClick={() => addSlide(contextMenu.index, 'after')} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">Add slide after</button>
                        <div className="h-px bg-white/10 my-1"></div>
                        <button type="button" onClick={() => deleteSlide(contextMenu.index)} className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 transition-colors flex items-center gap-2">
                           <Trash2 className="w-3.5 h-3.5" /> Delete slide
                        </button>
                     </div>
                  </>
                )}

                <div className="flex justify-between gap-3 pt-4 border-t border-white/5 mt-4">
                  <button type="button" onClick={handleClearDraft} disabled={creating} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-400 transition-colors">
                    Clear Draft
                  </button>
                  <div className="flex gap-3">
                    <button type="button" disabled={creating} onClick={() => setOutline(null)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                      Back to Config
                    </button>
                    <button type="button" onClick={handleCreate} disabled={creating} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors flex items-center gap-2">
                      {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Provisioning</> : "Approve & Generate"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
            <form onSubmit={handleCreate} className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-6 gap-5 custom-scrollbar">
              
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
                <div className="relative group/input">
                  <input required disabled={creating} type="text" data-form-field="title" value={form.title} onChange={e => {
                    const newTitle = e.target.value;
                    setForm(prev => ({
                      ...prev,
                      title: newTitle,
                      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                    }));
                  }} placeholder="e.g. Pulsetech Engineering Q3" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-accent w-full" />
                  <Mic className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 opacity-30 group-focus-within/input:text-accent group-focus-within/input:opacity-100 transition-colors pointer-events-none" />
                </div>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-300">Aimed Audience (Optional)</span>
                <div className="relative group/input">
                  <input disabled={creating} type="text" data-form-field="audience" value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} placeholder="e.g. Senior Backend Engineers" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-accent w-full" />
                  <Mic className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 opacity-30 group-focus-within/input:text-accent group-focus-within/input:opacity-100 transition-colors pointer-events-none" />
                </div>
              </label>

              <div className="flex gap-4">
                <label className="flex flex-col gap-2 flex-1">
                  <span className="text-sm font-medium text-slate-300">Short Description (Optional)</span>
                  <div className="relative group/input h-full">
                    <textarea disabled={creating} data-form-field="description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} placeholder="Brief summary of the deck's purpose" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-accent resize-none w-full h-full custom-scrollbar" />
                    <Mic className="absolute right-3 bottom-3 w-4 h-4 text-slate-500 opacity-30 group-focus-within/input:text-accent group-focus-within/input:opacity-100 transition-colors pointer-events-none" />
                  </div>
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

              <div className="flex justify-between gap-3 pt-4 border-t border-white/5 mt-auto">
                <button type="button" onClick={handleClearDraft} disabled={creating || generatingOutline} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-400 transition-colors">
                  Clear Draft
                </button>
                <div className="flex gap-3">
                  <button type="button" disabled={creating || generatingOutline} onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={creating || generatingOutline} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors flex items-center gap-2">
                    {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Provisioning</> : 
                     generatingOutline ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Plan</> : 
                     form.wallOfText ? "Generate Slide Plan" : "Create & Launch Editor"}
                  </button>
                </div>
              </div>
            </form>
            )}
          </div>
        </div>
      )}

      {/* Global Alert / Confirm Dialog */}
      {dialogState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f0f13] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
            <h2 className="text-xl font-bold mb-2 text-white">{dialogState.title}</h2>
            <p className="text-sm text-slate-300 mb-6">{dialogState.description}</p>
            <div className="flex justify-end gap-3">
              {dialogState.type === "confirm" && (
                <button onClick={closeDialog} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                  Cancel
                </button>
              )}
              <button 
                onClick={() => {
                  if (dialogState.type === "confirm" && dialogState.onConfirm) {
                    dialogState.onConfirm();
                  }
                  closeDialog();
                }} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${dialogState.type === "confirm" ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-accent text-white hover:bg-accent-hover'}`}
              >
                {dialogState.type === "confirm" ? (dialogState.title.includes("Archive") || dialogState.title.includes("Clear") ? "Confirm" : "Delete") : "OK"}
              </button>
            </div>
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
