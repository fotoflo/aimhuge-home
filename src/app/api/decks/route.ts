import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  // Fetch official decks
  const { data: decksData, error: dErr } = await supabase
    .from("decks")
    .select("deck_slug, title, description, target_audience, created_at, archived_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (dErr) {
    return NextResponse.json({ error: dErr.message }, { status: 500 });
  }

  // Fetch all slide rows to count them and discover legacy unmigrated decks.
  // We cannot restrict strictly to activeDeckSlugs because legacy decks are not in the decks table yet.
  const { data: slides } = await supabase
    .from("deck_slides")
    .select("deck_slug")
    .is("deleted_at", null);

  const slidesData = slides || [];

  const slideCounts = new Map<string, number>();
  for (const row of slidesData) {
    slideCounts.set(row.deck_slug, (slideCounts.get(row.deck_slug) ?? 0) + 1);
  }

  const decks = (decksData || []).map(deck => ({
    slug: deck.deck_slug,
    title: deck.title,
    description: deck.description,
    targetAudience: deck.target_audience,
    archivedAt: deck.archived_at,
    slideCount: slideCounts.get(deck.deck_slug) || 0
  }));

  // Maintain backward compatibility for older decks (if migration misses them)
  const legacySlugs = new Set(Array.from(slideCounts.keys()));
  for (const known of decks) {
    legacySlugs.delete(known.slug);
  }

  for (const legacySlug of legacySlugs) {
     decks.push({
       slug: legacySlug,
       title: legacySlug,
       description: "Legacy unmigrated deck",
       targetAudience: null,
       archivedAt: null,
       slideCount: slideCounts.get(legacySlug) || 0
     });
  }

  return NextResponse.json({ decks });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  
  try {
    const { slug, title, description, audience, wallOfText, brand } = await req.json();
    if (!slug || !title || !brand) return NextResponse.json({ error: "Slug, Title, and Brand are required" }, { status: 400 });

    // 1. Metadata
    const { error: dErr } = await supabase.from("decks").insert({
      deck_slug: slug,
      brand_slug: brand,
      title,
      description: description || null,
      target_audience: audience || null
    });
    
    if (dErr) {
       console.error("Failed to insert deck", dErr);
       return NextResponse.json({ error: "Failed to create deck. Slug likely exists." }, { status: 500 });
    }

    // 2. Default initial slide
    // If user provided a "wallOfText", we create a placeholder slide informing them AI is generating content.
    const slideHeadline = wallOfText ? `Generating: ${title}` : title;
    const bodyContent = wallOfText 
      ? `## AI is assembling your slides...\n\nPlease wait a few minutes, then refresh.`
      : `${description || "Let's build something huge."}`;

    const { error: sErr } = await supabase.from("deck_slides").insert({
       deck_slug: slug,
       slide_order: 0,
       frontmatter: { order: 0, title: "Title", level: 0, variant: "dark" },
       mdx_content: `## ${slideHeadline}\n\n${bodyContent}`
    });

    if (sErr) console.warn("Could not insert initial slide:", sErr);

    return NextResponse.json({ success: true, deckSlug: slug });
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
