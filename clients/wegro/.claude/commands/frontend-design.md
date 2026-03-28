---
description: Create frontend pages and components following the WeGro brand style guide, built within the AimHuge Next.js architecture. Use this when building new pages, sections, or UI components for WeGro.
---

This skill guides creation of frontend interfaces that follow the WeGro brand identity, implemented as pages/components within the AimHuge Next.js 16 app.

The user provides frontend requirements: a page, component, section, or interface to build. They may include context about purpose, audience, or placement.

## Before You Code

Read `clients/wegro/style-guide.md` for the complete WeGro design system reference.

## Architecture

WeGro pages live inside the **AimHuge Next.js app** at `src/app/wegro/`. This is:

- **Next.js 16** with App Router, React 19, TypeScript (strict)
- **Tailwind CSS v4** — uses `@import "tailwindcss"` and `@theme inline` syntax (NOT v3 `@tailwind` directives)
- **pnpm** as package manager
- **Path alias:** `@/*` → `./src/*`
- **Dev server:** `pnpm run dev` (port 4000)

### File Locations

| What | Where |
|------|-------|
| WeGro pages | `src/app/wegro/` (e.g., `src/app/wegro/page.tsx`, `src/app/wegro/impact/page.tsx`) |
| WeGro layout | `src/app/wegro/layout.tsx` (own nav/footer, overrides root layout chrome) |
| WeGro components | `src/app/wegro/components/` |
| WeGro static images | `public/images/wegro/` (copied from `clients/wegro/assets/`) |
| WeGro copy/content | `clients/wegro/copy/` (markdown reference files) |
| WeGro style guide | `clients/wegro/style-guide.md` |
| Global CSS | `src/app/globals.css` (WeGro theme tokens added here) |
| Root layout | `src/app/layout.tsx` (do NOT modify root nav/footer — use WeGro's own layout) |

### WeGro Layout Pattern

WeGro pages get their own `layout.tsx` at `src/app/wegro/layout.tsx` with:
- WeGro-specific nav header (dark teal, not AimHuge purple)
- WeGro footer (deep forest background, multi-column)
- Fira Sans font loaded via `next/font/google`
- WeGro metadata defaults

This means WeGro pages render inside the root layout's `<html>` and `<body>` but replace the AimHuge nav/footer with their own.

## WeGro Brand Identity

**Tone:** Professional, warm, agricultural, trustworthy. WeGro simplifies agriculture for Bangladeshi smallholder farmers. The design should feel grounded and human — not flashy tech startup.

**Tagline:** "Agriculture Simplified."

## Color Palette — Tailwind v4 Theme Tokens

These should be added to `globals.css` under a WeGro section in the `@theme inline` block:

```css
/* WeGro brand tokens */
--color-wg-primary: #015546;
--color-wg-primary-dark: #011412;
--color-wg-accent: #FF8F1C;
--color-wg-accent-green: #20C61C;
--color-wg-card-bg: #FAFAFA;
--color-wg-border: #ECECEC;
--color-wg-text: #6F6F6F;
--color-wg-text-muted: #8C8C8C;
```

Use as: `bg-wg-primary`, `text-wg-accent`, `border-wg-border`, etc.

### Primary Colors
- **Dark Teal** `#015546` (`wg-primary`) — CTA buttons, badges, section backgrounds
- **Deep Forest** `#011412` (`wg-primary-dark`) — Hero sections, footer
- **Orange** `#FF8F1C` (`wg-accent`) — Brand accent (leaf icon). Use sparingly.

### Secondary / UI
- **Bright Green** `#20C61C` (`wg-accent-green`) — Status indicators only
- **Card BG** `#FAFAFA` (`wg-card-bg`) — Card backgrounds
- **Border** `#ECECEC` (`wg-border`) — Dividers
- **Text** `#6F6F6F` (`wg-text`) — Body text on light backgrounds
- **Text Muted** `#8C8C8C` (`wg-text-muted`) — Caption text
- **Slate 800** `#1E293B` — Dark headings on light backgrounds (use Tailwind built-in `text-slate-800`)

## Typography

### Font Loading
```tsx
// In src/app/wegro/layout.tsx
import { Fira_Sans } from 'next/font/google';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira-sans',
  display: 'swap',
});
```

Add to `@theme inline` in globals.css:
```css
--font-fira: var(--font-fira-sans), system-ui, sans-serif;
```

### Type Scale
```
Hero headline:     text-7xl xl:text-[96px] font-semibold xl:leading-[80px]
Section header:    sm:text-[40px] sm:leading-[60px] font-semibold
Card title:        text-2xl to text-4xl font-semibold
Body large:        text-xl
Body:              text-base
Small/Caption:     text-sm
```

## Layout

```
Container:         mx-auto max-w-[1490px] px-4 sm:px-16
Section spacing:   pt-[60px] sm:pt-[80px] pb-[60px]
Element gaps:      gap-6, gap-10, or gap-14
```

## Component Patterns

### Primary CTA Button
```tsx
<button className="bg-wg-primary hover:opacity-70 text-white font-semibold uppercase py-3 px-5 border border-wg-primary rounded-md text-sm md:text-base transition-opacity duration-200 cursor-pointer">
  Button Text
</button>
```

### Cards
```tsx
<div className="bg-wg-card-bg rounded-[15px] p-5">
  {/* card content */}
</div>
```

### Images
Use Next.js `<Image>` component — never raw `<img>` tags:
```tsx
import Image from 'next/image';

<Image
  src="/images/wegro/Impact/impactHeroImage.webp"
  alt="Farmers harvesting rice"
  width={1200}
  height={600}
  className="w-full object-cover rounded-lg"
/>
```

### WeGro Navigation Header
```tsx
<header className="fixed top-0 w-full h-20 bg-slate-800/70 backdrop-blur-sm z-50">
  <div className="mx-auto max-w-[1490px] flex items-center justify-between px-4 sm:px-16 h-full">
    <Link href="/wegro">
      <Image src="/images/wegro/whitelogo.png" alt="WeGro" width={120} height={32} className="h-8 w-auto" />
    </Link>
    {/* nav links */}
  </div>
</header>
```

### WeGro Footer
```tsx
<footer className="bg-wg-primary-dark text-white">
  {/* Multi-column flex layout */}
  {/* Social icons: w-[30px] rounded-md */}
  {/* Logo: w-[146px] */}
</footer>
```

### Section Alternation
Alternate between dark and light sections:
- **Dark:** `bg-wg-primary-dark` or `bg-wg-primary`, white text
- **Light:** `bg-white` or `bg-gray-50`, `text-slate-800` headings, `text-wg-text` body text

## Animation & Motion

Keep animations subtle and purposeful:

- **Hover translate:** `hover:translate-x-1 transition-transform duration-300`
- **Button hover:** `hover:opacity-70 transition-opacity duration-200`
- **Grayscale toggle:** `grayscale hover:grayscale-0 transition-all duration-300`
- **Status pulse:** `animate-pulse`
- Reuse AimHuge's existing animation classes (`animate-fade-up`, `animate-scale-in`, etc.) from globals.css where appropriate

## Assets

Static images served from `public/images/wegro/`:
- **Logos:** `newWegroLogo.png` (color), `whitelogo.png` (white), `icon.png` (favicon)
- **Leaf accent:** `orangeLeaf.svg` — the signature brand element, `#FF8F1C` fill
- **Social icons:** `footerLinkedin.png`, `footerX.png`, `footerFb.png`, `footerYoutube.png`, `instagram.png`
- **App badges:** `googlePlay.png`, `appStore.png`
- **Photography:** `images/wegro/Impact/`, `images/wegro/AboutUs/`, `images/wegro/Home/`

## Photography Direction

- Real Bangladeshi farmers in real fields — never stock illustration
- Warm natural lighting
- Wide aspect ratios for hero backgrounds with dark overlay for text legibility
- Team photos: candid, green WeGro t-shirts

## What NOT To Do

- Do NOT use Geist, Inter, Roboto, Arial, or system fonts on WeGro pages (use Fira Sans)
- Do NOT use the AimHuge purple accent (`#7c5cfc`) on WeGro pages
- Do NOT use the AimHuge dark theme colors — WeGro has its own light+dark alternating palette
- Do NOT modify the root `layout.tsx` nav/footer — WeGro has its own layout
- Do NOT use Bootstrap or other CSS frameworks
- Do NOT invent new brand colors — use the WeGro palette
- Do NOT use raw `<img>` tags — always use Next.js `<Image>`
- Do NOT use emoji in professional/investor-facing pages

## Implementation Checklist

When creating a new WeGro page:
1. Create page at `src/app/wegro/{route}/page.tsx`
2. Export a `metadata` object (title, description, OG image)
3. Use Fira Sans via the `font-fira` class (set on WeGro layout)
4. Use `wg-*` color tokens for all WeGro brand colors
5. Use Next.js `<Image>` for all images, sourced from `public/images/wegro/`
6. Use Next.js `<Link>` for all internal navigation
7. Follow the alternating dark/light section pattern
8. Mobile-first responsive design using Tailwind breakpoints
9. TypeScript with strict mode — type all props and exports
10. File naming: `page.tsx` for routes, `PascalCase.tsx` for components

$ARGUMENTS
