import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, View, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../../config/firebaseConfig';
import { loadUserProfile } from '../../services/profileLoader';
import { useRefresh } from '../../hook/useRefresh';

import UserProfileHeader from './components/UserProfileHeader';
import UserPersonalInfo from './components/UserPersonalInfo';

export default function UserProfileScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const dispatch = useDispatch();
  
  // Lấy status từ Redux để kiểm tra trạng thái loading
  const profileStatus = useSelector((state) => state.profile.status);

  // ✨ Sử dụng custom hook để xử lý refresh
  const { refreshing, onRefresh } = useRefresh(async () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      // await loadUserProfile(userId, dispatch);
      await dispatch(loadUserProfile(userId));
    }
  });

  // Load profile khi component mount
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId && profileStatus === 'idle') {
      loadUserProfile(userId, dispatch);
    }
  }, [dispatch, profileStatus]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={{ backgroundColor: '#000' }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            // Tùy chỉnh màu sắc cho iOS và Android
            tintColor="#ff7bbf" // iOS
            colors={['#ff7bbf', '#b36dff']} // Android
            progressBackgroundColor="#1a1a1a" // Android
            title="Đang tải lại..." // iOS
            titleColor="#ff7bbf" // iOS
          />
        }
      >
        <UserProfileHeader 
          navigation={navigation}
        />
        <UserPersonalInfo navigation={navigation} />
      </ScrollView>

    </View>
  );
}