"use client";

import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

export function googleOAuthReady(): boolean {
  return isSupabaseConfigured();
}

export function googleSetupHint(): string {
  return "This host is missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Open the latest deploy URL, or set those env vars and redeploy. Google Client ID/Secret belong only in the Supabase dashboard.";
}

/** Starts Supabase Google OAuth when configured. Returns false if not configured. */
export async function startGoogleOAuth(nextPath = "/app"): Promise<boolean> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return false;

  // Keep redirectTo path clean for Supabase allow-list matching (no ?next=).
  try {
    sessionStorage.setItem("synsera-auth-next", nextPath.startsWith("/") ? nextPath : "/app");
  } catch {
    /* ignore */
  }

  const redirectTo = `${window.location.origin}/auth/callback`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: { access_type: "offline", prompt: "consent" },
      skipBrowserRedirect: false,
    },
  });
  if (error) throw error;
  return true;
}
