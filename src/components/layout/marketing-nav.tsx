"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { SynseraLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/cn";

const links = [
  { href: "/personal", label: "Personal" },
  { href: "/for-business", label: "Business" },
  { href: "/for-merchant", label: "Merchant" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const { resolved, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-bg-app/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <SynseraLogo />
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-1.5 md:flex">
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-raised hover:text-text-primary"
          >
            {resolved === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Button href="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button href="/register" size="sm">
            Get started
          </Button>
        </div>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-primary md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div
        className={cn(
          "border-t border-border bg-bg-surface md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-0.5 px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-raised hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            <Button
              href="/login"
              variant="secondary"
              className="w-full flex-1"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Log in
            </Button>
            <Button
              href="/register"
              className="w-full flex-1"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
