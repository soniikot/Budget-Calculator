import MonthBudgetClient from "./MonthBudgetClient";

interface Props {
  params: {
    month: string;
  };
}

export default function BudgetMonthPage({ params }: Props) {
  return <MonthBudgetClient month={params.month} />;
}
