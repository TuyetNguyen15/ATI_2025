import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getAICache, saveAIPrediction } from "./aiPredictionStorageService";
import { getPredictionCache, savePrediction } from "./predictionStorageService";
import { generatePrediction } from "./geminiPredictionService";

export async function getDailyPrediction() {
  const user = auth.currentUser;
  if (!user) throw new Error("User chưa đăng nhập");

  const today = new Date().toISOString().split("T")[0];

  // 1️⃣ Ưu tiên lấy từ AI cache (nhanh nhất)
  const aiCache = await getAICache(today);
  if (aiCache) {
    console.log("⚡ Load từ ai_predictions");
    return aiCache;
  }

  // 2️⃣ Check cache trong user/predictions
  const userCache = await getPredictionCache(today);
  if (userCache) {
    console.log("📦 Load từ users cache");
    return userCache;
  }

  // 3️⃣ Nếu chưa có → gọi Gemini
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const userData = snap.exists() ? snap.data() : {};

  const prediction = await generatePrediction(userData);

  // 4️⃣ Lưu cả hai nơi
  await Promise.all([
    saveAIPrediction(today, prediction),
    savePrediction(today, prediction),
  ]);

  return prediction;
}
