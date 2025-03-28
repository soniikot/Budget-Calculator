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
import {
  Transaction,
  CreateTransactionData,
} from "@/types/transactionType/types";
import { eventBus } from "@/utils/eventBus";
import { TRANSACTION } from "@/utils/eventsIds";
import { BaseEvent } from "@/utils/eventBus";
import { db } from "@/utils/firebase";

function handleError(error: unknown, context: string) {
  console.error(`Error in ${context}:`, error);
  throw error;
}

export const createTransactionService = (db: Firestore) => {
  return {
    async addTransaction(
      transaction: CreateTransactionData
    ): Promise<Transaction> {
      try {
        const docRef = await addDoc(collection(db, "transactions"), {
          ...transaction,
          createdAt: serverTimestamp(),
        });

        const newTransaction = {
          id: docRef.id,
          ...transaction,
          createdAt: new Date().toISOString(),
        };

        eventBus.emit(
          new BaseEvent(TRANSACTION.ADDED, {
            transaction: newTransaction,
          })
        );

        return newTransaction;
      } catch (error) {
        handleError(error, "addTransaction");
        throw error;
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
        throw error;
      }
    },

    async updateTransaction(
      id: string,
      updates: Partial<Transaction>
    ): Promise<void> {
      try {
        const docRef = doc(db, "transactions", id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });

        eventBus.emit(
          new BaseEvent(TRANSACTION.UPDATED, {
            transactionId: id,
            updates,
          })
        );
      } catch (error) {
        handleError(error, "updateTransaction");
        throw error;
      }
    },

    async deleteTransaction(id: string): Promise<void> {
      try {
        const docRef = doc(db, "transactions", id);
        await deleteDoc(docRef);

        eventBus.emit(
          new BaseEvent(TRANSACTION.DELETED, {
            transactionId: id,
          })
        );
      } catch (error) {
        handleError(error, "deleteTransaction");
      }
    },
  };
};

export const transactionService = createTransactionService(db);
