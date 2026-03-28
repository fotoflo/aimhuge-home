# Obsidian Vault

## Overview

The `obsidian/` directory is a knowledge base of business reference notes for AimHuge. It is NOT consumed by the Next.js app — it's a standalone Obsidian vault for internal reference.

## Key Files

| File | Purpose |
|------|---------|
| `index.md` | Vault entry point |
| `Alex Miller.md` | Founder profile |
| `Clients.md` | Client index — completed, upcoming, and advisory |
| `Offerings.md` | Service offerings overview |
| `Advisory Services.md` | Advisory service details |
| `Workshops.md` | Workshop format and tracks |
| `People.md` | Team directory |
| `Contact.md` | Contact information |

### Client Pages

Each client has its own note linked from `Clients.md`:

- `Jibble Group.md` — completed workshop, testimonials
- `Ling App.md` — workshop client
- `Priyoshop.md` — upcoming workshop (two tracks)
- `PulseTech.md` — upcoming workshop

### WeGro (Advisory Client)

WeGro has the most extensive coverage with five interlinked notes:

- `WeGro.md` — hub page: company overview, stats, mission, values
- `WeGro Business Model.md` — four business lines, investment products, bottlenecks
- `WeGro Brand Identity.md` — colors, typography, logo, components (scraped from wegro.global)
- `WeGro Board Deck.md` — board presentation files and design system
- `WeGro Prioritization Framework.md` — strategic scoring methodology

### Workshop Tracks

- `Engineering Track.md`
- `Product & PM Track.md`
- `Executive Track.md`

## Important Patterns

- All notes use Obsidian `[[wikilinks]]` for cross-referencing
- Notes have YAML frontmatter with `title` field
- Client notes link back to `Clients.md` and relevant workshop/service pages
- Content is reference-only — source assets live in `clients/` and `public/images/`
