import fs from "fs";
import path from "path";

const root = path.resolve("src/app");

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log(rel);
}

function demoPage(title, description, extra = "") {
  return `"use client";

import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="${title}"
        description="${description}"
      />
      ${extra || `<div className="rounded-xl border border-border bg-bg-surface p-6 text-sm text-text-secondary leading-relaxed">
        Working demo view for <strong className="text-text-primary">${title}</strong>. Data is illustrative sample for Kenya/KES. Synsera never asks for M-PESA PIN or bank passwords.
      </div>`}
    </div>
  );
}
`;
}

// Personal feature pages with richer content
write(
  "app/money-radar/page.tsx",
  `"use client";

import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useApp } from "@/lib/store";
import { getDashboardStats, monthlyEquivalent } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";

export default function MoneyRadarPage() {
  const { expenses } = useApp();
  const personal = expenses.filter((e) => e.workspace === "personal" && e.status !== "archived");
  const stats = getDashboardStats(personal);
  const suspected = personal.filter((e) => !e.confirmed);
  const byCat = personal.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + monthlyEquivalent(e);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Money Radar"
        description="Confirmed vs suspected recurring — a unified scan across your commitments."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Tracked monthly" value={formatKES(stats.monthlyRecurring)} hint="Confirmed + active · KES" emphasize />
        <StatCard label="Suspected" value={String(suspected.length)} hint="Needs your confirmation" />
        <StatCard label="Categories" value={String(Object.keys(byCat).length)} hint="Spend clusters" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="text-[15px] font-semibold mb-4">By category</h2>
          <ul className="space-y-3">
            {Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([cat, amt]) => (
              <li key={cat} className="flex items-center justify-between text-sm">
                <span>{cat}</span>
                <span className="money font-semibold">{formatKES(amt)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="text-[15px] font-semibold mb-4">Needs attention</h2>
          <ul className="space-y-3">
            {personal.filter(e => ["failed","price_changed","trial","cancellation_pending"].includes(e.status)).map(e => (
              <li key={e.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{e.name}</span>
                <StatusBadge status={e.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
`,
);

write(
  "app/insights/page.tsx",
  `"use client";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useApp } from "@/lib/store";
import { getDashboardStats, monthlyEquivalent } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";

export default function InsightsPage() {
  const { expenses } = useApp();
  const personal = expenses.filter((e) => e.workspace === "personal" && !["cancelled","archived"].includes(e.status));
  const stats = getDashboardStats(personal);
  const top = [...personal].sort((a,b)=>monthlyEquivalent(b)-monthlyEquivalent(a)).slice(0,5);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Insights" description="Spend patterns and projections — deterministic maths on your tracked expenses." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Annualized" value={formatKES(stats.annualized)} hint="Monthly × 12" emphasize />
        <StatCard label="Potential savings" value={formatKES(stats.potentialSavings)} estimate hint="Hypotheses only" />
        <StatCard label="Active items" value={String(personal.length)} hint="Personal workspace" />
      </div>
      <section className="rounded-xl border border-border bg-bg-surface p-5">
        <h2 className="font-semibold mb-4">Largest monthly commitments</h2>
        <ul className="space-y-3">
          {top.map(e => (
            <li key={e.id} className="flex justify-between text-sm border-b border-border/60 pb-3 last:border-0">
              <span>{e.name}</span>
              <span className="money font-semibold">{formatKES(monthlyEquivalent(e))}/mo</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
`,
);

