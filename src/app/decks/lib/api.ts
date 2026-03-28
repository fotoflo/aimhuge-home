import { NextResponse } from "next/server";
import { getDeckConfig, setDeckConfig } from "./config";

/**
 * Create GET and PUT handlers for a deck config field.
 *
 * Usage in a route.ts:
 * ```ts
 * import { deckConfigRoute } from "@/app/decks/lib/api";
 * export const { GET, PUT } = deckConfigRoute("wegro-board", "priorities", defaultData);
 * ```
 */
export function deckConfigRoute<T>(slug: string, field: string, fallback: T) {
  return {
    async GET() {
      try {
        const data = await getDeckConfig<T>(slug, field, fallback);
        return NextResponse.json(data);
      } catch {
        return NextResponse.json(fallback);
      }
    },

    async PUT(request: Request) {
      try {
        const body = await request.json();
        await setDeckConfig(slug, field, body);
        return NextResponse.json({ ok: true });
      } catch {
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
      }
    },
  };
}
