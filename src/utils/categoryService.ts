import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { BaseEvent, eventBus } from "@/utils/eventBus";

export enum CATEGORY {
  ADDED = "category:added",
  DELETED = "category:deleted",
  ERROR = "category:error",
}

class CategoryService {
  private collection = "categories";

  async getCategories(): Promise<string[]> {
    try {
      const categoriesRef = collection(db, this.collection);
      const q = query(categoriesRef, orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => doc.data().name);
    } catch (error) {
      console.error("❌ Error getting categories:", error);
      eventBus.emit(new BaseEvent(CATEGORY.ERROR, { error, action: "fetch" }));
      throw error;
    }
  }

  async addCategory(name: string): Promise<void> {
    try {
      const categoriesRef = collection(db, this.collection);
      await addDoc(categoriesRef, {
        name,
        createdAt: new Date().toISOString(),
      });

      eventBus.emit(new BaseEvent(CATEGORY.ADDED, { name }));
    } catch (error) {
      console.error("❌ Error adding category:", error);
      eventBus.emit(new BaseEvent(CATEGORY.ERROR, { error, action: "add" }));
      throw error;
    }
  }

  async deleteCategory(name: string): Promise<void> {
    try {
      const categoriesRef = collection(db, this.collection);
      const q = query(categoriesRef, orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);

      const categoryDoc = querySnapshot.docs.find(
        (doc) => doc.data().name === name
      );

      if (categoryDoc) {
        await deleteDoc(doc(db, this.collection, categoryDoc.id));
        eventBus.emit(new BaseEvent(CATEGORY.DELETED, { name }));
      }
    } catch (error) {
      console.error("❌ Error deleting category:", error);
      eventBus.emit(new BaseEvent(CATEGORY.ERROR, { error, action: "delete" }));
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
