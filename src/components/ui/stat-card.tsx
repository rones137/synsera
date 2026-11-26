import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  icon,
  estimate,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  estimate?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg-surface p-5 flex flex-col gap-3",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-text-secondary">{label}</p>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-tint text-brand">
            {icon}
          </span>
        )}
      </div>
      <p className="money text-2xl font-semibold tracking-tight text-text-primary">
        {value}
      </p>
      {(hint || estimate) && (
        <p className="text-xs text-text-secondary">
          {estimate && (
            <span className="mr-1.5 rounded bg-red-tint px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand">
              Estimate
            </span>
          )}
          {hint}
        </p>
      )}
    </div>
  );
}
