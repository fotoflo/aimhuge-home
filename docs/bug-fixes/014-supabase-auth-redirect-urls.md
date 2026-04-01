# Supabase Auth Redirect URLs Allow-Listing

## The Problem
Authentication via Supabase was failing inconsistently across environments depending on what the `Site URL` was set to in the Supabase Dashboard:
- If `Site URL` was set to `https://aimhuge.com`, logging into the production site worked, but logging in locally (`http://localhost:4000`) caused the user to be redirected back to the production site after auth ("login on local redirects to prod").
- If `Site URL` was set to `http://localhost:4000`, local login worked, but logging in on production caused the user to be redirected back to localhost ("login on prod redirects to local").

This happened despite the Next.js application correctly calculating its own host origin dynamically during `signInWithOAuth` and Magic Link request actions via environment variables (`process.env.NEXT_PUBLIC_SITE_URL`) or header matching (`headers().get('host')`).

## The Cause
By default, Supabase's authentication service employs strict redirect allow-listing rules. 

When an authentication request completes, Supabase evaluates the `redirectTo` parameter sent by the client. If the `redirectTo` parameter **does not exactly match** the primary configured `Site URL`, and is **not explicitly allow-listed** in the `Additional Redirect URLs` settings, Supabase will reject the requested redirect URL. 

To prevent an open-redirect vulnerability, it instead safely defaults the user's redirect back to the primary `Site URL`. Because the `Additional Redirect URLs` were not properly configured in the Supabase dashboard to include Vercel environments and the localhost environment simultaneously, it forced every non-matching login back to the primary `Site URL`.

## The Fix
This requires manual configuration inside the Supabase Auth Dashboard, as these security settings are managed exclusively at the remote database level:

1. **Set the Primary Site URL:**
   In the Supabase Dashboard -> **Authentication** -> **URL Configuration**, set the `Site URL` to the primary production domain:
   ```
   https://aimhuge.com
   ```

2. **Allow-List Secondary Environments:**
   Under **Redirect URLs**, add wildcard records for all secondary development/deployment domains the application uses:
   ```
   http://localhost:4000/**
   https://*.vercel.app/**
   ```

3. **Align Environment Variables:**
   Ensure Next.js passes the correct local or remote host. Set `SITE_URL` and `NEXT_PUBLIC_SITE_URL` to `http://localhost:4000` inside `.env.local` or the Vercel Development environment. The Next.js client correctly grabs this and passes it as `options: { redirectTo: ... }`.

Once the redirect environments are officially allow-listed in Supabase, the OAuth/OTP provider can successfully redirect users directly back to the environment where the login was initiated.
