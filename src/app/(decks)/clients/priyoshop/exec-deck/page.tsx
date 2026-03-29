import { getSlides } from "@/app/decks/lib/slides-db";
import { MDXSlide } from "@/app/decks/components/MDXSlide";
import { DeckShell } from "@/app/decks/components/DeckShell";
import type { SlideFrontmatter } from "@/app/decks/lib/mdx-types";

export const metadata = {
  title: "AimHuge × Priyoshop — Executive Training Deck",
  description: "AI Productivity Workshop for Priyoshop Leadership Team",
};

export const dynamic = "force-dynamic";

export default async function ExecDeckPage() {
  const rows = await getSlides("priyoshop-exec");

  const slides = rows.map((row) => (
    <MDXSlide
      key={row.id}
      frontmatter={row.frontmatter as SlideFrontmatter}
      content={row.mdx_content}
    />
  ));

  return <DeckShell slides={slides} />;
}
