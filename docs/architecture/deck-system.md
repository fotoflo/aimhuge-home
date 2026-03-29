# Deck System

## Overview

A reusable slide deck framework with MDX-based content stored in Supabase, rendered at request time via `next-mdx-remote`. Supports presentation mode (click/keyboard navigation), a visual editor with AI-assisted slide editing (Gemini 2.5 Flash), inline text editing, image resize/crop, thumbnail caching, and light table view.

## Route Groups

Decks live in a `(decks)` route group with its own root `<html>` layout — completely isolated from the main site's nav/footer. The main site is in a `(site)` route group.

```
src/app/
  layout.tsx              # Pass-through root (renders children)
  (site)/                 # Main website — has nav, footer, analytics
    layout.tsx            # Full site root layout
    globals.css
    page.tsx, about/, blog/, etc.
  (decks)/                # Decks — minimal <html>/<body>, no site chrome
    layout.tsx            # Deck root layout (imports globals.css for Tailwind)
    clients/priyoshop/exec-deck/
    clients/wegro/board-deck/
```

## Key Files

### Shared Deck Kit (`src/app/decks/`)

| File | Purpose |
|------|---------|
| `components/DeckShell.tsx` | Top-level container — renders slides at 1920x1080, scales to viewport via `useSyncExternalStore`, Cmd+scroll zoom |
| `components/SlideShell.tsx` | Slide chrome wrapper — variant styling, logo, title, subtitle, background image support |
| `components/MDXSlide.tsx` | Renders MDX content via `next-mdx-remote/rsc`, wraps in SlideShell using frontmatter, handles string→object style conversion, strips `cursor:pointer` from MDX source to prevent hydration mismatches |
| `components/SlideImageEditor.tsx` | Modal image editor with corner resize handles and inset-based crop (ported from habitcal) |
| `components/Card.tsx` | Card, CardTitle, CardText, CardList components available in MDX |
| `components/Stat.tsx`, `Tag.tsx` | Stat/Tag components available in MDX |
| `lib/useSlideNavigation.ts` | Hook: `useSyncExternalStore`-based slide index + URL hash sync + `postMessage` listener for editor-driven navigation (no useState/useEffect — strict React 19 compliant) |
| `lib/useSlideControls.ts` | Hook: keyboard (arrows, space) + split-screen click navigation, disabled in `?edit` mode |
| `lib/slides-db.ts` | Supabase CRUD for `deck_slides` table (soft-delete via `deleted_at`) + version history (snapshot, list, revert) |
| `lib/mdx-types.ts` | TypeScript types for SlideFrontmatter, MDXSlideModule |
| `lib/editor-utils.ts` | Pure utility functions: reorder cursor tracking, indent/outdent, width↔class mapping, image tag building/parsing, crop parsing, resize/crop geometry |
| `lib/viewport.ts` | Pure functions for slide scaling (`computeSlideScale`), wheel zoom clamping, click-half navigation |
| `lib/hooks/useThumbnails.ts` | Hook: thumbnail fetching + regeneration for a deck |
| `lib/hooks/useEditorKeyboard.ts` | Hook: Tab indent/outdent + Arrow key slide navigation |
| `lib/hooks/useInlineEditing.ts` | Hook: iframe image-click + double-click text inline editing |
| `deck.css` | Base slide CSS — fixed 1920x1080 `.slide` inside `.slide-container`, variant backgrounds, image constraints |

### Priyoshop Exec Deck (`src/app/(decks)/clients/priyoshop/exec-deck/`)

| File | Purpose |
|------|---------|
| `page.tsx` | Server component — fetches slides from Supabase, renders with DeckShell + MDXSlide |
| `edit/page.tsx` | Editor page — fetches slides, renders SlideEditor (auth-gated) |
| `edit/SlideEditor.tsx` | Main editor — iframe preview, thumbnails, AI prompt, inline editing, image editor, light table |
| `edit/components/EditorTopBar.tsx` | Top bar — nav arrows, zoom dropdown, light table toggle, assets, present, fullscreen |
| `edit/components/SlideSidebar.tsx` | Left sidebar — cached thumbnail previews, drag-and-drop reorder (`@dnd-kit`), click to navigate, indentation display |
| `edit/components/PromptSidebar.tsx` | Right sidebar — slide info, example prompts, AI prompt textarea |
| `edit/components/AssetPanel.tsx` | Asset browser — grid of uploaded images, click to copy URL |
| `edit/components/LightTable.tsx` | Grid view of all slides with cached thumbnails |
| `layout.tsx` | Deck layout with Geist font |
| `aimhuge.css` | AimHuge theme CSS variables |

### API Routes

