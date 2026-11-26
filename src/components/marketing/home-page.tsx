import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Eye,
  Lock,
  Radar,
  Shield,
  Sparkles,
  Target,
  User,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatKES } from "@/lib/format";

const pillars = [
  {
    icon: Radar,
    title: "Discover",
    body: "Surface recurring commitments from cards, M-PESA, email, invoices, and manual entry — confirmed vs suspected.",
  },
  {
    icon: Eye,
    title: "Track",
    body: "One inbox for every renewal: status, price changes, failed payments, and notice deadlines.",
  },
  {
    icon: Target,
    title: "Predict",
    body: "See the next 7 days, payday pressure, and annualized spend before money leaves your account.",
  },
  {
    icon: Wallet,
    title: "Control",
    body: "Reminders, cancellation assistance with verification — never fake “we cancelled it for you” claims.",
  },
];

const faqs = [
  {
    q: "Does Synsera connect to my M-PESA or bank?",
    a: "Stage 1 focuses on manual tracking, CSV, and receipts. Future integrations will never ask for your M-PESA PIN or bank passwords — only revocable, scoped permissions.",
  },
  {
    q: "Is this only for subscriptions like Netflix?",
    a: "No. Synsera covers any recurring commitment: utilities, software, gyms, vendor contracts, licenses, and family plans — across networks, not just one payment rail.",
  },
  {
    q: "Personal or Business — which should I start with?",
    a: "One account can hold both. Freelancers and SMEs often start with Business; individuals and families use Personal. Merchant Billing comes later.",
  },
  {
    q: "Are the prices final?",
    a: "Pricing on this site is a hypothesis for Kenya/EA validation — not locked billing. Early users help us prove value first.",
  },
  {
    q: "Will Synsera cancel subscriptions automatically?",
    a: "No. We help you request and verify cancellation. We do not claim to cancel on your behalf without confirmation.",
  },
];

