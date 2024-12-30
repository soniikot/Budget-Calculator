"use client";
import { useState } from "react";
import { BUDGET_CATEGORIES } from "@/constants/budget";
import { TransactionType } from "@/types/budget";
import { transactionService } from "@/utils/transactionService";
import { useParams } from "next/navigation";
import { eventBus } from "@/utils/eventBus";
import { BUDGET_EVENTS } from "@/utils/eventTypes";

export function TransactionForm() {
  const params = useParams();
  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    category: BUDGET_CATEGORIES[0],
    date: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!newTransaction.description || !newTransaction.amount) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const month = params.month as string;
      const transactionData = {
        description: newTransaction.description,
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        date: newTransaction.date,
        type: transactionType,
        month,
      };

      const savedTransaction = await transactionService.addTransaction(
        transactionData
      );

      // Emit event to update the table
      eventBus.emit(BUDGET_EVENTS.TRANSACTION_ADDED, {
        transaction: savedTransaction,
      });

      // Reset form
      setNewTransaction({
        description: "",
        amount: "",
        category: BUDGET_CATEGORIES[0],
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Failed to save transaction:", error);
      setError("Failed to save transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Add New Transaction</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTransactionType("expense")}
            className={`px-4 py-2 rounded-md transition-colors ${
              transactionType === "expense"
                ? "bg-red-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setTransactionType("income")}
            className={`px-4 py-2 rounded-md transition-colors ${
              transactionType === "income"
                ? "bg-green-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Description"
          value={newTransaction.description}
          onChange={(e) =>
            setNewTransaction({
              ...newTransaction,
              description: e.target.value,
            })
          }
          className="border p-2 rounded"
          disabled={isSubmitting}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, amount: e.target.value })
          }
          className="border p-2 rounded"
          disabled={isSubmitting}
        />
        <select
          value={newTransaction.category}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, category: e.target.value })
          }
          className="border p-2 rounded"
          disabled={isSubmitting}
        >
          {BUDGET_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newTransaction.date}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, date: e.target.value })
          }
          className="border p-2 rounded"
          disabled={isSubmitting}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`mt-4 px-4 py-2 rounded text-white transition-colors
          ${
            transactionType === "expense"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          } 
          ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isSubmitting
          ? "Saving..."
          : `Add ${transactionType === "expense" ? "Expense" : "Income"}`}
      </button>
      <div className="mt-2 text-sm text-gray-500">
        {isSubmitting ? "Saving transaction..." : "All fields are required"}
      </div>
    </div>
  );
}
