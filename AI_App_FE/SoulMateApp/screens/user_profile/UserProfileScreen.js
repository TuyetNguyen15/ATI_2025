  import React, { useState, useEffect } from 'react';
  import { ScrollView, RefreshControl, View, Text } from 'react-native';
  import { doc, getDoc } from "firebase/firestore";
  import { db } from "../../config/firebaseConfig";

  import UserProfileHeader from './components/UserProfileHeader';
  import UserPersonalInfo from './components/UserPersonalInfo';

  export default function UserProfileScreen({ route, navigation }) {
    const uid = route?.params?.uid;

    console.log("👤 UserProfileScreen nhận uid:", uid);

    const [userData, setUserData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUser = async () => {
      if (!uid) {
        console.log("❌ Không có UID để load profile");
        return;
      }

      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        console.log("📄 Đã load user:", snap.data());
        setUserData(snap.data());
      } else {
        console.log("❌ Không tìm thấy user trong Firestore");
      }
    };

    useEffect(() => {
      fetchUser();
    }, [uid]);

    const onRefresh = async () => {
      setRefreshing(true);
      await fetchUser();
      setRefreshing(false);
    };

    // ⭐ NẾU CHƯA LOAD ĐƯỢC, ĐỪNG RENDER COMP BÊN DƯỚI
    if (!userData) {
      return <View style={{flex:1, backgroundColor:"#000"}} />;
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ backgroundColor: '#000' }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ff7bbf"
              colors={['#ff7bbf']}
            />
          }
        >
          <UserProfileHeader navigation={navigation} user={userData} />
          <UserPersonalInfo 
    navigation={navigation} 
    userData={userData} 
/>
        </ScrollView>
      </View>
    );
  }
