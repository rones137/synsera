/**
 * Domain helpers + blank profile template.
 * No seeded financial fixtures — first load is empty.
 */
import type { RecurringExpense, UserProfile } from "./types";

/** Blank profile shape used when registering / logging in (not financial sample data). */
export const DEFAULT_USER_PROFILE: UserProfile = {
  id: "user-local",
  name: "You",
  email: "",
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

/** @deprecated Use DEFAULT_USER_PROFILE — kept so older imports compile during purge. */
export const DEMO_USER = DEFAULT_USER_PROFILE;

export const DEMO_EXPENSES: RecurringExpense[] = [];
export const DEMO_ALERTS: import("./types").AlertItem[] = [];
export const DEMO_ACTIVITY: import("./types").ActivityItem[] = [];

export const BUSINESS_VENDORS: never[] = [];
export const BUSINESS_CONTRACTS: never[] = [];
export const BUSINESS_LICENSES: never[] = [];
export const BUSINESS_BUDGETS: never[] = [];
export const BUSINESS_PURCHASES: never[] = [];
export const MERCHANT_PLANS: never[] = [];
export const MERCHANT_CUSTOMERS: never[] = [];
export const MERCHANT_INVOICES: never[] = [];

/** CSV header template for import — no fake amount rows. */
export const SAMPLE_CSV = `name,merchant,amount,cycle,nextBillingDate,category,paymentMethod
`;

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
  const ref = new Date();
  ref.setHours(0, 0, 0, 0);
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
    .filter((e) => ["cancellation_pending", "trial", "price_changed"].includes(e.status))
    .reduce((s, e) => s + monthlyEquivalent(e), 0);
  return { monthlyRecurring, next7, annualized, potentialSavings };
}
