# WeGro Brand & Style Guide

Extracted from [wegro.global](https://wegro.global) — March 2026

---

## 1. Logo

The WeGro wordmark uses bold, rounded letterforms with a distinctive orange leaf accent replacing the dot on the letter "O".

| Variant | File | Use |
|---------|------|-----|
| Color (dark text) | `assets/newWegroLogo.png`, `assets/wegronewLogo.png`, `assets/logo-color.png` | Light backgrounds |
| White | `assets/whitelogo.png`, `assets/logo-white.png` | Dark/green backgrounds |
| Favicon/App Icon | `assets/icon.png` | White leaf on green circle gradient |

**Logo colors in the wordmark:**
- "WE" + "GR" letterforms: **Dark Teal `#015546`**
- "O" letterform + leaf accent: **Orange `#FF8F1C`**

**Clear space:** Maintain generous padding around the logo. The website uses it at `w-[146px]` in the footer and at header scale in navigation.

---

## 2. Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Dark Teal** | `#015546` | Primary brand color, CTA buttons, badges, section backgrounds |
| **Deep Forest** | `#011412` | Dark hero sections, page backgrounds, footer |
| **Orange** | `#FF8F1C` | Brand accent (leaf icon), highlights, warmth |

### Secondary / UI Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Bright Green** | `#20C61C` | Status indicators, "live" pulse dots |
| **White** | `#FFFFFF` | Text on dark backgrounds, card backgrounds |
| **Off-White** | `#F9FAFB` | Page backgrounds |
| **Light Gray** | `#FAFAFA` | Card backgrounds |
| **Border Gray** | `#ECECEC` | Dividers, borders |
| **Text Gray** | `#6F6F6F` | Body text on light backgrounds |
| **Muted Gray** | `#8C8C8C` | Secondary/caption text |
| **Slate 600** | `#6B7280` | Metadata, labels |
| **Slate 800** | `#1E293B` | Dark text, headings on light backgrounds |
| **Link Blue** | `#2563EB` | Hyperlinks |

### SDG / Category Accent Colors

Used for UN Sustainable Development Goal badges and category coding:

| SDG | Hex |
|-----|-----|
| SDG 1 (No Poverty) | `#EB1C2D` |
| SDG 2 (Zero Hunger) | `#DDA83A` |
| SDG 3 (Health) | `#C7212F` |
| SDG 5 (Gender Equality) | `#EF3E25` |
| SDG 8 (Economic Growth) | `#A21942` |
| SDG 10 (Reduced Inequalities) | `#DD1367` |

---

## 3. Typography

### Font Family

**Primary:** Fira Sans (loaded as `font-fira` via Next.js font optimization, served as WOFF2)

**Fallback:** Arial, system sans-serif

### Type Scale

| Element | Size | Weight | Line Height | Notes |
|---------|------|--------|-------------|-------|
| Hero headline | `text-7xl` to `text-[96px]` | Semibold (600) | `leading-[80px]` | Largest text on page |
| Section header | `text-[40px]` | Semibold (600) | `leading-[60px]` | Main section titles |
| Card title | `text-2xl` to `text-4xl` | Semibold (600) | Default | Feature cards, names |
| Body large | `text-xl` | Regular (400) | Default | Hero subtext |
| Body | `text-base` | Regular (400) | Default | Standard paragraphs |
| Small / Caption | `text-sm` / `text-[14px]` | Regular (400) | Default | Labels, metadata |
| Micro | `text-[8px]` | Regular (400) | Default | Badges (e.g., "hiring" tag) |

### Weight Usage

- **700 (Bold):** CTAs, emphasis within body
- **600 (Semibold):** Headings, card titles, button text
- **500 (Medium):** Stats/numbers, subheadings
- **400 (Regular):** Body text, descriptions
- **300 (Light):** Used sparingly for large display text in the board deck

---

## 4. Spacing & Layout

### Container

- **Max width:** `1490px`
- **Horizontal padding:** `64px` (desktop) / `16px` (mobile) — `sm:px-16 px-4`
- **Centered:** `mx-auto`

### Section Spacing

- **Top padding:** `80px` (desktop) / `60px` (mobile)
- **Bottom padding:** `60px`
- **Inter-element gaps:** `24px` (`gap-6`), `40px` (`gap-10`), `56px` (`gap-14`)

### Grid

- Responsive columns using Tailwind: `grid-cols-2`, `grid-cols-5`
- Flex wrap for partner logos and cards: `flex flex-wrap gap-6 md:gap-20`

---

## 5. Component Styles

### Buttons (Primary CTA)

```
Background:    #015546 (bg-secondary)
Hover:         #015546 at 70% opacity (bg-secondary/70)
Text:          White, semibold/bold, uppercase
Padding:       12px 20px (py-3 px-5)
Border:        1px solid #015546
Border Radius: rounded-md (~6px)
Font Size:     text-sm (mobile), text-base (desktop)
```

### Cards

```
Background:    #FAFAFA
Border Radius: 15px (rounded-[15px])
Padding:       20px (py-5 px-5)
Heights:       286px (small), 398px (large) — varies by context
```

### Image Cards (Impact page)

```
Border Radius: 15px
Gradient overlay on hover
Height:        398px
```

### Team Member Photos

```
Grayscale by default
Full color on hover
Transition:    grayscale → color, 300ms
Dimensions:    270px × 370px
```

### News Article Cards

```
Image:         w-full, object-cover, rounded-[8px], mb-6
Border Radius: 8px
```

### 3D Flip Cards (Impact page)

```
Transform:     preserve-3d
Hover:         rotateY(180deg)
Transition:    500ms
```

---

## 6. Navigation & Header

```
Height:        80px
Background:    slate-800 at 70% opacity (bg-slate-800/70)
Backdrop:      blur-sm
Position:      Fixed top
Logo:          Left-aligned
Nav links:     Right-aligned, white text
CTA button:    "Schedule a Meeting" — green/secondary style
```

### Announcement Bar (below header)

```
Height:     50px
Background: Primary brand color
Content:    Scrolling marquee, 50px/s, pauses on hover
```

---

## 7. Footer

```
Background:    #011412 (deep forest)
Text:          White / off-white
Logo width:    146px
Layout:        Multi-column flex (contact, locations, links, app downloads)
Social icons:  30px × 30px, rounded-md
Border top:    1px solid #ECECEC (on inner sections)
App badges:    ~205px wide
```

---

## 8. Iconography & Brand Elements

### Orange Leaf

The signature brand element — a single stylized leaf shape filled with `#FF8F1C`.

| File | Size | Usage |
|------|------|-------|
| `assets/orangeLeaf.svg` | 11×15 | Inline decorative accent (nav, cards) |
| `assets/orange-leaf.svg` | 11×15 | Same SVG, alternate filename |
| `assets/orangeLeaf-brand.svg` | 11×15 | Same SVG, brand variant |

### WEGRO Letter SVGs (About page)

Individual letter SVGs at 670×670, white fill — used for the animated values section:
`assets/AboutUs/W.svg`, `E.svg`, `G.svg`, `R.svg`, `O.svg`

### Social Icons

Located at `assets/footer*.png` and `assets/instagram.png` — 30px rendered size.

---

## 9. Photography Style

Based on the hero and background images across the site:

- **Subject matter:** Bangladeshi smallholder farmers, rice paddies, crop fields, the WeGro team
- **Tone:** Warm, authentic, human — real people in real fields
- **Treatment:** Full color, natural lighting, shot on location
- **Hero images:** Wide aspect ratio, used as full-width backgrounds with dark overlays for text legibility
- **Team photos:** Candid group shots, green WeGro t-shirts as unifying element

---

## 10. Motion & Animation

| Effect | Spec | Usage |
|--------|------|-------|
| Pulse | `animate-pulse` | "Live" status dots, hiring indicators |
| Hover translate | `translate-x-1`, 300ms | Arrow links, CTAs |
| Hover opacity | `opacity → 70%` | Buttons, links |
| Grayscale toggle | `grayscale → grayscale-0`, 300ms | Team member photos |
| Card flip | `rotateY(180deg)`, 500ms | Impact commitment cards |
| Marquee scroll | `50px/s`, left direction | Announcement bar |
| Intersection Observer | Triggered on scroll into view | Stats, score bars (board deck) |

---

## 11. Responsive Breakpoints

Uses Tailwind CSS breakpoint system:

| Prefix | Min Width | Notes |
|--------|-----------|-------|
| (default) | 0px | Mobile-first base styles |
| `sm:` | 640px | Tablets — padding increases to `px-16` |
| `md:` | 768px | Grid layouts activate |
| `lg:` | 1024px | Full desktop layouts |
| `xl:` | 1280px | Hero text reaches max size |

---

## 12. Dark vs Light Sections

The site alternates between two themes:

**Dark sections** (hero, CTA, footer):
- Background: `#011412` or `#015546`
- Text: White
- Buttons: White outline or secondary green

**Light sections** (content, cards):
- Background: `#FFFFFF` or `#F9FAFB`
- Text: Slate-800 headings, `#6F6F6F` body
- Cards: `#FAFAFA` background

---

## 13. Board Deck Specific Styles

The board deck HTML files use a parallel design system with CSS custom properties:

| Token | Value | Usage |
|-------|-------|-------|
| `--g500` | `#10b981` | Primary green (Tailwind emerald-500) |
| `--g700` | `#047857` | Darker green |
| `--g800` | `#065f46` | Darkest green backgrounds |
| `--slate-*` | Various | Text hierarchy |
| Amber, Blue, Red, Purple | Various | Category color coding for business divisions |

The deck uses **Inter** font (not Fira) and its own card/tag/stat component system separate from the website.
