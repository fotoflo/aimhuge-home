# 009 - Vercel Env String Escaping

**Date**: 2026-03-30
**Severity**: High

## Symptom
The Next.js production build (and local environment when pulled from Vercel) throws a catastrophic `Uncaught Error` from `@supabase/ssr`: `Your project's URL and API key are required to create a Supabase client!`. This prevents the entire application from initializing properly on the browser.

## Root Cause
When linking a project to Vercel and executing `vercel env pull` or standard CLI commands, the Vercel CLI evaluates dashboard variables and writes them to `.env.local` surrounded by double quotes. However, if the variables in the Vercel Dashboard were historically pasted *with* literal quotes (e.g., `"https://..."`), the CLI sync writes them as escaping double-double quotes:
```env
NEXT_PUBLIC_SUPABASE_URL=""https://cnnttsihfbyxhzlmzdtv.supabase.co""
```
When Next.js bundles the environment into the client side chunk, it retains the outer string value literally, causing the `createBrowserClient` to receive an invalid URL format or an API key prefixed with quotes, which Supabase internally rejects or fails to read as valid credentials, rendering the SSR client dead.

## The Fix
All nested `""` strings needed to be regex replaced or manually stripped back to standard `"` formatting within `.env.local`. Additionally, testing the deployment locally before pushing allowed us to manually add the keys to the Vercel production scope properly using:
```bash
printf "%s" "value" | npx vercel env add KEY production
```

## Key Rule
Never copy-paste environment variables containing literal surrounding quotes into the Vercel dashboard, and manually inspect `.env.local` integrity after a `vercel link` or `vercel env pull` operation.

## Files Involved
- `.env.local`
