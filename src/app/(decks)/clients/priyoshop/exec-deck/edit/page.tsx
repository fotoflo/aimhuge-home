import { getSlides } from "@/app/decks/lib/slides-db";
import { SlideEditor } from "@/app/decks/components/Editor/SlideEditor";

export const metadata = {
  title: "Edit — Priyoshop Exec Deck",
};

export const dynamic = "force-dynamic";

export default async function EditPage() {
  const slides = await getSlides("priyoshop-exec");
  return <SlideEditor initialSlides={slides} deckSlug="priyoshop-exec" viewerPath="/clients/priyoshop/exec-deck" />;
}
