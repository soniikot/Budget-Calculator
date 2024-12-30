import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { MonthlyBudget } from "@/types/budget";

class MonthService {
  /**
   * Create a new month entry if it doesn't already exist.
   * @param year - The year of the month (e.g., 2024)
   * @param month - The numeric month (e.g., "06")
   * @returns The created month identifier (e.g., "2024-06")
   */
  async createMonth(year: number, month: string): Promise<string> {
    try {
      const exists = await this.getMonth(year, month);
      if (exists) {
        console.log(`Month ${year}-${month} already exists.`);
        return `${year}-${month}`;
      }

      const monthsRef = collection(db, "months");
      const docRef = await addDoc(monthsRef, {
        year,
        month,
        name: new Date(`${year}-${month}-01`).toLocaleString("default", {
          month: "long",
        }),
        createdAt: new Date().toISOString(),
      });

      console.log(`Created new month: ${year}-${month} with ID: ${docRef.id}`);
      return `${year}-${month}`;
    } catch (error) {
      console.error("Error creating month:", error);
      throw error;
    }
  }

  /**
   * Check if a specific month entry exists.
   * @param year - The year of the month (e.g., 2024)
   * @param month - The numeric month (e.g., "06")
   * @returns True if the month exists, false otherwise.
   */
  async getMonth(year: number, month: string): Promise<boolean> {
    try {
      console.log(`Checking month: ${year}-${month}`);
      const monthsRef = collection(db, "months");
      const q = query(
        monthsRef,
        where("year", "==", year),
        where("month", "==", month)
      );
      const querySnapshot = await getDocs(q);
      const exists = !querySnapshot.empty;
      console.log(`Month ${year}-${month} exists: ${exists}`);
      return exists;
    } catch (error) {
      console.error("Error checking month:", error);
      return false;
    }
  }

  /**
   * Fetch all months sorted by creation date (descending).
   * @returns A list of all months in the database.
   */
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
          year: data.year,
          month: data.month,
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
