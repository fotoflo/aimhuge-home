# Site Layout

## Overview

The main website layout lives in the `(site)` route group, providing navigation, footer, fonts, and analytics. It is isolated from the `(decks)` route group, which has its own `<html>/<body>` layout with no site chrome.

## Route Group Architecture

```
src/app/
  layout.tsx              # Pass-through root (just renders children)
  (site)/                 # Main website
    layout.tsx            # Root layout: <html>, <body>, NavBar, footer, analytics
    globals.css           # Tailwind v4 config, CSS variables, animations
    components/
      NavBar.tsx          # Client component: nav links + LoginButton + Book a Call
      LoginButton.tsx     # Client component: Google OAuth login/logout via useAuth
    page.tsx, about/, blog/, advisory/, etc.
    decks/page.tsx        # Deck listing page (auth-gated)
  (decks)/                # Decks — separate root layout, no nav/footer
    layout.tsx
```

## Key Files

| File | Purpose |
|------|---------|
| `(site)/layout.tsx` | Server component root layout — fonts, metadata, `<NavBar />`, footer, Google Analytics |
| `(site)/components/NavBar.tsx` | Client component — nav links array, `<LoginButton />`, Book a Call CTA |
| `(site)/components/LoginButton.tsx` | Client component — uses `useAuth` hook for Google OAuth, shows "Decks" link only for `fotoflo@gmail.com` |
| `(site)/decks/page.tsx` | Auth-gated deck listing — fetches `/api/decks`, maps slugs to View/Edit links |

## Navigation

The `navLinks` array defines the main site pages:

```
Home | AI Workshop | Advisory | Talks | Portfolio | Blog | About | [Login] | [Book a Call]
```

When logged in as `fotoflo@gmail.com`, the LoginButton shows a "Decks" link and "Logout" button. All other users see only "Login".

## Cross-Route-Group Navigation

Links from `(site)` to `(decks)` routes (e.g., `/decks` page linking to `/clients/priyoshop/exec-deck/edit`) must use plain `<a>` tags, not Next.js `<Link>`. Using `<Link>` performs client-side navigation that preserves the current layout, causing the deck/editor to render nested inside the site's nav and footer. Plain `<a>` tags force a full page reload, picking up the correct `(decks)` root layout.

## Auth

Google OAuth via Supabase — see `src/lib/hooks/useAuth.ts` for the client-side hook and `src/app/auth/callback/route.ts` for the OAuth code exchange.
