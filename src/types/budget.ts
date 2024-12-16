export type Expense = {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
};

export type MonthlyBudget = {
  id: string;
  month: string;
  expenses: Expense[];
  totalAmount: number;
  categories: {
    [key: string]: number;
  };
};

export interface MonthBudgetPageProps {
  params: Promise<{
    month: string;
  }>;
}
