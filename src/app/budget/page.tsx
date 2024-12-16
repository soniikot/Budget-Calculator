"use client";

import { useEffect, useState } from "react";
import MonthSelector from "../../components/MonthSelector/MonthSelector";
import MonthDisplay from "../../components/MonthDisplay/MonthDisplay";

import { budgetService } from "@/lib/budgetService";
import MonthBudgetPage from "./[month]/MonthBudgetPage";

export default function BudgetPage() {
  const [monthId, setMonthId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const today = new Date();
    const defaultMonth = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;
    setMonthId(defaultMonth);
    setIsInitialized(true);
  }, []);

  const handleCreateNew = () => {
    setShowForm(true);
  };

  const handleMonthSelect = async (month: string) => {
    try {
      const exists = await budgetService.getMonth(month);
      if (!exists) {
        await budgetService.createMonth(month);
      }
      setMonthId(month);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating/selecting month:", error);
    }
  };

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {!showForm && !monthId && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg font-semibold"
          >
            Create New Month Budget
          </button>
        </div>
      )}

      {showForm && (
        <MonthSelector
          defaultMonth={monthId}
          onMonthSelect={handleMonthSelect}
          onCancel={() => setShowForm(false)}
        />
      )}

      {monthId && !showForm && (
        <>
          <MonthDisplay
            month={monthId}
            onChangeMonth={() => setShowForm(true)}
          />
          <MonthBudgetPage params={{ month: monthId }} />
        </>
      )}
    </div>
  );
}
