"use client";
import { useState, useEffect, useCallback } from "react";
import { Expense } from "@/types/budget";
import { budgetService } from "@/lib/budgetService";
import { useRouter } from "next/navigation";
import { PageHeader } from "./components/PageHeader";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseTable } from "./components/ExpenseTable";
import { ExpenseSummary } from "./components/ExpenseSummary";

interface Props {
  month: string;
}

export default function MonthBudgetClient({ month }: Props) {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExpenses = useCallback(async () => {
    try {
      const monthExists = await budgetService.getMonth(month);
      if (!monthExists) {
        router.push("/");
        return;
      }
      const monthExpenses = await budgetService.getMonthExpenses(month);
      setExpenses(monthExpenses);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [month, router]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleAddExpense = async (newExpense: Omit<Expense, "id">) => {
    try {
      await budgetService.addExpense(month, newExpense);
      await loadExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return <div>Loading...</div>;

  return (
    <main className="p-6">
      <PageHeader month={month} />
      <ExpenseForm onSubmit={handleAddExpense} />
      <ExpenseSummary
        totalAmount={totalAmount}
        categoryTotals={categoryTotals}
      />
      <ExpenseTable expenses={expenses} />
    </main>
  );
}
