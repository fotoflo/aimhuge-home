# GEMINI.md

This file provides foundational guidance for Gemini CLI when working in the AimHuge repository.

## Project Context
AimHuge is Alex Miller's professional website for AI advisory, workshops, and engineering services. It is a high-performance, aesthetically rich Next.js application.

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript (Strict)
- **Styling:** Tailwind CSS v4 (Modern `@import "tailwindcss"` syntax)
- **Database/Auth:** Supabase (@supabase/ssr)
- **Caching:** Redis (ioredis)
- **Content:** MDX (next-mdx-remote, @next/mdx)
- **Testing:** Vitest + React Testing Library
- **Icons:** Lucide React
- **Package Manager:** pnpm

## Development Workflow
- **Dev Server:** `pnpm run dev` (Runs on **port 4000**, kills existing processes on 4000)
- **Build:** `pnpm run build`
- **Lint:** `pnpm run lint` (ESLint flat config)
- **Test:** `pnpm run test` or `pnpm run test:watch`

## Project Structure
- `src/app/`: Next.js App Router pages and layouts.
- `src/lib/`: Shared utilities, Supabase clients, and hooks.
- `obsidian/`: Local Obsidian vault containing reference material, drafts, and business context (not served by the app).
- `public/images/`: Static assets and photography.
- `supabase/`: Local Supabase configuration and migrations.

## Architectural & Style Mandates
- **Theme:** Dark theme only. Use CSS variables defined in `src/app/globals.css`.
- **Accent:** Purple (`#7c5cfc`). Use `text-accent`, `bg-accent`, and `border-accent`.
- **Typography:** Geist Sans/Mono (local fonts).
- **Layouts:** Use `mx-auto max-w-6xl px-6` for main containers.
- **Components:** Favor self-contained pages for now, extracting components only when reuse is clear.
- **Frontend Design:** ALWAYS use the `/frontend-design` workflow (`.agents/workflows/frontend-design.md`) when building web components, pages, or writing HTML/CSS to ensure high-quality, distinctive, and non-generic aesthetics.
- **SEO:** Every page must export a `metadata` object with proper title, description, and OG images.
- **Performance:** Use Next.js `<Image>` component for all images. Configure remote patterns in `next.config.ts` if needed.
- **Alerts/Modals:** NEVER use browser `window.alert` or `window.confirm`. Always build and use custom React modal components for a cohesive UI.

## Important Patterns
- **CTA:** Most call-to-actions point to `https://calendly.com/fotoflo/30min`.
- **Client Pages:** Workshop and deck pages follow the `/workshop/{client}/{track}` pattern.
- **Animations:** Use custom Tailwind classes like `animate-fade-up`, `animate-glow`, and `.grain` overlay for consistent "vibe".

## Tool Usage
- Use `pnpm` for all package operations.
- Prefer `vitest` for adding new tests.
- Reference `obsidian/` files for deep business context or content drafts before implementing new pages.
