import type { Metadata } from "next";
import Link from "next/link";
import {
  EyeOff,
  FileKey,
  KeyRound,
  Lock,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Synsera security & privacy principles — no M-PESA PINs, no bank passwords, no raw card storage.",
};

const principles = [
  {
    icon: KeyRound,
    title: "No PINs or bank passwords",
    body: "We will never ask for your M-PESA PIN, bank password, or OTP. Integrations (when available) use revocable, scoped permissions only.",
  },
  {
    icon: Lock,
    title: "No raw card storage",
    body: "Card numbers are not stored by Synsera. Merchant billing will use payment-provider adapters — we don’t hold funds.",
  },
  {
    icon: EyeOff,
    title: "We don’t sell your transactions",
    body: "Personal transaction data is not a product. Monetization is subscriptions and merchant usage fees — not data brokerage.",
  },
  {
    icon: FileKey,
    title: "Encryption & isolation",
    body: "Data is encrypted in transit. Multi-tenant isolation is a design requirement as we grow workspaces.",
  },
  {
    icon: Trash2,
    title: "Export & delete",
    body: "You should be able to export your data and request deletion. Privacy is a brand promise, not a footer footnote.",
  },
  {
    icon: ShieldCheck,
    title: "Kenya DPA awareness",
    body: "We design with Kenya’s Data Protection Act 2019 / ODPC guidance in mind. Formal legal review accompanies production launch.",
  },
];

export default function SecurityPage() {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingNav />
      <main className="flex-1">
        <section className="hero-glow border-b border-border py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <ShieldCheck className="mx-auto mb-4 text-brand" size={40} />
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Security & privacy
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Premium fintech should feel as careful as cybersecurity. Synsera treats
              trust as core product work.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-border bg-bg-surface p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-tint text-brand">
                  <p.icon size={20} />
                </div>
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-text-secondary">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-bg-surface py-16">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-semibold">Cancellation honesty</h2>
            <p className="mt-3 text-text-secondary">
              Synsera helps you request and verify cancellations. We do not claim to
              have cancelled a subscription for you without verification. Fake
              one-click cancel claims are not our product.
            </p>
            <Link href="/register" className="mt-8 inline-block">
              <Button size="lg">Create a Synsera account</Button>
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
