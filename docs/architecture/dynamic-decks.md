# Dynamic Decks Architecture

## Overview
The platform organizes, views, and modifies presentations through a dynamic Next.js routing structure (`(decks)/decks/[deckSlug]/`), backed by the `decks` and `deck_slides` tables in Supabase. This architecture replaces the previous method of statically hardcoding a filesystem route per client delivery.

## Key Files
- **`src/app/(decks)/decks/[deckSlug]/page.tsx`**
  The public viewer. Pulls frontmatter and mdx content sequentially based on the `deck_slug`.
  
- **`src/app/(decks)/decks/[deckSlug]/edit/page.tsx`**
  The generic authoring environment. Instantiates the centralized `SlideEditor` component, binding it definitively to the provided slug.

- **`src/app/decks/components/Editor/SlideEditor.tsx`**
  The 600+ LOC orchestration engine handling dragging, inline editing, previews, thumbnails, database patching. Now heavily generalized taking `deckSlug` as a mandatory prop and `viewerPath` to resolve preview iframes.

- **`src/app/api/decks/route.ts`**
  Handles reading and writing the formal presentation metadata. Includes a `POST` handler that creates an initial placeholder deck and slide.

- **`src/app/api/decks/generate/text/route.ts`**
  The background generation endpoint. Called seamlessly via client fetching the moment a user submits a "Wall of Text" via the dashboard, using Gemini 'flash' to output heavily structured MDX into `deck_slides`.

## Data Flow
Deck state is initialized from the formal `decks` table and bound to paths via Next.js dynamic routing. The `mdx_content` operates as the absolute source of truth. Features like thumbnails, search, and AI tip generation use the `deckSlug` for scoping across unified backend routes.

## Important Patterns
When using `SlideEditor`, you MUST provide a valid `deckSlug` that exists in the database. The editor guarantees backward compatibility to explicit static routes (like Priyoshop) by accepting an optional `viewerPath` which overrides the dynamic `/decks/` prefix in the internal <iframe> previews.
