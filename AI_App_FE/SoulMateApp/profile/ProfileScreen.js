import React from 'react';
import { ScrollView } from 'react-native';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfo from './components/PersonalInfo';
import PlanetsInfo from './components/PlanetsInfo';
import HousesInfo from './components/HousesInfo';
import AspectsInfo from './components/AspectsInfo';
import NatalChart from './components/NatalChart';
// import FunctionRow from './components/FunctionRow';
import MatchedHistory from './components/MatchedHistory';

export default function ProfileScreen() {
  return (
    <ScrollView style={{ marginVertical: 30, backgroundColor: '#000' }}>
      <ProfileHeader />
      <PersonalInfo />
      <PlanetsInfo />
      <HousesInfo />
      <AspectsInfo />
      <NatalChart />
      <MatchedHistory />
      {/*
      <FunctionRow />
       */}
    </ScrollView>
  );
}
