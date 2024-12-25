import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { Expense, MonthlyBudget } from "@/types/budget";

class BudgetService {
  async createMonth(month: string): Promise<string> {
    try {
      // First check if month already exists
      const exists = await this.getMonth(month);
      if (exists) {
        return month; // Return existing month
      }

      // Create new month if it doesn't exist
      const monthsRef = collection(db, "months");
      const docRef = await addDoc(monthsRef, {
        month,
        createdAt: new Date().toISOString(),
      });

      console.log(`Created new month: ${month} with ID: ${docRef.id}`);
      return month;
    } catch (error) {
      console.error("Error creating month:", error);
      throw error;
    }
  }

  async getMonth(monthId: string): Promise<boolean> {
    try {
      console.log(`Checking month: ${monthId}`);
      const monthsRef = collection(db, "months");
      const q = query(monthsRef, where("month", "==", monthId));
      const querySnapshot = await getDocs(q);
      const exists = !querySnapshot.empty;
      console.log(`Month ${monthId} exists: ${exists}`);
      return exists;
    } catch (error) {
      console.error("Error checking month:", error);
      return false;
    }
  }

  async getMonthExpenses(monthId: string): Promise<Expense[]> {
    try {
      const expensesRef = collection(db, "expenses");
      const q = query(expensesRef, where("monthId", "==", monthId));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[];
    } catch (error) {
      console.error("Error getting expenses:", error);
      return [];
    }
  }

  async addExpense(monthId: string, expense: Omit<Expense, "id">) {
    try {
      const expensesRef = collection(db, "expenses");
      const docRef = await addDoc(expensesRef, {
        ...expense,
        monthId,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  }

  async getAllMonths(): Promise<MonthlyBudget[]> {
    try {
      console.log("Fetching all months");
      const monthsRef = collection(db, "months");
      const q = query(monthsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const months = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          month: data.month,
          createdAt: data.createdAt,
        } as MonthlyBudget;
      });

      console.log(`Found ${months.length} months:`, months);
      return months;
    } catch (error) {
      console.error("Error getting all months:", error);
      throw error;
    }
  }
}

export const budgetService = new BudgetService();
