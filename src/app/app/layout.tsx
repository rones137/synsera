import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

export const metadata: Metadata = {
  title: "Personal",
  description: "Synsera Personal workspace",
};

function ShellFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-app text-sm text-text-secondary">
      Loading Synsera…
    </div>
  );
}

export default function PersonalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <WorkspaceShell workspace="personal">{children}</WorkspaceShell>
    </Suspense>
  );
}
