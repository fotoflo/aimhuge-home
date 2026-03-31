import { NextRequest, NextResponse } from "next/server";
import { generateSlideEmbedding } from "@/lib/gemini";
import { getSimilarSlides } from "@/app/decks/lib/slides-db";

/**
 * GET /api/decks/search?q=query&deck=deck-slug
 * Returns the top semantically matching slide IDs.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const deck = searchParams.get("deck");

  if (!q || !deck) {
    return NextResponse.json({ error: "Missing 'q' or 'deck' parameter" }, { status: 400 });
  }

  try {
    // Generate embedding for the search query
    const queryEmbedding = await generateSlideEmbedding(q);

    // Fetch top 5 matching slides (lower threshold for keyword-to-document matching)
    const similarSlides = await getSimilarSlides(queryEmbedding, deck, null, 0.0, 5);

    // Return just the IDs and their similarity scores
    const results = similarSlides.map(s => ({
      id: s.id,
      similarity: s.similarity,
      title: s.frontmatter?.title || "Untitled"
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 });
  }
}
