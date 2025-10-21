import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { auth } from '../firebaseConfig';
import { loadUserProfile } from '../services/profileLoader';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfo from './components/PersonalInfo';
import NatalChart from './components/NatalChart';
import AstrologyDetails from './components/AstrologyDetails';
import MatchedHistory from './components/MatchedHistory';

export default function ProfileScreen({ navigation }) {
  const profileStatus = useSelector((state) => state.profile.status);

  useEffect(() => {
    // Load profile khi component mount (nếu chưa load)
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (user && profileStatus === 'idle') {
        try {
          await loadUserProfile(user.uid);
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadProfile();
  }, [profileStatus]);

  return (
    <ScrollView style={{ marginVertical: 30, backgroundColor: '#000' }}>
      <ProfileHeader navigation={navigation} />
      <PersonalInfo />
      <AstrologyDetails />
      <NatalChart />
      <MatchedHistory />
    </ScrollView>
  );
}