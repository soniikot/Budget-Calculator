"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { monthService } from "@/utils/monthService";
import { MonthlyBudget } from "@/types/month/types";

export default function Home() {
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchYears() {
      try {
        const allMonths = await monthService.getAllMonths();

        // Extract and validate unique years from months
        const uniqueYears = Array.from(
          new Set(
            allMonths
              .map((month) => month.year) // Extract years
              .filter((year) => typeof year === "number" && !isNaN(year)) // Ensure valid years
          )
        ).sort((a, b) => b - a); // Sort descending

        setYears(uniqueYears);
      } catch (error) {
        console.error("Error loading years:", error);
        setError("Failed to load years");
      } finally {
        setLoading(false);
      }
    }

    fetchYears();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  const handleYearClick = (year: number) => {
    router.push(`/budget/${year}`);
  };

  return (
    <main className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budget by Year</h1>
        <button
          onClick={() => router.push("/budget/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Month
        </button>
      </div>

      {/* Year Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {years.map((year) => (
          <div
            key={year}
            onClick={() => handleYearClick(year)}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center cursor-pointer"
          >
            <div className="text-lg font-semibold">{year}</div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {years.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No budget years found. Create your first one!
        </div>
      )}
    </main>
  );
}
