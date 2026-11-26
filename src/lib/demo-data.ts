import type {
  ActivityItem,
  AlertItem,
  RecurringExpense,
  UserProfile,
} from "./types";

export const DEMO_USER: UserProfile = {
  id: "user-blaise",
  name: "Blaise Rolys",
  email: "blaise@synsera.app",
  country: "KE",
  currency: "KES",
  timezone: "Africa/Nairobi",
  theme: "dark",
  notifications: {
    email: true,
    push: true,
    renewalDays: 7,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  },
  onboardingComplete: true,
  workspacesEnabled: ["personal", "business", "merchant"],
};

const now = "2026-11-26T10:00:00";

export const DEMO_EXPENSES: RecurringExpense[] = [
  {
    id: "exp-1",
    name: "Netflix Premium",
    merchant: "Netflix",
    amount: 1400,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-11-28",
    category: "Entertainment",
    status: "active",
    paymentMethod: "Card ···· 4281",
    confirmed: true,
    workspace: "personal",
    history: [
      { date: "2026-10-28", amount: 1400 },
      { date: "2026-09-28", amount: 1400 },
      { date: "2026-08-28", amount: 1300, note: "Previous tier" },
    ],
    createdAt: "2026-01-12T09:00:00",
    updatedAt: now,
  },
  {
    id: "exp-2",
    name: "Adobe Creative Cloud",
    merchant: "Adobe",
    amount: 7200,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-12-01",
    category: "Software",
    status: "price_changed",
    paymentMethod: "Card ···· 4281",
    notes: "Price rose from KSh 6,500",
    confirmed: true,
    workspace: "personal",
    history: [
      { date: "2026-11-01", amount: 7200 },
      { date: "2026-10-01", amount: 6500 },
      { date: "2026-09-01", amount: 6500 },
    ],
    createdAt: "2025-06-01T09:00:00",
    updatedAt: now,
  },
  {
    id: "exp-3",
    name: "Spotify Family",
    merchant: "Spotify",
    amount: 850,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-11-30",
    category: "Entertainment",
    status: "active",
    paymentMethod: "M-PESA Till",
    confirmed: true,
    workspace: "personal",
    history: [
      { date: "2026-10-30", amount: 850 },
      { date: "2026-09-30", amount: 850 },
    ],
    createdAt: "2025-11-01T09:00:00",
    updatedAt: now,
  },
  {
    id: "exp-4",
    name: "Safaricom Fibre 20Mbps",
    merchant: "Safaricom",
    amount: 3999,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-12-05",
    category: "Utilities",
    status: "active",
    paymentMethod: "M-PESA AutoPay",
    confirmed: true,
    workspace: "personal",
    createdAt: "2024-03-01T09:00:00",
    updatedAt: now,
  },
  {
    id: "exp-5",
    name: "Canva Pro",
    merchant: "Canva",
    amount: 1500,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-12-03",
    category: "Software",
    status: "trial",
    paymentMethod: "Card ···· 8820",
    notes: "Trial ends in 7 days",
    confirmed: true,
    workspace: "personal",
    createdAt: "2026-11-19T09:00:00",
    updatedAt: now,
  },
  {
    id: "exp-6",
    name: "Gym Membership — PureGym",
    merchant: "PureGym KE",
    amount: 4500,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-12-08",
    category: "Health",
    status: "active",
    paymentMethod: "M-PESA AutoPay",
    confirmed: true,
    workspace: "personal",
    createdAt: "2026-02-01T09:00:00",
    updatedAt: now,
  },
  {
    id: "exp-7",
    name: "Domain — synsera.ke",
    merchant: "Safaricom Domains",
    amount: 1800,
    currency: "KES",
    cycle: "yearly",
    nextBillingDate: "2027-03-15",
    category: "Software",
    status: "upcoming",
    paymentMethod: "Card ···· 4281",
    confirmed: true,
    workspace: "personal",
    createdAt: "2026-03-15T09:00:00",
    updatedAt: now,
  },
  {
    id: "exp-8",
    name: "Microsoft 365 Personal",
    merchant: "Microsoft",
    amount: 1100,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-11-27",
    category: "Software",
    status: "failed",
    paymentMethod: "Card ···· 8820",
    notes: "Last payment failed — update card",
    confirmed: true,
    workspace: "personal",
    createdAt: "2025-08-01T09:00:00",
    updatedAt: now,
  },
  {
    id: "exp-9",
    name: "Showmax",
    merchant: "Showmax",
    amount: 720,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-12-12",
    category: "Entertainment",
    status: "cancellation_pending",
    paymentMethod: "M-PESA Till",
    confirmed: false,
    workspace: "personal",
    createdAt: "2025-05-01T09:00:00",
    updatedAt: now,
  },
  {
    id: "exp-10",
    name: "Notion Plus",
    merchant: "Notion",
    amount: 1300,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-12-10",
    category: "Software",
    status: "active",
    paymentMethod: "Card ···· 4281",
    confirmed: true,
    workspace: "personal",
    createdAt: "2026-04-01T09:00:00",
    updatedAt: now,
  },
  // Business sample
  {
    id: "biz-1",
    name: "AWS — staging",
    merchant: "Amazon Web Services",
    amount: 18500,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-12-02",
    category: "Cloud",
    status: "active",
    paymentMethod: "Card ···· 5510",
    confirmed: true,
    workspace: "business",
    createdAt: "2025-01-01T09:00:00",
    updatedAt: now,
  },
  {
    id: "biz-2",
    name: "Figma Organization",
    merchant: "Figma",
    amount: 9600,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-12-04",
    category: "Software",
    status: "active",
    paymentMethod: "Card ···· 5510",
    confirmed: true,
    workspace: "business",
    createdAt: "2025-03-01T09:00:00",
    updatedAt: now,
  },
  {
    id: "biz-3",
    name: "Slack Pro",
    merchant: "Slack",
    amount: 4200,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-11-29",
    category: "Software",
    status: "price_changed",
    paymentMethod: "Card ···· 5510",
    confirmed: true,
    workspace: "business",
    createdAt: "2024-11-01T09:00:00",
    updatedAt: now,
  },
  {
    id: "biz-4",
    name: "Office lease — Westlands",
    merchant: "Landmark Properties",
    amount: 85000,
    currency: "KES",
    cycle: "monthly",
    nextBillingDate: "2026-12-01",
    category: "Facilities",
    status: "active",
    paymentMethod: "Bank transfer",
    confirmed: true,
    workspace: "business",
    createdAt: "2024-06-01T09:00:00",
    updatedAt: now,
  },
];

