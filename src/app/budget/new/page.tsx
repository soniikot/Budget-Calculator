"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { monthService } from "@/utils/monthService";

export default function NewBudgetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateMonth = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

      console.log(
        `Creating budget for: Year=${currentYear}, Month=${currentMonth}`
      );

      const response = await monthService.createMonth(
        currentYear,
        currentMonth
      );

      if (!response) {
        throw new Error("Failed to create month.");
      }

      router.push(`/budget/${currentYear}/${currentMonth}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      console.error("Error creating month:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Create New Budget Month
      </h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {error}
        </div>
      )}
      <button
        onClick={handleCreateMonth}
        disabled={loading}
        className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-all ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {loading ? "Creating..." : "Create Budget for Current Month"}
      </button>
    </div>
  );
}
