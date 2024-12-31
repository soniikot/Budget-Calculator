"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { monthService } from "@/utils/monthService";
import { MonthlyBudget } from "@/types/month/types";
import { eventBus } from "@/utils/eventBus";
import { getMonthName } from "@/utils/getMonthName";

export default function YearlyBudgetPage() {
  const { year } = useParams();
  const router = useRouter();
  const [months, setMonths] = useState<MonthlyBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMonthsForYear() {
      try {
        const allMonths = await monthService.getAllMonths();
        const filteredMonths = allMonths.filter(
          (month) => month.year === Number(year)
        );
        setMonths(filteredMonths);
      } catch (error) {
        console.error("Error fetching months:", error);
        setError("Failed to load months for this year.");
      } finally {
        setLoading(false);
      }
    }

    fetchMonthsForYear();
  }, [year]);

  useEffect(() => {
    const onMonthCreated = (payload: any) => {
      console.log("New month created:", payload);
      if (payload.year === Number(year)) {
        setMonths((current) => [...current, payload]);
      }
    };

    const onMonthError = (payload: any) => {
      console.error("Error occurred in MonthService:", payload);
    };

    eventBus.on("month:created", onMonthCreated);
    eventBus.on("month:error", onMonthError);
  }, [year]);

  const handleMonthClick = (month: string) => {
    router.push(`/budget/${year}/${month}`);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <main className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budget for Year {year}</h1>
        <button
          onClick={() => router.push("/budget/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Month
        </button>
      </div>

      {/* Months Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {months.map((month) => (
          <div
            key={month.id}
            onClick={() => handleMonthClick(month.month)}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center cursor-pointer"
          >
            <div className="text-lg font-semibold">
              {getMonthName(Number(month.month))}
            </div>
          </div>
        ))}
      </div>

      {months.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No months found for this year. Create your first one!
        </div>
      )}
    </main>
  );
}
