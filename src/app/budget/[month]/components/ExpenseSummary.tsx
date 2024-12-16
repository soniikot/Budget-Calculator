interface ExpenseSummaryProps {
  totalAmount: number;
  categoryTotals: Record<string, number>;
}

export function ExpenseSummary({
  totalAmount,
  categoryTotals,
}: ExpenseSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Total Expenses</h2>
        <p className="text-3xl font-bold text-red-600">
          ${totalAmount.toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">By Category</h2>
        {Object.entries(categoryTotals).map(([category, amount]) => (
          <div key={category} className="flex justify-between mb-2">
            <span>{category}</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