write(
  "app/savings/page.tsx",
  `"use client";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { formatKES } from "@/lib/format";

const ideas = [
  { title: "Showmax cancel verification", amount: 720, note: "Cancellation pending — confirm with merchant" },
  { title: "Canva trial decision", amount: 1500, note: "Trial ends Dec 3 — keep or drop" },
  { title: "Adobe price review", amount: 700, note: "Delta vs prior plan — estimate only" },
];

export default function SavingsPage() {
  const total = ideas.reduce((s,i)=>s+i.amount,0);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Savings Vault" description="Potential recoveries labelled as estimates — never invented auto-savings." />
      <div className="rounded-xl border border-brand/30 bg-red-tint/40 p-6">
        <Badge tone="sample">Estimate</Badge>
        <p className="money mt-3 text-3xl font-semibold text-brand">{formatKES(total)}</p>
        <p className="mt-1 text-sm text-text-secondary">Illustrative monthly opportunity across open actions</p>
      </div>
      <ul className="space-y-3">
        {ideas.map(i => (
          <li key={i.title} className="rounded-xl border border-border bg-bg-surface p-4 flex justify-between gap-4">
            <div>
              <p className="font-medium">{i.title}</p>
              <p className="text-xs text-text-secondary mt-1">{i.note}</p>
            </div>
            <p className="money font-semibold">{formatKES(i.amount)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
);

write("app/family/page.tsx", demoPage("Family", "Share visibility with household members. Demo seats — invite flow ships with backend.", `
      <div className="grid gap-4 sm:grid-cols-3">
        {["You (Owner)","Amina (Viewer)","Seat open"].map((m,i)=>(
          <div key={m} className="rounded-xl border border-border bg-bg-surface p-5">
            <p className="font-medium">{m}</p>
            <p className="text-xs text-text-secondary mt-1">{i===2?"Invite when ready":"Personal workspace"}</p>
          </div>
        ))}
      </div>`));

write("app/integrations/page.tsx", demoPage("Integrations", "Future connectors — email, CSV, receipts first. Never M-PESA PIN or bank passwords.", `
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["CSV import","Ready","/app/import"],
          ["Receipt upload","Ready","/app/receipts"],
          ["Email detection","Soon","#"],
          ["M-PESA (scoped)","Planned","#"],
          ["Bank CSV","Planned","#"],
          ["Calendar sync","Soon","#"],
        ].map(([n,s,h])=>(
          <a key={n} href={h} className="rounded-xl border border-border bg-bg-surface p-5 hover:border-brand/30 block">
            <p className="font-medium">{n}</p>
            <p className="text-xs text-text-secondary mt-1">{s}</p>
          </a>
        ))}
      </div>`));

write("app/reports/page.tsx", demoPage("Reports", "Exportable summaries of recurring spend. Demo export uses your local data.", `
      <div className="space-y-3">
        <button type="button" className="w-full rounded-xl border border-border bg-bg-surface p-4 text-left hover:border-brand/30" onClick={()=>{
          const blob = new Blob([JSON.stringify({exportedAt:new Date().toISOString(),note:"Synsera demo export"},null,2)],{type:"application/json"});
          const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="synsera-report.json"; a.click();
        }}>
          <p className="font-medium">Download JSON summary</p>
          <p className="text-xs text-text-secondary mt-1">Includes metadata only in this demo click — full export in Settings</p>
        </button>
      </div>`));

// Business pages
const bizPages = [
  ["expenses", "Business expenses", "Company recurring spend — software, vendors, facilities."],
  ["software", "Software", "SaaS tools tracked for your company."],
  ["vendors", "Vendors", "Supplier directory with monthly spend."],
  ["contracts", "Contracts", "Renewal dates and notice windows."],
  ["calendar", "Renewal calendar", "Upcoming business renewals."],
  ["licenses", "Licenses", "Seat utilisation and waste signals."],
  ["teams", "Teams", "Departments and owners."],
  ["budgets", "Budgets", "Department spend vs limits."],
  ["purchase-requests", "Purchase requests", "Request and track software purchases."],
  ["approvals", "Approvals", "Pending and decided requests."],
  ["ai-usage", "AI usage", "Illustrative AI/API cost monitoring."],
  ["analytics", "Analytics", "Business spend analytics demo."],
  ["reports", "Reports", "Company exports and summaries."],
  ["integrations", "Integrations", "Business connectors — scoped permissions only."],
  ["audit", "Audit log", "Who changed what — demo trail."],
  ["settings", "Business settings", "Company profile and preferences."],
];

for (const [slug, title, desc] of bizPages) {
  write(`business/${slug}/page.tsx`, `"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { formatKES } from "@/lib/format";
