"use client";
import { useState } from "react";
import { budgetService } from "@/lib/budgetService";
import MonthBudget from "../../components/MonthBudget";

export default function BudgetPage() {
  const [monthId, setMonthId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateNew = () => {
    const today = new Date();
    const defaultMonth = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;
    setMonthId(defaultMonth);
    setShowForm(true);
  };

  const handleMonthChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const monthInput = form.month.value;

    try {
      const exists = await budgetService.getMonth(monthInput);
      if (!exists) {
        await budgetService.createMonth(monthInput);
      }
      setMonthId(monthInput);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating/selecting month:", error);
    }
  };

  if (!monthId && !showForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <button
          onClick={handleCreateNew}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg font-semibold"
        >
          Create New Month Budget
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {showForm ? (
        <form onSubmit={handleMonthChange} className="mb-6">
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="month"
              name="month"
              defaultValue={monthId || undefined}
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Create Month
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Budget for{" "}
            {new Date(monthId + "-01").toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Change Month
          </button>
        </div>
      )}

      {monthId && <MonthBudget month={monthId} />}
    </div>
  );
}
