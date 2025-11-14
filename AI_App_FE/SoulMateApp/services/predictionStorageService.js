// import { db, auth } from "../firebaseConfig";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// export async function getPredictionCache(date) {
//   const user = auth.currentUser;
//   if (!user) throw new Error("User chưa đăng nhập");

//   const ref = doc(db, `users/${user.uid}/predictions/${date}`);
//   const snap = await getDoc(ref);
//   return snap.exists() ? snap.data() : null;
// }

// export async function savePrediction(date, data) {
//   const user = auth.currentUser;
//   if (!user) throw new Error("User chưa đăng nhập");

//   const ref = doc(db, `users/${user.uid}/predictions/${date}`);
//   await setDoc(ref, { ...data, createdAt: new Date().toISOString() });
//   console.log("💾 Saved prediction in users:", date);
// }
