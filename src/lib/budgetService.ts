import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Expense, MonthlyBudget } from "@/types/budget";

async function initializeCollections() {
  try {
    const monthsRef = collection(db, "months");

    await addDoc(monthsRef, {
      id: "test",
      createdAt: new Date().toISOString(),
    });

    const querySnapshot = await getDocs(
      query(monthsRef, where("id", "==", "test"))
    );
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error initializing collections:", error);
  }
}

initializeCollections();

export const budgetService = {
  async addExpense(monthId: string, expense: Omit<Expense, "id">) {
    try {
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

  async deleteExpense(expenseId: string) {
    try {
      await deleteDoc(doc(db, "expenses", expenseId));
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  },

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

  async getAllMonths(): Promise<string[]> {
    try {
      const monthsRef = collection(db, "months");
      const querySnapshot = await getDocs(monthsRef);
      const months = querySnapshot.docs.map(
        (doc) => doc.data().month as string
      );
      console.log("Raw months from DB:", months); // Debug log
      return months.sort((a, b) => b.localeCompare(a));
    } catch (error) {
      console.error("Error getting all months:", error);
      throw error;
    }
  },
};
