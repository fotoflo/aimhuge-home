/**
 * Upload all images from public/images/ to Supabase Storage (deck-assets bucket).
 * Run with: npx tsx scripts/upload-images-to-supabase.ts
 *
 * After uploading, prints a mapping of local paths → public URLs
 * that can be used to find-and-replace references in the codebase.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join, extname } from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const BUCKET = "deck-assets";
const IMAGES_DIR = join(process.cwd(), "public/images");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
};

async function main() {
  const files = readdirSync(IMAGES_DIR).filter((f) => {
    const ext = extname(f).toLowerCase();
    return ext in MIME_TYPES;
  });

  console.log(`Found ${files.length} images to upload.\n`);

  const mapping: { local: string; remote: string }[] = [];

  for (const file of files) {
    const filePath = join(IMAGES_DIR, file);
    const ext = extname(file).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
    const remotePath = `site-images/${file}`;

    const buffer = readFileSync(filePath);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(remotePath, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`✗ ${file}: ${error.message}`);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(remotePath);

    mapping.push({ local: `/images/${file}`, remote: publicUrl });
    console.log(`✓ ${file} → ${publicUrl}`);
  }

  console.log(`\n── Mapping (${mapping.length} files) ──\n`);
  for (const m of mapping) {
    console.log(`${m.local}  →  ${m.remote}`);
  }
}

main();
