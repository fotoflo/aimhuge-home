#!/usr/bin/env node

/**
 * Generate blog cover images using Gemini 2.5 Flash Image
 * Model: gemini-2.5-flash-image (~$0.02 per image)
 *
 * Usage: GEMINI_API_KEY=... node scripts/generate-blog-images.mjs
 */

import { writeFileSync } from "fs";
import { join } from "path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY is required");
  process.exit(1);
}

const MODEL = "gemini-2.5-flash-image";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const OUTPUT_DIR = join(import.meta.dirname, "../public/images/blog");

const images = [
  {
    name: "done-skill-cover.png",
    prompt: `Generate a 1200x630 OG image for a blog post titled "How to Write a /done Skill for Claude Code".

Design: Dark background (#08080a). A stylized terminal window in the center with a subtle purple (#7c5cfc) glow/border. Inside the terminal, show this text clearly rendered in a monospace font:

/done summary
───────────────────────────
Phase              Time
───────────────────────────
Architecture docs   12s
Lint fix            18s
File sizes           5s
Tests + coverage     8s
Commit               3s
Report               1s
───────────────────────────
Total               47s

Below the terminal: "done." in purple text. Keep the overall feel dark, technical, and clean. No people, no stock photo feel. Developer aesthetic.`,
  },
  {
    name: "done-skill-pipeline.png",
    prompt: `Generate a 1200x630 technical diagram image.

Dark background (#08080a). Show 6 hexagonal nodes flowing left to right, connected by thin lines with a purple (#7c5cfc) gradient. Each hexagon contains an icon and label:

1. "Docs" (document icon)
2. "Lint" (checkmark icon)
3. "File Sizes" (bar chart icon)
4. "Tests" (flask icon)
5. "Commit" (git branch icon)
6. "Report" (clipboard icon)

A subtle purple glow connects them all. The style is minimal, dark-themed, and technical — like a CI/CD pipeline visualization. No text other than the labels. Clean lines, no clutter.`,
  },
  {
    name: "done-skill-before-after.png",
    prompt: `Generate a 1200x630 split-screen terminal comparison image.

Dark background (#08080a). The image is split vertically:

LEFT HALF — labeled "Before" in red/orange at the top:
A messy terminal showing scattered git status output:
  modified: src/app/page.tsx
  modified: src/lib/utils.ts
  new file: src/app/blog/page.tsx
  Untracked files...
  3 lint errors
  No docs updated

RIGHT HALF — labeled "After /done" in purple (#7c5cfc) at the top:
A clean terminal showing:
  ✓ 2 docs updated
  ✓ Lint clean
  ✓ 29 files tracked
  ✓ 12 tests passed
  ✓ 1 commit, 7 files staged
  done.

Thin purple divider line between the halves. Developer terminal aesthetic, monospace font, dark theme.`,
  },
];

async function generateImage(config) {
  console.log(`Generating ${config.name}...`);
  const start = Date.now();

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: config.prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
        temperature: 0.8,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart) {
    console.error("No image in response. Text parts:", parts.filter((p) => p.text).map((p) => p.text));
    throw new Error("No image data in response");
  }

  const buffer = Buffer.from(imagePart.inlineData.data, "base64");
  const outPath = join(OUTPUT_DIR, config.name);
  writeFileSync(outPath, buffer);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  ✓ ${config.name} (${elapsed}s, ${(buffer.length / 1024).toFixed(0)}KB)`);
}

async function main() {
  console.log(`Model: ${MODEL}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Estimated cost: $${(images.length * 0.02).toFixed(2)} (${images.length} images × $0.02)\n`);

  for (const img of images) {
    try {
      await generateImage(img);
    } catch (err) {
      console.error(`  ✗ ${img.name}: ${err.message}`);
    }
  }

  console.log("\nDone!");
}

main();
