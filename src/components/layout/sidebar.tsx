"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  Lightbulb,
  Plus,
  Radar,
  Receipt,
  Settings,
  Sparkles,
  Wallet,
} from "lucide-react";
import { SynseraLogo, SynseraMark } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/app/expenses", label: "Expenses", icon: Receipt },
  { href: "#", label: "Money Radar", icon: Radar, soon: true },
  { href: "#", label: "Calendar", icon: Calendar, soon: true },
  { href: "#", label: "Alerts", icon: Bell, soon: true },
  { href: "#", label: "AI Detective", icon: Sparkles, soon: true },
  { href: "#", label: "Insights", icon: Lightbulb, soon: true },
  { href: "#", label: "Savings Vault", icon: Wallet, soon: true },
  { href: "#", label: "Settings", icon: Settings, soon: true },
];

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-bg-surface transition-[width] duration-200 md:flex",
        collapsed ? "w-[72px]" : "w-[248px]",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-border px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {collapsed ? <SynseraMark /> : <SynseraLogo href="/app" />}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-raised hover:text-text-primary",
            collapsed && "absolute -right-3 top-5 z-40 border border-border bg-bg-surface shadow",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="p-3">
        <Link
          href="/app/expenses/new"
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-hover",
            collapsed && "px-0",
          )}
        >
          <Plus size={18} />
          {!collapsed && "Add expense"}
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {nav.map((item) => {
          const active =
            item.href !== "#" &&
            (pathname === item.href ||
              (item.href !== "/app" && pathname.startsWith(item.href)));
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.soon ? "#" : item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                collapsed && "justify-center px-0",
                active
                  ? "bg-red-tint text-brand"
                  : "text-text-secondary hover:bg-bg-raised hover:text-text-primary",
                item.soon && "opacity-55 cursor-default",
              )}
              onClick={(e) => {
                if (item.soon) e.preventDefault();
              }}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.soon && (
                    <span className="rounded bg-bg-raised px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-text-secondary">
                      Soon
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="border-t border-border p-4">
          <p className="text-xs text-text-secondary">
            Personal workspace · KES
          </p>
          <p className="mt-1 text-[11px] text-text-secondary/80">
            Sample data — illustrative only
          </p>
        </div>
      )}
    </aside>
  );
}
