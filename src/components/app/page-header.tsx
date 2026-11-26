import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
  sample = true,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  sample?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {sample && (
          <Badge tone="sample" className="mb-2">
            Illustrative sample data
          </Badge>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
