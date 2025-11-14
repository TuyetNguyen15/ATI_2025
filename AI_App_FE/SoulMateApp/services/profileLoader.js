// services/profileLoader.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { setProfileData, setStatus } from '../profile/profileSlice';

export const loadUserProfile = (userId) => {
  return async (dispatch) => {
    if (!userId) {
      console.error('userId is required');
      return null;
    }

    try {
      // Set loading
      dispatch(setStatus('loading'));

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error('User not found in Firestore');
        dispatch(setStatus('error'));
        return null;
      }

      const userData = userSnap.data();

      const profileData = {
        uid: userId,
        ...userData,
        status: 'success',
      };

      dispatch(setProfileData(profileData));
      dispatch(setStatus('success'));

      console.log("Profile loaded:", profileData.name);
      return profileData;

    } catch (error) {
      console.error("Error loading profile:", error);
      dispatch(setStatus('error'));
      return null;
    }
  };
};

export const refreshUserProfile = loadUserProfile;
