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
import {
  DEMO_ACTIVITY,
  DEMO_ALERTS,
  DEMO_EXPENSES,
  DEMO_USER,
} from "./demo-data";
import type {
  ActivityItem,
  AlertItem,
  BillingCycle,
  RecurringExpense,
  UserProfile,
  WorkspaceKind,
} from "./types";

const STORAGE_KEY = "synsera-app-v1";

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
  hydratedDemo: boolean;
};

type AppContextValue = {
  ready: boolean;
  user: UserProfile | null;
  workspace: WorkspaceKind;
  expenses: RecurringExpense[];
  alerts: AlertItem[];
  activity: ActivityItem[];
  login: (email: string, password: string, name?: string) => void;
  register: (input: {
    name: string;
    email: string;
    password: string;
    country: string;
  }) => void;
  logout: () => void;
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
  resetDemoData: () => void;
  deleteAccount: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function load(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

function save(data: Persisted) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function stamp() {
  return new Date().toISOString();
}

function initialState(): Persisted {
  const existing = load();
  if (existing) {
    return {
      user: existing.user,
      workspace: existing.workspace || "personal",
      expenses: existing.expenses?.length ? existing.expenses : DEMO_EXPENSES,
      alerts: existing.alerts?.length ? existing.alerts : DEMO_ALERTS,
      activity: existing.activity?.length ? existing.activity : DEMO_ACTIVITY,
      hydratedDemo: true,
    };
  }
  return {
    user: null,
    workspace: "personal",
    expenses: DEMO_EXPENSES,
    alerts: DEMO_ALERTS,
    activity: DEMO_ACTIVITY,
    hydratedDemo: true,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [workspace, setWorkspaceState] = useState<WorkspaceKind>("personal");
  const [expenses, setExpenses] = useState<RecurringExpense[]>(DEMO_EXPENSES);
  const [alerts, setAlerts] = useState<AlertItem[]>(DEMO_ALERTS);
  const [activity, setActivity] = useState<ActivityItem[]>(DEMO_ACTIVITY);

  useEffect(() => {
    const existing = initialState();
    // Hydrate from localStorage after mount (SSR-safe)
    queueMicrotask(() => {
      setUser(existing.user);
      setWorkspaceState(existing.workspace);
      setExpenses(existing.expenses);
      setAlerts(existing.alerts);
      setActivity(existing.activity);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    save({
      user,
      workspace,
      expenses,
      alerts,
      activity,
      hydratedDemo: true,
    });
  }, [ready, user, workspace, expenses, alerts, activity]);

  const login = useCallback((email: string, _password: string, name?: string) => {
    setUser((prev) => {
      if (prev && prev.email === email) return prev;
      return {
        ...DEMO_USER,
        email,
        name: name || prev?.name || DEMO_USER.name,
        onboardingComplete: prev?.onboardingComplete ?? true,
      };
    });
  }, []);

  const register = useCallback(
    (input: { name: string; email: string; password: string; country: string }) => {
      void input.password;
      setUser({
        ...DEMO_USER,
        id: `user-${Date.now()}`,
        name: input.name,
        email: input.email,
        country: input.country,
        currency: input.country === "KE" ? "KES" : DEMO_USER.currency,
        onboardingComplete: false,
        workspacesEnabled: ["personal"],
      });
      setWorkspaceState("personal");
    },
    [],
  );

  const logout = useCallback(() => {
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
        detail: `${items.length} expenses imported (illustrative demo)`,
        at: stamp(),
      });
      return items.length;
    },
    [addExpense, addActivity],
  );

  const resetDemoData = useCallback(() => {
    setExpenses(DEMO_EXPENSES);
    setAlerts(DEMO_ALERTS);
    setActivity(DEMO_ACTIVITY);
  }, []);

  const deleteAccount = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setExpenses(DEMO_EXPENSES);
    setAlerts(DEMO_ALERTS);
    setActivity(DEMO_ACTIVITY);
    setWorkspaceState("personal");
  }, []);

  const value = useMemo(
    () => ({
      ready,
      user,
      workspace,
      expenses,
      alerts,
      activity,
      login,
      register,
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
      resetDemoData,
      deleteAccount,
    }),
    [
      ready,
      user,
      workspace,
      expenses,
      alerts,
      activity,
      login,
      register,
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
      resetDemoData,
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
