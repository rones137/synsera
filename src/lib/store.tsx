"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_USER_PROFILE } from "./demo-data";
import { APP_STORAGE_KEY, persistence } from "./persistence";
import { getSupabaseBrowser, isSupabaseConfigured } from "./supabase/client";
import type {
  ActivityItem,
  AlertItem,
  BillingCycle,
  RecurringExpense,
  UserProfile,
  WorkspaceKind,
} from "./types";

const STORAGE_KEY = APP_STORAGE_KEY;

export type NewExpenseInput = {
  name: string;
  merchant: string;
  amount: number;
  cycle: BillingCycle;
  nextBillingDate: string;
  category: string;
  paymentMethod: string;
  notes?: string;
  workspace?: WorkspaceKind;
  confirmed?: boolean;
  status?: RecurringExpense["status"];
};

type Persisted = {
  user: UserProfile | null;
  workspace: WorkspaceKind;
  expenses: RecurringExpense[];
  alerts: AlertItem[];
  activity: ActivityItem[];
  schemaVersion: number;
};

type AppContextValue = {
  ready: boolean;
  backend: "supabase" | "local";
  user: UserProfile | null;
  workspace: WorkspaceKind;
  expenses: RecurringExpense[];
  alerts: AlertItem[];
  activity: ActivityItem[];
  login: (email: string, password: string, name?: string) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    country: string;
  }) => Promise<void>;
  loginWithGoogleDemo: (completeOnboarding?: boolean) => void;
  logout: () => Promise<void>;
  completeOnboarding: (partial: Partial<UserProfile>) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  setWorkspace: (w: WorkspaceKind) => void;
  addExpense: (input: NewExpenseInput) => RecurringExpense;
  updateExpense: (id: string, patch: Partial<RecurringExpense>) => void;
  archiveExpense: (id: string) => void;
  requestCancelExpense: (id: string) => void;
  confirmCancelExpense: (id: string) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  addActivity: (item: Omit<ActivityItem, "id">) => void;
  importExpenses: (items: NewExpenseInput[]) => number;
  clearWorkspaceData: () => void;
  deleteAccount: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function load(): Persisted | null {
  try {
    const raw = persistence.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

function save(data: Persisted) {
  persistence.setItem(STORAGE_KEY, JSON.stringify(data));
}

function stamp() {
  return new Date().toISOString();
}

function emptyPersisted(): Persisted {
  return {
    user: null,
    workspace: "personal",
    expenses: [],
    alerts: [],
    activity: [],
    schemaVersion: 2,
  };
}

function initialState(): Persisted {
  const existing = load();
  if (existing) {
    return {
      user: existing.user,
      workspace: existing.workspace || "personal",
      expenses: Array.isArray(existing.expenses) ? existing.expenses : [],
      alerts: Array.isArray(existing.alerts) ? existing.alerts : [],
      activity: Array.isArray(existing.activity) ? existing.activity : [],
      schemaVersion: 2,
    };
  }
  return emptyPersisted();
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [workspace, setWorkspaceState] = useState<WorkspaceKind>("personal");
  const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const backend: "supabase" | "local" = isSupabaseConfigured()
    ? "supabase"
    : "local";

  useEffect(() => {
    // Drop legacy v1 demo fixtures if still present
    persistence.removeItem("synsera-app-v1");
    const existing = initialState();
    setUser(existing.user);
    setWorkspaceState(existing.workspace);
    setExpenses(existing.expenses);
    setAlerts(existing.alerts);
    setActivity(existing.activity);

    const supabase = getSupabaseBrowser();
    if (supabase) {
      void supabase.auth.getSession().then(async ({ data }) => {
        const session = data.session;
        if (!session?.user) {
          setReady(true);
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        setUser({
          ...DEFAULT_USER_PROFILE,
          id: session.user.id,
          email: session.user.email || "",
          name:
            profile?.name ||
            session.user.user_metadata?.full_name ||
            session.user.email ||
            "You",
          country: profile?.country || "KE",
          currency: (profile?.currency as UserProfile["currency"]) || "KES",
          timezone: profile?.timezone || "Africa/Nairobi",
          theme: (profile?.theme as UserProfile["theme"]) || "dark",
          onboardingComplete: profile?.onboarding_complete ?? true,
          workspacesEnabled:
            (profile?.workspaces_enabled as WorkspaceKind[]) || [
              "personal",
              "business",
              "merchant",
            ],
        });
        const { data: rows } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });
        if (rows) {
          setExpenses(
            rows.map((row) => ({
              id: row.id,
              name: row.name,
              merchant: row.merchant,
              amount: Number(row.amount),
              currency: "KES" as const,
              cycle: row.cycle,
              nextBillingDate: row.next_billing_date,
              category: row.category,
              status: row.status,
              paymentMethod: row.payment_method,
              notes: row.notes || undefined,
              confirmed: row.confirmed,
              workspace: row.workspace,
              history: row.history || [],
              createdAt: row.created_at,
              updatedAt: row.updated_at,
            })),
          );
        }
        setReady(true);
      });
      return;
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    save({
      user,
      workspace,
      expenses,
      alerts,
      activity,
      schemaVersion: 2,
    });
  }, [ready, user, workspace, expenses, alerts, activity]);

  const login = useCallback(async (email: string, password: string, name?: string) => {
    const supabase = getSupabaseBrowser();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const u = data.user;
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.id)
        .maybeSingle();
      setUser({
        ...DEFAULT_USER_PROFILE,
        id: u.id,
        email: u.email || email,
        name: profile?.name || name || u.email || email,
        onboardingComplete: profile?.onboarding_complete ?? true,
        country: profile?.country || "KE",
        workspacesEnabled:
          (profile?.workspaces_enabled as WorkspaceKind[]) || [
            "personal",
            "business",
            "merchant",
          ],
      });
      return;
    }
    setUser((prev) => {
      return {
        ...DEFAULT_USER_PROFILE,
        ...(prev || {}),
        id: prev?.id || `user-${Date.now()}`,
        email,
        name: name || prev?.name || "You",
        onboardingComplete: true,
        workspacesEnabled: ["personal", "business", "merchant"],
      };
    });
  }, []);

  const register = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      country: string;
    }) => {
      const supabase = getSupabaseBrowser();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: { data: { name: input.name, full_name: input.name } },
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: input.email,
            name: input.name,
            country: input.country,
            currency: input.country === "KE" ? "KES" : "KES",
            onboarding_complete: false,
            workspaces_enabled: ["personal"],
          });
        }
        setUser({
          ...DEFAULT_USER_PROFILE,
          id: data.user?.id || `user-${Date.now()}`,
          name: input.name,
          email: input.email,
          country: input.country,
          currency: "KES",
          onboardingComplete: false,
          workspacesEnabled: ["personal"],
        });
        setWorkspaceState("personal");
        setExpenses([]);
        setAlerts([]);
        setActivity([]);
        return;
      }
      setUser({
        ...DEFAULT_USER_PROFILE,
        id: `user-${Date.now()}`,
        name: input.name,
        email: input.email,
        country: input.country,
        currency: input.country === "KE" ? "KES" : DEFAULT_USER_PROFILE.currency,
        onboardingComplete: false,
        workspacesEnabled: ["personal"],
      });
      setWorkspaceState("personal");
    },
    [],
  );

  const loginWithGoogleDemo = useCallback((complete = true) => {
    setUser({
      ...DEFAULT_USER_PROFILE,
      id: `google-${Date.now()}`,
      name: "Google user",
      email: `google.user+${Date.now()}@synsera.local`,
      onboardingComplete: complete,
      workspacesEnabled: complete
        ? ["personal", "business", "merchant"]
        : ["personal"],
    });
    setExpenses([]);
    setAlerts([]);
    setActivity([]);
  }, []);

  const logout = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }, []);

  const completeOnboarding = useCallback((partial: Partial<UserProfile>) => {
    setUser((u) =>
      u
        ? {
            ...u,
            ...partial,
            onboardingComplete: true,
            workspacesEnabled: partial.workspacesEnabled || [
              "personal",
              "business",
              "merchant",
            ],
          }
        : u,
    );
  }, []);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setUser((u) => (u ? { ...u, ...partial } : u));
  }, []);

  const setWorkspace = useCallback((w: WorkspaceKind) => {
    setWorkspaceState(w);
  }, []);

  const addActivity = useCallback((item: Omit<ActivityItem, "id">) => {
    setActivity((prev) => [{ ...item, id: `act-${Date.now()}` }, ...prev].slice(0, 50));
  }, []);

  const addExpense = useCallback(
    (input: NewExpenseInput) => {
      const item: RecurringExpense = {
        id: `exp-${Date.now()}`,
        name: input.name,
        merchant: input.merchant || input.name,
        amount: input.amount,
        currency: "KES",
        cycle: input.cycle,
        nextBillingDate: input.nextBillingDate,
        category: input.category,
        status: input.status || "active",
        paymentMethod: input.paymentMethod || "Manual",
        notes: input.notes,
        confirmed: input.confirmed ?? true,
        workspace: input.workspace || "personal",
        history: [{ date: input.nextBillingDate, amount: input.amount }],
        createdAt: stamp(),
        updatedAt: stamp(),
      };
      setExpenses((prev) => [item, ...prev]);
      addActivity({
        type: "added",
        title: "Expense added",
        detail: `${item.name} · KSh ${item.amount.toLocaleString("en-KE")}/${item.cycle === "yearly" ? "yr" : "mo"}`,
        at: stamp(),
      });
      const supabase = getSupabaseBrowser();
      if (supabase) {
        void supabase.auth.getUser().then(({ data }) => {
          if (!data.user) return;
          void supabase.from("expenses").upsert({
            id: item.id,
            user_id: data.user.id,
            workspace: item.workspace,
            name: item.name,
            merchant: item.merchant,
            amount: item.amount,
            currency: item.currency,
            cycle: item.cycle,
            next_billing_date: item.nextBillingDate,
            category: item.category,
            status: item.status,
            payment_method: item.paymentMethod,
            notes: item.notes || null,
            confirmed: item.confirmed,
            history: item.history || [],
            created_at: item.createdAt,
            updated_at: item.updatedAt,
          });
        });
      }
      return item;
    },
    [addActivity],
  );

  const updateExpense = useCallback(
    (id: string, patch: Partial<RecurringExpense>) => {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, ...patch, updatedAt: stamp() } : e,
        ),
      );
      addActivity({
        type: "edited",
        title: "Expense updated",
        detail: patch.name || id,
        at: stamp(),
      });
    },
    [addActivity],
  );

  const archiveExpense = useCallback(
    (id: string) => {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, status: "archived", updatedAt: stamp() }
            : e,
        ),
      );
      addActivity({
        type: "edited",
        title: "Expense archived",
        detail: id,
        at: stamp(),
      });
    },
    [addActivity],
  );

  const requestCancelExpense = useCallback(
    (id: string) => {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, status: "cancellation_pending", updatedAt: stamp() }
            : e,
        ),
      );
      addActivity({
        type: "cancelled",
        title: "Cancellation requested",
        detail: "Verification pending — Synsera does not auto-cancel",
        at: stamp(),
      });
      setAlerts((prev) => [
        {
          id: `att-${Date.now()}`,
          severity: "info",
          title: "Cancellation verification pending",
          detail:
            "We recorded your cancel request. Confirm with the merchant — we never claim success without verification.",
          expenseId: id,
          read: false,
          createdAt: stamp(),
          category: "system",
        },
        ...prev,
      ]);
    },
    [addActivity],
  );

  const confirmCancelExpense = useCallback(
    (id: string) => {
      const name = expenses.find((e) => e.id === id)?.name || id;
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: "cancelled", updatedAt: stamp() } : e,
        ),
      );
      addActivity({
        type: "cancelled",
        title: "Cancellation verified",
        detail: `${name} marked cancelled after merchant confirmation`,
        at: stamp(),
      });
      setAlerts((prev) => [
        {
          id: `att-${Date.now()}`,
          severity: "info",
          title: "Cancellation verified",
          detail: `${name} is cancelled. Added to Subscription Graveyard when you confirm savings.`,
          expenseId: id,
          read: false,
          createdAt: stamp(),
          category: "system",
        },
        ...prev,
      ]);
    },
    [addActivity, expenses],
  );

  const markAlertRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  const importExpenses = useCallback(
    (items: NewExpenseInput[]) => {
      items.forEach((i) => addExpense(i));
      addActivity({
        type: "import",
        title: "CSV import completed",
        detail: `${items.length} expenses imported`,
        at: stamp(),
      });
      return items.length;
    },
    [addExpense, addActivity],
  );

  const clearWorkspaceData = useCallback(() => {
    setExpenses([]);
    setAlerts([]);
    setActivity([]);
  }, []);

  const deleteAccount = useCallback(() => {
    persistence.removeItem(STORAGE_KEY);
    persistence.removeItem("synsera-app-v1");
    setUser(null);
    setExpenses([]);
    setAlerts([]);
    setActivity([]);
    setWorkspaceState("personal");
  }, []);

  const value = useMemo(
    () => ({
      ready,
      backend,
      user,
      workspace,
      expenses,
      alerts,
      activity,
      login,
      register,
      loginWithGoogleDemo,
      logout,
      completeOnboarding,
      updateProfile,
      setWorkspace,
      addExpense,
      updateExpense,
      archiveExpense,
      requestCancelExpense,
      confirmCancelExpense,
      markAlertRead,
      markAllAlertsRead,
      addActivity,
      importExpenses,
      clearWorkspaceData,
      deleteAccount,
    }),
    [
      ready,
      backend,
      user,
      workspace,
      expenses,
      alerts,
      activity,
      login,
      register,
      loginWithGoogleDemo,
      logout,
      completeOnboarding,
      updateProfile,
      setWorkspace,
      addExpense,
      updateExpense,
      archiveExpense,
      requestCancelExpense,
      confirmCancelExpense,
      markAlertRead,
      markAllAlertsRead,
      addActivity,
      importExpenses,
      clearWorkspaceData,
      deleteAccount,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

/** Back-compat for earlier expenses-store consumers */
export function useExpenses() {
  const app = useApp();
  return {
    expenses: app.expenses.filter((e) => e.workspace === "personal"),
    addExpense: app.addExpense,
    updateExpense: app.updateExpense,
    archiveExpense: app.archiveExpense,
    requestCancelExpense: app.requestCancelExpense,
  };
}
