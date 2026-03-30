import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * POST /api/decks/slides/reorder
 *
 * Reorder slides by providing an array of { id, slide_order } pairs.
 * Only updates slide_order — content and frontmatter are untouched.
 *
 * Body:
 * {
 *   "slides": [
 *     { "id": "uuid-1", "slide_order": 10 },
 *     { "id": "uuid-2", "slide_order": 20 },
 *     ...
 *   ]
 * }
 *
 * To move slide 3 between slides 1 and 2, assign it an order between them:
 * { "id": "slide-3-uuid", "slide_order": 15 }
 *
 * Or renumber the whole deck in one call.
 */
export async function POST(req: NextRequest) {
  const { slides } = await req.json();

  if (!Array.isArray(slides) || slides.length === 0) {
    return NextResponse.json({ error: "Missing slides array" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // Use a transaction-like approach: temporarily set orders to negative
  // to avoid unique constraint conflicts, then set final values
  const now = new Date().toISOString();

  // Phase 1: set all to negative temporaries
  const phase1Promises = slides.map((slide: { id: string, slide_order: number }, i: number) => 
    supabase.from("deck_slides").update({ slide_order: -(100000 + i), updated_at: now }).eq("id", slide.id)
  );
  const results1 = await Promise.all(phase1Promises);
  const error1 = results1.find(r => r.error)?.error;
  if (error1) {
    return NextResponse.json({ error: `Failed phase 1: ${error1.message}` }, { status: 500 });
  }

  // Phase 2: set final values
  const phase2Promises = slides.map((slide: { id: string, slide_order: number }) => 
    supabase.from("deck_slides").update({ slide_order: slide.slide_order, updated_at: now }).eq("id", slide.id)
  );
  const results2 = await Promise.all(phase2Promises);
  const error2 = results2.find(r => r.error)?.error;
  if (error2) {
    return NextResponse.json({ error: `Failed phase 2: ${error2.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, updated: slides.length });
}
