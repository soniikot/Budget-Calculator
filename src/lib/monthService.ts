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

class MonthService {
  async createMonth(month: string): Promise<string> {
    try {
      const exists = await this.getMonth(month);
      if (exists) {
        return month;
      }
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

export const monthService = new MonthService();
