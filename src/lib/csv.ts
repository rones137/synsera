import type { NewExpenseInput } from "./store";
import type { BillingCycle } from "./types";

export function parseExpenseCsv(text: string): NewExpenseInput[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (name: string) => headers.indexOf(name);

  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const amount = Number(cols[idx("amount")] || 0);
    const cycle = (cols[idx("cycle")] || "monthly") as BillingCycle;
    return {
      name: cols[idx("name")] || "Imported expense",
      merchant: cols[idx("merchant")] || cols[idx("name")] || "Unknown",
      amount: Number.isFinite(amount) ? amount : 0,
      cycle: ["monthly", "yearly", "weekly", "custom"].includes(cycle)
        ? cycle
        : "monthly",
      nextBillingDate: cols[idx("nextbillingdate")] || "2026-12-20",
      category: cols[idx("category")] || "Other",
      paymentMethod: cols[idx("paymentmethod")] || "Manual",
      confirmed: true,
      workspace: "personal" as const,
    };
  }).filter((e) => e.amount > 0);
}
