"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { SynseraLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/cn";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#personal-business", label: "Personal & Business" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const { resolved, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg-app/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <SynseraLogo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-bg-raised hover:text-text-primary"
          >
            {resolved === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
        <button
          type="button"
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-text-primary"
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
        <div className="flex flex-col gap-1 px-4 py-3">
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
            <Link href="/login" className="flex-1" onClick={() => setOpen(false)}>
              <Button variant="secondary" className="w-full" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register" className="flex-1" onClick={() => setOpen(false)}>
              <Button className="w-full" size="sm">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
