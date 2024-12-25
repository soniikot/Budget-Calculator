import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { eventBus } from "@/utils/eventBus";
import { BUDGET_EVENTS } from "@/utils/eventTypes";
import { Transaction } from "@/types/budget";

export const transactionService = {
  async addTransaction(transaction: Omit<Transaction, "id">) {
    try {
      const docRef = await addDoc(collection(db, "transactions"), {
        ...transaction,
        createdAt: new Date().toISOString(),
      });

      const savedTransaction = { ...transaction, id: docRef.id };
      eventBus.emit(BUDGET_EVENTS.TRANSACTION_ADDED, {
        transaction: savedTransaction,
      });
      return savedTransaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    try {
      const docRef = doc(db, "transactions", id);

      // Check if document exists first
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error(`Transaction with ID ${id} does not exist`);
      }

      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const updateData = {
        ...cleanUpdates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);

      eventBus.emit(BUDGET_EVENTS.TRANSACTION_UPDATED, {
        transactionId: id,
        updates: updateData,
      });

      if (updates.month) {
        eventBus.emit(BUDGET_EVENTS.TRANSACTION_FETCH_REQUESTED, {
          month: updates.month,
        });
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },

  async deleteTransaction(id: string) {
    try {
      console.log("Attempting to delete transaction:", id);
      const docRef = doc(db, "transactions", id);

      // Check if document exists first
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