export function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-fade" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pb-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="animate-fade-up mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Synsera
            </p>
            <h1 className="animate-fade-up text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Your Money. Your Rules.
            </h1>
            <p className="animate-fade-up-delay mx-auto mt-5 max-w-2xl text-lg text-text-secondary sm:text-xl">
              Stop losing track of where your money goes. Take back control of every
              recurring payment and renewal — across cards, M-PESA, and beyond.
            </p>
            <div className="animate-fade-up-delay-2 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="min-w-[180px]">
                  Start free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/app">
                <Button size="lg" variant="secondary" className="min-w-[180px]">
                  View demo dashboard
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-text-secondary">
              Kenya & East Africa first · KES · Privacy by design
            </p>
          </div>

          {/* Product preview */}
          <div className="animate-fade-up-delay-2 mx-auto mt-16 max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-border bg-bg-surface shadow-[var(--shadow)]">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                </div>
                <Badge tone="sample">Sample preview · illustrative data</Badge>
              </div>
              <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6">
                {[
                  { label: "Monthly recurring", value: formatKES(22569), hint: "This month · KES" },
                  { label: "Next 7 days", value: formatKES(3350), hint: "Due soon" },
                  {
                    label: "Potential savings",
                    value: formatKES(1570),
                    hint: "Estimate only",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-border bg-bg-app p-4"
                  >
                    <p className="text-xs text-text-secondary">{s.label}</p>
                    <p className="money mt-2 text-xl font-semibold">{s.value}</p>
                    <p className="mt-1 text-[11px] text-text-secondary">{s.hint}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border px-4 pb-5 sm:px-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Upcoming
                </p>
                <ul className="space-y-2">
                  {[
                    ["Netflix Premium", "28 Nov", 1400],
                    ["Microsoft 365", "27 Nov", 1100],
                    ["Spotify Family", "30 Nov", 850],
                  ].map(([name, date, amt]) => (
                    <li
                      key={String(name)}
                      className="flex items-center justify-between rounded-lg bg-bg-app px-3 py-2.5 text-sm"
                    >
                      <span className="text-text-primary">{name}</span>
                      <span className="text-text-secondary">{date}</span>
                      <span className="money font-medium">{formatKES(Number(amt))}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-border bg-bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Recurring money is scattered. Control shouldn&apos;t be.
            </h2>
            <p className="mt-4 text-text-secondary">
              Commitments hide in email, cards, M-PESA, invoices, and contracts. You
              lose sight of what you pay, when prices change, unused duplicates, and
              cancel deadlines — until payday pressure hits.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              "Price hikes you notice too late",
              "Trials that convert quietly",
              "Failed payments and renewals you forgot",
            ].map((t) => (
              <div
                key={t}
                className="rounded-xl border border-border bg-bg-app p-5 text-sm text-text-secondary"
              >
                <span className="mb-3 block h-1 w-8 rounded bg-brand" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover / Track / Predict / Control */}
      <section id="features" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Discover. Track. Predict. Control.
            </h2>
            <p className="mt-4 text-text-secondary">
              Synsera is your recurring financial control centre — not a prettier
              clone of one payment network.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-border bg-bg-surface p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-tint text-brand">
                  <p.icon size={20} />
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal vs Business */}
      <section
        id="personal-business"
        className="scroll-mt-20 border-t border-border bg-bg-surface py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              One account. Three workspaces.
            </h2>
            <p className="mt-4 text-text-secondary">
              Personal for households. Business for freelancers & SMEs. Merchant
              Billing when you&apos;re ready to charge others.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: User,
                title: "Personal",
                body: "Detect, track, warn, forecast, and manage household recurring spend with family-ready views.",
                tag: "Available in MVP",
              },
              {
                icon: Building2,
                title: "Business",
                body: "Software, vendors, contracts, budgets, and licenses — built for Kenya/EA freelancers and SMEs.",
                tag: "Coming next",
              },
              {
                icon: Shield,
                title: "Merchant Billing",
                body: "Plans, checkout, and renewals via payment-provider adapters. We never hold funds or raw cards.",
                tag: "Later stage",
              },
            ].map((w) => (
              <div
                key={w.title}
                className="flex flex-col rounded-xl border border-border bg-bg-app p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-tint text-brand">
                  <w.icon size={20} />
                </div>
                <h3 className="text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 flex-1 text-sm text-text-secondary">{w.body}</p>
                <Badge className="mt-4 w-fit" tone="neutral">
                  {w.tag}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI */}
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <Badge tone="brand" className="mb-4">
              AI Detective
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              AI extracts. Deterministic code owns the money.
            </h2>
            <p className="mt-4 text-text-secondary">
              Synsera uses AI to help pull dates, merchants, and amounts from
              receipts and statements — then a rules engine owns status, renewals,
              and forecasts. No invented expenses. No unverified savings claims.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-bg-surface p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 shrink-0 text-brand" size={20} />
              <div>
                <p className="font-medium">Confidence labels</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Confirmed vs suspected recurring. You decide what becomes tracked
                  truth.
                </p>
              </div>
            </div>
            <div className="my-4 h-px bg-border" />
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 shrink-0 text-brand" size={20} />
              <div>
                <p className="font-medium">Your data stays yours</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Export and delete supported. We never sell personal transaction
                  data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security teaser */}
      <section className="border-t border-border bg-bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <Shield className="mx-auto mb-4 text-brand" size={32} />
          <h2 className="text-3xl font-semibold tracking-tight">
            Privacy is a product promise
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            We never ask for your M-PESA PIN or bank passwords. No raw card storage.
            Scoped, revocable permissions when integrations arrive.
          </p>
          <Link href="/security" className="mt-6 inline-block">
            <Button variant="outline">Read security principles</Button>
          </Link>
        </div>
      </section>

      {/* Pricing hypotheses */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="sample" className="mb-4">
              Pricing hypothesis · not final billing
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple plans for Kenya first
            </h2>
            <p className="mt-4 text-text-secondary">
              Illustrative KES pricing for validation. Early access helps prove
              verified value before we lock rates.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Personal Free",
                price: "KSh 0",
                period: "/mo",
                features: ["Manual expenses", "Dashboard & calendar", "Basic reminders"],
              },
              {
                name: "Personal Plus",
                price: "KSh 199",
                period: "/mo",
                features: ["AI extraction", "Savings estimates", "Family share (soon)"],
                featured: true,
              },
              {
                name: "Business Starter",
                price: "KSh 1,500",
                period: "/mo",
                features: ["Vendor & license tracking", "Budgets", "Exports"],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 ${
                  plan.featured
                    ? "border-brand bg-red-tint/40"
                    : "border-border bg-bg-surface"
                }`}
              >
                <p className="text-sm font-medium text-text-secondary">{plan.name}</p>
                <p className="mt-3">
                  <span className="money text-3xl font-semibold">{plan.price}</span>
                  <span className="text-text-secondary">{plan.period}</span>
                </p>
                <ul className="mt-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm text-text-secondary">
                      · {f}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing" className="mt-6 block">
                  <Button
                    variant={plan.featured ? "primary" : "secondary"}
                    className="w-full"
                  >
                    See all plans
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-border bg-bg-surface py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Frequently asked
          </h2>
          <div className="mt-10 space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-border bg-bg-app px-5 py-4"
              >
                <summary className="cursor-pointer list-none font-medium text-text-primary marker:content-none">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-text-secondary">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Every renewal. Under your control.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Join Synsera and take back visibility over recurring spend — starting
            with Personal, built for Kenya.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button size="lg">
                Create your account
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/app">
              <Button size="lg" variant="ghost">
                Explore the demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
