"use client";
import { useState, useEffect, useCallback } from "react";
import { Expense } from "@/types/budget";
import Link from "next/link";
import { budgetService } from "@/lib/budgetService";
import { useRouter } from "next/navigation";

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

export default function MonthBudgetClient({ month }: Props) {
  const router = useRouter();
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

  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount) return;

    try {
      await budgetService.addExpense(month, {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
      });
      await loadExpenses();
      setNewExpense({
        description: "",
        amount: "",
        category: categories[0],
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as { [key: string]: number });

  if (loading) return <div>Loading...</div>;

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Budget for{" "}
          {new Date(month + "-01").toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Back to All Months
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            className="border p-2 rounded"
          />
          <select
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
            className="border p-2 rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) =>
              setNewExpense({ ...newExpense, date: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleAddExpense}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Add Expense
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Total Expenses</h2>
          <p className="text-3xl font-bold text-red-600">
            ${totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">By Category</h2>
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <div key={category} className="flex justify-between mb-2">
              <span>{category}</span>
              <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Expenses</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Category</th>
                <th className="text-right p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b">
                  <td className="p-2">{expense.date}</td>
                  <td className="p-2">{expense.description}</td>
                  <td className="p-2">{expense.category}</td>
                  <td className="p-2 text-right">
                    ${expense.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
