import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3g4XaZRvnjKzjIz3yY6kn_vukpvMDolI",
  authDomain: "fast-typer-2023.firebaseapp.com",
  projectId: "fast-typer-2023",
  storageBucket: "fast-typer-2023.appspot.com",
  messagingSenderId: "550391552050",
  appId: "1:550391552050:web:83142ec77ce2522680042b",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
