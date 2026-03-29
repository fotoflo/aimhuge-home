import { getSupabase } from "@/lib/supabase";
import type { SlideFrontmatter } from "./mdx-types";

export interface SlideRow {
  id: string;
  deck_slug: string;
  slide_order: number;
  frontmatter: SlideFrontmatter;
  mdx_content: string;
  updated_at: string;
  deleted_at: string | null;
}

/** Fetch all slides for a deck, ordered by slide_order */
export async function getSlides(deckSlug: string): Promise<SlideRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("deck_slides")
    .select("*")
    .eq("deck_slug", deckSlug)
    .is("deleted_at", null)
    .order("slide_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch slides:", error);
    return [];
  }
  return data ?? [];
}

/** Upsert a single slide (by deck_slug + slide_order) */
export async function upsertSlide(
  deckSlug: string,
  slideOrder: number,
  frontmatter: SlideFrontmatter,
  mdxContent: string,
): Promise<SlideRow> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("deck_slides")
    .upsert(
      {
        deck_slug: deckSlug,
        slide_order: slideOrder,
        frontmatter,
        mdx_content: mdxContent,
        updated_at: new Date().toISOString(),
        deleted_at: null,
      },
      { onConflict: "deck_slug,slide_order" },
    )
    .select()
    .single();

  if (error) throw error;
  return data as SlideRow;
}

/** Update just the MDX content for a slide */
export async function updateSlideContent(
  id: string,
  mdxContent: string,
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("deck_slides")
    .update({ mdx_content: mdxContent, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

/** Update just the frontmatter for a slide */
export async function updateSlideFrontmatter(
  id: string,
  frontmatter: SlideFrontmatter,
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("deck_slides")
    .update({ frontmatter, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

/** Soft-delete a slide by setting deleted_at */
export async function softDeleteSlide(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("deck_slides")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}
