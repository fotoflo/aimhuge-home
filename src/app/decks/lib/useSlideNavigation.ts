"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Creates a slide navigation store scoped to a specific total/startAt.
 * Returns subscribe + getSnapshot functions for useSyncExternalStore.
 */
function createSlideStore(total: number, startAt: number) {
  let override: number | null = null;
  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((l) => l());
  }

  function subscribe(callback: () => void) {
    listeners.add(callback);
    const onHashChange = () => {
      override = null;
      callback();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("hashchange", onHashChange);
    };
  }

  function getSnapshot(): number {
    if (override !== null) return override;
    const match = window.location.hash.match(/^#slide-(\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10) - 1;
      if (idx >= 0 && idx < total) return idx;
    }
    return startAt;
  }

  function getServerSnapshot(): number {
    return startAt;
  }

  function navigate(index: number) {
    override = index;
    window.location.replace(`#slide-${index + 1}`);
    notify();
  }

  return { subscribe, getSnapshot, getServerSnapshot, navigate };
}

/**
 * Core slide navigation hook.
 *
 * Uses useSyncExternalStore for URL hash sync.
 * No useState/useEffect — satisfies strict React 19 lint rules.
 */
export function useSlideNavigation(total: number, startAt = 0) {
  const store = useMemo(() => createSlideStore(total, startAt), [total, startAt]);

  const current = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const next = useCallback(() => {
    store.navigate((store.getSnapshot() + 1) % total);
  }, [store, total]);

  const prev = useCallback(() => {
    store.navigate((store.getSnapshot() - 1 + total) % total);
  }, [store, total]);

  return { current, next, prev, ready: true };
}
