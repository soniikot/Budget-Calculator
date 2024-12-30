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
import { db } from "@/utils/firebase";

function handleError(error: unknown, context: string) {
  console.error(`Error in ${context}:`, error);
  throw error;
}

export const createTransactionService = (db: Firestore) => {
  return {
    async addTransaction(
      transaction: Omit<Transaction, "id" | "createdAt">
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
          new BaseEvent(EVENT_IDS.TRANSACTION.ADDED, {
            transaction: newTransaction,
          })
        );

        return newTransaction;
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
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });

        eventBus.emit(
          new BaseEvent(EVENT_IDS.TRANSACTION.UPDATED, {
            transactionId: id,
            updates,
          })
        );
      } catch (error) {
        handleError(error, "updateTransaction");
      }
    },

    async deleteTransaction(id: string): Promise<void> {
      try {
        const docRef = doc(db, "transactions", id);
        await deleteDoc(docRef);

        eventBus.emit(
          new BaseEvent(EVENT_IDS.TRANSACTION.DELETED, {
            transactionId: id,
          })
        );
      } catch (error) {
        handleError(error, "deleteTransaction");
      }
    },

    initializeEventListeners() {
      eventBus.on(EVENT_IDS.MONTH.FETCH_REQUESTED, async () => {
        try {
          const months = await this.getTransactions("2024-06"); // Example usage
          eventBus.emit(
            new BaseEvent(EVENT_IDS.MONTH.FETCH_SUCCEEDED, { months })
          );
        } catch (error) {
          eventBus.emit(new BaseEvent(EVENT_IDS.MONTH.FETCH_FAILED, { error }));
        }
      });

      eventBus.on(
        EVENT_IDS.TRANSACTION.SAVE_REQUESTED,
        async (data: { transaction: Transaction; month: string }) => {
          try {
            const { transaction, month } = data;
            await this.addTransaction(transaction);

            eventBus.emit(
              new BaseEvent(EVENT_IDS.TRANSACTION.SAVE_SUCCEEDED, {
                transaction,
                month,
              })
            );
          } catch (error) {
            eventBus.emit(
              new BaseEvent(EVENT_IDS.TRANSACTION.SAVE_FAILED, {
                error: (error as Error).message,
              })
            );
          }
        }
      );
    },
  };
};

export const transactionService = createTransactionService(db);
