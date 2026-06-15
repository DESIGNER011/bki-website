// ============================================================
//  client/src/firebase.js  —  Firebase configuration and SDKs
// ============================================================
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Safe environment fallback configuration
const firebaseConfig = {
  apiKey:             import.meta.env.VITE_FIREBASE_API_KEY || "dummy-api-key-replace-in-env",
  authDomain:         import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bki-karate.firebaseapp.com",
  projectId:          import.meta.env.VITE_FIREBASE_PROJECT_ID || "bki-karate",
  storageBucket:      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bki-karate.appspot.com",
  messagingSenderId:  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId:              import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:00000000000000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

export default app;
