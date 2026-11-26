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
  INITIAL_AUDIT,
  INITIAL_BUDGETS,
  INITIAL_CONTRACTS,
  INITIAL_CUSTOMERS,
  INITIAL_DISCOUNTS,
  INITIAL_INVOICES,
  INITIAL_LICENSES,
  INITIAL_PLANS,
  INITIAL_PURCHASES,
  INITIAL_TEAMS,
  INITIAL_VENDORS,
  INITIAL_WEBHOOKS,
  type AuditEntry,
  type Budget,
  type Contract,
  type Discount,
  type License,
  type MerchantCustomer,
  type MerchantInvoice,
  type MerchantPlan,
  type PurchaseRequest,
  type PurchaseStatus,
  type TeamMember,
  type Vendor,
  type WebhookEndpoint,
} from "./business-data";

const KEY = "synsera-workspace-v1";

type State = {
  vendors: Vendor[];
  contracts: Contract[];
  licenses: License[];
  budgets: Budget[];
  purchases: PurchaseRequest[];
  teams: TeamMember[];
  audit: AuditEntry[];
  plans: MerchantPlan[];
  customers: MerchantCustomer[];
  invoices: MerchantInvoice[];
  discounts: Discount[];
  webhooks: WebhookEndpoint[];
  familyMembers: { id: string; name: string; role: string }[];
  graveyard: { id: string; name: string; amount: number; cancelledAt: string }[];
  blacklist: { id: string; merchant: string; reason: string }[];
  fxWatch: { pair: string; rate: number; note: string }[];
  emergencyMode: boolean;
  healthScore: number;
};

type Ctx = State & {
  ready: boolean;
  decidePurchase: (id: string, status: Exclude<PurchaseStatus, "pending">, note?: string) => void;
  addPurchase: (title: string, amount: number, requester: string) => void;
  addVendor: (v: Omit<Vendor, "id" | "contracts">) => void;
  updateContract: (id: string, patch: Partial<Contract>) => void;
  reclaimLicense: (id: string) => void;
  addPlan: (name: string, price: number) => void;
  togglePlan: (id: string) => void;
  addCustomer: (name: string, plan: string, email: string) => void;
  retryInvoice: (id: string) => void;
  addDiscount: (code: string, type: "percent" | "fixed", value: number) => void;
  toggleWebhook: (id: string) => void;
  inviteFamily: (name: string) => void;
  removeFamily: (id: string) => void;
  addToGraveyard: (name: string, amount: number) => void;
  addBlacklist: (merchant: string, reason: string) => void;
  removeBlacklist: (id: string) => void;
  setEmergencyMode: (on: boolean) => void;
  recomputeHealth: (score: number) => void;
};

const C = createContext<Ctx | null>(null);

const defaults = (): State => ({
  vendors: INITIAL_VENDORS,
  contracts: INITIAL_CONTRACTS,
  licenses: INITIAL_LICENSES,
  budgets: INITIAL_BUDGETS,
  purchases: INITIAL_PURCHASES,
  teams: INITIAL_TEAMS,
  audit: INITIAL_AUDIT,
  plans: INITIAL_PLANS,
  customers: INITIAL_CUSTOMERS,
  invoices: INITIAL_INVOICES,
  discounts: INITIAL_DISCOUNTS,
  webhooks: INITIAL_WEBHOOKS,
  familyMembers: [
    { id: "f1", name: "You", role: "Owner" },
    { id: "f2", name: "Amina", role: "Viewer" },
  ],
  graveyard: [
    { id: "g1", name: "Old VPN sub", amount: 800, cancelledAt: "2026-09-01" },
  ],
  blacklist: [
    { id: "bl1", merchant: "LootBox Games", reason: "Impulse spend" },
  ],
  fxWatch: [
    { pair: "USD/KES", rate: 129.4, note: "Illustrative mid · watch SaaS invoices" },
    { pair: "EUR/KES", rate: 140.1, note: "Illustrative mid" },
  ],
  emergencyMode: false,
  healthScore: 72,
});

function load(): State | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as State) : null;
  } catch {
    return null;
  }
}

