export type PurchaseStatus = "pending" | "approved" | "rejected";

export interface Vendor {
  id: string;
  name: string;
  category: string;
  spend: number;
  contracts: number;
  owner: string;
  email?: string;
  notes?: string;
}

export interface Contract {
  id: string;
  name: string;
  vendor: string;
  renews: string;
  noticeDays: number;
  value: number;
  status: "active" | "notice_window" | "expired";
}

export interface License {
  id: string;
  name: string;
  total: number;
  used: number;
  waste: number;
}

export interface Budget {
  id: string;
  dept: string;
  limit: number;
  spent: number;
}

export interface PurchaseRequest {
  id: string;
  title: string;
  amount: number;
  status: PurchaseStatus;
  requester: string;
  createdAt: string;
  decidedAt?: string;
  note?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  dept: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  at: string;
}

export interface MerchantPlan {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  subscribers: number;
  active: boolean;
}

export interface MerchantCustomer {
  id: string;
  name: string;
  plan: string;
  mrr: number;
  status: "active" | "past_due" | "trialing" | "cancelled";
  email: string;
}

export interface MerchantInvoice {
  id: string;
  customer: string;
  amount: number;
  status: "paid" | "failed" | "open";
  due: string;
}

export interface Discount {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  uses: number;
  active: boolean;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string;
  status: "active" | "disabled";
}

/** Empty defaults — first load has no fake vendors/customers/KES rows. */
export const INITIAL_VENDORS: Vendor[] = [];
export const INITIAL_CONTRACTS: Contract[] = [];
export const INITIAL_LICENSES: License[] = [];
export const INITIAL_BUDGETS: Budget[] = [];
export const INITIAL_PURCHASES: PurchaseRequest[] = [];
export const INITIAL_TEAMS: TeamMember[] = [];
export const INITIAL_AUDIT: AuditEntry[] = [];
export const INITIAL_PLANS: MerchantPlan[] = [];
export const INITIAL_CUSTOMERS: MerchantCustomer[] = [];
export const INITIAL_INVOICES: MerchantInvoice[] = [];
export const INITIAL_DISCOUNTS: Discount[] = [];
export const INITIAL_WEBHOOKS: WebhookEndpoint[] = [];
