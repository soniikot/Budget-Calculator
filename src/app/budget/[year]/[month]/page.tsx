"use client";
import { PageHeader } from "@/components/Month/PageHeader";
import { TransactionForm } from "@/components/Month/TransactionForm";
import { TransactionTable } from "@/components/Month/TransactionTable";
import { TransactionsSummary } from "@/components/Month/TransactionsSummary";

export default function BudgetMonthPage() {
  return (
    <main className="p-6">
      <PageHeader />
      <TransactionForm />
      <TransactionsSummary />
      <TransactionTable />
    </main>
  );
}
