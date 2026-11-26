export type ExpenseStatus =
  | "active"
  | "trial"
  | "upcoming"
  | "price_changed"
  | "failed"
  | "cancellation_pending"
  | "cancelled";

export type BillingCycle = "monthly" | "yearly" | "weekly" | "custom";

export interface RecurringExpense {
  id: string;
  name: string;
  merchant: string;
  amount: number;
  currency: "KES";
  cycle: BillingCycle;
  nextBillingDate: string;
  category: string;
  status: ExpenseStatus;
  paymentMethod: string;
  notes?: string;
  confirmed: boolean;
}

export interface ActivityItem {
  id: string;
  type: "added" | "reminder" | "price" | "cancelled" | "payment";
  title: string;
  detail: string;
  at: string;
}

export interface AttentionItem {
  id: string;
  severity: "warning" | "danger" | "info";
  title: string;
  detail: string;
  expenseId?: string;
}

export const DEMO_USER = {
  name: "Blaise Rolys",
  email: "blaise@synsera.app",
  initials: "BR",
};

/** Illustrative Kenyan sample data — labelled as sample in UI */
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
  },
];

export const DEMO_ATTENTION: AttentionItem[] = [
  {
    id: "att-1",
    severity: "danger",
    title: "Microsoft 365 payment failed",
    detail: "Card ···· 8820 was declined. Update payment method before Dec 4.",
    expenseId: "exp-8",
  },
  {
    id: "att-2",
    severity: "warning",
    title: "Adobe price increase",
    detail: "Creative Cloud rose to KSh 7,200/mo (+KSh 700). Review before renewal.",
    expenseId: "exp-2",
  },
  {
    id: "att-3",
    severity: "info",
    title: "Canva Pro trial ending",
    detail: "Trial converts to paid on Dec 3. Cancel or keep — your choice.",
    expenseId: "exp-5",
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
  const active = expenses.filter(
    (e) => !["cancelled"].includes(e.status),
  );
  const monthlyRecurring = active.reduce((s, e) => s + monthlyEquivalent(e), 0);
  const now = new Date("2026-11-26");
  const in7 = new Date(now);
  in7.setDate(in7.getDate() + 7);
  const next7 = active
    .filter((e) => {
      const d = new Date(e.nextBillingDate);
      return d >= now && d <= in7;
    })
    .reduce((s, e) => s + e.amount, 0);
  const annualized = monthlyRecurring * 12;
  // Estimate only — unused/duplicate hypotheses for demo
  const potentialSavings = 850 + 720; // Spotify overlap hypothesis + Showmax
  return { monthlyRecurring, next7, annualized, potentialSavings };
}
