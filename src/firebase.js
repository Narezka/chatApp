import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEEBMr4VZQKcZXhvdsHbGGghTGgv3ceik",
  authDomain: "chatapp-d9223.firebaseapp.com",
  databaseURL: "https://chatapp-d9223-default-rtdb.firebaseio.com",
  projectId: "chatapp-d9223",
  storageBucket: "chatapp-d9223.appspot.com",
  messagingSenderId: "977613922654",
  appId: "1:977613922654:web:00156a57fb454c0f9cafcf",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
