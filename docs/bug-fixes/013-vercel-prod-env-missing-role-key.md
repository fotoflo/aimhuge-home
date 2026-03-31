# 013: Missing Supabase Service Role Key on Vercel Production

**Date:** March 31, 2026  
**Severity:** High  

## Symptom
The dashboard in the production environment (`aimhuge.com`) displayed "No decks found in the database," even though decks correctly populated in the local development environment. There were no visible frontend crashes.

## Root Cause
The `getSupabase()` function in `src/lib/supabase.ts` uses the `SUPABASE_SERVICE_ROLE_KEY` to initialize the client. If this environment variable is missing, it returns `null`:

```typescript
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
```

The `/api/decks` route checks if `getSupabase()` returns `null` and subsequently sends a 500 error:

```typescript
const supabase = getSupabase();
if (!supabase) {
  return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
}
```

In the dashboard UI, a failed `fetch` simply evaluates to an empty array (falling back to `{ decks: [] }`), leading to a silent failure. While `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` were successfully added to the Vercel production environment previously, the server-side `SUPABASE_SERVICE_ROLE_KEY` was missing from the "Production" and "Preview" environment scopes.

## Why It Was Hard to Find
The application fails silently on the frontend without blowing up the UI. The dashboard gracefully handles an empty `decks` payload and naturally assumes the database actually has no decks without raising an obvious UI error.

## The Fix
Using the `vercel env add` command, the `SUPABASE_SERVICE_ROLE_KEY` was added correctly targeting the `production` and `preview` environments, followed by a `vercel --prod --yes` to trigger a re-build with the newly injected environment config.

## Key Rule
Always double-check both `NEXT_PUBLIC_*` (client) and `SUPABASE_SERVICE_ROLE_KEY` (server) when spinning up environments globally to prevent silent backend failures.

## Files Involved
- None changed. (Bug resolved via Vercel CLI orchestration).
