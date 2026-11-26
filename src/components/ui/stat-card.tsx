import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  icon,
  estimate,
  emphasize,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  estimate?: boolean;
  emphasize?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg-surface p-5 flex flex-col gap-3 surface-inset",
        emphasize && "border-brand/25 bg-gradient-to-b from-red-tint/40 to-bg-surface",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-text-secondary">{label}</p>
        {icon && (
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              emphasize ? "bg-brand/15 text-brand" : "bg-bg-raised text-text-secondary",
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p
        className={cn(
          "money text-[1.65rem] font-semibold leading-none tracking-tight text-text-primary sm:text-[1.75rem]",
          emphasize && "text-brand",
        )}
      >
        {value}
      </p>
      {(hint || estimate) && (
        <p className="text-xs leading-relaxed text-text-secondary">
          {estimate && (
            <span className="mr-1.5 inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand bg-red-tint">
              Estimate
            </span>
          )}
          {hint}
        </p>
      )}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5 flex flex-col gap-3">
      <div className="skeleton h-4 w-28" />
      <div className="skeleton h-8 w-36" />
      <div className="skeleton h-3 w-40" />
    </div>
  );
}
