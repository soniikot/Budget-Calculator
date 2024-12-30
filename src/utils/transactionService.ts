import {
  Firestore,
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
import { EVENT_IDS } from "@/utils/eventsIds";
import { BaseEvent } from "@/utils/eventBus";

function handleError(error: unknown, context: string) {
  console.error(`Error in ${context}:`, error);
  throw error;
}

type TransactionUpdatedPayload = {
  transactionId: string;
  updates: Partial<Transaction>;
};

type TransactionDeletedPayload = {
  transactionId: string;
};

export const createTransactionService = (db: Firestore) => ({
  // Add a new transaction
  async addTransaction(
    transaction: Omit<Transaction, "id" | "createdAt">
  ): Promise<Transaction> {
    try {
      const docRef = await addDoc(collection(db, "transactions"), {
        ...transaction,
        createdAt: serverTimestamp(),
      });

      return {
        id: docRef.id,
        ...transaction,
        createdAt: new Date().toISOString(), // Client-side timestamp for immediate feedback
      };
    } catch (error) {
      handleError(error, "addTransaction");
    }
  },

  async getTransactions(month: string): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, "transactions"),
        where("month", "==", month)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        if (!data || !data.amount || !data.month) {
          throw new Error(
            `Invalid transaction data for document ID: ${doc.id}`
          );
        }
        return { id: doc.id, ...data } as Transaction;
      });
    } catch (error) {
      handleError(error, "getTransactions");
    }
  },

  async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<void> {
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

      eventBus.emit(
        new BaseEvent<TransactionUpdatedPayload>(
          EVENT_IDS.TRANSACTION.UPDATED,
          {
            transactionId: id,
            updates: updateData,
          }
        )
      );
    } catch (error) {
      handleError(error, "updateTransaction");
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    try {
      const docRef = doc(db, "transactions", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        eventBus.emit(
          new BaseEvent<TransactionDeletedPayload>(
            EVENT_IDS.TRANSACTION.DELETE_FAILED,
            { transactionId: id }
          )
        );
        return;
      }

      await deleteDoc(docRef);

      eventBus.emit(
        new BaseEvent<TransactionDeletedPayload>(
          EVENT_IDS.TRANSACTION.DELETED,
          { transactionId: id }
        )
      );
    } catch (error) {
      handleError(error, "deleteTransaction");
    }
  },
});
