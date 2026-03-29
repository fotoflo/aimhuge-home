# Priyoshop Executive Training Deck

## Overview

A full-day AI productivity workshop deck for Priyoshop's leadership team in Dhaka, Bangladesh. The deck is stored as MDX slides in Supabase (`deck_slug: "priyoshop-exec"`) and rendered via the shared deck system. The deck includes a full-featured AI Copilot editor with streaming responses, dynamic suggestions, and version history.

## Slide Structure (44 slides)

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
| 35+ | Business Value & Security | ~9 | ROI, Risk, Security, Governance |

### Variant Alternation

Slides alternate between `dark` and `light` variants for visual variety. The pattern resets at section boundaries.

## Key Files

| File | Purpose |
|------|---------|
| `page.tsx` | Production entry — fetches MDX slides from Supabase |
| `ExecDeck.tsx` | Legacy React component assembly (not used in production) |
| `edit/SlideEditor.tsx` | Full-featured slide editor with AI Copilot, zoom, keyboard nav |
| `edit/components/PromptSidebar.tsx` | AI Copilot sidebar: Editor, Tips, and History tabs |
| `edit/components/SlideSidebar.tsx` | Left panel: slide navigator with drag-to-reorder, context menu, accordion grouping, and thumbnails |
| `lib/data.ts` | Workshop config (date, audience, location) |
| `lib/types.ts` | DeckConfig TypeScript type |
| `aimhuge.css` | Theme overrides + custom animations (matrixFall, pulse) |
| `slides/*.tsx` | React slide components (reference implementations) |

## AI Copilot System

The editor includes a streaming AI assistant powered by Gemini:

### Architecture

1. **Streaming Prompt API** (`/api/decks/slides/prompt`):
   - Uses `generateContentStream` for real-time token delivery
   - Streams conversational reasoning first, then MDX/JSON code blocks
   - Supports tool use (image generation via Gemini Imagen)
   - Saves version snapshots before applying AI changes
   - `maxDuration = 60` for Vercel serverless compatibility

2. **Dynamic Suggestions API** (`/api/decks/slides/suggestions`):
   - Gemini Vision analyzes the current slide screenshot
   - Receives narrative context: TOC, previous/next slide content
   - Returns 3-5 context-aware, actionable layout suggestions
   - Results cached per-slide in a `useRef` to avoid redundant API calls

3. **PromptSidebar** (3 tabs):
   - **Editor**: Chat-style UI with user prompt + AI copilot bubbles, textarea input
   - **Tips**: Lazy-loaded AI suggestions with skeleton loader; fetched only when tab is opened
   - **History**: Version timeline with thumbnail previews and one-click revert

### Canvas Constraints

The system prompt enforces strict 1920×1080 canvas bounds. All typography, spacing, and layout suggestions respect these dimensions.

## Managing Slides

Slides are managed via the Supabase-backed API:

- **Add slides (end):** `PUT /api/decks/slides` with `deck_slug`, `slide_order`, `frontmatter`, `mdx_content`
- **Insert slide:** `POST /api/decks/slides/insert` with `deck_slug`, `insert_index`, and sequentially shifts subsequent orders
- **Edit content:** `PATCH /api/decks/slides` with `id` and `mdx_content`
- **Reorder:** `POST /api/decks/slides/reorder`
- **Delete:** `DELETE /api/decks/slides` (soft-delete via context menu)
- **Skip:** `PATCH /api/decks/slides` to toggle `{ skip: true }` in frontmatter (visibly skipped in sidebar)
- **Bulk operations:** Use scripts in `scripts/` (e.g., `upsert-new-slides.ts`)
- **Thumbnails:** `POST /api/decks/thumbnails?deck=priyoshop-exec` regenerates all
- **AI Edit:** `POST /api/decks/slides/prompt` with streaming response
- **AI Suggestions:** `POST /api/decks/slides/suggestions` with slide context + screenshot

## Dependencies

- `qrcode.react` — QR code SVG generation (used in Agenda slide React component)
- `next-mdx-remote` — server-side MDX rendering
- `@google/genai` — Gemini API for streaming AI copilot and suggestions
- Supabase Storage — background images and thumbnails
