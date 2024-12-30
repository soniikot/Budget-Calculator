import Link from "next/link";
import { useParams } from "next/navigation";

interface PageHeaderProps {
  month: string;
}

export function PageHeader() {
  // Parse the month string properly
  const { year, month } = useParams();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Budget for{}</h1>
      <Link
        href="/"
        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
      >
        Back to All Months
      </Link>
    </div>
  );
}
