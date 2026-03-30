# Puppeteer Thumbnail Generation Layout Collapse

- **Date:** 2026-03-30
- **Severity:** Medium

## Symptom
When users clicked "Regenerate Thumbnail" for a slide using `CMD+Right Click`, the resulting thumbnail image appeared either completely white or severely squished, losing all rich styling (background images, gradients, font sizes) that worked perfectly in the live Next.js preview iframe. 

## Root Cause
Two overlapping issues caused this:

1. **Responsive Viewport Collapse:** Headless Chrome was launching with a `defaultViewport` of `960x540`. Since the slides meticulously use Tailwind responsive utilities (e.g. `md:grid-cols-3`, `lg:text-4xl`) geared for a fixed 16:9 1080p canvas (`1920x1080`), the `960px` width missed the Tailwind `lg:` breakpoint (`1024px`), causing the grid to collapse into a single unstyled column.
2. **Middleware Auth Redirect Block:** When Chrome visited Next.js to take the screenshot (`http://localhost:4000/clients/priyoshop/...`), it lacked the user's authentication cookies. `middleware.ts` automatically redirected the unauthenticated headless browser to `/login`. The white card seen in the broken thumbnails was actually a perfectly rendered 1080p screenshot of the Next.js Login Card.

## The Fix
1. **Viewport Correction:** Explicitly set the Puppeteer `defaultViewport` to `1920x1080` in `/api/decks/thumbnails/route.ts` to trigger all desktop Tailwind breakpoints.
2. **Auth Bypass & Next 16 Migration:** Replaced the deprecated `middleware.ts` with Next.js 16's `proxy.ts` (exporting a `proxy` function). Injected a custom HTTP header (`x-puppeteer-auth`) via `page.setExtraHTTPHeaders()` during thumbnail generation, and updated `proxy.ts` to conditionally bypass the `/login` redirect for requests containing this secure header.

```typescript
// src/app/api/decks/thumbnails/route.ts
const browser = await puppeteer.launch({
  // BEFORE: defaultViewport: { width: 960, height: 540 }
  // AFTER:
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
});

const page = await browser.newPage();
// Injected Header
await page.setExtraHTTPHeaders({
  "x-puppeteer-auth": process.env.SUPABASE_SERVICE_ROLE_KEY || "local-dev-secret",
});
```

```typescript
// src/proxy.ts (previously middleware.ts)
export default async function proxy(request: NextRequest) {
  // ...
  const puppeteerAuth = request.headers.get("x-puppeteer-auth");
  const isPuppeteerAuthorized = puppeteerAuth === (process.env.SUPABASE_SERVICE_ROLE_KEY || "local-dev-secret");

  const isPriyoshopRoute = request.nextUrl.pathname.startsWith('/clients/priyoshop');
  // Pass if puppeteer authorized
  if (isPriyoshopRoute && !isPuppeteerAuthorized) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

## Key Rule
Always configure headless browser dimensions (`defaultViewport`) to perfectly match the target design resolution to avoid false responsive layout collapses, and proactively inject authentication bypass headers when snapshotting authenticated routes locally.

## Files Involved
- `src/app/api/decks/thumbnails/route.ts`
- `src/proxy.ts` (migrated from `src/middleware.ts`)
