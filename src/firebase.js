import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAEEBMr4VZQKcZXhvdsHbGGghTGgv3ceik",
  authDomain: "chatapp-d9223.firebaseapp.com",
  projectId: "chatapp-d9223",
  storageBucket: "chatapp-d9223.appspot.com",
  messagingSenderId: "977613922654",
  appId: "1:977613922654:web:00156a57fb454c0f9cafcf",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
