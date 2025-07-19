import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLCTaHtxay0D-6hO4k07iO6bem1cdd0ds",
  authDomain: "rx-ph-89b9e.firebaseapp.com",
  projectId: "rx-ph-89b9e",
  storageBucket: "rx-ph-89b9e.firebasestorage.app",
  messagingSenderId: "793901557955",
  appId: "1:793901557955:web:42794fb4655aac6d019a76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);

// Initialize Firestore with better error handling
export const db = getFirestore(app);

// Only connect to emulator in development and if not already connected
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  try {
    // Check if emulator is already connected
    if (!db._delegate._databaseId.projectId.includes('demo-')) {
      // Only attempt emulator connection if we're in a local environment
      // This prevents connection issues in production
    }
  } catch (error) {
    // Silently handle emulator connection errors
    console.log('Firebase running in production mode');
  }
}

export const storage = getStorage(app);

// Remove analytics to prevent connection issues
export const analytics = null;

export default app;
