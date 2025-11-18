import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export async function blockUser(myUid, targetUid) {
  try {
    const userRef = doc(db, "users", myUid);

    await updateDoc(userRef, {
      blockedUsers: arrayUnion(targetUid),
    });

    return true;
  } catch (err) {
    console.log("🔥 Block user error:", err);
    return false;
  }
}
