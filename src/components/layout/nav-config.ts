import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  CheckSquare,
  CreditCard,
  FileText,
  Gauge,
  GitBranch,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  Link2,
  Package,
  Percent,
  PieChart,
  Radar,
  Receipt,
  Settings,
  Shield,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
  Wallet,
  Webhook,
  FileWarning,
  Brain,
  ClipboardList,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const PERSONAL_NAV: NavItem[] = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/money-radar", label: "Money Radar", icon: Radar },
  { href: "/app/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/app/expenses", label: "Expenses", icon: Receipt },
  { href: "/app/calendar", label: "Calendar", icon: Calendar },
  { href: "/app/alerts", label: "Alerts", icon: Bell },
  { href: "/app/ai-detective", label: "AI Detective", icon: Sparkles },
  { href: "/app/insights", label: "Insights", icon: PieChart },
  { href: "/app/savings", label: "Savings Vault", icon: Wallet },
  { href: "/app/family", label: "Family", icon: Users },
  { href: "/app/integrations", label: "Integrations", icon: Link2 },
  { href: "/app/reports", label: "Reports", icon: FileText },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export const BUSINESS_NAV: NavItem[] = [
  { href: "/business", label: "Overview", icon: LayoutDashboard },
  { href: "/business/expenses", label: "Expenses", icon: Receipt },
  { href: "/business/software", label: "Software", icon: Package },
  { href: "/business/vendors", label: "Vendors", icon: Store },
  { href: "/business/contracts", label: "Contracts", icon: FileText },
  { href: "/business/calendar", label: "Renewal calendar", icon: Calendar },
  { href: "/business/licenses", label: "Licenses", icon: KeyRound },
  { href: "/business/teams", label: "Teams", icon: Users },
  { href: "/business/budgets", label: "Budgets", icon: Wallet },
  { href: "/business/purchase-requests", label: "Purchase requests", icon: ShoppingBag },
  { href: "/business/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/business/ai-usage", label: "AI usage", icon: Brain },
  { href: "/business/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/business/reports", label: "Reports", icon: ClipboardList },
  { href: "/business/integrations", label: "Integrations", icon: Link2 },
  { href: "/business/audit", label: "Audit", icon: Shield },
  { href: "/business/settings", label: "Settings", icon: Settings },
];

export const MERCHANT_NAV: NavItem[] = [
  { href: "/merchant", label: "Overview", icon: LayoutDashboard },
  { href: "/merchant/plans", label: "Plans", icon: Package },
  { href: "/merchant/customers", label: "Customers", icon: Users },
  { href: "/merchant/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/merchant/invoices", label: "Invoices", icon: FileText },
  { href: "/merchant/payments", label: "Payments", icon: Wallet },
  { href: "/merchant/failed-payments", label: "Failed payments", icon: FileWarning },
  { href: "/merchant/discounts", label: "Discounts", icon: Percent },
  { href: "/merchant/checkout", label: "Checkout", icon: ShoppingBag },
  { href: "/merchant/analytics", label: "Analytics", icon: Gauge },
  { href: "/merchant/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/merchant/integrations", label: "Integrations", icon: GitBranch },
  { href: "/merchant/settings", label: "Settings", icon: Settings },
];

export const WORKSPACE_META = {
  personal: { label: "Personal", icon: Activity, home: "/app" },
  business: { label: "Business", icon: Building2, home: "/business" },
  merchant: { label: "Merchant", icon: Store, home: "/merchant" },
} as const;

export const MARKETING_LINKS = [
  { href: "/personal", label: "Personal" },
  { href: "/for-business", label: "Business" },
  { href: "/for-merchant", label: "Merchant" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
];

export const HELP_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help" },
  { href: "/docs", label: "Docs" },
];
