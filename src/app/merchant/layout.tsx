import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

export const metadata: Metadata = {
  title: "Merchant",
  description: "Synsera Merchant Billing workspace",
};

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg-app text-sm text-text-secondary">
          Loading Synsera…
        </div>
      }
    >
      <WorkspaceShell workspace="merchant">{children}</WorkspaceShell>
    </Suspense>
  );
}
