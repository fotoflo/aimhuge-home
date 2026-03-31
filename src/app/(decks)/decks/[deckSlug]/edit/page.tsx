import { getSlides } from "@/app/decks/lib/slides-db";
import { SlideEditor } from "@/app/decks/components/Editor/SlideEditor";

export const metadata = {
  title: "Deck Editor",
};

export const dynamic = "force-dynamic";

export default async function DeckEditorPage({ params }: { params: Promise<{ deckSlug: string }> }) {
  const { deckSlug } = await params;
  const slides = await getSlides(deckSlug);
  return <SlideEditor initialSlides={slides} deckSlug={deckSlug} />;
}
