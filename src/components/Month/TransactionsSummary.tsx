"use client";

import { useEffect, useState } from "react";
import { transactionService } from "@/utils/transactionService";
import type { Transaction, TransactionSummary } from "../../types/month/types";
import { useParams } from "next/navigation";
import { eventBus } from "@/utils/eventBus";
import { TRANSACTION, MONTH } from "@/utils/eventsIds";

export function TransactionsSummary() {
  const { year, month } = useParams() as { year: string; month: string };
  const [summary, setSummary] = useState<TransactionSummary>({
    totalExpenses: 0,
    totalIncome: 0,
    balance: 0,
    expensesByCategory: {},
    incomeByCategory: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
    const handleTransactionUpdate = () => {
      loadTransactions();
    };
  }, [year, month]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const transactions = await transactionService.getTransactions(month);

      calculateSummary(transactions);
    } catch (error) {
      console.error("❌ Error loading transactions:", error);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSummary = (transactions: Transaction[]) => {
    console.log("🔄 Calculating summary...");
    const newSummary: TransactionSummary = {
      totalExpenses: 0,
      totalIncome: 0,
      balance: 0,
      expensesByCategory: {},
      incomeByCategory: {},
    };

    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        newSummary.totalExpenses += transaction.amount;
        newSummary.expensesByCategory[transaction.category] =
          (newSummary.expensesByCategory[transaction.category] || 0) +
          transaction.amount;
      } else if (transaction.type === "income") {
        newSummary.totalIncome += transaction.amount;
        newSummary.incomeByCategory[transaction.category] =
          (newSummary.incomeByCategory[transaction.category] || 0) +
          transaction.amount;
      }
    });

    newSummary.balance = newSummary.totalIncome - newSummary.totalExpenses;

    setSummary(newSummary);
  };

  /**
   * Loading State
   */
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 border border-red-400 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Income */}
      <div className="bg-white p-6 rounded-lg shadow border-t-4 border-green-500">
        <h3 className="text-lg font-medium text-gray-600 mb-2">Total Income</h3>
        <p className="text-3xl font-bold text-green-600">
          ${summary.totalIncome.toFixed(2)}
        </p>
        <div className="mt-4 space-y-2">
          {Object.entries(summary.incomeByCategory).map(
            ([category, amount]) => (
              <div key={category} className="flex justify-between text-sm">
                <span className="text-gray-600">{category}</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-white p-6 rounded-lg shadow border-t-4 border-red-500">
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Total Expenses
        </h3>
        <p className="text-3xl font-bold text-red-600">
          ${summary.totalExpenses.toFixed(2)}
        </p>
        <div className="mt-4 space-y-2">
          {Object.entries(summary.expensesByCategory).map(
            ([category, amount]) => (
              <div key={category} className="flex justify-between text-sm">
                <span className="text-gray-600">{category}</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Net Balance */}
      <div
        className={`bg-white p-6 rounded-lg shadow border-t-4 ${
          summary.balance >= 0 ? "border-blue-500" : "border-yellow-500"
        }`}
      >
        <h3 className="text-lg font-medium text-gray-600 mb-2">Net Balance</h3>
        <p
          className={`text-3xl font-bold ${
            summary.balance >= 0 ? "text-blue-600" : "text-yellow-600"
          }`}
        >
          ${summary.balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
