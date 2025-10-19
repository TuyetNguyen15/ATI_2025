import React from 'react';
import { ScrollView } from 'react-native';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfo from './components/PersonalInfo';
import NatalChart from './components/NatalChart';
import AstrologyDetails from './components/AstrologyDetails';
import MatchedHistory from './components/MatchedHistory';

export default function ProfileScreen() {
  return (
    <ScrollView style={{ marginVertical: 30, backgroundColor: '#000' }}>
      <ProfileHeader />
      <PersonalInfo />
      <AstrologyDetails />
      <NatalChart />
      <MatchedHistory />
    </ScrollView>
  );
}