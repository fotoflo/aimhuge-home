"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function ImageModal({
  previewSrc,
  fullSrc,
  alt,
  width,
  height,
  className
}: {
  previewSrc: string;
  fullSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="block relative w-full h-full text-left group"
        aria-label={`Expand image: ${alt}`}
      >
        <Image
          src={previewSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-card-bg/80 border border-card-border rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
              <path d="M11 8v6"/>
              <path d="M8 11h6"/>
            </svg>
          </div>
        </div>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
            aria-label="Close full-screen image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
          
          <div className="relative w-full max-w-[1920px] h-[90vh] flex items-center justify-center">
            <Image
              src={fullSrc}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              quality={100}
            />
          </div>
        </div>
      )}
    </>
  );
}
