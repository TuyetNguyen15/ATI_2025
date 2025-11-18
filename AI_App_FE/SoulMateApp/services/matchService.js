// import { db } from "../config/firebaseConfig";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// // Lưu kết quả 5 người
// export const saveMatchResult = async (uid, type, users) => {
//   try {
//     const ref = doc(db, "matchResults", uid);

//     await setDoc(ref, {
//       [type]: {
//         users,
//         updatedAt: Date.now(),
//       }
//     }, { merge: true });

//     console.log("✔ Saved match result:", type);
//   } catch (e) {
//     console.log("❌ saveMatchResult error:", e);
//   }
// };

// // Lấy kết quả cũ
// export const getMatchResult = async (uid, type) => {
//   try {
//     const ref = doc(db, "matchResults", uid);
//     const snap = await getDoc(ref);

//     if (!snap.exists()) return null;

//     const data = snap.data();
//     return data[type] || null;
//   } catch (e) {
//     console.log("❌ getMatchResult error:", e);
//     return null;
//   }
// };
