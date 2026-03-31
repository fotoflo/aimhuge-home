"use client";

export function ClientLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-10 h-10 object-contain rounded-md bg-white/10"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
