"use client";
import { useState, useEffect, useCallback } from "react";
import { Expense } from "@/types/budget";
import { budgetService } from "@/lib/budgetService";

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

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const totalAmount = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Amount</th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description"
                  className="w-full border rounded p-2"
                />
              </td>
              <td className="p-2">
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className="w-full border rounded p-2"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  placeholder="0.00"
                  className="w-full border rounded p-2"
                />
              </td>
              <td className="p-2">
                <button
                  onClick={handleAddExpense}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Category Totals</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex justify-between">
                <span>{category}</span>
                <span className="font-semibold">
                  ${(categoryTotals[category] || 0).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
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
      </div>
    </div>
  );
}