export function WorkspaceDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<State>(defaults);

  useEffect(() => {
    const existing = load();
    queueMicrotask(() => {
      if (existing) setState({ ...defaults(), ...existing });
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [ready, state]);

  const stamp = () => new Date().toISOString();

  const decidePurchase = useCallback(
    (id: string, status: Exclude<PurchaseStatus, "pending">, note?: string) => {
      setState((s) => ({
        ...s,
        purchases: s.purchases.map((p) =>
          p.id === id
            ? { ...p, status, decidedAt: stamp(), note: note || p.note }
            : p,
        ),
        audit: [
          {
            id: `a-${Date.now()}`,
            actor: "Blaise",
            action: `${status === "approved" ? "Approved" : "Rejected"} ${s.purchases.find((p) => p.id === id)?.title || id}`,
            at: stamp(),
          },
          ...s.audit,
        ],
      }));
    },
    [],
  );

  const addPurchase = useCallback((title: string, amount: number, requester: string) => {
    setState((s) => ({
      ...s,
      purchases: [
        {
          id: `pr-${Date.now()}`,
          title,
          amount,
          status: "pending",
          requester,
          createdAt: stamp(),
        },
        ...s.purchases,
      ],
    }));
  }, []);

  const addVendor = useCallback((v: Omit<Vendor, "id" | "contracts">) => {
    setState((s) => ({
      ...s,
      vendors: [{ ...v, id: `v-${Date.now()}`, contracts: 0 }, ...s.vendors],
    }));
  }, []);

  const updateContract = useCallback((id: string, patch: Partial<Contract>) => {
    setState((s) => ({
      ...s,
      contracts: s.contracts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const reclaimLicense = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      licenses: s.licenses.map((l) =>
        l.id === id
          ? {
              ...l,
              total: Math.max(l.used, l.total - l.waste),
              waste: 0,
            }
          : l,
      ),
      audit: [
        {
          id: `a-${Date.now()}`,
          actor: "Blaise",
          action: `Reclaimed waste seats on ${s.licenses.find((l) => l.id === id)?.name}`,
          at: stamp(),
        },
        ...s.audit,
      ],
    }));
  }, []);

  const addPlan = useCallback((name: string, price: number) => {
    setState((s) => ({
      ...s,
      plans: [
        {
          id: `mp-${Date.now()}`,
          name,
          price,
          interval: "monthly",
          subscribers: 0,
          active: true,
        },
        ...s.plans,
      ],
    }));
  }, []);

  const togglePlan = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      plans: s.plans.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    }));
  }, []);

  const addCustomer = useCallback((name: string, plan: string, email: string) => {
    const price =
      state.plans.find((p) => p.name === plan)?.price ||
      state.plans[0]?.price ||
      999;
    setState((s) => ({
      ...s,
      customers: [
        {
          id: `mc-${Date.now()}`,
          name,
          plan,
          mrr: price,
          status: "trialing",
          email,
        },
        ...s.customers,
      ],
    }));
  }, [state.plans]);

  const retryInvoice = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      invoices: s.invoices.map((i) =>
        i.id === id ? { ...i, status: "paid" as const } : i,
      ),
    }));
  }, []);

  const addDiscount = useCallback(
    (code: string, type: "percent" | "fixed", value: number) => {
      setState((s) => ({
        ...s,
        discounts: [
          {
            id: `d-${Date.now()}`,
            code,
            type,
            value,
            uses: 0,
            active: true,
          },
          ...s.discounts,
        ],
      }));
    },
    [],
  );

  const toggleWebhook = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      webhooks: s.webhooks.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "active" ? "disabled" : "active" }
          : w,
      ),
    }));
  }, []);

  const inviteFamily = useCallback((name: string) => {
    setState((s) => ({
      ...s,
      familyMembers: [
        ...s.familyMembers,
        { id: `f-${Date.now()}`, name, role: "Member" },
      ],
    }));
  }, []);

  const removeFamily = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      familyMembers: s.familyMembers.filter((m) => m.id !== id || m.role === "Owner"),
    }));
  }, []);

  const addToGraveyard = useCallback((name: string, amount: number) => {
    setState((s) => ({
      ...s,
      graveyard: [
        {
          id: `g-${Date.now()}`,
          name,
          amount,
          cancelledAt: new Date().toISOString().slice(0, 10),
        },
        ...s.graveyard,
      ],
    }));
  }, []);

  const addBlacklist = useCallback((merchant: string, reason: string) => {
    setState((s) => ({
      ...s,
      blacklist: [
        { id: `bl-${Date.now()}`, merchant, reason },
        ...s.blacklist,
      ],
    }));
  }, []);

  const removeBlacklist = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      blacklist: s.blacklist.filter((b) => b.id !== id),
    }));
  }, []);

  const setEmergencyMode = useCallback((on: boolean) => {
    setState((s) => ({ ...s, emergencyMode: on }));
  }, []);

  const recomputeHealth = useCallback((score: number) => {
    setState((s) => ({ ...s, healthScore: score }));
  }, []);

  const value = useMemo(
    () => ({
      ready,
      ...state,
      decidePurchase,
      addPurchase,
      addVendor,
      updateContract,
      reclaimLicense,
      addPlan,
      togglePlan,
      addCustomer,
      retryInvoice,
      addDiscount,
      toggleWebhook,
      inviteFamily,
      removeFamily,
      addToGraveyard,
      addBlacklist,
      removeBlacklist,
      setEmergencyMode,
      recomputeHealth,
    }),
    [
      ready,
      state,
      decidePurchase,
      addPurchase,
      addVendor,
      updateContract,
      reclaimLicense,
      addPlan,
      togglePlan,
      addCustomer,
      retryInvoice,
      addDiscount,
      toggleWebhook,
      inviteFamily,
      removeFamily,
      addToGraveyard,
      addBlacklist,
      removeBlacklist,
      setEmergencyMode,
      recomputeHealth,
    ],
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useWorkspaceData() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useWorkspaceData requires WorkspaceDataProvider");
  return ctx;
}
