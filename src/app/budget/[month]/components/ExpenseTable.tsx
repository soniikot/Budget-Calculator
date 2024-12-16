import { Expense } from "@/types/budget";

interface ExpenseTableProps {
  expenses: Expense[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Expenses</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Category</th>
              <th className="text-right p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b">
                <td className="p-2">{expense.date}</td>
                <td className="p-2">{expense.description}</td>
                <td className="p-2">{expense.category}</td>
                <td className="p-2 text-right">${expense.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
