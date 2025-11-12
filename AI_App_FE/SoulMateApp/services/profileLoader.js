// services/profileLoader.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { setProfileData, setStatus } from '../profile/profileSlice';

/**
 * Load user profile từ Firestore và cập nhật Redux store
 * @param {string} userId - UID của user
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Promise<Object|null>} - Profile data hoặc null nếu có lỗi
 */
export const loadUserProfile = async (userId, dispatch) => {
  if (!userId) {
    console.error('❌ userId is required');
    return null;
  }

  try {
    // Set status loading
    dispatch(setStatus('loading'));

    // Fetch dữ liệu từ Firestore
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error('❌ User not found in Firestore');
      dispatch(setStatus('error'));
      return null;
    }

    const userData = userSnap.data();

    // Chuẩn bị data để cập nhật Redux
    const profileData = {
      uid: userId,
      name: userData.name || '',
      avatar: userData.avatar || '',
      coverImage: userData.coverImage || '',
      age: userData.age || null,
      gender: userData.gender || '',
      height: userData.height || null,
      weight: userData.weight || null,
      job: userData.job || '',
      email: userData.email || '',
      password: userData.password || '',
      
      // Planets
      sun: userData.sun || '',
      moon: userData.moon || '',
      mercury: userData.mercury || '',
      venus: userData.venus || '',
      mars: userData.mars || '',
      jupiter: userData.jupiter || '',
      saturn: userData.saturn || '',
      uranus: userData.uranus || '',
      neptune: userData.neptune || '',
      pluto: userData.pluto || '',
      ascendant: userData.ascendant || '',
      descendant: userData.descendant || '',
      mc: userData.mc || '',
      ic: userData.ic || '',
      
      // Houses
      house1: userData.house1 || '',
      house2: userData.house2 || '',
      house3: userData.house3 || '',
      house4: userData.house4 || '',
      house5: userData.house5 || '',
      house6: userData.house6 || '',
      house7: userData.house7 || '',
      house8: userData.house8 || '',
      house9: userData.house9 || '',
      house10: userData.house10 || '',
      house11: userData.house11 || '',
      house12: userData.house12 || '',
      
      // Aspects
      conjunctionAspect: userData.conjunctionAspect || '',
      oppositionAspect: userData.oppositionAspect || '',
      trineAspect: userData.trineAspect || '',
      squareAspect: userData.squareAspect || '',
      sextileAspect: userData.sextileAspect || '',
      
      // Natal Chart
      natalChartImage: userData.natalChartImage || '',
      
      // Elemental Ratios
      fireRatio: userData.fireRatio || null,
      earthRatio: userData.earthRatio || null,
      airRatio: userData.airRatio || null,
      waterRatio: userData.waterRatio || null,
      
      // Other
      matchedHistory: userData.matchedHistory || [],
      status: 'success',
    };

    // Cập nhật Redux store
    dispatch(setProfileData(profileData));
    
    console.log('✅ Profile loaded successfully:', profileData.name);
    return profileData;

  } catch (error) {
    console.error(' ', error);
    dispatch(setStatus('error'));
    return null;
  }
};

/**
 * Refresh profile - alias cho loadUserProfile
 */
export const refreshUserProfile = loadUserProfile;