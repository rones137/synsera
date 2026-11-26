import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function SimpleTable({
  headers,
  children,
  className,
}: {
  headers: string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-bg-surface", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-[0.06em] text-text-secondary">
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    "px-4 py-3 font-medium",
                    i === headers.length - 1 && "text-right",
                    i === 0 && "pl-5",
                    i === headers.length - 1 && "pr-5",
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Td({
  children,
  right,
  className,
}: {
  children: ReactNode;
  right?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "border-b border-border/60 px-4 py-3.5 last:border-0",
        right && "text-right money font-medium",
        className,
      )}
    >
      {children}
    </td>
  );
}
