"use client";

import { useState, useEffect, useCallback } from "react";

export function useThumbnails(deckSlug: string) {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [generatingThumbs, setGeneratingThumbs] = useState(false);

  useEffect(() => {
    fetch(`/api/decks/thumbnails?deck=${deckSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.thumbnails) {
          const map: Record<string, string> = {};
          for (const t of data.thumbnails) map[t.id] = t.thumbnail_url;
          setThumbnails(map);
        }
      })
      .catch(() => {});
  }, [deckSlug]);

  const regenerateThumbnails = useCallback(async (slideIds?: string[]) => {
    setGeneratingThumbs(true);
    try {
      const res = await fetch(`/api/decks/thumbnails?deck=${deckSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slideIds ? { slideIds } : {}),
      });
      const data = await res.json();
      if (data.thumbnails) {
        setThumbnails((prev) => {
          const next = { ...prev };
          for (const t of data.thumbnails) next[t.id] = t.thumbnail_url + "?t=" + Date.now();
          return next;
        });
      }
    } finally {
      setGeneratingThumbs(false);
    }
  }, [deckSlug]);

  return { thumbnails, generatingThumbs, regenerateThumbnails };
}
