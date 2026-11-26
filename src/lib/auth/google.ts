"use client";

import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

export function googleOAuthReady(): boolean {
  return isSupabaseConfigured();
}

export function googleSetupHint(): string {
  return "Real Google sign-in needs NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY on this host, plus Client ID/Secret in Supabase → Authentication → Providers → Google (secret never in Next.js). See docs/google-oauth-setup.md.";
}

/** Starts Supabase Google OAuth when configured. Returns false if not configured. */
export async function startGoogleOAuth(nextPath = "/app"): Promise<boolean> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return false;
  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, queryParams: { access_type: "offline", prompt: "consent" } },
  });
  if (error) throw error;
  return true;
}
