# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AimHuge — Alex Miller's personal/business website for AI workshops and advisory services.

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS v4 (uses `@import "tailwindcss"` and `@theme inline` syntax, not v3 `@tailwind` directives)
- Geist Sans/Mono fonts (loaded as local fonts from node_modules)
- Deployed on Vercel

## Commands

- `pnpm run dev` — dev server on **port 4000** (kills existing :4000 process, clears .next)
- `pnpm run build` — production build
- `pnpm run lint` — ESLint (flat config, core-web-vitals + typescript)
- No test framework

## Project Structure

- `src/app/` — App Router pages (no shared components directory)
- `src/app/layout.tsx` — Root layout with nav, footer, fonts, analytics
- `src/app/globals.css` — Tailwind v4 config, CSS variables, custom animations
- `public/images/` — Static images
- `obsidian/` — Reference content (not consumed by the app)
- Path alias: `@/*` → `./src/*`

## Style Conventions

- Dark theme only (CSS variables in :root, no light mode)
- Accent color: `#7c5cfc` (purple), use `text-accent`, `bg-accent`
- Custom animation classes: `animate-fade-up`, `animate-slide-left`, `animate-slide-right`, `animate-scale-in`, `animate-fade-in` with `delay-1` through `delay-6`
- `.grain` class for noise texture overlay, `.glow` for accent glow effect
- Max width container: `mx-auto max-w-6xl px-6`
- Cards: `rounded-xl border border-card-border p-6`

## Page Patterns

- Each page exports a `metadata` object for SEO (title, description, OG, Twitter)
- Pages are self-contained — all content inline, no shared component extraction yet
- Navigation defined in `navLinks` array in layout.tsx
- CTA links point to `https://calendly.com/fotoflo/30min`

## Images

- Use Next.js `<Image>` component
- Remote patterns configured for `media.licdn.com`
- Local images go in `public/images/`

## Important Notes

- Package manager is **pnpm** (not npm/yarn)
- No API routes, no database, no env vars needed
- Client-specific workshop pages live under `/workshop/{client}/{track}`
