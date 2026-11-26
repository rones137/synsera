import { cn } from "@/lib/cn";
import type { ExpenseStatus } from "@/lib/demo-data";

const statusStyles: Record<ExpenseStatus, string> = {
  active: "bg-success/15 text-success",
  trial: "bg-brand/15 text-brand",
  upcoming: "bg-bg-raised text-text-secondary border border-border",
  price_changed: "bg-warning/15 text-warning",
  failed: "bg-brand/15 text-brand",
  cancellation_pending: "bg-warning/10 text-warning",
  cancelled: "bg-bg-raised text-text-secondary",
};

const statusLabels: Record<ExpenseStatus, string> = {
  active: "Active",
  trial: "Trial",
  upcoming: "Upcoming",
  price_changed: "Price changed",
  failed: "Failed",
  cancellation_pending: "Cancel pending",
  cancelled: "Cancelled",
};

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "brand" | "success" | "warning" | "sample";
}) {
  const tones = {
    neutral: "bg-bg-raised text-text-secondary border border-border",
    brand: "bg-brand/15 text-brand",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    sample: "bg-red-tint text-brand border border-brand/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ExpenseStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