| Route | Purpose |
|-------|---------|
| `GET /api/decks` | List all deck slugs with slide counts |
| `GET /api/decks/summary?deck=<slug>` | Lightweight slide index (no content) |
| `GET /api/decks/slides?deck=<slug>` | Full slides with MDX content |
| `PUT /api/decks/slides` | Upsert slide (create or full replace) |
| `PATCH /api/decks/slides` | Update slide content by id |
| `DELETE /api/decks/slides` | Soft-delete slide by id |
| `POST /api/decks/slides/reorder` | Reorder slides (two-phase update to avoid unique constraint conflicts) |
| `POST /api/decks/slides/prompt` | AI-powered slide edit via Gemini 2.5 Flash. Returns a **text/plain stream**. Snapshots version before edit. |
| `GET /api/decks/slides/versions?slideId=<id>` | List version history for a slide, newest first |
| `POST /api/decks/slides/versions/revert` | Revert a slide to a previous version (snapshots current state first) |
| `GET /api/decks/thumbnails?deck=<slug>` | Get cached thumbnail URLs from Supabase Storage |
| `POST /api/decks/thumbnails?deck=<slug>` | Generate thumbnails via Puppeteer + sharp, upload to Supabase Storage |
| `POST /api/assets` | Upload image to Supabase Storage |
| `GET /api/assets` | List uploaded assets |

### Deck Listing (`src/app/(site)/decks/`)

| File | Purpose |
|------|---------|
| `page.tsx` | Client page listing all deck slugs from Supabase — gated to `fotoflo@gmail.com`, uses `<a>` tags (not `<Link>`) for cross-route-group navigation to `(decks)` |

### Auth & Infrastructure

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Server-side Supabase client (service role key) |
| `src/lib/supabase-browser.ts` | Browser-side Supabase client |
| `src/lib/supabase-server.ts` | Server-side Supabase client with cookie auth |
| `src/lib/chromium-launcher.ts` | Puppeteer Chrome launcher (local macOS or Vercel serverless) |
| `src/lib/hooks/useAuth.ts` | Client hook: Google OAuth sign-in/out, user state |
| `src/lib/hooks/useImageDropzone.tsx` | Global paste/drag-to-upload for images |
| `src/app/auth/callback/route.ts` | OAuth code exchange callback |

## Slide Rendering

Slides are fixed at 1920x1080px and scaled to fit the viewport:

```
.slide-container (100vw x 100vh, flex center, black bg)
  └── div (transform: scale(autoScale * userZoom))
       └── .slide (1920x1080, overflow: hidden)
            └── content
```

- `autoScale` = `min(viewportWidth/1920, viewportHeight/1080)`
- Cmd+scroll wheel adjusts `userZoom` (0.25x–3x)
- Content never overflows — `overflow: hidden` on `.slide`
- Inline images constrained to `max-height: 900px` (background `fill` images excluded via `:not([data-nimg="fill"])` selector)

## Editor ↔ Iframe Communication

The editor (`SlideEditor`) embeds the viewer (`DeckShell`) in an iframe. Navigation between slides uses **`postMessage`** — the editor sends `{ type: "goToSlide", index }` and `useSlideNavigation` inside the iframe listens for it.

**Why not `location.replace`?** Calling `iframe.contentWindow.location.replace('#slide-N')` triggers `hashchange` events inside the iframe, which feeds back into `useSyncExternalStore`'s subscription → `getSnapshot` loop, causing recursive rendering. `postMessage` sets an override directly without touching the URL hash, breaking the cycle.

The iframe uses a **static `src`** (`/clients/priyoshop/exec-deck?edit=true#slide-1`) and **static `key`** (`refreshKey`). The `key` only changes when slide content is updated (AI edit, reorder), forcing an iframe remount. After remount, `handleIframeLoad` sends a `postMessage` to navigate to the current slide.

## Editor Features

- **Slide preview** — iframe at selectable zoom level (25%–200% or Fit)
- **Slide thumbnails** — Puppeteer-generated WebP images cached in Supabase Storage
- **Light table** — 3-column grid of all slide thumbnails, click to jump
- **AI prompt** — right sidebar, powered by Gemini 2.5 Flash. Now utilizes a **streaming response** architecture for real-time conversational feedback and slide updates. Passes the active slide thumbnail to the model (`image/webp`) enabling structural/layout/color-aware visual prompting.
- **AI Copilot UI** — Dedicated streaming text area in the sidebar that displays the AI's step-by-step reasoning and explanation before and during slide modifications.
- **Version history UI** — "History" tab inside the prompt sidebar that dynamically fetches prior version thumbnails and permits 1-click reversions without reloading the editor.
- **Inline text editing** — double-click text in the preview to edit, saves on blur/Enter
- **Image editor** — click an image to open resize/crop modal
- **Paste/drag upload** — global image upload to `deck-assets` bucket
- **Fullscreen** — browser fullscreen toggle
- **Drag-and-drop reorder** — `@dnd-kit/sortable` in sidebar, persists via `/api/decks/slides/reorder`
- **Tab/Shift+Tab** — indent/outdent slides (adjusts `level` in frontmatter, max 2 levels)
- **Arrow Up/Down** — navigate slides from keyboard
- **Google OAuth** — auth-gated editor access