import {
  BUSINESS_VENDORS, BUSINESS_CONTRACTS, BUSINESS_LICENSES, BUSINESS_BUDGETS, BUSINESS_PURCHASES, DEMO_EXPENSES
} from "@/lib/demo-data";

export default function Page() {
  const slug = "${slug}";
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="${title}" description="${desc}" />
      {slug === "vendors" && (
        <SimpleTable headers={["Vendor","Category","Owner","Monthly"]}>
          {BUSINESS_VENDORS.map(v => (
            <tr key={v.id}><Td>{v.name}</Td><Td>{v.category}</Td><Td>{v.owner}</Td><Td right>{formatKES(v.spend)}</Td></tr>
          ))}
        </SimpleTable>
      )}
      {slug === "contracts" && (
        <SimpleTable headers={["Contract","Vendor","Renews","Notice","Value"]}>
          {BUSINESS_CONTRACTS.map(c => (
            <tr key={c.id}><Td>{c.name}</Td><Td>{c.vendor}</Td><Td>{c.renews}</Td><Td>{c.noticeDays}d</Td><Td right>{formatKES(c.value)}</Td></tr>
          ))}
        </SimpleTable>
      )}
      {slug === "licenses" && (
        <SimpleTable headers={["License","Total","Used","Waste"]}>
          {BUSINESS_LICENSES.map(l => (
            <tr key={l.id}><Td>{l.name}</Td><Td>{l.total}</Td><Td>{l.used}</Td><Td right>{l.waste}</Td></tr>
          ))}
        </SimpleTable>
      )}
      {slug === "budgets" && (
        <SimpleTable headers={["Department","Limit","Spent","Remaining"]}>
          {BUSINESS_BUDGETS.map(b => (
            <tr key={b.id}><Td>{b.dept}</Td><Td>{formatKES(b.limit)}</Td><Td>{formatKES(b.spent)}</Td><Td right>{formatKES(b.limit-b.spent)}</Td></tr>
          ))}
        </SimpleTable>
      )}
      {(slug === "purchase-requests" || slug === "approvals") && (
        <SimpleTable headers={["Request","Requester","Status","Amount"]}>
          {BUSINESS_PURCHASES.filter(p => slug==="approvals" ? true : true).map(p => (
            <tr key={p.id}><Td>{p.title}</Td><Td>{p.requester}</Td><Td className="capitalize">{p.status}</Td><Td right>{formatKES(p.amount)}</Td></tr>
          ))}
        </SimpleTable>
      )}
      {(slug === "expenses" || slug === "software") && (
        <SimpleTable headers={["Name","Category","Status","Amount"]}>
          {DEMO_EXPENSES.filter(e => e.workspace==="business" && (slug!=="software" || e.category==="Software" || e.category==="Cloud")).map(e => (
            <tr key={e.id}><Td>{e.name}</Td><Td>{e.category}</Td><Td>{e.status}</Td><Td right>{formatKES(e.amount)}</Td></tr>
          ))}
        </SimpleTable>
      )}
      {!["vendors","contracts","licenses","budgets","purchase-requests","approvals","expenses","software"].includes(slug) && (
        <div className="rounded-xl border border-border bg-bg-surface p-6 text-sm text-text-secondary">
          Demo {slug.replace(/-/g," ")} view — illustrative Business workspace data. No real bank connections.
        </div>
      )}
    </div>
  );
}
`);
}

// Merchant pages
const merchPages = [
  ["plans", "Plans", "Subscription plans you offer customers."],
  ["customers", "Customers", "Merchant customer directory."],
  ["subscriptions", "Subscriptions", "Active customer subscriptions."],
  ["invoices", "Invoices", "Issued invoices — demo statuses."],
  ["payments", "Payments", "Successful payment events."],
  ["failed-payments", "Failed payments", "Retry and dunning demo queue."],
  ["discounts", "Discounts", "Coupons and promo codes."],
  ["checkout", "Checkout", "Hosted checkout preview — no real charges."],
  ["analytics", "Analytics", "MRR and churn illustrations."],
  ["webhooks", "Webhooks", "Endpoint demo list."],
  ["integrations", "Integrations", "Payment-provider adapters (Daraja, IntaSend, etc.) — UI only."],
  ["settings", "Merchant settings", "Billing brand and preferences."],
];

for (const [slug, title, desc] of merchPages) {
  write(`merchant/${slug}/page.tsx`, `"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { formatKES } from "@/lib/format";
