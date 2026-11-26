/**
 * Synsera persistence adapter.
 * Today: localStorage (browser). Tomorrow: swap `createLocalPersistence`
 * for a Supabase-backed implementation without changing stores.
 */

export type PersistenceDriver = {
  /** Storage backend id — "local" | "supabase" */
  kind: "local" | "supabase";
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export function createLocalPersistence(): PersistenceDriver {
  return {
    kind: "local",
    getItem(key) {
      if (typeof window === "undefined") return null;
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(key, value);
      } catch {
        /* quota / private mode */
      }
    },
    removeItem(key) {
      if (typeof window === "undefined") return;
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };
}

/**
 * Placeholder for Stage 3+. Wire with @supabase/supabase-js and map
 * get/set to tables (expenses, alerts, workspace_*). Keep the same keys
 * as JSON documents or normalize into rows.
 */
export function createSupabasePersistence(_opts: {
  url: string;
  anonKey: string;
  userId: string;
}): PersistenceDriver {
  void _opts;
  throw new Error(
    "Supabase persistence is not configured yet. Set NEXT_PUBLIC_SUPABASE_URL + anon key and implement createSupabasePersistence.",
  );
}

/** Active driver — local until Supabase env is present and implemented. */
export const persistence: PersistenceDriver = createLocalPersistence();

/** Bump when schema shape changes so stale demo fixtures are discarded. */
export const APP_STORAGE_KEY = "synsera-app-v2";
export const WORKSPACE_STORAGE_KEY = "synsera-workspace-v2";
