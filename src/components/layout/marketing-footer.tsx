import Link from "next/link";
import { SynseraLogo } from "@/components/ui/logo";

const cols = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    title: "Workspaces",
    links: [
      { href: "/#personal-business", label: "Personal" },
      { href: "/#personal-business", label: "Business" },
      { href: "/#personal-business", label: "Merchant Billing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: "/security", label: "Privacy" },
      { href: "/login", label: "Sign in" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="space-y-4">
          <SynseraLogo />
          <p className="max-w-xs text-sm text-text-secondary">
            Every recurring payment. Every renewal. Under your control.
          </p>
          <p className="text-xs font-medium text-brand">Your Money. Your Rules.</p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-semibold text-text-primary">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-text-secondary hover:text-text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Synsera. Built for Kenya & East Africa first.</p>
          <p>We never ask for your M-PESA PIN or bank passwords.</p>
        </div>
      </div>
    </footer>
  );
}
