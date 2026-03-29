# Updating Deck Slides via API

Base URL: `http://localhost:4000` (dev) or `https://www.aimhuge.com` (prod)

## Deck Summary (lightweight)

```
GET /api/decks/summary?deck=priyoshop-exec
```

Returns a lightweight index of all slides — no content. Use this to see what slides exist before fetching or updating individual ones.

Response:
```json
{
  "deck_slug": "priyoshop-exec",
  "total_slides": 21,
  "slides": [
    { "index": 1, "id": "uuid", "slide_order": 10, "title": "...", "variant": "hero", "sectionLabel": null, "updated_at": "..." },
    ...
  ]
}
```

## Listing Slides (full content)

```
GET /api/decks/slides?deck=priyoshop-exec
```

Returns all slides with full MDX content. Each slide has:
- `id` — UUID (use this for PATCH)
- `slide_order` — 10, 20, 30, 40... (gaps allow insertion)
- `frontmatter` — JSON object with slide chrome config
- `mdx_content` — raw JSX body rendered inside SlideShell

### Current Slide Order

| Order | Title |
|-------|-------|
| 10 | AI Productivity for Leadership (hero) |
| 20 | Today's Agenda |
| 30 | Silent Meeting |
| 40 | What is AI? |
| 50 | Context |
| 60 | Write Your Context |
| 70 | Skills |
| 80 | Artifacts |
| 90 | Hands-On Cowork |
| 100 | Claude Code |
| 110 | Thank You. (close) |

## Updating a Slide's Content

```
PATCH /api/decks/slides
Content-Type: application/json

{
  "id": "<slide-uuid>",
  "mdx_content": "<new MDX/JSX content>"
}
```

Only updates the body content. Frontmatter (title, variant, etc.) stays the same.

## Upserting a Slide (create or full replace)

```
PUT /api/decks/slides
Content-Type: application/json

{
  "deck_slug": "priyoshop-exec",
  "slide_order": 30,
  "frontmatter": {
    "variant": "dark",
    "title": "Silent Meeting",
    "subtitle": "Everyone writes simultaneously in a shared doc — then we read and discuss.",
    "sectionLabel": "Section 1",
    "backgroundImage": "/images/hallwaybg.jpg",
    "logo": "white"
  },
  "mdx_content": "<div className=\"flex flex-col gap-6\">...</div>"
}
```

Use this to update both frontmatter and content, or to create a new slide at a given order.

## Reordering Slides

```
POST /api/decks/slides/reorder
Content-Type: application/json

{
  "slides": [
    { "id": "uuid-1", "slide_order": 10 },
    { "id": "uuid-2", "slide_order": 20 },
    { "id": "uuid-3", "slide_order": 30 }
  ]
}
```

Updates `slide_order` for each slide. Handles unique constraint conflicts internally. You can either:
- Move a single slide by giving it an order between two existing slides (e.g. `15` between `10` and `20`)
- Renumber the entire deck in one call

Returns `{ "ok": true, "updated": N }`.

## Deleting a Slide (soft-delete)

```
DELETE /api/decks/slides
Content-Type: application/json

{
  "id": "<slide-uuid>"
}
```

Sets `deleted_at` to the current timestamp. The slide is excluded from `GET` results but remains in the database. If a `PUT` upsert targets the same `deck_slug` + `slide_order`, the row is un-deleted (`deleted_at` reset to `null`).

Returns `{ "ok": true }` on success.

## AI-Powered Edit

```
POST /api/decks/slides/prompt
Content-Type: application/json

{
  "slideId": "<slide-uuid>",
  "currentContent": "<current MDX content>",
  "currentFrontmatter": { ... },
  "prompt": "Add a 4th prompt: What will you do differently?"
}
```

Uses Gemini 2.5 Flash to rewrite the slide. Saves automatically and returns `{ content, frontmatter }`.

## Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `variant` | `"dark" \| "light" \| "hero" \| "close"` | Slide background style |
| `title` | `string?` | Slide title (rendered by SlideShell) |
| `subtitle` | `string?` | Subtitle below title |
| `sectionLabel` | `string?` | Small label above title (e.g. "Section 2") |
| `topRight` | `string?` | Top-right label (e.g. "~20 min") |
| `backgroundImage` | `string?` | Full-bleed background image path |
| `backgroundOverlay` | `string?` | Overlay CSS class (default: "bg-black/50") |
| `logo` | `"white" \| "color" \| false` | Which logo to show |

## MDX Content Rules

- Use `className` not `class`
- Use `<div>` not `<p>` for text (MDX auto-wraps text in `<p>`, causing nesting errors)
- **No `.map()` or JS expressions** — write each element explicitly
- Available components (no import needed): `<Card accent="purple|blue|green|amber|red" small?>`, `<CardTitle>`, `<CardText>`, `<CardList>`, `<Stat>`, `<MetricRow>`, `<Tag>`
- Use `<img>` for images (not next/image `<Image>`)
- Content is compiled at request time by `next-mdx-remote`

## Uploading Assets

```
POST /api/assets
Content-Type: multipart/form-data

file: <image file>
folder: priyoshop-exec (optional)
```

Returns `{ url, path }`. Accepted types: JPEG, PNG, WebP, SVG. Max 5MB.

```
GET /api/assets
```

Lists uploaded assets with `{ name, url }`.
