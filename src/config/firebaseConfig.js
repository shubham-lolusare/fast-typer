import { initializeApp } from "firebase/app";

// authentication module
import { getAuth } from "firebase/auth";

// firebase fiestore
import { getFirestore } from "firebase/firestore";

// firebase storage
import { getStorage } from "firebase/storage";

// firebase config files
const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY}`,
  authDomain: `${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}`,
  projectId: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${import.meta.env.VITE_FIREBASE_MESSAGING_ID}`,
  appId: `${import.meta.env.VITE_FIREBASE_APP_ID}`,
};

// initializing firebase app
export const app = initializeApp(firebaseConfig);

// initializing firebase authentication
export const auth = getAuth(app);

// intializing firebase firestore
export const db = getFirestore(app);

// initializing firebase storage
export const storage = getStorage(app);
