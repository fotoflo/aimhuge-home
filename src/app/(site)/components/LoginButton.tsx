"use client";

import { useAuth } from "@/lib/hooks/useAuth";

const ALLOWED_EMAIL = "fotoflo@gmail.com";

export function LoginButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <button
        onClick={() => signInWithGoogle(window.location.pathname)}
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        Login
      </button>
    );
  }

  const email = user.email ?? "";
  const isAllowed = email === ALLOWED_EMAIL;

  return (
    <div className="flex items-center gap-4">
      {isAllowed && (
        <a
          href="/dashboard"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Dashboard
        </a>
      )}
      <button
        onClick={() => signOut()}
        className="text-sm text-muted hover:text-foreground transition-colors"
        title={email}
      >
        Logout
      </button>
    </div>
  );
}
