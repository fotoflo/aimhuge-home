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

/** Fetch a single slide by ID */
export async function getSlideById(id: string): Promise<SlideRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("deck_slides")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Failed to fetch slide:", error);
    return null;
  }
  return data as SlideRow;
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

  // Snapshot existing slide before overwriting
  const { data: existing } = await supabase
    .from("deck_slides")
    .select("id")
    .eq("deck_slug", deckSlug)
    .eq("slide_order", slideOrder)
    .single();

  if (existing) {
    await saveVersionSnapshot(existing.id, "upsert");
  }

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

  await saveVersionSnapshot(id, "manual");

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

  await saveVersionSnapshot(id, "manual");

  const { error } = await supabase
    .from("deck_slides")
    .update({ frontmatter, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

// ── Version history ──

export interface SlideVersion {
  id: string;
  slide_id: string;
  deck_slug: string;
  slide_order: number;
  frontmatter: SlideFrontmatter;
  mdx_content: string;
  version_number: number;
  change_source: string | null;
  created_at: string;
  thumbnail_url?: string;
}

/** Save a snapshot of the current slide state before mutating it */
export async function saveVersionSnapshot(
  slideId: string,
  changeSource: string,
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  // Fetch current state
  const { data: slide, error: fetchErr } = await supabase
    .from("deck_slides")
    .select("*")
    .eq("id", slideId)
    .single();

  if (fetchErr || !slide) return;

  // Compute next version number in a single insert+select
  const { data: maxRow } = await supabase
    .from("slide_versions")
    .select("version_number")
    .eq("slide_id", slideId)
    .order("version_number", { ascending: false })
    .limit(1)
    .single();

  const nextVersion = (maxRow?.version_number ?? 0) + 1;

  const { data: inserted, error: insertErr } = await supabase
    .from("slide_versions")
    .insert({
      slide_id: slideId,
      deck_slug: slide.deck_slug,
      slide_order: slide.slide_order,
      frontmatter: slide.frontmatter,
      mdx_content: slide.mdx_content,
      version_number: nextVersion,
      change_source: changeSource,
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    console.error("Failed to insert version:", insertErr);
    return;
  }

  // Attempt to hard-copy the current thumbnail for this exact version snapshot
  const sourcePath = `thumbnails/${slide.deck_slug}/${slideId}.webp`;
  const destPath = `thumbnails/versions/${inserted.id}.webp`;
  const { error: copyErr } = await supabase.storage.from("deck-assets").copy(sourcePath, destPath);
  if (copyErr) {
    console.warn("Could not copy thumbnail for version snapshot (it may not exist):", copyErr);
  }
}

/** Get all versions for a slide, newest first */
export async function getSlideVersions(slideId: string): Promise<SlideVersion[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("slide_versions")
    .select("*")
    .eq("slide_id", slideId)
    .order("version_number", { ascending: false });

  if (error) {
    console.error("Failed to fetch slide versions:", error);
    return [];
  }

  // Inject thumbnail URL dynamically
  const versions = data ?? [];
  return versions.map((v) => {
    const { data: { publicUrl } } = supabase.storage
      .from("deck-assets")
      .getPublicUrl(`thumbnails/versions/${v.id}.webp`);
    return {
      ...v,
      thumbnail_url: `${publicUrl}?t=${Date.now()}`,
    };
  });
}

/** Revert a slide to a previous version (saves current state first) */
export async function revertToVersion(
  slideId: string,
  versionId: string,
): Promise<SlideRow> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  // Save current state before reverting
  await saveVersionSnapshot(slideId, "revert");

  // Fetch the target version
  const { data: version, error: vErr } = await supabase
    .from("slide_versions")
    .select("*")
    .eq("id", versionId)
    .single();

  if (vErr || !version) throw new Error("Version not found");

  // Apply the old state
  const { data, error } = await supabase
    .from("deck_slides")
    .update({
      mdx_content: version.mdx_content,
      frontmatter: version.frontmatter,
      updated_at: new Date().toISOString(),
    })
    .eq("id", slideId)
    .select()
    .single();

  if (error) throw error;
  return data as SlideRow;
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
