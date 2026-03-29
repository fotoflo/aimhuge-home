"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

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
  slideCount: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [decks, setDecks] = useState<DeckInfo[]>([]);
  const [fetching, setFetching] = useState(true);

  const email = user?.email ?? "";
  const isAllowed = email === ALLOWED_EMAIL;

  useEffect(() => {
    if (!isAllowed) return;
    fetch("/api/decks")
      .then((r) => r.json())
      .then((data) => setDecks(data.decks ?? []))
      .finally(() => setFetching(false));
  }, [isAllowed]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-muted">Loading...</p>
      </div>
    );
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
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <a
          href="/tokens"
          className="rounded-full border border-accent text-accent px-4 py-2 text-sm font-medium hover:bg-accent/10 transition-colors flex items-center gap-2"
        >
          Token Terminal
        </a>
      </div>

      <h2 className="text-xl font-semibold mb-6">Decks</h2>

      {fetching ? (
        <p className="text-muted">Loading decks...</p>
      ) : decks.length === 0 ? (
        <p className="text-muted">No decks found in the database.</p>
      ) : (
        <div className="grid gap-4">
          {decks.map((deck) => {
            const route = DECK_ROUTES[deck.slug];
            return (
              <div
                key={deck.slug}
                className="rounded-xl border border-card-border p-6 flex items-center justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold">
                    {route?.name ?? deck.slug}
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    Slug: <code className="text-accent">{deck.slug}</code>
                    {" · "}
                    {deck.slideCount} slide{deck.slideCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {route && (
                    <a
                      href={route.path}
                      className="rounded-full border border-card-border px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                    >
                      View
                    </a>
                  )}
                  {route?.editPath && (
                    <a
                      href={route.editPath}
                      className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
                    >
                      Edit
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