export const DEMO_ALERTS: AlertItem[] = [
  {
    id: "att-1",
    severity: "danger",
    title: "Microsoft 365 payment failed",
    detail: "Card ···· 8820 was declined. Update payment method before Dec 4.",
    expenseId: "exp-8",
    read: false,
    createdAt: "2026-11-26T08:00:00",
    category: "payment",
  },
  {
    id: "att-2",
    severity: "warning",
    title: "Adobe price increase",
    detail: "Creative Cloud rose to KSh 7,200/mo (+KSh 700). Review before renewal.",
    expenseId: "exp-2",
    read: false,
    createdAt: "2026-11-25T09:14:00",
    category: "price",
  },
  {
    id: "att-3",
    severity: "info",
    title: "Canva Pro trial ending",
    detail: "Trial converts to paid on Dec 3. Cancel or keep — your choice.",
    expenseId: "exp-5",
    read: false,
    createdAt: "2026-11-25T07:00:00",
    category: "trial",
  },
  {
    id: "att-4",
    severity: "info",
    title: "Netflix renews in 2 days",
    detail: "KSh 1,400 will be charged on 28 Nov via Card ···· 4281.",
    expenseId: "exp-1",
    read: true,
    createdAt: "2026-11-26T07:00:00",
    category: "renewal",
  },
  {
    id: "att-5",
    severity: "warning",
    title: "Slack Pro price change (Business)",
    detail: "Vendor notice: +12% effective next cycle.",
    expenseId: "biz-3",
    read: false,
    createdAt: "2026-11-24T11:00:00",
    category: "price",
  },
];

export const DEMO_ACTIVITY: ActivityItem[] = [
  {
    id: "act-1",
    type: "price",
    title: "Price change detected",
    detail: "Adobe Creative Cloud · KSh 6,500 → KSh 7,200",
    at: "2026-11-25T09:14:00",
  },
  {
    id: "act-2",
    type: "reminder",
    title: "Renewal reminder sent",
    detail: "Netflix Premium renews in 3 days",
    at: "2026-11-25T07:00:00",
  },
  {
    id: "act-3",
    type: "payment",
    title: "Payment recorded",
    detail: "Spotify Family · KSh 850 via M-PESA",
    at: "2026-11-24T18:22:00",
  },
  {
    id: "act-4",
    type: "added",
    title: "Expense added",
    detail: "Notion Plus · KSh 1,300/mo",
    at: "2026-11-23T14:05:00",
  },
  {
    id: "act-5",
    type: "cancelled",
    title: "Cancellation requested",
    detail: "Showmax — verification pending",
    at: "2026-11-22T11:40:00",
  },
];

