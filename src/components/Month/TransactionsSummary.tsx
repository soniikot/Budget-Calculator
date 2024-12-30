"use client";
import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { Transaction, TransactionSummary } from "@/types/budget";

export function TransactionsSummary() {
  const [summary, setSummary] = useState<TransactionSummary>({
    totalExpenses: 0,
    totalIncome: 0,
    balance: 0,
    expensesByCategory: {},
    incomeByCategory: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const month = window.location.pathname.split("/budget/")[1];
    setSelectedMonth(month);
    loadTransactions(month);
  }, []);

  const loadTransactions = async (month: string) => {
    try {
      console.log("📊 Loading transactions for month:", month);
      const q = query(
        collection(db, "transactions"),
        where("month", "==", month)
      );

      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];

      calculateSummary(transactions);
    } catch (error) {
      console.error("❌ Error loading transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSummary = (transactions: Transaction[]) => {
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
      } else {
        newSummary.totalIncome += transaction.amount;
        newSummary.incomeByCategory[transaction.category] =
          (newSummary.incomeByCategory[transaction.category] || 0) +
          transaction.amount;
      }
    });

    newSummary.balance = newSummary.totalIncome - newSummary.totalExpenses;
    setSummary(newSummary);
  };

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

      <div
        className={`bg-white p-6 rounded-lg shadow border-t-4 
        ${summary.balance >= 0 ? "border-blue-500" : "border-yellow-500"}`}
      >
        <h3 className="text-lg font-medium text-gray-600 mb-2">Net Balance</h3>
        <p
          className={`text-3xl font-bold ${
            summary.balance >= 0 ? "text-blue-600" : "text-yellow-600"
          }`}
        >
          ${summary.balance.toFixed(2)}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Income Ratio</span>
            <span className="font-medium">
              {summary.totalIncome > 0
                ? (
                    (summary.totalIncome /
                      (summary.totalIncome + summary.totalExpenses)) *
                    100
                  ).toFixed(1)
                : "0"}
              %
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Expense Ratio</span>
            <span className="font-medium">
              {summary.totalExpenses > 0
                ? (
                    (summary.totalExpenses /
                      (summary.totalIncome + summary.totalExpenses)) *
                    100
                  ).toFixed(1)
                : "0"}
              %
            </span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${
                    summary.totalIncome > 0
                      ? (summary.totalIncome /
                          (summary.totalIncome + summary.totalExpenses)) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
