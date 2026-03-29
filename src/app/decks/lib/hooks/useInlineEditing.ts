"use client";

import { useCallback, type RefObject, type MutableRefObject } from "react";
import type { SlideRow } from "@/app/decks/lib/slides-db";
import { parseCropFromStyle, parseWidthFromClass, findImageTagInMdx } from "@/app/decks/lib/editor-utils";

interface ImageEditorState {
  src: string;
  originalTag: string;
  width: number;
  cropTop: number;
  cropRight: number;
  cropBottom: number;
  cropLeft: number;
}

interface UseInlineEditingOptions {
  slide: SlideRow | undefined;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  editingInline: MutableRefObject<boolean>;
  setSlides: React.Dispatch<React.SetStateAction<SlideRow[]>>;
  setImageEditor: React.Dispatch<React.SetStateAction<ImageEditorState | null>>;
}

/**
 * Sets up inline editing on the slide preview iframe:
 * - Click on images → opens image editor
 * - Double-click text → contentEditable inline editing
 *
 * Returns handleIframeLoad to be passed as the iframe's onLoad.
 */
export function useInlineEditing({
  slide,
  iframeRef,
  editingInline,
  setSlides,
  setImageEditor,
}: UseInlineEditingOptions) {
  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;
    const doc = iframe.contentDocument;

    doc.addEventListener("click", (e) => {
      if (editingInline.current) e.stopPropagation();
    }, true);

    const textSelectors = "h1, h2, h3, h4, h5, h6, p, span, div";

    // Image click → open image editor
    doc.querySelectorAll("img").forEach((img) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", (e) => {
        e.stopPropagation();
        const src = img.getAttribute("src") ?? "";
        if (!src) return;

        const crop = parseCropFromStyle(img.getAttribute("style") ?? "");
        const width = parseWidthFromClass(img.getAttribute("class") ?? img.className ?? "");
        const originalTag = findImageTagInMdx(slide?.mdx_content ?? "", src);

        setImageEditor({ src, originalTag, width, ...crop });
      });
    });

    // Double-click text → inline edit
    doc.addEventListener("dblclick", (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") return;
      if (!target.matches(textSelectors)) return;
      if (target.children.length > 2) return;
      if (target.contentEditable === "true") return;
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
          const updatedContent = slide.mdx_content.replace(originalText, newText);
          if (updatedContent !== slide.mdx_content) {
            await fetch("/api/decks/slides", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: slide.id, mdx_content: updatedContent }),
            });
            setSlides((prev) => prev.map((s) => s.id === slide.id ? { ...s, mdx_content: updatedContent } : s));
          }
        }
      };

      target.addEventListener("blur", finish, { once: true });
      target.addEventListener("keydown", (ke) => {
        if (ke.key === "Enter" && !ke.shiftKey) { ke.preventDefault(); target.blur(); }
        if (ke.key === "Escape") { target.textContent = originalText; target.blur(); }
      });
    });
  }, [slide, iframeRef, editingInline, setSlides, setImageEditor]);

  return handleIframeLoad;
}
