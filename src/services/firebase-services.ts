import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Product, Coupon } from "@/types";

// Helper function to handle Firebase operations safely in WebContainer
const safeFirebaseOperation = async <T>(operation: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.warn('Firebase operation failed, using fallback:', error);
    return fallback;
  }
};

// Add error handling wrapper for all Firebase operations
const handleFirebaseError = (error: any) => {
  console.warn('Firebase operation failed, using offline mode:', error.message);
  return null;
};

// Wrap Firebase calls with error handling
const safeFirebaseCall = async (operation: () => Promise<any>) => {
  try {
    return await operation();
  } catch (error: any) {
    if (error.code === 'unavailable' || error.message.includes('No connection established')) {
      return handleFirebaseError(error);
    }
    throw error;
  }
};

// Products Service
export const productService = {
  async getAll() {
    return await safeFirebaseCall(async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    }) || [];
  },

  async getById(id: string) {
    return await safeFirebaseCall(async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    });
  },

  async create(product: Omit<Product, "id">) {
    return await safeFirebaseCall(async () => {
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    });
  },

  async update(id: string, product: Partial<Product>) {
    return await safeFirebaseCall(async () => {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        ...product,
        updatedAt: Timestamp.now()
      });
    });
  },

  async delete(id: string) {
    return await safeFirebaseCall(async () => {
      await deleteDoc(doc(db, "products", id));
    });
  }
};

// Categories Service
export const categoryService = {
  async getAll() {
    return await safeFirebaseCall(async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }) || [];
  },

  async create(category: any) {
    return await safeFirebaseCall(async () => {
      const docRef = await addDoc(collection(db, "categories"), {
        ...category,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    });
  },

  async update(id: string, category: any) {
    return await safeFirebaseCall(async () => {
      const docRef = doc(db, "categories", id);
      await updateDoc(docRef, {
        ...category,
        updatedAt: Timestamp.now()
      });
    });
  },

  async delete(id: string) {
    return await safeFirebaseCall(async () => {
      await deleteDoc(doc(db, "categories", id));
    });
  }
};

// Orders Service
export const orderService = {
  async getAll() {
    return await safeFirebaseCall(async () => {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }) || [];
  },

  async getById(id: string) {
    return await safeFirebaseCall(async () => {
      const docRef = doc(db, "orders", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    });
  },

  async updateStatus(id: string, status: string) {
    return await safeFirebaseCall(async () => {
      const docRef = doc(db, "orders", id);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now()
      });
    });
  },

  async create(order: any) {
    return await safeFirebaseCall(async () => {
      const docRef = await addDoc(collection(db, "orders"), {
        ...order,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    });
  }
};

// Storage Service for Images
export const storageService = {
  async uploadProductImage(file: File, productId: string) {
    return await safeFirebaseCall(async () => {
      const storageRef = ref(storage, `products/${productId}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    });
  },

  async deleteProductImage(imageUrl: string) {
    return await safeFirebaseCall(async () => {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    });
  }
};

// Analytics Service
export const analyticsService = {
  async getDashboardStats() {
    return await safeFirebaseCall(async () => {
      // Get today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const ordersQuery = query(
        collection(db, "orders"),
        where("createdAt", ">=", Timestamp.fromDate(today))
      );
      const todayOrders = await getDocs(ordersQuery);

      // Get total products
      const products = await getDocs(collection(db, "products"));

      // Get total categories
      const categories = await getDocs(collection(db, "categories"));

      // Calculate revenue (mock for now)
      let todayRevenue = 0;
      todayOrders.docs.forEach(doc => {
        const order = doc.data();
        todayRevenue += order.total || 0;
      });

      return {
        totalProducts: products.size,
        totalCategories: categories.size,
        todayOrders: todayOrders.size,
        todayRevenue,
        totalOrders: (await getDocs(collection(db, "orders"))).size
      };
    }) || {
      totalProducts: 0,
      totalCategories: 0,
      todayOrders: 0,
      todayRevenue: 0,
      totalOrders: 0
    };
  },

  async getTopProducts(limit: number = 5) {
    return await safeFirebaseCall(async () => {
      // This would normally aggregate from orders
      const products = await productService.getAll();
      return products.slice(0, limit);
    }) || [];
  },

  async getRecentOrders(maxResults: number = 10) {
    return await safeFirebaseCall(async () => {
      const q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        limit(maxResults)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }) || [];
  }
};

// Coupons Service
export const couponService = {
  async getAll() {
    return await safeFirebaseCall(async () => {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Coupon[];
    }) || [];
  },

  async create(coupon: any) {
    return await safeFirebaseCall(async () => {
      const docRef = await addDoc(collection(db, "coupons"), {
        ...coupon,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    });
  },

  async update(id: string, coupon: any) {
    return await safeFirebaseCall(async () => {
      const docRef = doc(db, "coupons", id);
      await updateDoc(docRef, coupon);
    });
  },

  async delete(id: string) {
    return await safeFirebaseCall(async () => {
      await deleteDoc(doc(db, "coupons", id));
    });
  }
};

// Shipping Service
export const shippingService = {
  async getAll() {
    return await safeFirebaseCall(async () => {
      const querySnapshot = await getDocs(collection(db, "shipping"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }) || [];
  },

  async create(shipping: any) {
    return await safeFirebaseCall(async () => {
      const docRef = await addDoc(collection(db, "shipping"), {
        ...shipping,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    });
  },

  async update(id: string, shipping: any) {
    return await safeFirebaseCall(async () => {
      const docRef = doc(db, "shipping", id);
      await updateDoc(docRef, shipping);
    });
  },

  async delete(id: string) {
    return await safeFirebaseCall(async () => {
      await deleteDoc(doc(db, "shipping", id));
    });
  }
};