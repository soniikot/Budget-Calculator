"use client";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/Month/PageHeader";
import { TransactionForm } from "@/components/Month/TransactionForm";
import { TransactionTable } from "@/components/Month/TransactionTable";
import { TransactionsSummary } from "@/components/Month/TransactionsSummary";

interface Props {
  params: { month: string };
}

export default function BudgetMonthPage({ params }: Props) {
  const router = useRouter();
  const { month } = params;

  return (
    <main className="p-6">
      <PageHeader month={month} />
      <TransactionForm />
      <TransactionsSummary />
      <TransactionTable />
    </main>
  );
}
