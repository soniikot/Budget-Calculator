import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Expense, MonthlyBudget } from "@/types/budget";

export const budgetService = {
  // Add a new expense
  async addExpense(monthId: string, expense: Omit<Expense, "id">) {
    try {
      const monthRef = doc(db, "months", monthId);
      const expenseRef = await addDoc(collection(db, "expenses"), {
        ...expense,
        monthId,
        createdAt: new Date().toISOString(),
      });
      return expenseRef.id;
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  },

  // Get expenses for a specific month
  async getMonthExpenses(monthId: string): Promise<Expense[]> {
    try {
      const q = query(
        collection(db, "expenses"),
        where("monthId", "==", monthId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Expense)
      );
    } catch (error) {
      console.error("Error getting expenses:", error);
      throw error;
    }
  },

  // Delete an expense
  async deleteExpense(expenseId: string) {
    try {
      await deleteDoc(doc(db, "expenses", expenseId));
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  },

  // Get monthly summary
  async getMonthSummary(monthId: string): Promise<MonthlyBudget | null> {
    try {
      const expenses = await this.getMonthExpenses(monthId);
      const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const categories = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {} as { [key: string]: number });

      return {
        id: monthId,
        month: monthId,
        expenses,
        totalAmount,
        categories,
      };
    } catch (error) {
      console.error("Error getting month summary:", error);
      throw error;
    }
  },

  async createMonth(monthId: string) {
    try {
      const monthRef = await addDoc(collection(db, "months"), {
        id: monthId,
        month: monthId,
        createdAt: new Date().toISOString(),
        totalAmount: 0,
        categories: {},
      });
      return monthRef.id;
    } catch (error) {
      console.error("Error creating month:", error);
      throw error;
    }
  },

  async getMonth(monthId: string) {
    try {
      const q = query(collection(db, "months"), where("month", "==", monthId));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking month:", error);
      throw error;
    }
  },

  async deleteMonth(monthId: string) {
    try {
      // Delete all expenses for this month
      const expensesQuery = query(
        collection(db, "expenses"),
        where("monthId", "==", monthId)
      );
      const querySnapshot = await getDocs(expensesQuery);
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Delete the month document
      const monthQuery = query(
        collection(db, "months"),
        where("month", "==", monthId)
      );
      const monthSnapshot = await getDocs(monthQuery);
      if (!monthSnapshot.empty) {
        await deleteDoc(monthSnapshot.docs[0].ref);
      }
    } catch (error) {
      console.error("Error deleting month:", error);
      throw error;
    }
  },
};