import { MERCHANT_PLANS, MERCHANT_CUSTOMERS, MERCHANT_INVOICES } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const slug = "${slug}";
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="${title}" description="${desc}" />
      {slug === "plans" && (
        <SimpleTable headers={["Plan","Price","Subscribers","Status"]}>
          {MERCHANT_PLANS.map(p => (
            <tr key={p.id}><Td>{p.name}</Td><Td>{formatKES(p.price)}/{p.interval}</Td><Td>{p.subscribers}</Td><Td right>{p.active?"Active":"Off"}</Td></tr>
          ))}
        </SimpleTable>
      )}
      {(slug === "customers" || slug === "subscriptions") && (
        <SimpleTable headers={["Customer","Plan","Status","MRR"]}>
          {MERCHANT_CUSTOMERS.map(c => (
            <tr key={c.id}><Td>{c.name}</Td><Td>{c.plan}</Td><Td>{c.status}</Td><Td right>{formatKES(c.mrr)}</Td></tr>
          ))}
        </SimpleTable>
      )}
      {(slug === "invoices" || slug === "payments" || slug === "failed-payments") && (
        <SimpleTable headers={["Invoice","Customer","Status","Amount"]}>
          {MERCHANT_INVOICES.filter(i => slug!=="failed-payments" || i.status==="failed").map(i => (
            <tr key={i.id}><Td>{i.id}</Td><Td>{i.customer}</Td><Td>{i.status}</Td><Td right>{formatKES(i.amount)}</Td></tr>
          ))}
        </SimpleTable>
      )}
      {slug === "checkout" && (
        <div className="rounded-xl border border-border bg-bg-surface p-8 max-w-md">
          <Badge tone="sample" className="mb-4">Demo checkout · no real charges</Badge>
          <h2 className="text-xl font-semibold">Growth plan</h2>
          <p className="money text-3xl font-semibold mt-2">{formatKES(2499)}<span className="text-sm text-text-secondary">/mo</span></p>
          <button type="button" className="mt-6 w-full h-11 rounded-lg bg-brand text-white font-medium">Subscribe (demo)</button>
          <p className="mt-3 text-xs text-text-secondary">Adapters only — Synsera never stores raw cards or holds funds.</p>
        </div>
      )}
      {slug === "discounts" && (
        <SimpleTable headers={["Code","Type","Value","Uses"]}>
          <tr><Td>LAUNCH20</Td><Td>Percent</Td><Td>20%</Td><Td right>42</Td></tr>
          <tr><Td>KEFOUNDER</Td><Td>Fixed</Td><Td>{formatKES(500)}</Td><Td right>18</Td></tr>
        </SimpleTable>
      )}
      {slug === "webhooks" && (
        <SimpleTable headers={["Endpoint","Events","Status"]}>
          <tr><Td>https://api.example.com/hooks/synsera</Td><Td>invoice.paid, payment.failed</Td><Td right>Active</Td></tr>
        </SimpleTable>
      )}
      {!["plans","customers","subscriptions","invoices","payments","failed-payments","checkout","discounts","webhooks"].includes(slug) && (
        <div className="rounded-xl border border-border bg-bg-surface p-6 text-sm text-text-secondary">
          Merchant {slug} demo — UI only, no payment processor.
        </div>
      )}
    </div>
  );
}
`);
}

console.log("done generating");
