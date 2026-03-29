import { NextRequest, NextResponse } from "next/server";
import { revertToVersion } from "@/app/decks/lib/slides-db";

/** POST /api/decks/slides/versions/revert — revert a slide to a previous version */
export async function POST(req: NextRequest) {
  const { slideId, versionId } = await req.json();

  if (!slideId || !versionId) {
    return NextResponse.json({ error: "Missing slideId or versionId" }, { status: 400 });
  }

  try {
    const slide = await revertToVersion(slideId, versionId);
    return NextResponse.json({ ok: true, slide });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Revert failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
