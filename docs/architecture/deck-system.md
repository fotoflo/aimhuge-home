# Deck System

## Overview

A reusable slide deck framework with MDX-based content stored in Supabase, rendered at request time via `next-mdx-remote`. Supports presentation mode (click/keyboard navigation), a visual editor with AI-assisted slide editing (Gemini 2.5 Flash), inline text editing, and image resize/crop.

## Key Files

### Shared Deck Kit (`src/app/decks/`)

| File | Purpose |
|------|---------|
| `components/DeckShell.tsx` | Top-level deck container — slide navigation, URL hash sync, click/keyboard controls |
| `components/SlideShell.tsx` | Slide chrome wrapper — variant styling, logo, title, subtitle, background image support |
| `components/MDXSlide.tsx` | Renders MDX content via `next-mdx-remote/rsc`, wraps in SlideShell using frontmatter |
| `components/SlideImageEditor.tsx` | Modal image editor with resize handles and crop (inset-based) |
| `components/Card.tsx` | Card, CardTitle, CardText, CardList components available in MDX |
| `components/Stat.tsx`, `Tag.tsx` | Stat/Tag components available in MDX |
| `lib/useSlideNavigation.ts` | Hook: slide index state + two-way URL hash sync |
| `lib/useSlideControls.ts` | Hook: keyboard (arrows, space) + split-screen click navigation |
| `lib/slides-db.ts` | Supabase CRUD for `deck_slides` table |
| `lib/mdx-types.ts` | TypeScript types for SlideFrontmatter, MDXSlideModule |
| `deck.css` | Base slide system CSS (`.slide`, `.slide-dark`, `.slide-light`, `.slide-hero`, `.slide-close`) |

### Priyoshop Exec Deck (`src/app/clients/priyoshop/exec-deck/`)

| File | Purpose |
|------|---------|
| `page.tsx` | Server component — fetches slides from Supabase, renders with DeckShell + MDXSlide |
| `edit/page.tsx` | Editor page — fetches slides, renders SlideEditor (auth-gated) |
| `edit/SlideEditor.tsx` | Full editor UI — iframe preview, AI prompt sidebar, inline text editing, image editor |
| `layout.tsx` | Deck layout with Geist font |
| `aimhuge.css` | AimHuge theme CSS variables |

### API Routes

| Route | Purpose |
|-------|---------|
| `GET /api/decks/summary?deck=<slug>` | Lightweight slide index (no content) |
| `GET /api/decks/slides?deck=<slug>` | Full slides with MDX content |
| `PUT /api/decks/slides` | Upsert slide (create or full replace) |
| `PATCH /api/decks/slides` | Update slide content by id |
| `DELETE /api/decks/slides` | Soft-delete slide by id |
| `POST /api/decks/slides/prompt` | AI-powered slide edit via Gemini 2.5 Flash |
| `POST /api/assets` | Upload image to Supabase Storage |
| `GET /api/assets` | List uploaded assets |

### Auth & Infrastructure

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Server-side Supabase client (service role key) |
| `src/lib/supabase-browser.ts` | Browser-side Supabase client |
| `src/lib/supabase-server.ts` | Server-side Supabase client with cookie auth |
| `src/lib/hooks/useAuth.ts` | Client hook: Google OAuth sign-in/out, user state |
| `src/lib/hooks/useImageDropzone.tsx` | Global paste/drag-to-upload for images |
| `src/app/auth/callback/route.ts` | OAuth code exchange callback |

## Data Architecture

### Supabase Postgres — `deck_slides` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `deck_slug` | text | e.g. "priyoshop-exec" |
| `slide_order` | integer | 10, 20, 30... (gaps for insertion) |
| `frontmatter` | jsonb | `{variant, title, subtitle, sectionLabel, backgroundImage, logo, topRight, ...}` |
| `mdx_content` | text | Raw MDX/JSX body |
| `deleted_at` | timestamptz | Soft-delete timestamp (null = active) |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |
| | | UNIQUE(deck_slug, slide_order) |

### Supabase Storage — `deck-assets` bucket

Public bucket for slide images. Uploaded via `/api/assets`.

## Slide Variants

- **`dark`** — dark gradient background, white text
- **`light`** — light background, dark text
- **`hero`** — centered layout for title slides (no SlideShell chrome)
- **`close`** — centered layout for closing slides (no SlideShell chrome)

Any variant can have a `backgroundImage` — SlideShell renders it with a configurable overlay.

## MDX Content Rules

- Use `className` not `class`
- Use `<div>` not `<p>` for text (MDX auto-wraps text in `<p>`, causing nesting errors)
- No `.map()` or JS expressions — write each element explicitly
- Available components (no import needed): `Card`, `CardTitle`, `CardText`, `CardList`, `Stat`, `MetricRow`, `Tag`
- Use `<img>` for images (not next/image)
- Compiled at request time by `next-mdx-remote/rsc`

## Editor Features

- **Slide preview** — iframe showing the actual rendered slide
- **Slide thumbnails** — scaled-down iframes in the left sidebar
- **AI prompt** — right sidebar, powered by Gemini 2.5 Flash
- **Inline text editing** — double-click text in the preview to edit, saves to Supabase on blur/Enter
- **Image editor** — click an image to open resize/crop modal
- **Paste/drag upload** — global image upload to `deck-assets` bucket
- **Google OAuth** — auth-gated editor access

## Deployment

- Supabase project: `cnnttsihfbyxhzlmzdtv` (shared with claw-home)
- Auth redirect URLs configured for localhost:4000 and www.aimhuge.com
- Slides fetched at request time (`force-dynamic`) — edits are live immediately
