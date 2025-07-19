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
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  },

  async getById(id: string) {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  },

  async create(product: Omit<Product, "id">) {
    const docRef = await addDoc(collection(db, "products"), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, product: Partial<Product>) {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, {
      ...product,
      updatedAt: Timestamp.now()
    });
  },

  async delete(id: string) {
    await deleteDoc(doc(db, "products", id));
  }
};

// Categories Service
export const categoryService = {
  async getAll() {
    const querySnapshot = await getDocs(collection(db, "categories"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async create(category: any) {
    const docRef = await addDoc(collection(db, "categories"), {
      ...category,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, category: any) {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, {
      ...category,
      updatedAt: Timestamp.now()
    });
  },

  async delete(id: string) {
    await deleteDoc(doc(db, "categories", id));
  }
};

// Orders Service
export const orderService = {
  async getAll() {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getById(id: string) {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  },

  async updateStatus(id: string, status: string) {
    const docRef = doc(db, "orders", id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
  },

  async create(order: any) {
    const docRef = await addDoc(collection(db, "orders"), {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }
};

// Storage Service for Images
export const storageService = {
  async uploadProductImage(file: File, productId: string) {
    const storageRef = ref(storage, `products/${productId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  },

  async deleteProductImage(imageUrl: string) {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }
};

// Analytics Service
export const analyticsService = {
  async getDashboardStats() {
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
  },

  async getTopProducts(limit: number = 5) {
    // This would normally aggregate from orders
    const products = await productService.getAll();
    return products.slice(0, limit);
  },

  async getRecentOrders(maxResults: number = 10) {
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
  }
};

// Coupons Service
export const couponService = {
  async getAll() {
    const querySnapshot = await getDocs(collection(db, "coupons"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Coupon[];
  },

  async create(coupon: any) {
    const docRef = await addDoc(collection(db, "coupons"), {
      ...coupon,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, coupon: any) {
    const docRef = doc(db, "coupons", id);
    await updateDoc(docRef, coupon);
  },

  async delete(id: string) {
    await deleteDoc(doc(db, "coupons", id));
  }
};

// Shipping Service
export const shippingService = {
  async getAll() {
    const querySnapshot = await getDocs(collection(db, "shipping"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async create(shipping: any) {
    const docRef = await addDoc(collection(db, "shipping"), {
      ...shipping,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, shipping: any) {
    const docRef = doc(db, "shipping", id);
    await updateDoc(docRef, shipping);
  },

  async delete(id: string) {
    await deleteDoc(doc(db, "shipping", id));
  }
};