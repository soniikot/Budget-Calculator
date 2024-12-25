"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { budgetService } from "@/lib/budgetService";

export default function NewBudgetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateMonth = async (month: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Creating month:", month);
      await budgetService.createMonth(month);
      console.log("Month created successfully");
      router.push(`/budget/${month}`);
    } catch (error) {
      console.error("Error creating month:", error);
      setError("Failed to create month. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Budget Month</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <button
        onClick={() => handleCreateMonth(currentMonth)}
        disabled={loading}
        className={`bg-blue-500 text-white px-4 py-2 rounded
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
      >
        {loading ? "Creating..." : "Create Budget for Current Month"}
      </button>
    </div>
  );
}
