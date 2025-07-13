import type { Category, Resource } from "./types";
import { initialCategories, initialResources } from "./data";
import * as FirebaseDB from "./firebase-db";

const STORAGE_KEYS = {
  CATEGORIES: "bookmrk_categories",
  RESOURCES: "bookmrk_resources",
  IS_LOCAL_USER: "bookmrk_is_local_user",
} as const;

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Helper to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    localStorage.setItem(key, value);
  },
  clear: (): void => {
    if (!isBrowser) return;
    localStorage.clear();
  },
};

// Helper to generate unique IDs for local storage
export function generateLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Check if user is using local storage
export function isLocalUser(): boolean {
  return safeLocalStorage.getItem(STORAGE_KEYS.IS_LOCAL_USER) === "true";
}

export function setLocalUser(value: boolean): void {
  safeLocalStorage.setItem(STORAGE_KEYS.IS_LOCAL_USER, value.toString());
}

// Categories
export function getLocalCategories(): Category[] {
  try {
    const data = safeLocalStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading local categories:", error);
    return [];
  }
}

export function saveLocalCategories(categories: Category[]): void {
  try {
    safeLocalStorage.setItem(
      STORAGE_KEYS.CATEGORIES,
      JSON.stringify(categories)
    );
  } catch (error) {
    console.error("Error saving local categories:", error);
  }
}

// ... existing code ...

// Function to sync local data to Firebase when user creates an account
export async function syncLocalDataToFirebase(userId: string): Promise<void> {
  try {
    const categories = getLocalCategories();
    const resources = getLocalResources();

    // Create a map of local IDs to new Firebase IDs for categories
    const categoryIdMap: Record<string, string> = {};

    // Add categories to Firebase and build ID mapping
    for (const category of categories) {
      const newId = crypto.randomUUID();
      categoryIdMap[category.id] = newId;

      await FirebaseDB.addCategory(userId, {
        ...category,
        id: newId,
      });
    }

    // Add resources to Firebase with updated category IDs
    for (const resource of resources) {
      await FirebaseDB.addResource(userId, {
        ...resource,
        id: crypto.randomUUID(),
        categoryId: categoryIdMap[resource.categoryId],
      });
    }

    // Clear local storage after successful sync
    safeLocalStorage.clear();
    setLocalUser(false);
  } catch (error) {
    console.error("Error syncing local data to Firebase:", error);
    throw error;
  }
}
