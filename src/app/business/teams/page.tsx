"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";

export default function TeamsPage() {
  const { teams, addTeamMember } = useWorkspaceData();
  const [open, setOpen] = useState(false);

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;
    addTeamMember({
      name,
      role: String(fd.get("role") || "Member"),
      dept: String(fd.get("dept") || "General"),
    });
    setOpen(false);
    e.currentTarget.reset();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Teams"
        description="People who own vendors, budgets, and approvals."
        action={
          <Button size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Close" : "Add member"}
          </Button>
        }
      />

      {open && (
        <form
          onSubmit={onAdd}
          className="grid gap-3 rounded-xl border border-border bg-bg-surface p-5 sm:grid-cols-3"
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" placeholder="Owner / Admin / Member" />
          </div>
          <div>
            <Label htmlFor="dept">Department</Label>
            <Input id="dept" name="dept" placeholder="Finance" />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit">Save member</Button>
          </div>
        </form>
      )}

      {teams.length === 0 ? (
        <EmptyState
          title="No team members"
          description="Add owners so vendor and budget responsibility is clear."
          action={<Button onClick={() => setOpen(true)}>Add member</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-border bg-bg-surface p-5"
            >
              <p className="font-medium">{t.name}</p>
              <p className="mt-1 text-xs text-text-secondary">
                {t.role} · {t.dept}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
