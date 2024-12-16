"use client";
import React, { useState } from "react";

interface MonthSelectorProps {
  defaultMonth: string | null;
  onMonthSelect: (month: string) => void;
  onCancel: () => void;
}

export default function MonthSelector({
  defaultMonth,
  onMonthSelect,
  onCancel,
}: MonthSelectorProps) {
  const [monthInput, setMonthInput] = useState(defaultMonth || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monthInput) {
      onMonthSelect(monthInput);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-4 max-w-md mx-auto">
        <input
          type="month"
          value={monthInput}
          onChange={(e) => setMonthInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Create Month
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
