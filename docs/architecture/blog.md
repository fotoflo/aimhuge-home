# Blog

## Overview

The `/blog` section hosts articles about AI workshops, Claude Code workflows, and building with AI-assisted development. It uses a simple static index page with individual post pages as subdirectories.

## Key Files

| File | Purpose |
|------|---------|
| `src/app/blog/page.tsx` | Blog index — lists all posts from a hardcoded `posts` array |
| `src/app/blog/how-to-write-a-done-skill-for-claude-code/page.tsx` | First blog post about writing Claude Code /done skills |
| `public/images/blog/` | Blog images — generated covers and screenshots |
| `scripts/generate-blog-images.mjs` | Gemini 2.5 Flash Image generation script (~$0.02/image) |

## Important Patterns

- **Post listing is hardcoded** — the `posts` array in `src/app/blog/page.tsx` must be updated manually when adding new posts
- Each post is a subdirectory under `src/app/blog/<slug>/page.tsx` following App Router conventions
- Posts are self-contained — all content is inline JSX, no MDX or CMS
- Blog index cards link to individual posts and show date + description
- Posts follow the same section layout pattern as other pages: alternating `bg-card-bg` sections, `max-w-3xl` content width, code examples in `<pre>` blocks with `bg-surface` styling
- Each post exports its own `metadata` object for SEO
- Posts end with a CTA section linking to the Calendly booking page
