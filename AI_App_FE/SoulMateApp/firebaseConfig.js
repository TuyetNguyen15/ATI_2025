// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚙️ Config Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDnzNnNMDI__0gsGSg_RTR69m-RKUh9n04",
  authDomain: "astrolove-e53f8.firebaseapp.com",
  projectId: "astrolove-e53f8",
  storageBucket: "astrolove-e53f8.appspot.com",
  messagingSenderId: "558608123139",
  appId: "1:558608123139:web:1769fc52f3d9960a3b5536",
  measurementId: "G-PYD6JX4RJN",
};

// 🚀 Chỉ khởi tạo 1 lần (chống lỗi duplicate-app)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Khởi tạo Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
