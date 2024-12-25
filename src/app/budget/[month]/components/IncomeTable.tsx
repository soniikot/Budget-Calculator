"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Transaction } from "@/types/budget";
import { BUDGET_CATEGORIES } from "@/constants/budget";
import { useParams, useRouter } from "next/navigation";

export function IncomeTable() {
  const router = useRouter();
  const params = useParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    loadIncomeTransactions();
  }, []);

  const loadIncomeTransactions = async () => {
    try {
      const month = params.month as string;
      if (!month) {
        console.error("❌ Month parameter is missing");
        return;
      }

      console.log("💰 Loading income transactions for month:", month);

      const q = query(
        collection(db, "transactions"),
        where("month", "==", month),
        where("type", "==", "income")
      );

      const querySnapshot = await getDocs(q);
      const loadedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];

      console.log("📥 Loaded income transactions:", loadedTransactions);
      setTransactions(loadedTransactions);
    } catch (error) {
      console.error("❌ Error loading income transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingTransaction({ ...transaction });
  };

  const handleUpdate = async () => {
    if (!editingTransaction || !editingId) return;

    try {
      const docRef = doc(db, "transactions", editingId);
      await updateDoc(docRef, {
        description: editingTransaction.description,
        amount: parseFloat(editingTransaction.amount.toString()),
        category: editingTransaction.category,
        date: editingTransaction.date,
      });

      setTransactions((prev) =>
        prev.map((t) => (t.id === editingId ? editingTransaction : t))
      );
      setEditingId(null);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Failed to update transaction:", error);
      alert("Failed to update transaction");
    }
  };

  const handleDelete = async (transactionId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this income transaction?"
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "transactions", transactionId));
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      alert("Failed to delete transaction");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTransaction(null);
  };

  const handleMonthChange = async (month: string) => {
    try {
      setIsLoading(true);
      router.push(`/budget/${month}`);
    } catch (error) {
      console.error("Error navigating to month:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center text-gray-500">
          Loading income transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-green-600">
        Income Transactions
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Category</th>
              <th className="text-right p-2">Amount</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  {editingId === transaction.id ? (
                    <>
                      <td className="p-2">
                        <input
                          type="date"
                          value={editingTransaction?.date || ""}
                          onChange={(e) =>
                            setEditingTransaction((prev) =>
                              prev ? { ...prev, date: e.target.value } : prev
                            )
                          }
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={editingTransaction?.description || ""}
                          onChange={(e) =>
                            setEditingTransaction((prev) =>
                              prev
                                ? { ...prev, description: e.target.value }
                                : prev
                            )
                          }
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={editingTransaction?.category || ""}
                          onChange={(e) =>
                            setEditingTransaction((prev) =>
                              prev
                                ? { ...prev, category: e.target.value }
                                : prev
                            )
                          }
                          className="border p-1 rounded w-full"
                        >
                          {BUDGET_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editingTransaction?.amount || ""}
                          onChange={(e) =>
                            setEditingTransaction((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    amount: parseFloat(e.target.value),
                                  }
                                : prev
                            )
                          }
                          className="border p-1 rounded w-full text-right"
                        />
                      </td>
                      <td className="p-2 text-right space-x-2">
                        <button
                          onClick={handleUpdate}
                          className="text-green-600 hover:text-green-800"
                          title="Save changes"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-800"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{transaction.date}</td>
                      <td className="p-2">{transaction.description}</td>
                      <td className="p-2">{transaction.category}</td>
                      <td className="p-2 text-right text-green-600">
                        +${transaction.amount.toFixed(2)}
                      </td>
                      <td className="p-2 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit transaction"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete transaction"
                        >
                          ×
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No income transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Total income transactions: {transactions.length}
      </div>
    </div>
  );
}
