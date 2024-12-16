"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { budgetService } from "@/lib/budgetService";

export default function NewBudgetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const month = form.month.value;

    setLoading(true);
    try {
      await budgetService.createMonth(month);
      router.push(`/budget/${month}`);
    } catch (error) {
      console.error("Error creating month:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Month Budget</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="space-y-4">
          <input
            type="month"
            name="month"
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Month"}
          </button>
        </div>
      </form>
    </main>
  );
}
