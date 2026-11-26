"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  Monitor,
  Moon,
  Plus,
  Search,
  Sun,
  X,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import { SynseraLogo, SynseraMark } from "@/components/ui/logo";
import { AuthGate } from "@/components/app/auth-gate";
import { useTheme, type ThemeMode } from "@/components/theme/theme-provider";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/cn";
import {
  BUSINESS_NAV,
  MERCHANT_NAV,
  PERSONAL_NAV,
  WORKSPACE_META,
  type NavItem,
} from "./nav-config";
import type { UserProfile, WorkspaceKind } from "@/lib/types";

function navFor(ws: WorkspaceKind): NavItem[] {
  if (ws === "business") return BUSINESS_NAV;
  if (ws === "merchant") return MERCHANT_NAV;
  return PERSONAL_NAV;
}

function BuildingGlyph({ workspace }: { workspace: WorkspaceKind }) {
  const Icon = WORKSPACE_META[workspace].icon;
  return <Icon size={16} />;
}

/** Module-scope sidebar — must not be declared inside WorkspaceShell (remounts kill clicks). */
function SidebarInner({
  compact,
  workspace,
  pathname,
  items,
  user,
  wsOpen,
  setWsOpen,
  setMobileOpen,
  switchWs,
  addHref,
  onLogout,
}: {
  compact: boolean;
  workspace: WorkspaceKind;
  pathname: string;
  items: NavItem[];
  user: UserProfile | null;
  wsOpen: boolean;
  setWsOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  setMobileOpen: (v: boolean) => void;
  switchWs: (w: WorkspaceKind) => void;
  addHref: string;
  onLogout: () => void;
}) {
  return (
    <>
      <div
        className={cn(
          "flex h-16 items-center border-b border-border px-4",
          compact ? "justify-center" : "justify-between",
        )}
      >
        {compact ? (
          <SynseraMark />
        ) : (
          <SynseraLogo href={WORKSPACE_META[workspace].home} />
        )}
        {!compact && (
          <button
            type="button"
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="relative border-b border-border p-3">
        <button
          type="button"
          onClick={() => setWsOpen((v) => !v)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-border bg-bg-app px-2.5 py-2 text-left text-sm hover:border-brand/30",
            compact && "justify-center px-0",
          )}
        >
          {!compact && (
            <>
              <span className="flex-1 truncate font-medium">
                {WORKSPACE_META[workspace].label}
              </span>
              <ChevronsUpDown size={14} className="text-text-secondary" />
            </>
          )}
          {compact && <BuildingGlyph workspace={workspace} />}
        </button>
        {wsOpen && !compact && (
          <div className="absolute left-3 right-3 z-50 mt-1 rounded-lg border border-border bg-bg-surface p-1 shadow-[var(--shadow)]">
            {(Object.keys(WORKSPACE_META) as WorkspaceKind[]).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => switchWs(w)}
                className={cn(
                  "flex w-full rounded-md px-3 py-2 text-left text-sm",
                  w === workspace
                    ? "bg-red-tint text-brand"
                    : "text-text-secondary hover:bg-bg-raised hover:text-text-primary",
                )}
              >
                {WORKSPACE_META[w].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {workspace === "personal" && (
        <div className="p-3">
          <Link
            href={addHref}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-hover",
              compact && "px-0",
            )}
          >
            <Plus size={18} />
            {!compact && "Add expense"}
          </Link>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== WORKSPACE_META[workspace].home &&
              pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={compact ? item.label : undefined}
              prefetch
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                compact && "justify-center px-0",
                active
                  ? "bg-red-tint text-brand"
                  : "text-text-secondary hover:bg-bg-raised hover:text-text-primary",
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!compact && <span className="flex-1 truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!compact && (
        <div className="space-y-2 border-t border-border p-4">
          <p className="text-xs text-text-secondary">
            {WORKSPACE_META[workspace].label} · {user?.currency || "KES"}
          </p>
          <p className="text-[11px] text-text-secondary/80">
            Your data · local until Supabase
          </p>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 text-xs text-text-secondary hover:text-brand"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </>
  );
}

export function WorkspaceShell({
  workspace,
  children,
}: {
  workspace: WorkspaceKind;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wsOpen, setWsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, setWorkspace, logout, alerts } = useApp();
  const { theme, setTheme, resolved } = useTheme();
  const items = navFor(workspace);
  const unread = alerts.filter((a) => !a.read).length;

  const cycleTheme = () => {
    const order: ThemeMode[] = ["dark", "light", "system"];
    setTheme(order[(order.indexOf(theme) + 1) % order.length]);
  };
  const ThemeIcon =
    theme === "system" ? Monitor : resolved === "dark" ? Moon : Sun;

  const switchWs = (w: WorkspaceKind) => {
    setWorkspace(w);
    setWsOpen(false);
    router.push(WORKSPACE_META[w].home);
  };

  const addHref =
    workspace === "personal"
      ? "/app/expenses/new"
      : workspace === "business"
        ? "/business/expenses"
        : "/merchant/plans";

  const sidebarProps = {
    workspace,
    pathname,
    items,
    user,
    wsOpen,
    setWsOpen,
    setMobileOpen,
    switchWs,
    addHref,
    onLogout: () => {
      void logout();
      router.push("/login");
    },
  };

  return (
    <AuthGate>
      <div className="min-h-full bg-bg-app">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-bg-surface transition-[width] duration-200 md:flex",
            collapsed ? "w-[72px]" : "w-[248px]",
          )}
        >
          <SidebarInner compact={collapsed} {...sidebarProps} />
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="absolute -right-3 top-5 z-40 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg-surface text-text-secondary shadow"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              aria-label="Close"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-[248px] flex-col border-r border-border bg-bg-surface">
              <SidebarInner compact={false} {...sidebarProps} />
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex min-h-full flex-col transition-[padding] duration-200",
            collapsed ? "md:pl-[72px]" : "md:pl-[248px]",
          )}
        >
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-bg-surface/90 px-4 backdrop-blur-md sm:px-6">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-raised md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="search"
                placeholder="Search…"
                className="h-10 w-full rounded-lg border border-border bg-bg-app pl-9 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-brand focus:outline-none"
              />
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              {workspace === "personal" && (
                <Link
                  href="/app/expenses/new"
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-medium text-white hover:bg-brand-hover"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add</span>
                </Link>
              )}
              <Link
                href={
                  workspace === "personal"
                    ? "/app/alerts"
                    : WORKSPACE_META[workspace].home
                }
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-raised"
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand" />
                )}
              </Link>
              <button
                type="button"
                onClick={cycleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-raised"
                title={`Theme: ${theme}`}
              >
                <ThemeIcon size={18} />
              </button>
              <Link
                href={
                  workspace === "personal"
                    ? "/app/settings"
                    : workspace === "business"
                      ? "/business/settings"
                      : "/merchant/settings"
                }
                className="ml-1 flex items-center gap-2 rounded-lg border border-border bg-bg-app py-1 pl-1 pr-2.5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-xs font-semibold text-white">
                  {(user?.name || "U")
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span className="hidden text-sm lg:inline">
                  {user?.name?.split(" ")[0]}
                </span>
              </Link>
            </div>
          </header>
          <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-8">{children}</main>

          <nav
            className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-bg-surface/95 backdrop-blur-md md:hidden"
            aria-label="Mobile"
          >
            {items.slice(0, 5).map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== WORKSPACE_META[workspace].home &&
                  pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium",
                    active ? "text-brand" : "text-text-secondary",
                  )}
                >
                  <Icon size={20} />
                  <span className="max-w-[4.5rem] truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </AuthGate>
  );
}
