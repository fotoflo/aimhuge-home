# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WeGro is a client site within the AimHuge Next.js application — a board deck and web presence for an agricultural technology company operating in Bangladesh. WeGro pages are served under the `/wegro` route of the AimHuge app.

## Architecture

WeGro lives in two places within the aimhuge repo:

| Location | Purpose |
|----------|---------|
| `clients/wegro/` | Source content, assets, copy, style guide, and this CLAUDE.md |
| `src/app/wegro/` | Next.js App Router pages and components |
| `public/images/wegro/` | Static images served by Next.js |

### Tech Stack (inherited from AimHuge)

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline` syntax)
- pnpm as package manager
- Deployed on Vercel

### Development

```bash
pnpm run dev     # dev server on port 4000
pnpm run build   # production build
pnpm run lint    # ESLint
```

## WeGro-Specific Conventions

- WeGro has its **own layout** at `src/app/wegro/layout.tsx` — separate nav/footer from the AimHuge site
- **Font:** Fira Sans (not Geist) — loaded via `next/font/google`
- **Color tokens:** prefixed `wg-*` (e.g., `bg-wg-primary`, `text-wg-accent`) defined in `globals.css`
- **Images:** Use Next.js `<Image>` component, assets in `public/images/wegro/`
- **Style guide:** See `clients/wegro/style-guide.md` for the complete brand reference
- **Copy/content:** Markdown files in `clients/wegro/copy/` contain all website text

## Content Structure

- `clients/wegro/copy/` — Website copy as markdown (home, impact, who-we-are, partners, gallery, career, privacy, terms)
- `clients/wegro/assets/` — Original downloaded assets from wegro.global (source of truth, copied to `public/images/wegro/`)
- `clients/wegro/style-guide.md` — Complete brand & style guide
- `clients/wegro/*.html` — Legacy standalone board deck HTML files
- `clients/wegro/business-overview.md` — Business context
- `clients/wegro/prioritization-framework.md` — Strategic scoring methodology

## Key Differences from AimHuge Pages

| | AimHuge | WeGro |
|--|---------|-------|
| Font | Geist Sans | Fira Sans |
| Accent | Purple `#7c5cfc` | Orange `#FF8F1C` |
| Primary | Dark bg `#08080a` | Dark teal `#015546` / Deep forest `#011412` |
| Theme | Dark only | Alternating dark/light sections |
| Container | `max-w-6xl` (1152px) | `max-w-[1490px]` |
| Layout | Shared root layout | Own layout at `/wegro` |
