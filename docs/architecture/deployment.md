# Deployment & Environment

## Overview
AimHuge is deployed to Vercel via the standard Next.js adapter. The core project is un-opinionated in terms of deployment mechanics, but heavily relies on `NEXT_PUBLIC_` environment variables injected during the build step.

## Running Locally vs Production
- **Local (`pnpm dev`)**: Variables are read from `.env.local`. When running the port 4000 server, the site behaves according to `NEXT_PUBLIC_SITE_URL` and connects to local/remote resources depending on what's defined in `.env.local`.
- **Production (Vercel)**: Vercel reads from variables stored in its cloud representation of the project (`aimhuge-home`). Any variable prefixed with `NEXT_PUBLIC_` MUST be configured in the Vercel Dashboard for the Production Environment *before* a build starts, otherwise it will not be bundled into the client javascript bundle.

## Linking To Vercel
When developing locally using the Vercel CLI (or agents managing the codebase), you should link the repository to the remote project using:
```bash
npx vercel link
```
This commands creates a `.vercel` directory mapping the local folder to the remote dashboard instance, and typically pulls down the `development` variables directly into `.env.local`.

> [!WARNING]  
> Vercel's `env pull` automatically creates double quotes around variables pulled down from the dashboard. For example, if you saved your Supabase key locally as "https://...", Vercel might re-pull it down into `.env.local` as `""https://...""`, which breaks Next.js frontend `.env` parser functionality. Be wary of string quoting bugs when syncing environments.

## Deployment Gotchas
- **Supabase SSR**: The `@supabase/ssr` `createBrowserClient` directly reads `process.env.NEXT_PUBLIC_SUPABASE_URL` and `_ANON_KEY`. If these are missing from Vercel *at build time*, the deployed site will wildly throw an `Uncaught Error` immediately upon initialization. Ensure `Production` scope checkboxes are ticked when adding keys in Vercel.
- **`env push` Does Not Natively Support Files**: While local `vercel link` pulls variables implicitly to `.env.local`, there is no `env push` capability in the standard `vercel` CLI to bulk push `.env.local`. Variables must be piped via `vercel env add NAME production` manually or via the Vercel Dashboard directly.
