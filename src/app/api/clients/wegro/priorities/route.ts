import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const REDIS_KEY = "wegro:priorities";

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(null);
  }
  try {
    const data = await redis.get(REDIS_KEY);
    return NextResponse.json(data ? JSON.parse(data) : null);
  } catch {
    return NextResponse.json(null);
  }
}

export async function PUT(request: Request) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 503 });
  }
  try {
    const body = await request.json();
    await redis.set(REDIS_KEY, JSON.stringify(body));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
