import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

export default function PersonalInfo({ navigation }) {
  const [activeTab, setActiveTab] = useState('personal');
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ✅ Lấy state từ Redux (thêm sun, bỏ name)
  const { relationshipStatus , age, gender, height, weight, job, email, password } = useSelector((state) => state.profile);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeTab === 'personal' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['5%', '126%'],
  });

  // Cấu hình field + icon (gắn value từ Redux)
  const personalInfoItems = [
    { icon: 'favorite', label: 'Trạng thái', value: relationshipStatus || 'Chưa cập nhật', fullWidth: true },
    { icon: 'cake', label: 'Tuổi', value: age || 'Chưa cập nhật', halfWidth: true },
    { icon: 'wc', label: 'Giới tính', value: gender || 'Chưa cập nhật', halfWidth: true },
    { icon: 'straighten', label: 'Chiều cao', value: height != null ? `${height} m` : 'Chưa cập nhật', halfWidth: true },
    { icon: 'fitness-center', label: 'Cân nặng', value: weight != null ? `${weight} kg` : 'Chưa cập nhật', halfWidth: true },
    { icon: 'work', label: 'Công việc', value: job || 'Chưa cập nhật', fullWidth: true },
  ];

  const securityInfoItems = [
    { icon: 'email', label: 'Email', value: email || 'Fetch lỗi', fullWidth: true },
    { icon: 'lock', label: 'Mật khẩu', value: password || '********', fullWidth: true },
  ];

  const handleEdit = () => {
    navigation.navigate('EditProfile', { editType: activeTab });
  };

  const renderInfoCard = (item) => (
    <View style={[styles.infoRow, item.halfWidth && styles.halfWidth]}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={item.icon} size={22} color="#ff7bbf" />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{item.label}</Text>
        <Text style={styles.infoValue}>{item.value}</Text>
      </View>
    </View>
  );

  const renderInfo = (items) => {
    const rows = [];
    let i = 0;
    
    while (i < items.length) {
      const currentItem = items[i];
      
      if (currentItem.fullWidth) {
        // Full width item
        rows.push(
          <View key={i} style={styles.rowContainer}>
            {renderInfoCard(currentItem)}
          </View>
        );
        i++;
      } else if (currentItem.halfWidth && i + 1 < items.length && items[i + 1].halfWidth) {
        // Two half width items in a row
        rows.push(
          <View key={i} style={styles.rowContainer}>
            {renderInfoCard(currentItem)}
            {renderInfoCard(items[i + 1])}
          </View>
        );
        i += 2;
      } else {
        // Single half width item (fallback)
        rows.push(
          <View key={i} style={styles.rowContainer}>
            {renderInfoCard(currentItem)}
          </View>
        );
        i++;
      }
    }
    
    return rows;
  };

  const renderContent = () => {
    const items = activeTab === 'personal' ? personalInfoItems : securityInfoItems;
    const title = activeTab === 'personal' ? 'Thông tin cá nhân' : 'Thông tin bảo mật';

    return (
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>{title}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={handleEdit}>
            <LinearGradient
              colors={['#ff7bbf', '#b36dff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.editButton}
            >
              <MaterialIcons name="edit" size={18} color="#fff" />
              <Text style={styles.editButtonText}>Chỉnh sửa</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {renderInfo(items)}
      </View>
    );
  };

  return (
    <View style={styles.containerWrapper}>
      {/* Gradient Border với Shadow Blur */}
      <LinearGradient
        colors={['#ff7bbf', '#b36dff', '#ff7bbf']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={styles.container}>
          {/* Switch Tabs */}
          <View style={styles.switchWrapper}>
            <Animated.View style={[styles.switchIndicator, { transform: [{ translateX }] }]} />
            <View style={styles.switchRow}>
              <TouchableOpacity onPress={() => setActiveTab('personal')} style={styles.switchItem}>
                <MaterialIcons
                  name="person"
                  size={26}
                  color={activeTab === 'personal' ? '#ff7bbf' : '#999'}
                />
                <Text style={[styles.switchLabel, activeTab === 'personal' && styles.switchLabelActive]}>
                  Cá nhân
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('security')} style={styles.switchItem}>
                <MaterialIcons
                  name="security"
                  size={26}
                  color={activeTab === 'security' ? '#ff7bbf' : '#999'}
                />
                <Text style={[styles.switchLabel, activeTab === 'security' && styles.switchLabelActive]}>
                  Bảo mật
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          {renderContent()}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 32,
    // Shadow blur effect (glowing)
    shadowColor: '#ff7acb',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
  },
  gradientBorder: {
    borderRadius: 16,
    padding: 2, // Độ dày viền gradient
  },
  container: {
    minHeight: 400,
    backgroundColor: '#000',
    borderRadius: 14,
    padding: 20,
  },
  switchWrapper: {
    position: 'relative',
    height: 80,
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  switchItem: {
    padding: 12,
    zIndex: 2,
    alignItems: 'center',
    gap: 6,
  },
  switchLabel: {
    fontSize: 13,
    color: '#999',
    fontWeight: '600',
  },
  switchLabelActive: {
    color: '#ff7bbf',
  },
  switchIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '5%',
    width: '40%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ff7bbf',
  },
  content: {
    marginTop: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  titleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#ff7acb',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  infoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#0a0a0a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  halfWidth: {
    flex: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 123, 191, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: '#999',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});