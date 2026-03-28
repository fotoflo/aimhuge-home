---
title: WeGro Brand Identity
---

# WeGro Brand Identity

Design language and visual system for [[WeGro]], scraped from [wegro.global](https://wegro.global) for reference. Full source: `clients/wegro/style-guide.md`

## Logo

Bold, rounded wordmark. Orange leaf accent replaces the dot on the "O".

| Variant | Use |
|---------|-----|
| Color (dark text) | Light backgrounds |
| White | Dark/green backgrounds |
| Favicon/App Icon | White leaf on green circle gradient |

## Color Palette

### Primary

| Color | Hex | Usage |
|-------|-----|-------|
| **Dark Teal** | `#015546` | Primary brand, CTAs, badges, section backgrounds |
| **Deep Forest** | `#011412` | Hero sections, page backgrounds, footer |
| **Orange** | `#FF8F1C` | Brand accent (leaf icon), highlights, warmth |

### Secondary

| Color | Hex | Usage |
|-------|-----|-------|
| Bright Green | `#20C61C` | Status indicators, "live" dots |
| White | `#FFFFFF` | Text on dark, card backgrounds |
| Off-White | `#F9FAFB` | Page backgrounds |
| Text Gray | `#6F6F6F` | Body text on light backgrounds |
| Slate 800 | `#1E293B` | Dark headings on light backgrounds |
| Link Blue | `#2563EB` | Hyperlinks |

## Typography

- **Font**: Fira Sans (weights 300-700)
- **Fallback**: Arial, system sans-serif
- **Hero**: text-7xl to text-[96px], Semibold 600
- **Section headers**: text-[40px], Semibold 600
- **Body**: text-base, Regular 400
- **Bold (700)**: CTAs, emphasis. **Semibold (600)**: Headings, cards. **Regular (400)**: Body.

## Signature Brand Element

**Orange Leaf** — single stylized leaf shape filled with `#FF8F1C`. Used as decorative accent throughout nav, cards, and the logo.

## Photography Style

- Bangladeshi smallholder farmers, rice paddies, crop fields, WeGro team
- Warm, authentic, human — real people in real fields
- Natural lighting, shot on location
- Heroes: wide aspect ratio, full-width with dark overlays for text
- Team: candid group shots, green WeGro t-shirts

## Component Patterns

### Buttons
- `#015546` background, white semibold uppercase text
- Rounded-md, hover at 70% opacity

### Cards
- `#FAFAFA` background, `rounded-[15px]`, `py-5 px-5`
- Team photos: grayscale by default, color on hover (300ms)

### Layout
- Max width: `1490px`, centered
- Horizontal padding: `64px` desktop / `16px` mobile
- Alternating dark/light sections

## Motion

| Effect | Usage |
|--------|-------|
| Pulse | "Live" status dots |
| Grayscale toggle (300ms) | Team member photos |
| Card flip rotateY(180deg) (500ms) | Impact commitment cards |
| Marquee scroll 50px/s | Announcement bar |

## Dark vs Light Sections

**Dark** (hero, CTA, footer): `#011412` or `#015546` bg, white text
**Light** (content, cards): `#FFFFFF` or `#F9FAFB` bg, slate-800 headings, `#6F6F6F` body
