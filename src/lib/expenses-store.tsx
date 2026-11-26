"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_EXPENSES,
  type BillingCycle,
  type RecurringExpense,
} from "./demo-data";

export type NewExpenseInput = {
  name: string;
  merchant: string;
  amount: number;
  cycle: BillingCycle;
  nextBillingDate: string;
  category: string;
  paymentMethod: string;
  notes?: string;
};

type ExpensesContextValue = {
  expenses: RecurringExpense[];
  addExpense: (input: NewExpenseInput) => RecurringExpense;
};

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<RecurringExpense[]>(DEMO_EXPENSES);

  const addExpense = useCallback((input: NewExpenseInput) => {
    const item: RecurringExpense = {
      id: `exp-${Date.now()}`,
      name: input.name,
      merchant: input.merchant || input.name,
      amount: input.amount,
      currency: "KES",
      cycle: input.cycle,
      nextBillingDate: input.nextBillingDate,
      category: input.category,
      status: "active",
      paymentMethod: input.paymentMethod || "Manual",
      notes: input.notes,
      confirmed: true,
    };
    setExpenses((prev) => [item, ...prev]);
    return item;
  }, []);

  const value = useMemo(
    () => ({ expenses, addExpense }),
    [expenses, addExpense],
  );

  return (
    <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpensesProvider");
  return ctx;
}
