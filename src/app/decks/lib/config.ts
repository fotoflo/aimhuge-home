import { getRedis } from "@/lib/redis";

/**
 * Read a deck config from Redis.
 * Key format: `deck:{slug}:{field}` — e.g. `deck:wegro-board:priorities`
 *
 * Returns parsed JSON or the provided fallback if Redis is unavailable or key is empty.
 */
export async function getDeckConfig<T>(slug: string, field: string, fallback: T): Promise<T> {
  try {
    const redis = getRedis();
    if (!redis) return fallback;
    const raw = await redis.get(`deck:${slug}:${field}`);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // fall through
  }
  return fallback;
}

/**
 * Write a deck config to Redis.
 */
export async function setDeckConfig<T>(slug: string, field: string, data: T): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
  await redis.set(`deck:${slug}:${field}`, JSON.stringify(data));
}
