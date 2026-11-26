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

export const INITIAL_VENDORS: Vendor[] = [
  { id: "v1", name: "Amazon Web Services", category: "Cloud", spend: 18500, contracts: 1, owner: "Eng", email: "billing@aws.amazon.com" },
  { id: "v2", name: "Figma", category: "Design", spend: 9600, contracts: 1, owner: "Design" },
  { id: "v3", name: "Slack", category: "Comms", spend: 4200, contracts: 1, owner: "Ops" },
  { id: "v4", name: "Landmark Properties", category: "Facilities", spend: 85000, contracts: 1, owner: "Ops" },
  { id: "v5", name: "Safaricom Business", category: "Telecom", spend: 12000, contracts: 2, owner: "Ops" },
];

export const INITIAL_CONTRACTS: Contract[] = [
  { id: "c1", name: "AWS Enterprise Discount", vendor: "AWS", renews: "2027-01-15", noticeDays: 30, value: 222000, status: "active" },
  { id: "c2", name: "Westlands lease", vendor: "Landmark", renews: "2027-06-01", noticeDays: 90, value: 1020000, status: "active" },
  { id: "c3", name: "Figma Org annual", vendor: "Figma", renews: "2026-12-04", noticeDays: 14, value: 115200, status: "notice_window" },
];

export const INITIAL_LICENSES: License[] = [
  { id: "l1", name: "Figma seats", total: 12, used: 9, waste: 3 },
  { id: "l2", name: "Slack Pro", total: 20, used: 18, waste: 2 },
  { id: "l3", name: "Adobe CC", total: 4, used: 2, waste: 2 },
];

export const INITIAL_BUDGETS: Budget[] = [
  { id: "b1", dept: "Engineering", limit: 80000, spent: 52000 },
  { id: "b2", dept: "Design", limit: 25000, spent: 18000 },
  { id: "b3", dept: "Operations", limit: 120000, spent: 97000 },
];

export const INITIAL_PURCHASES: PurchaseRequest[] = [
  { id: "pr1", title: "Linear seats ×5", amount: 7500, status: "pending", requester: "Amina", createdAt: "2026-11-24T10:00:00" },
  { id: "pr2", title: "Notion Team upgrade", amount: 4200, status: "approved", requester: "Ken", createdAt: "2026-11-20T10:00:00", decidedAt: "2026-11-21T12:00:00" },
  { id: "pr3", title: "Zoom Workplace", amount: 9800, status: "rejected", requester: "Otieno", createdAt: "2026-11-18T10:00:00", decidedAt: "2026-11-19T09:00:00", note: "Use Google Meet" },
];

export const INITIAL_TEAMS: TeamMember[] = [
  { id: "t1", name: "Blaise Rolys", role: "Owner", dept: "Leadership" },
  { id: "t2", name: "Amina Wanjiru", role: "Eng lead", dept: "Engineering" },
  { id: "t3", name: "Ken Otieno", role: "Designer", dept: "Design" },
  { id: "t4", name: "Wanjiku Njeri", role: "Ops", dept: "Operations" },
];

export const INITIAL_AUDIT: AuditEntry[] = [
  { id: "a1", actor: "Blaise", action: "Approved Notion Team upgrade", at: "2026-11-21T12:00:00" },
  { id: "a2", actor: "Amina", action: "Submitted Linear seats request", at: "2026-11-24T10:00:00" },
  { id: "a3", actor: "System", action: "Figma contract entered notice window", at: "2026-11-20T08:00:00" },
];

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

export const INITIAL_PLANS: MerchantPlan[] = [
  { id: "mp1", name: "Starter", price: 999, interval: "monthly", subscribers: 128, active: true },
  { id: "mp2", name: "Growth", price: 2499, interval: "monthly", subscribers: 64, active: true },
  { id: "mp3", name: "Pro", price: 5999, interval: "monthly", subscribers: 21, active: true },
];

export const INITIAL_CUSTOMERS: MerchantCustomer[] = [
  { id: "mc1", name: "Wanjiku Designs", plan: "Growth", mrr: 2499, status: "active", email: "hello@wanjiku.design" },
  { id: "mc2", name: "Nairobi Bites", plan: "Starter", mrr: 999, status: "active", email: "pay@nairoibites.co.ke" },
  { id: "mc3", name: "Lake Victoria Tours", plan: "Pro", mrr: 5999, status: "past_due", email: "billing@lvtours.ke" },
  { id: "mc4", name: "Kilifi Studio", plan: "Growth", mrr: 2499, status: "trialing", email: "hi@kilifi.studio" },
];

export const INITIAL_INVOICES: MerchantInvoice[] = [
  { id: "inv1", customer: "Wanjiku Designs", amount: 2499, status: "paid", due: "2026-11-20" },
  { id: "inv2", customer: "Nairobi Bites", amount: 999, status: "paid", due: "2026-11-18" },
  { id: "inv3", customer: "Lake Victoria Tours", amount: 5999, status: "failed", due: "2026-11-22" },
];

export const INITIAL_DISCOUNTS: Discount[] = [
  { id: "d1", code: "LAUNCH20", type: "percent", value: 20, uses: 42, active: true },
  { id: "d2", code: "KEFOUNDER", type: "fixed", value: 500, uses: 18, active: true },
];

export const INITIAL_WEBHOOKS: WebhookEndpoint[] = [
  { id: "w1", url: "https://api.example.com/hooks/synsera", events: "invoice.paid, payment.failed", status: "active" },
];
