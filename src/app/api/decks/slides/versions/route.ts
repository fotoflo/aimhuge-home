import { NextRequest, NextResponse } from "next/server";
import { getSlideVersions } from "@/app/decks/lib/slides-db";

/** GET /api/decks/slides/versions?slideId=xxx */
export async function GET(req: NextRequest) {
  const slideId = req.nextUrl.searchParams.get("slideId");
  if (!slideId) return NextResponse.json({ error: "Missing slideId" }, { status: 400 });

  const versions = await getSlideVersions(slideId);
  return NextResponse.json({ slideId, versions });
}
