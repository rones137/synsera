"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SynseraLogo } from "@/components/ui/logo";
import { ExpensesProvider } from "@/lib/expenses-store";
import { cn } from "@/lib/cn";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ExpensesProvider>
      <div className="min-h-full bg-bg-app">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-[248px] flex-col border-r border-border bg-bg-surface">
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <SynseraLogo href="/app" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-3 text-sm">
                {[
                  ["/app", "Overview"],
                  ["/app/subscriptions", "Subscriptions"],
                  ["/app/expenses", "Expenses"],
                  ["/app/expenses/new", "Add expense"],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-text-secondary hover:bg-bg-raised hover:text-text-primary"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex min-h-full flex-col transition-[padding] duration-200",
            collapsed ? "md:pl-[72px]" : "md:pl-[248px]",
          )}
        >
          <Topbar onMobileNav={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-8">{children}</main>
          <MobileNav />
        </div>
      </div>
    </ExpensesProvider>
  );
}
