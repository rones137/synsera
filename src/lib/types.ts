export type ThemeMode = "dark" | "light" | "system";
export type WorkspaceKind = "personal" | "business" | "merchant";
export type BillingCycle = "monthly" | "yearly" | "weekly" | "custom";
export type ExpenseStatus =
  | "active"
  | "trial"
  | "upcoming"
  | "price_changed"
  | "failed"
  | "cancellation_pending"
  | "cancelled"
  | "archived";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  country: string;
  currency: "KES" | "UGX" | "TZS" | "RWF";
  timezone: string;
  theme: ThemeMode;
  notifications: {
    email: boolean;
    push: boolean;
    renewalDays: number;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  onboardingComplete: boolean;
  workspacesEnabled: WorkspaceKind[];
}

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
  workspace: WorkspaceKind;
  history?: { date: string; amount: number; note?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AlertItem {
  id: string;
  severity: "danger" | "warning" | "info";
  title: string;
  detail: string;
  expenseId?: string;
  read: boolean;
  createdAt: string;
  category: "payment" | "price" | "trial" | "renewal" | "system";
}

export interface ActivityItem {
  id: string;
  type: "added" | "reminder" | "price" | "cancelled" | "payment" | "edited" | "import";
  title: string;
  detail: string;
  at: string;
}

export interface SessionState {
  user: UserProfile | null;
  workspace: WorkspaceKind;
}
