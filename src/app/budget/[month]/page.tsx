import MonthBudgetClient from "./MonthBudgetClient";
import { MonthBudgetPageProps } from "@/app/budget/types/types";

export default async function BudgetMonthPage({
  params,
}: MonthBudgetPageProps) {
  const resolvedParams = await params;
  return <MonthBudgetClient month={resolvedParams.month} />;
}
