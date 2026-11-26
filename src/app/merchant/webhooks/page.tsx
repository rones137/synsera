"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";

export default function WebhooksPage() {
  const { webhooks, addWebhook, toggleWebhook } = useWorkspaceData();
  const [open, setOpen] = useState(false);

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const url = String(fd.get("url") || "").trim();
    if (!url) return;
    addWebhook(url, String(fd.get("events") || "invoice.paid,subscription.updated"));
    setOpen(false);
    e.currentTarget.reset();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Webhooks"
        description="Notify your systems when subscriptions or invoices change."
        action={
          <Button size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Close" : "Add endpoint"}
          </Button>
        }
      />

      {open && (
        <form
          onSubmit={onAdd}
          className="grid gap-3 rounded-xl border border-border bg-bg-surface p-5 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <Label htmlFor="url">Endpoint URL</Label>
            <Input
              id="url"
              name="url"
              required
              placeholder="https://api.yourapp.com/webhooks/synsera"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="events">Events</Label>
            <Input
              id="events"
              name="events"
              defaultValue="invoice.paid,subscription.updated"
            />
          </div>
          <Button type="submit">Save endpoint</Button>
        </form>
      )}

      {webhooks.length === 0 ? (
        <EmptyState
          title="No webhooks"
          description="Add an HTTPS endpoint to receive billing events locally in Synsera."
          action={<Button onClick={() => setOpen(true)}>Add endpoint</Button>}
        />
      ) : (
        <SimpleTable headers={["Endpoint", "Events", "Status", "Actions"]}>
          {webhooks.map((w) => (
            <tr key={w.id}>
              <Td>{w.url}</Td>
              <Td>{w.events}</Td>
              <Td>{w.status}</Td>
              <Td right>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => toggleWebhook(w.id)}
                >
                  {w.status === "active" ? "Disable" : "Enable"}
                </Button>
              </Td>
            </tr>
          ))}
        </SimpleTable>
      )}
    </div>
  );
}
