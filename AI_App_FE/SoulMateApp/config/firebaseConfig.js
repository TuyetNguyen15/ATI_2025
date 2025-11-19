import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDnzNnNMDI__0gsGSg_RTR69m-RKUh9n04",
  authDomain: "astrolove-e53f8.firebaseapp.com",
  databaseURL: "https://astrolove-e53f8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "astrolove-e53f8",
  storageBucket: "astrolove-e53f8.firebasestorage.app",
  messagingSenderId: "558608123139",
  appId: "1:558608123139:web:1769fc52f3d9960a3b5536",
  measurementId: "G-PYD6JX4RJN"
};

// Chỉ khởi tạo 1 lần
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Khởi tạo Auth, Firestore & Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;