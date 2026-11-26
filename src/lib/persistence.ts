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
 * Document-key adapter for Supabase is optional; primary path is row sync
 * via `@/lib/supabase/client` in AppProvider / WorkspaceDataProvider when
 * NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
 */
export function createSupabasePersistence(_opts: {
  url: string;
  anonKey: string;
  userId: string;
}): PersistenceDriver {
  void _opts;
  // Prefer table sync in stores; local driver remains the offline cache.
  return createLocalPersistence();
}

/** Local cache always on; Supabase Auth + rows activate when env is set. */
export const persistence: PersistenceDriver = createLocalPersistence();

/** Bump when schema shape changes so stale demo fixtures are discarded. */
export const APP_STORAGE_KEY = "synsera-app-v2";
export const WORKSPACE_STORAGE_KEY = "synsera-workspace-v2";
