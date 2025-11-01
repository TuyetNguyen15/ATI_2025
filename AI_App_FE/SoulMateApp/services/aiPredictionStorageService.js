import { db, auth } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function getAICache(date) {
  const user = auth.currentUser;
  if (!user) throw new Error("User chưa đăng nhập");

  const docId = `${user.uid}_${date}`;
  const ref = doc(db, "ai_predictions", docId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveAIPrediction(date, data) {
  const user = auth.currentUser;
  if (!user) throw new Error("User chưa đăng nhập");

  const docId = `${user.uid}_${date}`;
  const ref = doc(db, "ai_predictions", docId);
  await setDoc(ref, {
    ...data,
    userId: user.uid,
    createdAt: new Date().toISOString(),
  });
  console.log("⚡ Saved AI cache:", docId);
}