## Streaming AI Copilot Architecture

The AI editing experience uses a streaming architecture to provide immediate feedback and handle potentially long-running generation tasks (up to 60s timeout).

### Data Flow

1. **Request**: `SlideEditor` sends the current MDX content, frontmatter, user prompt, and the latest slide thumbnail (data URL) to `/api/decks/slides/prompt`.
2. **AI Stream**: The API route initiates a streaming request to Gemini 2.5 Flash (`generateContentStream`). It uses a specific system prompt requiring the model to:
   - Start with a plain-text conversational explanation.
   - Wrap the updated MDX in a ```mdx code block.
   - Wrap any frontmatter changes in a ```json code block.
3. **Function Calling (Tools)**: For complex tasks like generating images, the model invokes tools. During a function call, the exact `Part` requested by the model is echoed back to the stream including its internal metadata (`thoughtSignature`), which is strictly required for Gemini 3.0+ to fulfill tool calls without error.
4. **Frontend Processing**: `SlideEditor` reads the stream. As text arrives, it updates the `copilotText` state.
5. **Code Mode Flip**: Once the stream encounters the ```mdx marker, the editor automatically flips into **Code Mode** (see below).
6. **Incremental Update**: The MDX content is optimistically updated in the local slides state as it streams, providing a "typing" effect in the code editor.
7. **Finalization**: When the stream ends, the API route parses the full response, performs a final database update (`deck_slides`), and the frontend flips back to visual mode after regenerating the slide thumbnail.

### Code Mode Flip Pattern

To prevent React from crashing while rendering partial or invalid MDX during the streaming process, the editor implements a "Code Mode Flip":

- **Trigger**: Detecting the start of an MDX code block (` ```mdx `) in the stream.
- **Action**: `setShowCode(true)` replaces the iframe visual preview with a raw `textarea` editor.
- **Benefit**: The `textarea` safely handles incomplete JSX/MDX tags that would otherwise trigger hydration errors or rendering crashes in the visual path.
- **Reversal**: Once the stream is complete and the MDX is valid, the editor resets `setShowCode(false)` to restore the visual rendering.

## Slide Version History

Every mutation to a slide automatically snapshots its current state into `slide_versions` before applying the change. This provides an undo/history trail for all edits.

### How It Works

1. **Before any mutation** (`upsertSlide`, `updateSlideContent`, `updateSlideFrontmatter`, AI prompt edit, revert), `saveVersionSnapshot()` reads the current slide row and inserts it into `slide_versions` with an incremented `version_number`.
2. **Thumbnail Snapshots**: Instantly duplicates the currently active WebP thumbnail in Supabase Storage from `thumbnails/{deck}/{slide_id}.webp` to an archive path `thumbnails/versions/{new_version_id}.webp`. This provides visual snapshots without a separate headless browser launch or DB migration.
3. **`change_source`** records what triggered the snapshot: `"upsert"`, `"manual"`, `"ai_edit"`, or `"revert"`.
4. **Reverting** saves the current state first (so reverts are themselves undoable), then applies the target version's `mdx_content` and `frontmatter` back to `deck_slides`.

### Schema (`slide_versions` table)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Auto-generated |
| `slide_id` | uuid (FK → deck_slides.id) | Which slide this version belongs to |
| `deck_slug` | text | Denormalized for querying |
| `slide_order` | integer | Position at time of snapshot |
| `frontmatter` | jsonb | Frontmatter at time of snapshot |
| `mdx_content` | text | MDX content at time of snapshot |
| `version_number` | integer | Monotonically increasing per slide |
| `change_source` | text | What triggered the snapshot |
| `created_at` | timestamptz | When the snapshot was taken |

Migration: `supabase/migrations/20260329132315_create_slide_versions.sql`

## Testing

Tests use **Vitest** + jsdom + React Testing Library. Run with `pnpm test` (or `pnpm test:watch`).

| Test file | Tests | Covers |
|-----------|-------|--------|
| `lib/__tests__/useSlideNavigation.test.ts` | 11 | Hash navigation, wrap-around, external hash changes |
| `lib/__tests__/editor-utils.test.ts` | 75 | Reorder cursor, indent/outdent, width mapping, image tags, crop/resize geometry |
| `lib/__tests__/viewport.test.ts` | 19 | Slide scaling, wheel zoom, click direction |

## Deployment

- Supabase project: `cnnttsihfbyxhzlmzdtv` (shared with claw-home)
- Auth redirect URLs configured for localhost:4000 and www.aimhuge.com
- Slides fetched at request time (`force-dynamic`) — edits are live immediately
- Images served from Supabase Storage (deck content) or `/images/` (main site)
