"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const getURL = () => {
    let url = typeof process !== 'undefined' ?
      (process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_VERCEL_URL ??
      'http://localhost:4000/') :
      'http://localhost:4000/';
    
    // Also try to use window.location.origin if available, to be safe on client
    if (typeof window !== 'undefined' && window.location.origin) {
         if (!url.includes(window.location.host)) {
            url = window.location.origin + '/';
         }
    }

    url = url.startsWith('http') ? url : `https://${url}`
    url = url.endsWith('/') ? url : `${url}/`
    return url
  }

  const signInWithGoogle = async (redirectTo?: string) => {
    // The exact path MUST exactly match an allowed Redirect URL in Supabase,
    // OR Supabase must be configured with wildcards (e.g., http://localhost:4000/**).
    // Using the ?next parameter may fail exact matches if wildcards are not setup!
    const baseUrl = getURL();
    const callbackUrl = `${baseUrl}auth/callback${redirectTo && redirectTo !== '/' ? `?next=${encodeURIComponent(redirectTo)}` : ""}`;
    
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, signInWithGoogle, signOut };
}
