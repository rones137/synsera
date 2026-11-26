import type { User } from "@supabase/supabase-js";
import { DEFAULT_USER_PROFILE } from "@/lib/demo-data";
import type { UserProfile, WorkspaceKind } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Map auth user (+ optional profiles row) into Synsera UserProfile. Safe if profiles table missing. */
export async function userProfileFromSupabase(
  supabase: SupabaseClient,
  authUser: User,
): Promise<UserProfile> {
  let profile: Record<string, unknown> | null = null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();
    if (!error) profile = data;
  } catch {
    profile = null;
  }

  const name =
    (profile?.name as string | undefined) ||
    (authUser.user_metadata?.full_name as string | undefined) ||
    (authUser.user_metadata?.name as string | undefined) ||
    authUser.email ||
    "You";

  return {
    ...DEFAULT_USER_PROFILE,
    id: authUser.id,
    email: authUser.email || (profile?.email as string) || "",
    name,
    country: (profile?.country as string) || "KE",
    currency: (profile?.currency as UserProfile["currency"]) || "KES",
    timezone: (profile?.timezone as string) || "Africa/Nairobi",
    theme: (profile?.theme as UserProfile["theme"]) || "dark",
    // New Google users: onboarding incomplete until they finish setup (or schema default false)
    onboardingComplete:
      typeof profile?.onboarding_complete === "boolean"
        ? profile.onboarding_complete
        : false,
    workspacesEnabled:
      (profile?.workspaces_enabled as WorkspaceKind[]) || ["personal"],
  };
}

/** Best-effort profile row so RLS-backed tables work after first Google login. */
export async function ensureProfileRow(
  supabase: SupabaseClient,
  authUser: User,
  profile: UserProfile,
) {
  try {
    await supabase.from("profiles").upsert({
      id: authUser.id,
      email: profile.email,
      name: profile.name,
      country: profile.country,
      currency: profile.currency,
      timezone: profile.timezone,
      theme: profile.theme,
      onboarding_complete: profile.onboardingComplete,
      workspaces_enabled: profile.workspacesEnabled,
    });
  } catch {
    /* schema may not be applied yet */
  }
}
