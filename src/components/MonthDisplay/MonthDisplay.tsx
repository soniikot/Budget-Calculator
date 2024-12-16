"use client";

interface MonthDisplayProps {
  month: string;
  onChangeMonth: () => void;
}

export default function MonthDisplay({
  month,
  onChangeMonth,
}: MonthDisplayProps) {
  const formattedMonth = new Date(month + "-01").toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Budget for {formattedMonth}</h2>
      <button
        onClick={onChangeMonth}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Change Month
      </button>
    </div>
  );
}
