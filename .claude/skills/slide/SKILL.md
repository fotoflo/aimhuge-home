---
name: slide
description: Create or update a slide in the Priyoshop exec deck via the API. Use when the user says "slide", "update slide", or describes slide content changes.
argument-hint: "<slide_order or title> <description of changes>"
---

# Slide Updater

You manage slides in the Priyoshop exec deck via the REST API at `http://localhost:4000`.

## API Reference

- **Summary:** `GET /api/decks/summary?deck=priyoshop-exec` — lightweight index, no content
- **Full slide:** `GET /api/decks/slides?deck=priyoshop-exec` — all slides with MDX content
- **Upsert:** `PUT /api/decks/slides` — create or replace a slide
- **Patch content:** `PATCH /api/decks/slides` — update MDX content only
- **Delete:** `DELETE /api/decks/slides` — soft-delete by `{ "id": "uuid" }`
- **Reorder:** `POST /api/decks/slides/reorder` — update slide_order for multiple slides

## Steps

### 1. Understand the request

Parse $ARGUMENTS to determine:
- **Which slide** — by slide_order number (e.g. `43`) or title substring (e.g. `"c3po"`)
- **What to do** — create new, update content, change frontmatter, delete, or reorder

If unclear, fetch the summary and ask the user which slide they mean.

### 2. Fetch current state

- For updates: fetch the specific slide's current content so you can modify it
- For new slides: fetch the summary to determine the right `slide_order` (use gaps between existing slides)

```bash
# Summary (lightweight)
curl -s 'http://localhost:4000/api/decks/summary?deck=priyoshop-exec'

# Full content of all slides (use sparingly)
curl -s 'http://localhost:4000/api/decks/slides?deck=priyoshop-exec'
```

### 3. Build the slide

When writing MDX content, follow these rules:

**Layout:**
- Slides render at 1920x1080, scaled to fit viewport
- Use `flex-1` on content containers to fill vertical space
- Alternate between `"dark"` and `"light"` variants for visual rhythm

**MDX rules:**
- Use `className` not `class`
- Use `<div>` not `<p>` for text blocks
- **No `.map()` or JS expressions** — write each element explicitly
- **No `style={{}}` JSX syntax** — use Tailwind classes only
- Available components (no import needed): `<Card accent="purple|blue|green|amber|red" small?>`, `<CardTitle>`, `<CardText>`, `<CardList>`, `<Stat>`, `<MetricRow>`, `<Tag>`
- Use `<img>` for images (not `<Image>`)

**Design system:**
- Accent purple: `#7c5cfc` / `#9b82fd` (lighter)
- Dark slides: `text-white`, `text-slate-300`, `text-slate-400`, `text-slate-500`
- Light slides: `text-slate-700`, `text-slate-600`, `text-slate-500`
- Cards: use colored accents to create visual hierarchy
- Section numbers: `text-[#9b82fd] font-mono text-sm font-bold`

**Frontmatter fields:**
- `variant`: `"dark"` | `"light"` | `"hero"` | `"close"`
- `title`: slide title (rendered by SlideShell chrome)
- `subtitle`: subtitle below title
- `sectionLabel`: small label above title (e.g. "Section 2")
- `topRight`: top-right label (e.g. "~20 min")
- `logo`: `"white"` | `"color"` | `false`

### 4. Upsert the slide

Use a heredoc to avoid shell escaping issues:

```bash
cat <<'ENDJSON' | curl -s -X PUT 'http://localhost:4000/api/decks/slides' \
  -H 'Content-Type: application/json' -d @- | python3 -m json.tool
{
  "deck_slug": "priyoshop-exec",
  "slide_order": <order>,
  "frontmatter": { ... },
  "mdx_content": "<content>"
}
ENDJSON
```

### 5. Confirm

After upserting, tell the user:
- What slide was updated (order + title)
- Brief description of changes
- Suggest they check it at `http://localhost:4000/clients/priyoshop/exec-deck`

## Rules

- Always use heredoc (`cat <<'ENDJSON'`) for API calls — never inline JSON with shell quoting
- When updating an existing slide, preserve content that the user didn't ask to change
- When creating new slides, pick an order that fits between existing slides
- If the user provides an image, copy it to `public/images/` first, then reference it as `/images/<filename>` in the MDX
- Keep text concise — these are presentation slides, not documents
- Don't touch files in `src/app/clients/priyoshop/exec-deck/edit/` — another agent manages those
