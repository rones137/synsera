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
import { WORKSPACE_STORAGE_KEY, persistence } from "./persistence";

const KEY = WORKSPACE_STORAGE_KEY;

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
  addContract: (c: Omit<Contract, "id" | "status"> & { status?: Contract["status"] }) => void;
  updateContract: (id: string, patch: Partial<Contract>) => void;
  addLicense: (l: Omit<License, "id">) => void;
  reclaimLicense: (id: string) => void;
  addBudget: (b: Omit<Budget, "id" | "spent"> & { spent?: number }) => void;
  addTeamMember: (t: Omit<TeamMember, "id">) => void;
  addPlan: (name: string, price: number) => void;
  togglePlan: (id: string) => void;
  addCustomer: (name: string, plan: string, email: string) => void;
  retryInvoice: (id: string) => void;
  addDiscount: (code: string, type: "percent" | "fixed", value: number) => void;
  addWebhook: (url: string, events: string) => void;
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
  familyMembers: [{ id: "f-self", name: "You", role: "Owner" }],
  graveyard: [],
  blacklist: [],
  fxWatch: [],
  emergencyMode: false,
  healthScore: 100,
});

function load(): State | null {
  try {
    const raw = persistence.getItem(KEY);
    return raw ? (JSON.parse(raw) as State) : null;
  } catch {
    return null;
  }
}

export function WorkspaceDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<State>(defaults);

  useEffect(() => {
    persistence.removeItem("synsera-workspace-v1");
    const existing = load();
    if (existing) {
      setState({
        ...defaults(),
        ...existing,
        // Never rehydrate fake seed arrays if somehow present empty-merge wrong
        familyMembers: existing.familyMembers?.length
          ? existing.familyMembers
          : defaults().familyMembers,
      });
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    persistence.setItem(KEY, JSON.stringify(state));
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
            actor: "You",
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

  const addContract = useCallback(
    (c: Omit<Contract, "id" | "status"> & { status?: Contract["status"] }) => {
      setState((s) => ({
        ...s,
        contracts: [
          {
            id: `ct-${Date.now()}`,
            status: c.status || "active",
            name: c.name,
            vendor: c.vendor,
            renews: c.renews,
            noticeDays: c.noticeDays,
            value: c.value,
          },
          ...s.contracts,
        ],
        vendors: s.vendors.map((v) =>
          v.name === c.vendor ? { ...v, contracts: v.contracts + 1 } : v,
        ),
        audit: [
          {
            id: `a-${Date.now()}`,
            actor: "You",
            action: `Added contract ${c.name}`,
            at: stamp(),
          },
          ...s.audit,
        ],
      }));
    },
    [],
  );

  const updateContract = useCallback((id: string, patch: Partial<Contract>) => {
    setState((s) => ({
      ...s,
      contracts: s.contracts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const addLicense = useCallback((l: Omit<License, "id">) => {
    setState((s) => ({
      ...s,
      licenses: [{ ...l, id: `lic-${Date.now()}` }, ...s.licenses],
    }));
  }, []);

  const addBudget = useCallback((b: Omit<Budget, "id" | "spent"> & { spent?: number }) => {
    setState((s) => ({
      ...s,
      budgets: [
        {
          id: `bd-${Date.now()}`,
          dept: b.dept,
          limit: b.limit,
          spent: b.spent ?? 0,
        },
        ...s.budgets,
      ],
    }));
  }, []);

  const addTeamMember = useCallback((t: Omit<TeamMember, "id">) => {
    setState((s) => ({
      ...s,
      teams: [{ ...t, id: `tm-${Date.now()}` }, ...s.teams],
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
          actor: "You",
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
    setState((s) => {
      const price =
        s.plans.find((p) => p.name === plan)?.price ||
        s.plans[0]?.price ||
        0;
      const due = new Date();
      due.setDate(due.getDate() + 14);
      const dueStr = due.toISOString().slice(0, 10);
      return {
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
        invoices: [
          {
            id: `inv-${Date.now()}`,
            customer: name,
            amount: price,
            status: "open" as const,
            due: dueStr,
          },
          ...s.invoices,
        ],
        plans: s.plans.map((p) =>
          p.name === plan ? { ...p, subscribers: p.subscribers + 1 } : p,
        ),
      };
    });
  }, []);

  const addWebhook = useCallback((url: string, events: string) => {
    setState((s) => ({
      ...s,
      webhooks: [
        {
          id: `wh-${Date.now()}`,
          url,
          events,
          status: "active",
        },
        ...s.webhooks,
      ],
    }));
  }, []);

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
      addContract,
      updateContract,
      addLicense,
      reclaimLicense,
      addBudget,
      addTeamMember,
      addPlan,
      togglePlan,
      addCustomer,
      retryInvoice,
      addDiscount,
      addWebhook,
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
      addContract,
      updateContract,
      addLicense,
      reclaimLicense,
      addBudget,
      addTeamMember,
      addPlan,
      togglePlan,
      addCustomer,
      retryInvoice,
      addDiscount,
      addWebhook,
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
