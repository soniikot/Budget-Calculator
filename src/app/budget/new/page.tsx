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

      console.log(`Creating month: Year=${currentYear}, Month=${currentMonth}`);
      await monthService.createMonth(currentYear, currentMonth);
      console.log("Month created successfully");
      router.push(`/budget/${currentYear}-${currentMonth}`);
    } catch (error) {
      console.error("Error creating month:", error);
      setError("Failed to create month. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Budget Month</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <button
        onClick={handleCreateMonth}
        disabled={loading}
        className={`bg-blue-500 text-white px-4 py-2 rounded
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
      >
        {loading ? "Creating..." : "Create Budget for Current Month"}
      </button>
    </div>
  );
}
