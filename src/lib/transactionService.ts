import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Transaction } from "@/types/budget";
import { eventBus } from "@/utils/eventBus";
import { BUDGET_EVENTS } from "@/utils/eventTypes";

export const transactionService = {
  async addTransaction(transaction: Omit<Transaction, "id">) {
    try {
      const docRef = await addDoc(collection(db, "transactions"), {
        ...transaction,
        createdAt: new Date().toISOString(),
      });

      const savedTransaction = {
        id: docRef.id,
        ...transaction,
        createdAt: new Date().toISOString(),
      };
      return savedTransaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  async getTransactions(month: string): Promise<Transaction[]> {
    const q = query(
      collection(db, "transactions"),
      where("month", "==", month)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Transaction)
    );
  },

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    try {
      const docRef = doc(db, "transactions", id);

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error(`Transaction with ID ${id} does not exist`);
      }

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);

      // Emit event after successful update
      eventBus.emit(BUDGET_EVENTS.TRANSACTION_UPDATED, {
        transactionId: id,
        updates: updateData,
      });

      return true;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },

  async deleteTransaction(id: string) {
    try {
      console.log("Attempting to delete transaction:", id);
      const docRef = doc(db, "transactions", id);

      const docSnap = await getDoc(docRef);
      console.log("Document exists?", docSnap.exists());

      if (!docSnap.exists()) {
        console.log("Document does not exist, emitting delete event");
        eventBus.emit(BUDGET_EVENTS.TRANSACTION_DELETED, { transactionId: id });
        return;
      }

      console.log("Document exists, proceeding with deletion");
      await deleteDoc(docRef);
      console.log("Document deleted successfully");
      eventBus.emit(BUDGET_EVENTS.TRANSACTION_DELETED, { transactionId: id });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  },
};
