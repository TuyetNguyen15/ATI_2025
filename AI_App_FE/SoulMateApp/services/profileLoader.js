// services/profileLoader.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { store } from '../app/store';
import { setProfileData } from '../profile/profileSlice';

/**
 * Load user profile từ Firestore và cập nhật vào Redux
 * @param {string} uid - User ID từ Firebase Auth
 */
export async function loadUserProfile(uid) {
  try {
    console.log('📥 Loading user profile for UID:', uid);
    
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      console.warn('⚠️ User profile not found');
      return null;
    }
    
    const userData = userDoc.data();
    
    // Dispatch data to Redux
    store.dispatch(setProfileData({
      // Basic info
      name: userData.name || '',
      avatar: userData.avatar || '',
      coverImage: userData.coverImage || '',
      age: userData.age || null,
      gender: userData.gender || '',
      height: userData.height || null,
      weight: userData.weight || null,
      job: userData.job || '',
      email: userData.email || '',
      
      // Astrology data
      zodiac: userData.zodiac || '',
      
      // Planets
      ascendant: userData.ascendant || '',
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
      fireRatio: userData.fireRatio || 0,
      earthRatio: userData.earthRatio || 0,
      airRatio: userData.airRatio || 0,
      waterRatio: userData.waterRatio || 0,
    }));
    
    console.log('✅ Profile loaded successfully');
    return userData;
    
  } catch (error) {
    console.error('❌ Error loading profile:', error);
    throw error;
  }
}

export default loadUserProfile;