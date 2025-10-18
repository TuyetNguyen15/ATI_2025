import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function PersonalInfo() {
  const [activeTab, setActiveTab] = useState('personal');
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ✅ Lấy state từ Redux
  const { name, age, gender, height, weight, job, email, password } = useSelector((state) => state.profile);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeTab === 'personal' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['5%', '100%'],
  });

  // Cấu hình field + icon (gắn value từ Redux)
  const personalInfoItems = [
    { icon: 'badge', label: 'Tên', value: name || '' },
    { icon: 'cake', label: 'Tuổi', value: age || '' },
    { icon: 'wc', label: 'Giới tính', value: gender || '' },
    { icon: 'straighten', label: 'Chiều cao', value: height != null ? `${height} cm` : '' },
    { icon: 'fitness-center', label: 'Cân nặng', value: weight != null ? `${weight} kg` : '' },
    { icon: 'school', label: 'Công việc', value: job || '' },
  ];

  const securityInfoItems = [
    { icon: 'email', label: 'Email', value: email || '' },
    { icon: 'lock', label: 'Mật khẩu', value: password || '********' },
  ];

  const renderInfo = (items) =>
    items.map((item, index) => (
      <View key={index} style={styles.infoRow}>
        <MaterialIcons name={item.icon} size={20} color="#478ae8ff" style={styles.infoIcon} />
        <Text style={styles.infoLabel}>{item.label}:</Text>
        <Text style={styles.infoValue}>{item.value}</Text>
      </View>
    ));

  const renderContent = () => {
    const items = activeTab === 'personal' ? personalInfoItems : securityInfoItems;
    const title = activeTab === 'personal' ? 'Thông tin cá nhân' : 'Thông tin bảo mật';

    return (
      <View style={styles.content}>
        <Text style={styles.titleText}>{title}</Text>
        {renderInfo(items)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Switch Tabs */}
      <View style={styles.switchWrapper}>
        <Animated.View style={[styles.switchIndicator, { transform: [{ translateX }] }]} />
        <View style={styles.switchRow}>
          <TouchableOpacity onPress={() => setActiveTab('personal')} style={styles.switchItem}>
            <MaterialIcons
              name="person"
              size={26}
              color={activeTab === 'personal' ? '#478ae8ff' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('security')} style={styles.switchItem}>
            <MaterialIcons
              name="security"
              size={26}
              color={activeTab === 'security' ? '#478ae8ff' : '#fff'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 360,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    alignSelf: 'center',
  },
  switchWrapper: {
    position: 'relative',
    height: 60,
    justifyContent: 'center',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  switchItem: {
    padding: 8,
    zIndex: 2,
  },
  switchIndicator: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    width: '50%',
    height: 5,
    borderRadius: 50,
    backgroundColor: '#478ae8ff',
  },
  content: {
    marginTop: 10,
    paddingHorizontal: 18,
  },
  titleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    color: '#ccc',
    fontSize: 16,
    width: 90,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    flexShrink: 1,
  },
});
