"use client";

import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

export function googleOAuthReady(): boolean {
  return isSupabaseConfigured();
}

export function googleSetupHint(): string {
  return "Connect Google via Supabase: set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY, enable Google provider with GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in the Supabase dashboard, and add your redirect URL.";
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
