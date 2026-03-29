"use client";

import { useState, useCallback, useRef } from "react";
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

  // ── AI Prompt ──

  const handlePrompt = async () => {
    if (!prompt.trim()) return;
    setPrompting(true);
    try {
      const res = await fetch("/api/decks/slides/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slideId: slide.id,
          currentContent: slide.mdx_content,
          currentFrontmatter: slide.frontmatter,
          prompt: prompt.trim(),
        }),
      });
      const data = await res.json();
      if (data.content) {
        setSlides((prev) =>
          prev.map((s) => s.id === slide.id ? { ...s, mdx_content: data.content, frontmatter: data.frontmatter } : s),
        );
        setRefreshKey((k) => k + 1);
        regenerateThumbnails([slide.id]);
      }
      setPrompt("");
    } finally {
      setPrompting(false);
    }
  };

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
            onClose={() => setShowLeftPanel(false)}
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
            current={current}
            frontmatter={fm}
            prompt={prompt}
            prompting={prompting}
            onPromptChange={setPrompt}
            onSubmit={handlePrompt}
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
