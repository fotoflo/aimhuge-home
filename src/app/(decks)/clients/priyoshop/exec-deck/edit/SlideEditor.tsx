"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useImageDropzone } from "@/lib/hooks/useImageDropzone";
import type { SlideRow } from "@/app/decks/lib/slides-db";
import type { SlideFrontmatter } from "@/app/decks/lib/mdx-types";
import { LogIn } from "lucide-react";
import { SlideImageEditor } from "@/app/decks/components/SlideImageEditor";
import { EditorTopBar } from "./components/EditorTopBar";
import { SlideSidebar } from "./components/SlideSidebar";
import { PromptSidebar } from "./components/PromptSidebar";
import { AssetPanel } from "./components/AssetPanel";
import { LightTable } from "./components/LightTable";
import { currentAfterReorder, buildImageTag } from "@/app/decks/lib/editor-utils";
import { useThumbnails } from "@/app/decks/lib/hooks/useThumbnails";
import { useEditorKeyboard } from "@/app/decks/lib/hooks/useEditorKeyboard";
import { useInlineEditing } from "@/app/decks/lib/hooks/useInlineEditing";

interface SlideEditorProps {
  initialSlides: SlideRow[];
  deckSlug: string;
}

export function SlideEditor({ initialSlides, deckSlug }: SlideEditorProps) {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [slides, setSlides] = useState(initialSlides);
  const [current, setCurrent] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [prompting, setPrompting] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showAssets, setShowAssets] = useState(false);
  const [assets, setAssets] = useState<{ name: string; url: string }[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [lightTable, setLightTable] = useState(false);
  const [copilotText, setCopilotText] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const editingInline = useRef(false);
  const [imageEditor, setImageEditor] = useState<{
    src: string;
    originalTag: string;
    width: number;
    cropTop: number;
    cropRight: number;
    cropBottom: number;
    cropLeft: number;
  } | null>(null);

  const slide = slides[current];
  const total = slides.length;

  // ── Hooks ──

  useEffect(() => {
    if (typeof window !== "undefined") {
      const match = window.location.hash.match(/^#slide-(\d+)$/);
      if (match) {
        const idx = parseInt(match[1], 10) - 1;
        if (idx >= 0 && idx < total) {
          setCurrent(idx);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once to read the initial hash

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = `#slide-${current + 1}`;
      if (window.location.hash !== hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search + hash);
      }
    }
  }, [current]);

  const { thumbnails, generatingThumbs, regenerateThumbnails } = useThumbnails(deckSlug);

  useEditorKeyboard({
    slides, current, total, iframeRef,
    setCurrent, setShowCode, setSlides,
  });

  const inlineEditingOnLoad = useInlineEditing({
    slide, iframeRef, editingInline,
    setSlides, setImageEditor,
  });

  // Wrap inlineEditing onLoad to also navigate to the current slide after remount
  const handleIframeLoad = useCallback(() => {
    inlineEditingOnLoad();

    // After a refreshKey remount, navigate to the current slide via postMessage
    const iframe = iframeRef.current;
    if (iframe?.contentWindow && current > 0) {
      iframe.contentWindow.postMessage({ type: "goToSlide", index: current }, "*");
    }
  }, [inlineEditingOnLoad, current]);

  // ── Upload ──

  const handleUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", deckSlug);
    const res = await fetch("/api/assets", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) setAssets((prev) => [{ name: file.name, url: data.url }, ...prev]);
  }, [deckSlug]);

  const { dropzoneProps, DropzoneOverlay } = useImageDropzone({ onUpload: handleUpload });

  // ── Fullscreen ──

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // ── Navigation — use postMessage (NOT location.replace) to avoid recursive rendering ──

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setShowCode(false);
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ type: "goToSlide", index: i }, "*");
    }
  }, []);
  const prev = () => goTo(Math.max(0, current - 1));
  const next = () => goTo(Math.min(total - 1, current + 1));

  // ── Reorder ──

  const handleReorder = useCallback(async (oldIndex: number, newIndex: number) => {
    const reordered = [...slides];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setSlides(reordered);

    setCurrent(currentAfterReorder(current, oldIndex, newIndex));

    setRefreshKey((k) => k + 1);

    const payload = reordered.map((s, i) => ({ id: s.id, slide_order: i }));
    await fetch("/api/decks/slides/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slides: payload }),
    });
  }, [slides, current]);

  // ── Context Menu Actions ──

  const handleAddSlide = useCallback(async (index: number, position: "before" | "after") => {
    const insertIndex = position === "before" ? index : index + 1;
    const newSlides = [...slides];
    
    const mockId = crypto.randomUUID();
    const newSlide: SlideRow = {
      id: mockId,
      deck_slug: deckSlug,
      slide_order: 0,
      frontmatter: { order: 0, title: "New Slide", variant: "dark", level: 0 },
      mdx_content: "## New Slide\n\nEnter your content here.",
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
    
    newSlides.splice(insertIndex, 0, newSlide);
    const slidesPayload = newSlides.map((s, i) => ({ id: s.id, slide_order: (i + 1) * 10 }));
    
    setSlides(newSlides);
    
    try {
      const res = await fetch("/api/decks/slides/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deck_slug: deckSlug,
          insert_index: (insertIndex + 1) * 10,
          slides: slidesPayload.filter(s => s.id !== mockId)
        }),
      });
      const data = await res.json();
      if (data.newSlide) {
        setSlides(prev => prev.map(s => s.id === mockId ? data.newSlide : s));
      }
    } catch (err) {
      console.error("Failed to insert slide", err);
    }
  }, [slides, deckSlug]);

  const handleDeleteSlide = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    
    const index = slides.findIndex(s => s.id === id);
    if (index === -1) return;
    
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    setSlides(newSlides);
    
    if (current >= newSlides.length) {
      setCurrent(Math.max(0, newSlides.length - 1));
    }
    
    try {
      await fetch("/api/decks/slides", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Failed to delete slide", err);
    }
  }, [slides, current]);

  const handleToggleSkip = useCallback(async (id: string, currentSkip: boolean) => {
    const target = slides.find(s => s.id === id);
    if (!target) return;
    const updatedFrontmatter = { ...(target.frontmatter as SlideFrontmatter), skip: !currentSkip };
    
    setSlides(prev => prev.map(s => s.id === id ? { ...s, frontmatter: updatedFrontmatter } : s));
    
    await fetch("/api/decks/slides", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, frontmatter: updatedFrontmatter }),
    });
  }, [slides]);

  // ── Title Edit ──

  const handleTitleEdit = useCallback(async (slideId: string, newTitle: string) => {
    const target = slides.find((s) => s.id === slideId);
    if (!target) return;

    const updatedFrontmatter = { ...(target.frontmatter as SlideFrontmatter), title: newTitle || undefined };

    // Optimistic local update
    setSlides((prev) =>
      prev.map((s) => s.id === slideId ? { ...s, frontmatter: updatedFrontmatter } : s),
    );

    await fetch("/api/decks/slides", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: slideId, frontmatter: updatedFrontmatter }),
    });
  }, [slides]);

  // ── AI Prompt ──

  const handlePrompt = async () => {
    if (!prompt.trim()) return;
    setPrompting(true);
    setCopilotText("");
    setUserPrompt(prompt.trim());
    try {
      const res = await fetch("/api/decks/slides/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deckSlug,
          slideId: slide.id,
          currentContent: slide.mdx_content,
          currentFrontmatter: slide.frontmatter,
          prompt: prompt.trim(),
          image: thumbnails[slide.id],
        }),
      });

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      let fullText = "";
      let isCodeMode = false;
      let streamedMdx = slide.mdx_content;
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        fullText += decoder.decode(value, { stream: true });
        
        const mdxStartIdx = fullText.indexOf("```mdx\n");
        if (mdxStartIdx === -1) {
          setCopilotText(fullText);
        } else {
          if (!isCodeMode) {
            isCodeMode = true;
            setCopilotText(fullText.substring(0, mdxStartIdx).trim());
          }
          
          const remainingText = fullText.substring(mdxStartIdx + 7);
          const mdxEndIdx = remainingText.indexOf("```");
          
          if (mdxEndIdx === -1) {
            streamedMdx = remainingText;
          } else {
            streamedMdx = remainingText.substring(0, mdxEndIdx).trim();
          }
          
          // Optimistically update the raw editor
          setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, mdx_content: streamedMdx } : s));
        }
      }

      // Final full text parsed for frontmatter
      let finalFm = slide.frontmatter;
      const jsonMatch = fullText.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          finalFm = { ...slide.frontmatter, ...parsed };
        } catch {}
      }
      
      setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, mdx_content: streamedMdx, frontmatter: finalFm } : s));
      setRefreshKey((k) => k + 1);
      regenerateThumbnails([slide.id]);
      setPrompt("");
    } catch (err) {
      console.error("AI prompt error:", err);
    } finally {
      setPrompting(false);
    }
  };

  const handleRevert = useCallback(async (versionId: string) => {
    try {
      const res = await fetch("/api/decks/slides/versions/revert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slideId: slide.id, versionId }),
      });
      const data = await res.json();
      if (data.slide) {
        setSlides((prev) =>
          prev.map((s) => (s.id === slide.id ? data.slide : s))
        );
        setRefreshKey((k) => k + 1);
        regenerateThumbnails([slide.id]);
      }
    } catch (err) {
      console.error("Revert failed", err);
    }
  }, [slide, regenerateThumbnails]);

  // ── Assets ──

  const toggleAssets = async () => {
    if (!showAssets && assets.length === 0) {
      const res = await fetch("/api/assets");
      const data = await res.json();
      if (Array.isArray(data)) setAssets(data);
    }
    setShowAssets(!showAssets);
  };

  // ── Image Editor ──

  const handleImageSave = async (imgState: { width: number; cropTop: number; cropRight: number; cropBottom: number; cropLeft: number }) => {
    if (!imageEditor || !slide) return;
    const { src, originalTag } = imageEditor;
    const newTag = buildImageTag(src, imgState.width, imgState);

    let updatedContent = slide.mdx_content;
    if (originalTag) updatedContent = updatedContent.replace(originalTag, newTag);

    if (updatedContent !== slide.mdx_content) {
      await fetch("/api/decks/slides", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slide.id, mdx_content: updatedContent }),
      });
      setSlides((prev) => prev.map((s) => (s.id === slide.id ? { ...s, mdx_content: updatedContent } : s)));
      setRefreshKey((k) => k + 1);
    }
    setImageEditor(null);
  };

  // ── Auth gates ──

  if (authLoading) {
    return <div className="h-screen bg-[#08080a] flex items-center justify-center text-slate-400">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="h-screen bg-[#08080a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold text-white">Deck Editor</h1>
          <p className="text-slate-400">Sign in to edit slides</p>
          <button
            onClick={() => signInWithGoogle(window.location.pathname)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  const fm = slide?.frontmatter as SlideFrontmatter;

  return (
    <div className="h-screen bg-[#08080a] text-white flex flex-col overflow-hidden" {...dropzoneProps}>
      <DropzoneOverlay />

      {imageEditor && (
        <SlideImageEditor
          src={imageEditor.src}
          initialState={{ width: imageEditor.width, cropTop: imageEditor.cropTop, cropRight: imageEditor.cropRight, cropBottom: imageEditor.cropBottom, cropLeft: imageEditor.cropLeft }}
          onSave={handleImageSave}
          onClose={() => setImageEditor(null)}
        />
      )}

      <EditorTopBar
        deckSlug={deckSlug}
        current={current}
        total={total}
        showLeftPanel={showLeftPanel}
        showRightPanel={showRightPanel}
        showAssets={showAssets}
        onPrev={prev}
        onNext={next}
        onToggleAssets={toggleAssets}
        onShowLeftPanel={() => setShowLeftPanel(true)}
        onShowRightPanel={() => setShowRightPanel(true)}
        zoom={zoom}
        onZoomChange={setZoom}
        lightTable={lightTable}
        onToggleLightTable={() => setLightTable(!lightTable)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onSignOut={signOut}
      />

      <div className="flex flex-1 overflow-hidden">
        {showLeftPanel && !lightTable && (
          <SlideSidebar
            slides={slides}
            current={current}
            thumbnails={thumbnails}
            generatingThumbs={generatingThumbs}
            onGoTo={goTo}
            onReorder={handleReorder}
            onTitleEdit={handleTitleEdit}
            onClose={() => setShowLeftPanel(false)}
            onRegenerateThumbnails={regenerateThumbnails}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
            onToggleSkip={handleToggleSkip}
          />
        )}

        {/* Main preview or Light Table */}
        {lightTable ? (
          <LightTable
            slides={slides}
            current={current}
            thumbnails={thumbnails}
            onSelect={(i) => { goTo(i); setLightTable(false); }}
          />
        ) : (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#111114]">
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" ref={previewContainerRef}>
            {showCode ? (
              <textarea
                value={slide?.mdx_content ?? ""}
                readOnly
                className="w-full h-full bg-[#0a0a0e] text-slate-300 font-mono text-xs p-4 rounded-lg border border-white/10 resize-none focus:outline-none"
                spellCheck={false}
              />
            ) : (
              <div
                className="rounded-lg overflow-hidden border border-white/10 bg-black shrink-0"
                style={zoom === "fit" ? { width: "100%", height: "100%" } : { width: 1920 * (zoom / 100), height: 1080 * (zoom / 100) }}
              >
                <iframe
                  ref={iframeRef}
                  key={refreshKey}
                  src="/clients/priyoshop/exec-deck?edit=true#slide-1"
                  className="border-0"
                  style={zoom === "fit"
                    ? { width: "100%", height: "100%" }
                    : { width: 1920, height: 1080, transform: `scale(${zoom / 100})`, transformOrigin: "top left" }
                  }
                  title="Slide preview"
                  onLoad={handleIframeLoad}
                />
              </div>
            )}
          </div>
        </div>
        )}

        {showRightPanel && (
          <PromptSidebar
            slides={slides}
            slideId={slide?.id}
            deckSlug={deckSlug}
            current={current}
            frontmatter={fm}
            prompt={prompt}
            prompting={prompting}
            copilotText={copilotText}
            userPrompt={userPrompt}
            screenshot={thumbnails[slide?.id]}
            onPromptChange={setPrompt}
            onSubmit={handlePrompt}
            onRevert={handleRevert}
            onClose={() => setShowRightPanel(false)}
          />
        )}

        {showAssets && (
          <AssetPanel
            assets={assets}
            onCopyUrl={(url) => navigator.clipboard.writeText(url)}
            onClose={() => setShowAssets(false)}
          />
        )}
      </div>
    </div>
  );
}
