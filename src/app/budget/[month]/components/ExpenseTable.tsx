"use client";
import { useEffect, useState } from "react";
import { eventBus } from "@/utils/eventBus";
import { Transaction } from "@/types/budget";
import { transactionService } from "@/lib/transactionService";
import { BUDGET_CATEGORIES } from "@/constants/budget";
import { BUDGET_EVENTS } from "@/utils/eventTypes";
export function ExpenseTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    const deleteSubscription = eventBus.on(
      BUDGET_EVENTS.TRANSACTION_DELETED,
      ({ transactionId }) => {
        setTransactions((current) =>
          current.filter((transaction) => transaction.id !== transactionId)
        );
      }
    );

    const updateSubscription = eventBus.on(
      BUDGET_EVENTS.TRANSACTION_UPDATED,
      ({ transactionId, updates }) => {
        setTransactions((current) =>
          current.map((transaction) =>
            transaction.id === transactionId
              ? { ...transaction, ...updates }
              : transaction
          )
        );
      }
    );

    // Listen for fetch requests
    const fetchSubscription = eventBus.on(
      BUDGET_EVENTS.TRANSACTION_FETCH_REQUESTED,
      async ({ month }) => {
        // Implement your fetch logic here
        // This should update your transactions state
      }
    );

    // Cleanup listeners
    return () => {
      deleteSubscription();
      updateSubscription();
      fetchSubscription();
    };
  }, []);

  const handleEdit = (expense: Transaction) => {
    setEditingId(expense.id);
    setEditingTransaction({ ...expense });
  };

  const handleUpdate = async (id: string, updates: Partial<Transaction>) => {
    try {
      await transactionService.updateTransaction(id, updates);
      setEditingTransaction(null);
    } catch (error) {
      if (error instanceof Error && error.message.includes("does not exist")) {
        alert("This transaction no longer exists. The page will refresh.");
      } else {
        console.error("Failed to update transaction:", error);
        alert("Failed to update transaction");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionService.deleteTransaction(id);
      // UI will update via event listener
    } catch (error) {
      if (
        !(error instanceof Error && error.message.includes("does not exist"))
      ) {
        console.error("Failed to delete transaction:", error);
        alert("Failed to delete transaction");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Expenses</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
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
            {transactions.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                {editingId === expense.id ? (
                  <>
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
                        onClick={() =>
                          handleUpdate(expense.id, editingTransaction)
                        }
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.date}
                    </td>
                    <td className="px-6 py-4">{expense.description}</td>
                    <td className="px-6 py-4">{expense.category}</td>
                    <td className="px-6 py-4 text-right text-red-600 font-medium">
                      -${expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
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
        Total expenses: {transactions.length}
      </div>
    </div>
  );
}
