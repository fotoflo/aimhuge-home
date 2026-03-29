# WeGro Board Deck

## Overview

The WeGro board deck is an interactive slide presentation for WeGro's Board of Directors. It lives in two places: the aimhuge-home monorepo (served at `/clients/wegro/board-deck`) and a standalone Next.js app at `~/dev/wegro-board-deck` (GitHub: `aimhuge/wegro`). The standalone repo exists so external collaborators (e.g., mahmudwegro) can develop on it without access to the full aimhuge codebase.

## Key Files

| File | Purpose |
|------|---------|
| `src/app/clients/wegro/board-deck/` | Board deck in aimhuge-home (source of truth for aimhuge deploys) |
| `src/app/api/clients/wegro/priorities/route.ts` | API route for saving/loading initiative priorities via Redis |
| `src/app/api/priorities/route.ts` | Re-export of the above, so the synced standalone code works (uses `/api/priorities`) |
| `~/dev/wegro-board-deck/` | Standalone Next.js app (GitHub: `aimhuge/wegro`, private) |

## Architecture

- **16 slide components** in `slides/` — each is a self-contained React component
- **Drag-and-drop prioritization** via `@dnd-kit` in `ScoringMatrixSlide`
- **Redis persistence** for initiative priorities (optional, falls back to defaults)
- **Fira Sans font** loaded via `next/font/google` in the board-deck `layout.tsx`
- **`wegro.css`** — standalone CSS with brand tokens and slide system styles

## Sync Between Repos

A git post-merge hook in `~/dev/wegro-board-deck/.git/hooks/post-merge` copies `src/app/board-deck/` → `aimhuge-home/src/app/clients/wegro/board-deck/` after every `git pull`.

**Known issue:** The standalone app uses `/api/priorities` while aimhuge uses `/api/clients/wegro/priorities`. The re-export at `src/app/api/priorities/route.ts` bridges this gap so the synced code works in aimhuge.

## Deployment

- **aimhuge-home**: Deployed on Vercel (`aimhuge-home` project), board deck at `/clients/wegro/board-deck`
- **Standalone**: Deployed on Vercel (`wegro-board-deck` project), board deck at `/board-deck`
- The Vercel GitHub App is installed on the `aimhuge` org, so pushes from any collaborator auto-deploy
