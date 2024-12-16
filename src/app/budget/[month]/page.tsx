import MonthBudgetClient from "./MonthBudgetClient";
import { MonthBudgetPageProps } from "@/types/budget";

export default async function BudgetMonthPage({
  params,
}: MonthBudgetPageProps) {
  const resolvedParams = await params;
  return <MonthBudgetClient month={resolvedParams.month} />;
}
