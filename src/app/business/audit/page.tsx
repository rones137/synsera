"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatShortDate } from "@/lib/format";

export default function AuditPage() {
  const { audit } = useWorkspaceData();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Audit log"
        description="Who changed what — updates as you approve purchases or reclaim licenses."
      />
      {audit.length === 0 ? (
        <EmptyState
          title="No activity yet"
          description="Approvals, contract adds, and license reclaim actions show up here."
          action={
            <Button href="/business/approvals" variant="secondary">
              Go to approvals
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-bg-surface">
          {audit.map((a) => (
            <li
              key={a.id}
              className="flex justify-between gap-4 px-5 py-3.5 text-sm"
            >
              <div>
                <p className="font-medium">{a.action}</p>
                <p className="text-xs text-text-secondary">{a.actor}</p>
              </div>
              <time className="text-xs text-text-secondary">
                {formatShortDate(a.at)}
              </time>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-text-secondary">
        Looking for vendors?{" "}
        <Link href="/business/vendors" className="text-brand hover:underline">
          Manage vendors
        </Link>
        .
      </p>
    </div>
  );
}
