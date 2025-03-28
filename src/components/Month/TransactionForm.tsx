"use client";
import { useState, useEffect } from "react";
import { TransactionType } from "../../types/transactionType/types";
import { transactionService } from "@/utils/transactionService";
import { useParams } from "next/navigation";
import { categoryService } from "@/utils/categoryService";
import { CATEGORY } from "@/utils/categoryService";
import { eventBus } from "@/utils/eventBus";
import { BaseEvent } from "@/utils/eventBus";
import { CategoryModal } from "./CategoryModal";

export function TransactionForm() {
  const params = useParams();
  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");
  const [categories, setCategories] = useState<string[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    loadCategories();

    const handleCategoryUpdate = () => {
      loadCategories();
    };

    const cleanupAdded = eventBus.on(CATEGORY.ADDED, handleCategoryUpdate);
    const cleanupDeleted = eventBus.on(CATEGORY.DELETED, handleCategoryUpdate);

    return () => {
      cleanupAdded();
      cleanupDeleted();
    };
  }, []);

  const loadCategories = async () => {
    try {
      const loadedCategories = await categoryService.getCategories();
      setCategories(loadedCategories);
      if (loadedCategories.length > 0 && !newTransaction.category) {
        setNewTransaction((prev) => ({
          ...prev,
          category: loadedCategories[0],
        }));
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setError("Failed to load categories");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "manage") {
      setIsCategoryModalOpen(true);
      // Reset to the previous category
      setNewTransaction((prev) => ({ ...prev, category: prev.category }));
    } else {
      setNewTransaction((prev) => ({ ...prev, category: value }));
    }
  };

  const handleSubmit = async () => {
    if (
      !newTransaction.description ||
      !newTransaction.amount ||
      !newTransaction.category
    ) {
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

      await transactionService.addTransaction(transactionData);

      setNewTransaction({
        description: "",
        amount: "",
        category: categories[0] || "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("[handleSubmit] Failed to save transaction:", error);
      setError("Failed to save transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setTransactionType("expense")}
          className={`px-4 py-2 rounded-md transition-colors ${
            transactionType === "expense"
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Expense
        </button>
        <button
          onClick={() => setTransactionType("income")}
          className={`px-4 py-2 rounded-md transition-colors ${
            transactionType === "income"
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Income
        </button>
      </div>

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
          onChange={handleCategoryChange}
          className="border p-2 rounded"
          disabled={isSubmitting}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="manage" className="text-blue-500 font-medium">
            + Manage Categories
          </option>
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

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}
