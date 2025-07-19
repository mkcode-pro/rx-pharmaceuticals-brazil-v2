import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

// Initialize Firestore with proper settings for WebContainer environment
export const db = getFirestore(app);

export const storage = getStorage(app);

// Remove analytics completely to prevent issues
export const analytics = null;

export default app;