import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Support for global variables (for custom deployment scenarios)
// Falls back to environment variables
const getFirebaseConfig = (): FirebaseConfig | null => {
  // Check for global __firebase_config first (for custom deployments)
  if (typeof window !== "undefined" && (window as any).__firebase_config) {
    const config = (window as any).__firebase_config;
    if (config.apiKey && config.projectId) {
      return config;
    }
  }

  // Otherwise use environment variables
  const envConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  };

  // Validate that we have at least the required fields
  if (!envConfig.apiKey || !envConfig.projectId) {
    return null;
  }

  return envConfig;
};

const firebaseConfig = getFirebaseConfig();

// Initialize Firebase only if we have valid config
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

if (firebaseConfig) {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize Firebase services
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
  storageInstance = getStorage(app);
} else {
  // In development, log a helpful error message
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "⚠️ Firebase configuration is missing. Please set up your Firebase credentials in .env.local file.\n" +
        "Required variables:\n" +
        "  - NEXT_PUBLIC_FIREBASE_API_KEY\n" +
        "  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\n" +
        "  - NEXT_PUBLIC_FIREBASE_PROJECT_ID\n" +
        "  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\n" +
        "  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\n" +
        "  - NEXT_PUBLIC_FIREBASE_APP_ID"
    );
  }
}

// Export Firebase services (may be null if config is missing)
export const auth: Auth | null = authInstance;
export const db: Firestore | null = dbInstance;
export const storage: FirebaseStorage | null = storageInstance;

// Export app instance and config for reference
export { app };
export default app;
