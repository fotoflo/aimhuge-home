"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Upload } from "lucide-react";

interface UseImageDropzoneOptions {
  onUpload: (file: File) => Promise<void>;
  onComplete?: () => void;
}

export function useImageDropzone({ onUpload, onComplete }: UseImageDropzoneOptions) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(async (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;
    setUploading(true);
    try {
      for (const file of images) {
        await onUpload(file);
      }
      onComplete?.();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }, [onUpload, onComplete]);

  // Global paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      const files = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith("image/"));
      if (files.length === 0) return;
      e.preventDefault();
      uploadFiles(files);
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [uploadFiles]);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("Files")) setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragOver(false);
  }, []);

  const onDragOverHandler = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOver(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  }, [uploadFiles]);

  const dropzoneProps = {
    onDragEnter,
    onDragLeave,
    onDragOver: onDragOverHandler,
    onDrop,
  };

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) uploadFiles(files);
    e.target.value = "";
  }, [uploadFiles]);

  function DropzoneOverlay() {
    if (!dragOver) return null;
    return createPortal(
      <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none" style={{ backgroundColor: "rgba(124, 92, 252, 0.15)" }}>
        <div className="fixed inset-6 z-[201] flex items-center justify-center rounded-2xl border-2 border-dashed border-[#7c5cfc] pointer-events-none" style={{ backgroundColor: "rgba(124, 92, 252, 0.08)" }}>
          <div className="flex flex-col items-center gap-4 px-24 py-16 bg-[#16161a] rounded-2xl shadow-xl text-center border border-white/10">
            <Upload className="w-12 h-12 text-[#9b82fd]" />
            <span className="text-lg font-semibold text-white">Drop images to upload</span>
            <span className="text-sm text-slate-400">Images will be added to deck assets</span>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  function UploadButton({ className }: { className?: string }) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={className ?? "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 border border-white/10 text-slate-300 hover:bg-white/5"}
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </>
    );
  }

  return { dropzoneProps, DropzoneOverlay, UploadButton, uploading, dragOver };
}
