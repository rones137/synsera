import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

export const metadata: Metadata = {
  title: "Business",
  description: "Synsera Business workspace",
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg-app text-sm text-text-secondary">
          Loading Synsera…
        </div>
      }
    >
      <WorkspaceShell workspace="business">{children}</WorkspaceShell>
    </Suspense>
  );
}
