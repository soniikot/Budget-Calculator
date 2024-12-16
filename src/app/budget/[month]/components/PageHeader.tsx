import Link from "next/link";

interface PageHeaderProps {
  month: string;
}

export function PageHeader({ month }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        Budget for{" "}
        {new Date(month + "-01").toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h1>
      <Link
        href="/"
        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
      >
        Back to All Months
      </Link>
    </div>
  );
}
