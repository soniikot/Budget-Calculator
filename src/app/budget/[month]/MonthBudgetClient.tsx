"use client";
import { useRouter } from "next/navigation";
import { PageHeader } from "./components/PageHeader";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionTable } from "./components/TransactionTable";

interface Props {
  month: string;
}

export default function MonthBudgetClient({ month }: Props) {
  const router = useRouter();

  return (
    <main className="p-6">
      <PageHeader month={month} />
      <TransactionForm />
      <TransactionTable />
    </main>
  );
}
