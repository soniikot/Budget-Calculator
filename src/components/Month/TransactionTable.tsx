"use client";
import { useEffect, useState } from "react";
import { Transaction } from "@/types/budget";
import { BUDGET_CATEGORIES } from "@/constants/budget";
import { eventBus } from "@/utils/eventBus";
import { EVENT_IDS } from "@/utils/eventsIds";
import { useParams } from "next/navigation";
import { BaseEvent } from "@/utils/eventBus";
import { transactionService } from "@/utils/transactionService";

export function TransactionTable() {
  const { month } = useParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    const handleDelete = (event: BaseEvent<{ transactionId: string }>) => {
      setTransactions((current) =>
        current.filter((t) => t.id !== event.payload.transactionId)
      );
    };

    const handleUpdate = (
      event: BaseEvent<{ transactionId: string; updates: Partial<Transaction> }>
    ) => {
      setTransactions((current) =>
        current.map((t) =>
          t.id === event.payload.transactionId
            ? { ...t, ...event.payload.updates }
            : t
        )
      );
    };

    const handleAdd = (event: BaseEvent<{ transaction: Transaction }>) => {
      setTransactions((current) => [...current, event.payload.transaction]);
    };

    // Subscribe to events
    eventBus.on(EVENT_IDS.TRANSACTION.DELETED, handleDelete);
    eventBus.on(EVENT_IDS.TRANSACTION.UPDATED, handleUpdate);
    eventBus.on(EVENT_IDS.TRANSACTION.ADDED, handleAdd);
  }, [eventBus, EVENT_IDS]);

  useEffect(() => {
    async function loadTransactions() {
      const transactions = await transactionService.getTransactions(month);
      setTransactions(transactions);
    }
    loadTransactions();
  }, []);

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingTransaction({ ...transaction });
  };

  const handleUpdate = async () => {
    if (!editingTransaction || !editingId) return;

    try {
      await transactionService.updateTransaction(editingId, editingTransaction);

      eventBus.emit(
        new BaseEvent(EVENT_IDS.TRANSACTION.UPDATED, {
          transactionId: editingId,
          updates: editingTransaction,
        })
      );

      setEditingId(null);
      setEditingTransaction(null);

      const updatedTransactions = await transactionService.getTransactions(
        month
      );

      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Failed to update transaction:", error);
      alert("Failed to update transaction");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await transactionService.deleteTransaction(id);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      alert("Failed to delete transaction");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                {editingId === transaction.id ? (
                  <>
                    <td className="px-6 py-4">
                      <select
                        value={editingTransaction?.type}
                        onChange={(e) =>
                          setEditingTransaction((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  type: e.target.value as "income" | "expense",
                                }
                              : prev
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        value={editingTransaction?.date || ""}
                        onChange={(e) =>
                          setEditingTransaction((prev) =>
                            prev ? { ...prev, date: e.target.value } : prev
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
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
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={editingTransaction?.category}
                        onChange={(e) =>
                          setEditingTransaction((prev) =>
                            prev ? { ...prev, category: e.target.value } : prev
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      >
                        {BUDGET_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <input
                        type="number"
                        value={editingTransaction?.amount || 0}
                        onChange={(e) =>
                          setEditingTransaction((prev) =>
                            prev
                              ? { ...prev, amount: Number(e.target.value) }
                              : prev
                          )
                        }
                        className="border rounded px-2 py-1 w-32 text-right"
                      />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={handleUpdate}
                        className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4">{transaction.description}</td>
                    <td className="px-6 py-4">{transaction.category}</td>
                    <td
                      className={`px-6 py-4 text-right font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Total transactions: {transactions.length}
      </div>
    </div>
  );
}
