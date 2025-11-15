// services/profileLoader.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { setProfileData, setStatus } from '../profile/profileSlice';
import { getAuth } from "firebase/auth";

// ⭐ Hàm xử lý sạch toàn bộ Firestore Timestamp
const deepClean = (data) => {
  if (!data) return data;

  // Nếu là Timestamp Firestore
  if (data?.toDate) {
    return data.toDate().toISOString();
  }

  // Nếu là Array
  if (Array.isArray(data)) {
    return data.map(item => deepClean(item));
  }

  // Nếu là Object
  if (typeof data === "object") {
    const cleaned = {};
    for (let key in data) {
      cleaned[key] = deepClean(data[key]);
    }
    return cleaned;
  }

  // Kiểu dữ liệu khác
  return data;
};

export const loadUserProfile = () => {
  return async (dispatch) => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error('userId is required');
      return null;
    }

    try {
      dispatch(setStatus('loading'));

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error('User not found in Firestore');
        dispatch(setStatus('error'));
        return null;
      }

      const rawData = userSnap.data();

      // ⭐ Làm sạch toàn bộ Timestamp
      const cleanedData = deepClean(rawData);
      delete cleanedData.updatedAt;

      const profileData = {
        uid: userId,
        ...cleanedData,
        status: 'success',
      };

      dispatch(setProfileData(profileData));
      dispatch(setStatus('success'));

      console.log("✔ Profile loaded:", profileData.name);
      return profileData;

    } catch (error) {
      console.error("❌ Error loading profile:", error);
      dispatch(setStatus('error'));
      return null;
    }
  };
};

export const refreshUserProfile = loadUserProfile;
