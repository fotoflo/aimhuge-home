import { BoardDeck } from "./BoardDeck";
import { defaultInitiatives } from "./lib/data";
import { getRedis } from "@/lib/redis";
import type { Initiative } from "./lib/types";

export const metadata = {
  title: "WeGro — Board Deck",
  description: "WeGro Business Model Overview — Board of Directors",
};

async function getInitiatives(): Promise<Initiative[]> {
  try {
    const redis = getRedis();
    if (!redis) return defaultInitiatives;
    const data = await redis.get("wegro:priorities");
    if (data) return JSON.parse(data);
  } catch {
    // fall through
  }
  return defaultInitiatives;
}

export default async function BoardDeckPage() {
  const initiatives = await getInitiatives();
  return <BoardDeck initialPriorities={initiatives} />;
}
