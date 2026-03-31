import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables before importing Next.js/application code
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

// Import existing libraries
import { getSupabase } from "../src/lib/supabase";
import { updateEmbeddingForSlide } from "../src/app/decks/lib/slides-db";

async function backfillEmbeddings() {
  const supabase = getSupabase();
  if (!supabase) {
    console.error("Supabase not configured");
    return;
  }

  console.log("Fetching slides without embeddings...");

  // Get all slides where embedding is null
  const { data: slides, error } = await supabase
    .from("deck_slides")
    .select("id, deck_slug")
    .is("embedding", null);

  if (error) {
    console.error("Failed to fetch slides:", error);
    return;
  }

  if (!slides || slides.length === 0) {
    console.log("No slides need backfilling! All clear.");
    return;
  }

  console.log(`Found ${slides.length} slides to backfill.`);

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    console.log(`[${i + 1}/${slides.length}] Generating embedding for slide ${slide.id} (Deck: ${slide.deck_slug})...`);
    
    try {
      await updateEmbeddingForSlide(slide.id);
      successCount++;
    } catch (err) {
      console.error(`Failed on slide ${slide.id}:`, err);
      failureCount++;
    }

    // Small delay to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n--- Backfill Complete ---");
  console.log(`Successfully embedded: ${successCount}`);
  if (failureCount > 0) {
    console.warn(`Failed: ${failureCount}`);
  }
}

backfillEmbeddings().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
