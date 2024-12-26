"use client";
import { useState, useEffect } from "react";
import { budgetService } from "@/lib/budgetService";
import Link from "next/link";

export default function HomePage() {
  const [months, setMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchMonths = async () => {
      try {
        const allMonths = await budgetService.getAllMonths();
        setMonths(allMonths);
      } catch (error) {
        console.error("Error loading months:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonths();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Budget Tracker</h1>
        <Link
          href="/budget/new"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Create New Month
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {months.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center py-10">
            No budget months created yet. Create your first month budget!
          </p>
        ) : (
          months
            .filter((month) => {
              // Only keep months that match YYYY-MM format
              return /^\d{4}-\d{2}$/.test(month);
            })
            .map((month) => {
              console.log("Month value:", month);
              const [year, monthNum] = month.split("-");
              const dateStr = `${year}-${monthNum}-01`;
              const date = new Date(dateStr);

              return (
                <Link
                  key={month}
                  href={`/budget/${month}`}
                  className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-xl font-semibold">
                    {!isNaN(date.getTime())
                      ? date.toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })
                      : "Invalid Date"}
                  </h2>
                </Link>
              );
            })
        )}
      </div>
    </main>
  );
}
