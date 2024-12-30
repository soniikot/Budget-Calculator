export type Expense = {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
};

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  month: string;
  createdAt?: string;
};

export type TransactionSummary = {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  expensesByCategory: { [key: string]: number };
  incomeByCategory: { [key: string]: number };
};

export type MonthlyBudget = {
  id: string;
  month: string;
  year: number;
};

export interface MonthBudgetPageProps {
  params: Promise<{
    month: string;
  }>;
}
