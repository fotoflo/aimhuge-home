"use client";

import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useImageDropzone } from "@/lib/hooks/useImageDropzone";
import type { SlideRow } from "@/app/decks/lib/slides-db";
import type { SlideFrontmatter } from "@/app/decks/lib/mdx-types";
import { Sparkles, LogIn, ChevronLeft, ChevronRight, Image as ImageIcon, X, Code, Eye, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { SlideImageEditor } from "@/app/decks/components/SlideImageEditor";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
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

  // Image upload
  const handleUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", deckSlug);
    const res = await fetch("/api/assets", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      setAssets((prev) => [{ name: file.name, url: data.url }, ...prev]);
    }
  }, [deckSlug]);

  const { dropzoneProps, DropzoneOverlay, UploadButton } = useImageDropzone({
    onUpload: handleUpload,
  });

  // Navigation
  const goTo = (i: number) => { setCurrent(i); setShowCode(false); };
  const prev = () => goTo(Math.max(0, current - 1));
  const next = () => goTo(Math.min(total - 1, current + 1));

  // AI prompt
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
          prev.map((s) =>
            s.id === slide.id
              ? { ...s, mdx_content: data.content, frontmatter: data.frontmatter }
              : s,
          ),
        );
        setRefreshKey((k) => k + 1);
      }
      setPrompt("");
    } finally {
      setPrompting(false);
    }
  };

  // Load assets
  const toggleAssets = async () => {
    if (!showAssets && assets.length === 0) {
      const res = await fetch("/api/assets");
      const data = await res.json();
      if (Array.isArray(data)) setAssets(data);
    }
    setShowAssets(!showAssets);
  };

  // Copy asset URL
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  // Save image edits back to MDX
  const handleImageSave = async (imgState: { width: number; cropTop: number; cropRight: number; cropBottom: number; cropLeft: number }) => {
    if (!imageEditor || !slide) return;
    const { src, originalTag } = imageEditor;
    const hasCrop = imgState.cropTop > 0 || imgState.cropRight > 0 || imgState.cropBottom > 0 || imgState.cropLeft > 0;

    // Build width class
    let widthClass = "w-full";
    if (imgState.width <= 25) widthClass = "w-1/4";
    else if (imgState.width <= 35) widthClass = "w-1/3";
    else if (imgState.width <= 45) widthClass = "w-2/5";
    else if (imgState.width <= 55) widthClass = "w-1/2";
    else if (imgState.width <= 68) widthClass = "w-2/3";
    else if (imgState.width <= 80) widthClass = "w-3/4";

    const clipStyle = hasCrop
      ? ` style="clip-path: inset(${Math.round(imgState.cropTop)}% ${Math.round(imgState.cropRight)}% ${Math.round(imgState.cropBottom)}% ${Math.round(imgState.cropLeft)}%)"`
      : "";

    const newTag = `<img src="${src}" alt="" className="${widthClass} rounded-lg"${clipStyle} />`;

    let updatedContent = slide.mdx_content;
    if (originalTag) {
      updatedContent = updatedContent.replace(originalTag, newTag);
    }

    if (updatedContent !== slide.mdx_content) {
      await fetch("/api/decks/slides", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slide.id, mdx_content: updatedContent }),
      });
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, mdx_content: updatedContent } : s)),
      );
      setRefreshKey((k) => k + 1);
    }
    setImageEditor(null);
  };

  // Inject inline editing into iframe
  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;

    const doc = iframe.contentDocument;

    // Disable slide click navigation inside editor
    doc.addEventListener("click", (e) => {
      if (editingInline.current) {
        e.stopPropagation();
      }
    }, true);

    // Text-bearing elements that are editable
    const textSelectors = "h1, h2, h3, h4, h5, h6, p, span, div";

    // Image click handler — open image editor
    doc.querySelectorAll("img").forEach((img) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", (e) => {
        e.stopPropagation();
        const src = img.getAttribute("src") ?? "";
        if (!src) return;

        // Parse existing styles
        const style = img.getAttribute("style") ?? "";
        const clipMatch = style.match(/clip-path:\s*inset\(([^)]+)\)/);
        let cropTop = 0, cropRight = 0, cropBottom = 0, cropLeft = 0;
        if (clipMatch) {
          const parts = clipMatch[1].replace(/%/g, "").trim().split(/\s+/).map(Number);
          [cropTop, cropRight, cropBottom, cropLeft] = [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, parts[3] ?? 0];
        }

        // Parse width from className or style
        const classStr = img.getAttribute("class") ?? img.className ?? "";
        const widthClassMatch = classStr.match(/w-(\d+)/);
        let width = 100;
        if (classStr.includes("w-full")) width = 100;
        else if (classStr.includes("w-1/2")) width = 50;
        else if (classStr.includes("w-1/3")) width = 33;
        else if (classStr.includes("w-2/3")) width = 66;
        else if (widthClassMatch) width = Math.round((parseInt(widthClassMatch[1]) / 96) * 100);

        // Find the original img tag in MDX content to replace later
        const srcAttr = src.includes('"') ? `'${src}'` : `"${src}"`;
        const tagPattern = `<img[^>]*src=${srcAttr}[^>]*/>`;
        const altTagPattern = `<img[^>]*src=${srcAttr}[^>]*>`;
        const mdx = slide?.mdx_content ?? "";
        const match = mdx.match(new RegExp(tagPattern)) ?? mdx.match(new RegExp(altTagPattern));
        const originalTag = match?.[0] ?? "";

        setImageEditor({
          src,
          originalTag,
          width,
          cropTop,
          cropRight,
          cropBottom,
          cropLeft,
        });
      });
    });

    doc.addEventListener("dblclick", (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") return; // handled by click above
      if (!target.matches(textSelectors)) return;

      // Skip containers with many children (layout divs)
      if (target.children.length > 2) return;

      // Skip if already editing
      if (target.contentEditable === "true") return;

      // Only edit leaf-ish text nodes
      const text = target.textContent?.trim();
      if (!text || text.length < 2) return;

      editingInline.current = true;
      const originalText = target.textContent ?? "";
      target.contentEditable = "true";
      target.style.outline = "2px solid #7c5cfc";
      target.style.outlineOffset = "2px";
      target.style.borderRadius = "4px";
      target.style.cursor = "text";
      target.focus();

      // Select all text
      const range = doc.createRange();
      range.selectNodeContents(target);
      const sel = doc.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);

      const finish = async () => {
        target.contentEditable = "false";
        target.style.outline = "";
        target.style.outlineOffset = "";
        target.style.cursor = "";
        editingInline.current = false;

        const newText = target.textContent ?? "";
        if (newText !== originalText && slide) {
          // Replace the old text in the MDX content
          const updatedContent = slide.mdx_content.replace(originalText, newText);
          if (updatedContent !== slide.mdx_content) {
            // Save to server
            await fetch("/api/decks/slides", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: slide.id, mdx_content: updatedContent }),
            });
            // Update local state
            setSlides((prev) =>
              prev.map((s) =>
                s.id === slide.id ? { ...s, mdx_content: updatedContent } : s,
              ),
            );
          }
        }
      };

      target.addEventListener("blur", finish, { once: true });
      target.addEventListener("keydown", (ke) => {
        if (ke.key === "Enter" && !ke.shiftKey) {
          ke.preventDefault();
          target.blur();
        }
        if (ke.key === "Escape") {
          target.textContent = originalText;
          target.blur();
        }
      });
    });
  }, [slide]);

  if (authLoading) {
    return (
      <div className="h-screen bg-[#08080a] flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
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

      {/* Image editor modal */}
      {imageEditor && (
        <SlideImageEditor
          src={imageEditor.src}
          initialState={{
            width: imageEditor.width,
            cropTop: imageEditor.cropTop,
            cropRight: imageEditor.cropRight,
            cropBottom: imageEditor.cropBottom,
            cropLeft: imageEditor.cropLeft,
          }}
          onSave={handleImageSave}
          onClose={() => setImageEditor(null)}
        />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0e0e12] shrink-0">
        <div className="flex items-center gap-4">
          {!showLeftPanel && (
            <button
              onClick={() => setShowLeftPanel(true)}
              className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
              title="Show slides"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}
          <span className="text-sm font-semibold text-slate-400">{deckSlug}</span>
          <div className="flex items-center gap-1">
            <button onClick={prev} disabled={current === 0} className="p-1 rounded hover:bg-white/10 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-500 w-16 text-center">{current + 1} / {total}</span>
            <button onClick={next} disabled={current === total - 1} className="p-1 rounded hover:bg-white/10 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${showCode ? "border-[#7c5cfc] text-[#9b82fd] bg-[#7c5cfc]/10" : "border-white/10 text-slate-300 hover:bg-white/5"}`}
          >
            {showCode ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
            {showCode ? "Preview" : "Code"}
          </button>
          <UploadButton className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-colors disabled:opacity-50" />
          <button
            onClick={toggleAssets}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${showAssets ? "border-[#7c5cfc] text-[#9b82fd] bg-[#7c5cfc]/10" : "border-white/10 text-slate-300 hover:bg-white/5"}`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Assets
          </button>
          <a
            href={`/clients/priyoshop/exec-deck#slide-${current + 1}`}
            target="_blank"
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"
          >
            Present
          </a>
          {!showRightPanel && (
            <button
              onClick={() => setShowRightPanel(true)}
              className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
              title="Show AI panel"
            >
              <PanelRightOpen className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={signOut}
            className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Slide list sidebar with previews */}
        {showLeftPanel && <div className="w-52 border-r border-white/10 overflow-y-auto bg-[#0a0a0e] shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative">
          <button
            onClick={() => setShowLeftPanel(false)}
            className="absolute top-2 right-2 z-10 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-colors"
            title="Hide slides"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
          {slides.map((s, i) => {
            const sfm = s.frontmatter as SlideFrontmatter;
            return (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`w-full text-left px-2 py-2 border-b border-white/5 transition-colors ${
                  i === current ? "bg-[#7c5cfc]/10 border-l-2 border-l-[#7c5cfc]" : "hover:bg-white/5 border-l-2 border-l-transparent"
                }`}
              >
                {/* Mini slide preview */}
                <div className="w-full aspect-video rounded overflow-hidden bg-black mb-1.5 relative">
                  <iframe
                    key={`thumb-${s.id}-${refreshKey}`}
                    src={`/clients/priyoshop/exec-deck#slide-${i + 1}`}
                    className="absolute top-0 left-0 pointer-events-none border-0"
                    style={{
                      width: "960px",
                      height: "540px",
                      transform: "scale(0.2)",
                      transformOrigin: "top left",
                    }}
                    tabIndex={-1}
                    loading="lazy"
                    title={sfm.title ?? `Slide ${i + 1}`}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-600">{i + 1}</span>
                  <span className="text-xs font-medium text-slate-300 truncate">
                    {sfm.title ?? sfm.sectionLabel ?? "Untitled"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>}

        {/* Main: rendered slide preview */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#111114]">
          <div className="flex-1 overflow-hidden p-4">
            {showCode ? (
              <textarea
                value={slide?.mdx_content ?? ""}
                readOnly
                className="w-full h-full bg-[#0a0a0e] text-slate-300 font-mono text-xs p-4 rounded-lg border border-white/10 resize-none focus:outline-none"
                spellCheck={false}
              />
            ) : (
              <div className="w-full h-full rounded-lg overflow-hidden border border-white/10 bg-black">
                <iframe
                  ref={iframeRef}
                  key={`${slide?.id}-${refreshKey}`}
                  src={`/clients/priyoshop/exec-deck?edit=true#slide-${current + 1}`}
                  className="w-full h-full border-0"
                  title="Slide preview"
                  onLoad={handleIframeLoad}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar: prompt + metadata */}
        {showRightPanel && <div className="w-80 border-l border-white/10 bg-[#0a0a0e] flex flex-col shrink-0 relative">
          <button
            onClick={() => setShowRightPanel(false)}
            className="absolute top-2 left-2 z-10 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-200 transition-colors"
            title="Hide AI panel"
          >
            <PanelRightClose className="w-3.5 h-3.5" />
          </button>
          {/* Slide info */}
          <div className="p-3 border-b border-white/10">
            <div className="text-xs text-slate-500 mb-2">Slide {current + 1}</div>
            <div className="text-sm font-bold text-white mb-1">{fm?.title ?? "Untitled"}</div>
            {fm?.subtitle && (
              <div className="text-xs text-slate-400 leading-relaxed">{fm.subtitle}</div>
            )}
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                {fm?.variant}
              </span>
              {fm?.sectionLabel && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                  {fm.sectionLabel}
                </span>
              )}
            </div>
          </div>

          {/* Prompt history area */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-3">
              AI Assistant
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              Describe changes you want to make to this slide. Examples:
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {[
                "Add a 4th prompt: 'What will you do differently?'",
                "Change the subtitle to mention 15 minutes",
                "Add a background image",
                "Make the title bigger",
                "Switch to light variant",
              ].map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="text-left text-[11px] text-slate-400 hover:text-[#9b82fd] px-2 py-1.5 rounded hover:bg-white/5 transition-colors"
                >
                  &ldquo;{ex}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Prompt input */}
          <div className="p-3 border-t border-white/10">
            <div className="flex flex-col gap-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePrompt();
                  }
                }}
                placeholder="Describe the change..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#7c5cfc]/50 resize-none"
                rows={3}
                disabled={prompting}
              />
              <button
                onClick={handlePrompt}
                disabled={prompting || !prompt.trim()}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-lg bg-[#7c5cfc] text-white hover:bg-[#6b4de0] transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {prompting ? "Thinking..." : "Update Slide"}
              </button>
            </div>
          </div>
        </div>}

        {/* Assets panel (overlay) */}
        {showAssets && (
          <div className="w-56 border-l border-white/10 bg-[#0a0a0e] overflow-y-auto shrink-0">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <span className="text-xs font-semibold text-slate-400">Assets</span>
              <button onClick={() => setShowAssets(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 grid grid-cols-2 gap-2">
              {assets.map((a) => (
                <button
                  key={a.url}
                  onClick={() => copyUrl(a.url)}
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
        )}
      </div>
    </div>
  );
}
