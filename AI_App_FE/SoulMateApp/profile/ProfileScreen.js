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