import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { MonthlyBudget } from "@/types/month/types";
import { BaseEvent, eventBus } from "@/utils/eventBus";
import { MONTH } from "@/utils/eventsIds";

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

      // Emit event after successfully creating a month
      eventBus.emit(
        new BaseEvent(MONTH.CREATED, { year, month, id: docRef.id })
      );

      return `${year}-${month}`;
    } catch (error) {
      console.error("❌ Error creating month:", error);
      eventBus.emit(new BaseEvent(MONTH.ERROR, { error, action: "create" }));
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
      const monthsRef = collection(db, "months");
      const q = query(
        monthsRef,
        where("year", "==", year),
        where("month", "==", month)
      );
      const querySnapshot = await getDocs(q);
      const exists = !querySnapshot.empty;
      return exists;
    } catch (error) {
      console.error("❌ Error checking month:", error);
      eventBus.emit(new BaseEvent(MONTH.ERROR, { error, action: "check" }));
      return false;
    }
  }

  /**
   * Fetch all months sorted by creation date (descending).
   * @returns A list of all months in the database.
   */
  async getAllMonths(): Promise<MonthlyBudget[]> {
    try {
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

      eventBus.emit(new BaseEvent(MONTH.FETCH_SUCCEEDED, months));

      return months;
    } catch (error) {
      console.error("❌ Error getting all months:", error);
      eventBus.emit(new BaseEvent(MONTH.ERROR, { error, action: "fetchAll" }));
      throw error;
    }
  }
}

export const monthService = new MonthService();
