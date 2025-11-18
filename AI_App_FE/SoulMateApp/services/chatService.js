import { db } from "../config/firebaseConfig";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * @param {string} myUid - UID người dùng đang đăng nhập
 * @param {string} myName - tên người dùng
 * @param {object} person - object của người muốn chat { uid, name }
 * @returns {Promise<{id: string, chatName: string}>}
 */
export async function openDirectChat(myUid, myName, person) {
  if (!myUid || !person?.uid) return null;

  // 1. Tìm chat đã tồn tại
  const chatQuery = query(
    collection(db, "chats"),
    where("type", "==", "direct"),
    where("members", "array-contains", myUid)
  );

  const snapshot = await getDocs(chatQuery);

  let existing = null;
  snapshot.forEach((doc) => {
    if (doc.data().members.includes(person.uid)) {
      existing = { id: doc.id, ...doc.data() };
    }
  });

  if (existing) {
    return { id: existing.id, chatName: person.name };
  }

  // 2. Nếu chưa có → tạo mới
  const newChatRef = await addDoc(collection(db, "chats"), {
    type: "direct",
    members: [myUid, person.uid],
    memberNames: [myName, person.name],
    lastMessageText: "Đã bắt đầu cuộc trò chuyện",
    lastMessageTimestamp: serverTimestamp(),
  });

  return { id: newChatRef.id, chatName: person.name };
}
