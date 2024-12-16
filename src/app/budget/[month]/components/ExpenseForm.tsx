"use client";
import { useState } from "react";
import { BUDGET_CATEGORIES } from "@/constants/budget";
import { Expense } from "@/types/budget";

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, "id">) => void;
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: BUDGET_CATEGORIES[0],
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    if (!newExpense.description || !newExpense.amount) return;

    onSubmit({
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
    });

    setNewExpense({
      description: "",
      amount: "",
      category: BUDGET_CATEGORIES[0],
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
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
          {BUDGET_CATEGORIES.map((cat) => (
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
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Add Expense
      </button>
    </div>
  );
}