export const BUSINESS_VENDORS = [
  { id: "v1", name: "Amazon Web Services", category: "Cloud", spend: 18500, contracts: 1, owner: "Eng" },
  { id: "v2", name: "Figma", category: "Design", spend: 9600, contracts: 1, owner: "Design" },
  { id: "v3", name: "Slack", category: "Comms", spend: 4200, contracts: 1, owner: "Ops" },
  { id: "v4", name: "Landmark Properties", category: "Facilities", spend: 85000, contracts: 1, owner: "Ops" },
  { id: "v5", name: "Safaricom Business", category: "Telecom", spend: 12000, contracts: 2, owner: "Ops" },
];

export const BUSINESS_CONTRACTS = [
  { id: "c1", name: "AWS Enterprise Discount", vendor: "AWS", renews: "2027-01-15", noticeDays: 30, value: 222000 },
  { id: "c2", name: "Westlands lease", vendor: "Landmark", renews: "2027-06-01", noticeDays: 90, value: 1020000 },
  { id: "c3", name: "Figma Org annual", vendor: "Figma", renews: "2026-12-04", noticeDays: 14, value: 115200 },
];

export const BUSINESS_LICENSES = [
  { id: "l1", name: "Figma seats", total: 12, used: 9, waste: 3 },
  { id: "l2", name: "Slack Pro", total: 20, used: 18, waste: 2 },
  { id: "l3", name: "Adobe CC", total: 4, used: 2, waste: 2 },
];

export const BUSINESS_BUDGETS = [
  { id: "b1", dept: "Engineering", limit: 80000, spent: 52000 },
  { id: "b2", dept: "Design", limit: 25000, spent: 18000 },
  { id: "b3", dept: "Operations", limit: 120000, spent: 97000 },
];

export const BUSINESS_PURCHASES = [
  { id: "pr1", title: "Linear seats ×5", amount: 7500, status: "pending", requester: "Amina" },
  { id: "pr2", title: "Notion Team upgrade", amount: 4200, status: "approved", requester: "Ken" },
  { id: "pr3", title: "Zoom Workplace", amount: 9800, status: "rejected", requester: "Otieno" },
];

export const MERCHANT_PLANS = [
  { id: "mp1", name: "Starter", price: 999, interval: "monthly", subscribers: 128, active: true },
  { id: "mp2", name: "Growth", price: 2499, interval: "monthly", subscribers: 64, active: true },
  { id: "mp3", name: "Pro", price: 5999, interval: "monthly", subscribers: 21, active: true },
];

export const MERCHANT_CUSTOMERS = [
  { id: "mc1", name: "Wanjiku Designs", plan: "Growth", mrr: 2499, status: "active" },
  { id: "mc2", name: "Nairobi Bites", plan: "Starter", mrr: 999, status: "active" },
  { id: "mc3", name: "Lake Victoria Tours", plan: "Pro", mrr: 5999, status: "past_due" },
  { id: "mc4", name: "Kilifi Studio", plan: "Growth", mrr: 2499, status: "trialing" },
];

export const MERCHANT_INVOICES = [
  { id: "inv1", customer: "Wanjiku Designs", amount: 2499, status: "paid", due: "2026-11-20" },
  { id: "inv2", customer: "Nairobi Bites", amount: 999, status: "paid", due: "2026-11-18" },
  { id: "inv3", customer: "Lake Victoria Tours", amount: 5999, status: "failed", due: "2026-11-22" },
];

export function monthlyEquivalent(e: RecurringExpense): number {
  switch (e.cycle) {
    case "yearly":
      return Math.round(e.amount / 12);
    case "weekly":
      return Math.round(e.amount * 4.33);
    default:
      return e.amount;
  }
}

export function getDashboardStats(expenses: RecurringExpense[]) {
  const active = expenses.filter((e) => !["cancelled", "archived"].includes(e.status));
  const monthlyRecurring = active.reduce((s, e) => s + monthlyEquivalent(e), 0);
  const ref = new Date("2026-11-26");
  const in7 = new Date(ref);
  in7.setDate(in7.getDate() + 7);
  const next7 = active
    .filter((e) => {
      const d = new Date(e.nextBillingDate);
      return d >= ref && d <= in7;
    })
    .reduce((s, e) => s + e.amount, 0);
  const annualized = monthlyRecurring * 12;
  const potentialSavings = active
    .filter((e) => ["cancellation_pending", "trial"].includes(e.status) || e.name.includes("Showmax"))
    .reduce((s, e) => s + monthlyEquivalent(e), 0);
  return { monthlyRecurring, next7, annualized, potentialSavings: potentialSavings || 1570 };
}

export const SAMPLE_CSV = `name,merchant,amount,cycle,nextBillingDate,category,paymentMethod
Disney+,Disney,1150,monthly,2026-12-15,Entertainment,M-PESA Till
GitHub Pro,GitHub,1800,monthly,2026-12-08,Software,Card ···· 4281
DSTV Compact,MultiChoice,3450,monthly,2026-12-01,Entertainment,M-PESA AutoPay
`;
