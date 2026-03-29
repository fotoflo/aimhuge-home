# Priyoshop Executive Training Deck

## Overview

A full-day AI productivity workshop deck for Priyoshop's leadership team in Dhaka, Bangladesh. The deck is stored as MDX slides in Supabase (`deck_slug: "priyoshop-exec"`) and rendered via the shared deck system.

## Slide Structure (36 slides)

The deck has two rendering paths:
1. **Production (DB-backed):** `page.tsx` fetches from Supabase via `getSlides("priyoshop-exec")` → renders as MDX through `MDXSlide`
2. **Legacy React components:** `ExecDeck.tsx` imports individual slide components from `slides/` — these are development-time references but NOT used by the production page

### Content Sections

| Order | Section | Slides | Notes |
|-------|---------|--------|-------|
| 0 | Title | 1 | Hero variant |
| 1 | Agenda | 1 | Full-day schedule with QR code (DB version) |
| 2 | Silent Meeting | 1 | Background image (hallwaybg.jpg) |
| 3–8 | What is AI? | 6 | LLM, Tool Use, Multimodal, Frontier Models, Getting Cheaper |
| 9–16 | Interacting with AI | 8 | Voice, Screenshots, Prompts between AIs, Pasting docs, Summarizing, Meta-prompting, AI interviewing, Pushing back |
| 17 | Artifacts | 1 | What AI can create |
| 18 | Activity: Paste an Image | 1 | Hands-on exercise |
| 19–23 | Context Window | 5 | Window concept, growth, lost-in-middle, quiz |
| 24 | Write Your Context | 1 | Exercise with team roster |
| 25 | Setup Cowork | 1 | Connect Google Drive & Calendar |
| 26 | Skills | 1 | Reusable saved instructions |
| 27–33 | Hands-On Exercises | 7 | Writing, Spreadsheets, Documents, Data, Email/Calendar, Interviewing, Presentations |
| 34 | Claude Code | 1 | Live demo |
| 35 | Closing | 1 | Thank you / contact |

### Variant Alternation

Slides alternate between `dark` and `light` variants for visual variety. The pattern resets at section boundaries.

## Key Files

| File | Purpose |
|------|---------|
| `page.tsx` | Production entry — fetches MDX slides from Supabase |
| `ExecDeck.tsx` | Legacy React component assembly (not used in production) |
| `lib/data.ts` | Workshop config (date, audience, location) |
| `lib/types.ts` | DeckConfig TypeScript type |
| `aimhuge.css` | Theme overrides + custom animations (matrixFall, pulse) |
| `slides/*.tsx` | React slide components (reference implementations) |

## Managing Slides

Slides are managed via the Supabase-backed API:

- **Add slides:** `PUT /api/decks/slides` with `deck_slug`, `slide_order`, `frontmatter`, `mdx_content`
- **Edit content:** `PATCH /api/decks/slides` with `id` and `mdx_content`
- **Reorder:** `POST /api/decks/slides/reorder`
- **Delete:** `DELETE /api/decks/slides` (soft-delete)
- **Bulk operations:** Use scripts in `scripts/` (e.g., `upsert-new-slides.ts`)
- **Thumbnails:** `POST /api/decks/thumbnails?deck=priyoshop-exec` regenerates all

## Dependencies

- `qrcode.react` — QR code SVG generation (used in Agenda slide React component)
- `next-mdx-remote` — server-side MDX rendering
- Supabase Storage — background images and thumbnails
