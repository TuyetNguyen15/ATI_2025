import React from 'react';
import { ScrollView } from 'react-native';
import ProfileHeader from './components/ProfileHeader';
// import PersonalInfo from './components/PersonalInfo';
// import ZodiacInfo from './components/ZodiacInfo';
// import FunctionRow from './components/FunctionRow';
// import MatchedHistory from './components/MatchedHistory';

export default function ProfileScreen() {
  return (
    <ScrollView style={{ marginTop: 30, backgroundColor: '#000' }}>
      <ProfileHeader />
      {/* <PersonalInfo />
      <ZodiacInfo />
      <FunctionRow />
      <MatchedHistory /> */}
    </ScrollView>
  );
}
