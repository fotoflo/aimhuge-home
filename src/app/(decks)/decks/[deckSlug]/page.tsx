import { getSlides } from "@/app/decks/lib/slides-db";
import { MDXSlide } from "@/app/decks/components/MDXSlide";
import { DeckShell } from "@/app/decks/components/DeckShell";
import type { SlideFrontmatter } from "@/app/decks/lib/mdx-types";
import { getSupabase } from "@/lib/supabase";

export async function generateMetadata({ params }: { params: Promise<{ deckSlug: string }> }) {
  // Await the params
  const resolvedParams = await params;
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from("decks").select("title, description").eq("deck_slug", resolvedParams.deckSlug).single();
    if (data) {
      return {
        title: `${data.title} — AimHuge Presentation`,
        description: data.description || "Interactive Executive Deck",
      };
    }
  }
  return { title: "AimHuge Presentation" };
}

export const dynamic = "force-dynamic";

export default async function DeckViewerPage({ params }: { params: Promise<{ deckSlug: string }> }) {
  // Next 15+ async params
  const { deckSlug } = await params;
  const rows = await getSlides(deckSlug);

  if (!rows || rows.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#08080a] text-slate-400 p-8">
        <p>No slides found for <code className="text-accent">{deckSlug}</code>.</p>
      </div>
    );
  }

  const slides = rows.map((row) => (
    <MDXSlide
      key={row.id}
      frontmatter={row.frontmatter as SlideFrontmatter}
      content={row.mdx_content}
    />
  ));

  return <DeckShell slides={slides} />;
}
