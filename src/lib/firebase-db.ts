import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase-config';
import type { Category, Resource } from './types';
import { initialCategories, initialResources } from './data';

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: Timestamp | null | undefined) => {
  return timestamp ? timestamp.toDate() : new Date();
};

// Categories Collection Operations
export const categoriesCollection = (userId: string) => 
  collection(db, `users/${userId}/categories`);

export const resourcesCollection = (userId: string) => 
  collection(db, `users/${userId}/resources`);

// Check if user data exists
export async function checkUserData(userId: string): Promise<boolean> {
  try {
    const categoriesSnapshot = await getDocs(categoriesCollection(userId));
    return !categoriesSnapshot.empty;
  } catch (error) {
    console.error('Error checking user data:', error);
    return false;
  }
}

// Initialize user data with test data
export async function initializeUserData(userId: string) {
  try {
    // Check if user already has data
    const hasData = await checkUserData(userId);
    if (hasData) {
      return; // Skip if user already has data
    }

    // Add initial categories
    const categoryPromises = initialCategories.map(category => 
      addCategory(userId, category)
    );
    await Promise.all(categoryPromises);

    // Add initial resources
    const resourcePromises = initialResources.map(resource =>
      addResource(userId, resource)
    );
    await Promise.all(resourcePromises);

    console.log('Successfully initialized user data');
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
}

// Category Operations
export async function addCategory(userId: string, category: Category) {
  try {
    const docRef = doc(categoriesCollection(userId), category.id);
    const categoryData = {
      ...category,
      userId, // Add userId to the document
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(docRef, categoryData);
    return category;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}

export async function getCategories(userId: string) {
  try {
    const q = query(categoriesCollection(userId), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt)
      } as Category;
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
}

export async function updateCategory(userId: string, category: Category) {
  try {
    const docRef = doc(categoriesCollection(userId), category.id);
    await setDoc(docRef, {
      ...category,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return category;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(userId: string, categoryId: string) {
  try {
    const docRef = doc(categoriesCollection(userId), categoryId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Resource Operations
export async function addResource(userId: string, resource: Resource) {
  try {
    const docRef = doc(resourcesCollection(userId), resource.id);
    const resourceData = {
      ...resource,
      userId, // Add userId to the document
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(docRef, resourceData);
    return resource;
  } catch (error) {
    console.error('Error adding resource:', error);
    throw error;
  }
}

export async function getResources(userId: string) {
  try {
    const q = query(resourcesCollection(userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt)
      } as Resource;
    });
  } catch (error) {
    console.error('Error getting resources:', error);
    throw error;
  }
}

export async function getResourcesByCategory(userId: string, categoryId: string) {
  try {
    const q = query(
      resourcesCollection(userId), 
      where("categoryId", "==", categoryId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt)
      } as Resource;
    });
  } catch (error) {
    console.error('Error getting resources by category:', error);
    throw error;
  }
}

export async function updateResource(userId: string, resource: Resource) {
  try {
    const docRef = doc(resourcesCollection(userId), resource.id);
    await setDoc(docRef, {
      ...resource,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return resource;
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
}

export async function deleteResource(userId: string, resourceId: string) {
  try {
    const docRef = doc(resourcesCollection(userId), resourceId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
} 