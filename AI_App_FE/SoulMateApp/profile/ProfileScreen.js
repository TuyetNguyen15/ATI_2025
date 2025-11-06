import React, { useState } from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import { auth } from '../firebaseConfig';
import { loadUserProfile } from '../services/profileLoader';

import ProfileHeader from './components/ProfileHeader';
import PersonalInfo from './components/PersonalInfo';
import NatalChart from './components/NatalChart';
import AstrologyDetails from './components/AstrologyDetails';
import MatchedHistory from './components/MatchedHistory';

export default function ProfileScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={{ backgroundColor: '#000' }}
        onScroll={closeMenu}
        scrollEventThrottle={16}
      >
        <ProfileHeader 
          navigation={navigation}
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
        />
        <Pressable onPress={closeMenu}>
          <PersonalInfo navigation={navigation} />
          <AstrologyDetails />
          <NatalChart />
          <MatchedHistory />
        </Pressable>
      </ScrollView>
      
      {/* Overlay để bắt tap bên ngoài */}
      {menuVisible && (
        <Pressable 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
          }}
          onPress={closeMenu}
        />
      )}
    </View>
  );
}