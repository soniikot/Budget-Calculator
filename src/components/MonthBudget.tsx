"use client";
import { useState, useEffect, useCallback } from "react";
import { Expense } from "@/types/budget";
import { budgetService } from "@/lib/budgetService";
import Link from "next/link";

const categories = [
  "Groceries",
  "Transport",
  "Entertainment",
  "Bills",
  "Other",
];

interface Props {
  month: string;
}

export default function MonthBudget({ month }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: categories[0],
    date: new Date().toISOString().split("T")[0],
  });

  const loadExpenses = useCallback(async () => {
    try {
      const monthExpenses = await budgetService.getMonthExpenses(month);
      setExpenses(monthExpenses);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // ... rest of your existing MonthBudgetPage component code ...
}
