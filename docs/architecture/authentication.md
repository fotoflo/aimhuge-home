# Authentication & User Management

## Overview
AimHuge uses Supabase for authentication, relying heavily on Magic Links (OTP) and Google OAuth flows to govern access securely without persisting manual credentials. It leverages Next.js App Router server actions and middleware context to restrict specific pages to authorized domains, primarily mapping external users to specialized interactive executive decks.

## Key Files
- `src/middleware.ts`: Intercepts route requests. Uses `@supabase/ssr` to validate active sessions and route metadata. Hard-blocks unauthorized domains from accessing client-specific paths (e.g. PriyoShop).
- `src/app/(standalone)/login/actions.ts`: Contains the server action to trigger Magic Link dispatch while strictly enforcing email domain whitelisting.
- `src/app/auth/callback/route.ts`: Core OAuth and Magic Link callback API. Captures `code` parameter, exchanges for an authenticated session, and runs smart redirection (e.g., `fotoflo@gmail.com` to dashboard vs `@priyoshop.com` to deck editor).
- `src/lib/hooks/useAuth.ts`: Exposes client-side context for `signInWithGoogle` and session state.
- `supabase/migrations/20260330..._create_profiles_table.sql`: Maintains PostgreSQL representations of Supabase `auth.users`, keeping track of telemetry such as `login_count` and custom application roles (`godMode`).

## Data Flow
1. **Initiation**: User accesses `/login` and provides an email or clicks standard Google OAuth `GoogleLoginButton`.
2. **Action / Hook**: For emails, standard form data is posted to `/login/actions.ts` invoking `supabase.auth.signInWithOtp`. For OAuth, `useAuth` invokes `signInWithOAuth({ provider: 'google' })`.
3. **Receipt**: Following identity verification, Supabase redirects to `/auth/callback?code=...`.
4. **Session Instantiation**: `route.ts` hits `exchangeCodeForSession()`, yielding an active user object.
5. **Telemetry & Routing**: Post-authentication, the DB seamlessly registers/updates the user's `profiles` identity (running PostgreSQL triggers and RPC `increment_login_count()` if applicable) while `route.ts` directs the user to their designated portal via Next.js `redirect()`.
6. **Persistence**: `middleware.ts` continually reads the hydrated cookie on every protected navigation, seamlessly validating domain privileges against route paths without demanding re-authorization natively.

## Important Patterns
- Never expose domain policies directly to the GUI (e.g., placeholder or explicit error strings) to enhance security through obscurity. Rely on generic HTTP Unathorized responses ("The email address provided is not authorized.").
- Always use `create_server_client` in server components and `getSupabaseBrowser` in client components to ensure zero hydration mismatch with cookies.
- Direct DB column mutations for auth users should be synced safely down to isolated tables, such as `public.profiles`, avoiding manual interaction with `auth.*` schema tables explicitly protected by Supabase.
