"use client";

import Link from "next/link";
import {
  Bell,
  Menu,
  Monitor,
  Moon,
  Plus,
  Search,
  Sun,
} from "lucide-react";
import { useTheme, type ThemeMode } from "@/components/theme/theme-provider";
import { DEMO_USER } from "@/lib/demo-data";
import { cn } from "@/lib/cn";

export function Topbar({ onMobileNav }: { onMobileNav?: () => void }) {
  const { theme, setTheme, resolved } = useTheme();

  const cycleTheme = () => {
    const order: ThemeMode[] = ["dark", "light", "system"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  const ThemeIcon =
    theme === "system" ? Monitor : resolved === "dark" ? Moon : Sun;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-bg-surface/90 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-raised md:hidden"
        onClick={onMobileNav}
        aria-label="Open navigation"
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
          placeholder="Search expenses, merchants…"
          className="h-10 w-full rounded-lg border border-border bg-bg-app pl-9 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-brand focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/app/expenses/new"
          className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-medium text-white hover:bg-brand-hover"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add</span>
        </Link>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-raised hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand" />
        </button>
        <button
          type="button"
          onClick={cycleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-raised hover:text-text-primary"
          aria-label={`Theme: ${theme}`}
          title={`Theme: ${theme}`}
        >
          <ThemeIcon size={18} />
        </button>
        <button
          type="button"
          className={cn(
            "ml-1 flex items-center gap-2 rounded-lg border border-border bg-bg-app py-1 pl-1 pr-2.5",
          )}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-xs font-semibold text-white">
            {DEMO_USER.initials}
          </span>
          <span className="hidden text-sm text-text-primary lg:inline">
            {DEMO_USER.name.split(" ")[0]}
          </span>
        </button>
      </div>
    </header>
  );
}
