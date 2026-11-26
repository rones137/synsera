"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  LayoutDashboard,
  PlusCircle,
  Receipt,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { href: "/app", label: "Home", icon: LayoutDashboard },
  { href: "/app/subscriptions", label: "Subs", icon: CreditCard },
  { href: "/app/expenses/new", label: "Add", icon: PlusCircle },
  { href: "/app/expenses", label: "Expenses", icon: Receipt },
  { href: "#", label: "More", icon: Settings, soon: true },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg-surface/95 backdrop-blur-md md:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 py-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            !item.soon &&
            (pathname === item.href ||
              (item.href !== "/app" &&
                item.href !== "/app/expenses/new" &&
                pathname.startsWith(item.href)));
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.soon ? "#" : item.href}
                onClick={(e) => item.soon && e.preventDefault()}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium",
                  active ? "text-brand" : "text-text-secondary",
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
