import { ExecDeck } from "./ExecDeck";
import { defaultConfig } from "./lib/data";
import { getDeckConfig } from "@/app/decks/lib/config";
import type { DeckConfig } from "./lib/types";

export const metadata = {
  title: "AimHuge × Priyoshop — Executive Training Deck",
  description: "AI Productivity Workshop for Priyoshop Leadership Team",
};

export default async function ExecDeckPage() {
  const config = await getDeckConfig<DeckConfig>("priyoshop-exec", "config", defaultConfig);
  return <ExecDeck config={config} />;
}
