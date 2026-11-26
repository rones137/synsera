import Link from "next/link";
import type { ReactNode } from "react";
import { SynseraLogo } from "@/components/ui/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-bg-app">
      <div className="hero-glow flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mb-8">
          <SynseraLogo href="/" />
        </div>
        <div className="w-full max-w-md rounded-2xl border border-border bg-bg-surface p-6 shadow-[var(--shadow)] sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-text-secondary">{footer}</div>}
        </div>
        <p className="mt-6 max-w-md text-center text-xs text-text-secondary">
          We never ask for your M-PESA PIN or bank passwords.{" "}
          <Link href="/security" className="text-brand hover:underline">
            Security
          </Link>
        </p>
      </div>
    </div>
  );
}
