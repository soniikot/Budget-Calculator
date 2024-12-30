"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { monthService } from "@/utils/monthService";
import { MonthlyBudget } from "@/types/budget";

export default function Home() {
  const [months, setMonths] = useState<MonthlyBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMonths() {
      try {
        const allMonths = await monthService.getAllMonths();
        setMonths(allMonths);
      } catch (error) {
        console.error("Error loading months:", error);
        setError("Failed to load months");
      } finally {
        setLoading(false);
      }
    }

    fetchMonths();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budget Months</h1>
        <Link
          href="/budget/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Month
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {months.map((month) => {
          const [year, monthNum] = month.month.split("-");
          const date = new Date(parseInt(year), parseInt(monthNum) - 1);

          return (
            <Link
              key={month.id}
              href={`/budget/${month.month}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="text-lg font-semibold">
                {date.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                })}
              </div>
              <div className="text-sm text-gray-500">
                Created: {new Date(month.createdAt).toLocaleDateString()}
              </div>
            </Link>
          );
        })}
      </div>

      {months.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No budget months found. Create your first one!
        </div>
      )}
    </main>
  );
}
