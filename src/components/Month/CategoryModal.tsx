"use client";

import { useState, useEffect } from "react";
import { categoryService, CATEGORY } from "@/utils/categoryService";
import { eventBus } from "@/utils/eventBus";
import { BaseEvent } from "@/utils/eventBus";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCategories();

      const handleCategoryAdded = (event: BaseEvent<{ name: string }>) => {
        setCategories((prev) => [...prev, event.payload.name].sort());
      };

      const handleCategoryDeleted = (event: BaseEvent<{ name: string }>) => {
        setCategories((prev) =>
          prev.filter((cat) => cat !== event.payload.name)
        );
      };

      const cleanupAdded = eventBus.on(CATEGORY.ADDED, handleCategoryAdded);
      const cleanupDeleted = eventBus.on(
        CATEGORY.DELETED,
        handleCategoryDeleted
      );

      return () => {
        cleanupAdded();
        cleanupDeleted();
      };
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedCategories = await categoryService.getCategories();
      setCategories(loadedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await categoryService.addCategory(newCategory.trim());
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category");
    }
  };

  const handleDelete = async (category: string) => {
    try {
      await categoryService.deleteCategory(category);
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category"
              className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
        </form>

        {isLoading ? (
          <div className="animate-pulse">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
              >
                <span>{category}</span>
                <button
                  onClick={() => handleDelete(category)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
