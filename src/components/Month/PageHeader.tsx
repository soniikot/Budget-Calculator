"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getMonthName } from "@/utils/getMonthName";
import { useRouter } from "next/navigation";

export function PageHeader() {
  const params = useParams();
  const router = useRouter();

  const month = params?.month as string | undefined;
  const year = params?.year as string | undefined;

  if (!month || !year) {
    return (
      <div className="p-6 text-red-600">
        ⚠️ Invalid or missing month/year parameters.
      </div>
    );
  }

  const handleBack = () => {
    if (year) {
      router.push(`/budget/${year}`);
    } else {
      router.push("/budget");
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        Budget for {getMonthName(Number(month))} {year}
      </h1>
      <button
        onClick={handleBack}
        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
      >
        Back to {year || "Budget Overview"}
      </button>
    </div>
  );
}
