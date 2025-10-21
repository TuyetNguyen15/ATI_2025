import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { resetProfile } from '../profileSlice';
import AppCircleButton from '../../components/AppCircleButton';

export default function ProfileHeader({ navigation }) {
  const { name, zodiac, avatar, coverImage } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const defaultCover = require('../../assets/default_cover_image.jpg');
  const defaultAvatar = require('../../assets/default_avatar.jpg');

  const [showMenu, setShowMenu] = useState(false);

  const handleEditCover = () => {
    setShowMenu(false);
    // TODO: mở modal chọn ảnh hoặc upload
  };

  const handleEditAvatar = () => {
    setShowMenu(false);
    // TODO: mở modal chọn ảnh hoặc upload
  };

  const handleLogout = () => {
    setShowMenu(false);
    
    Alert.alert(
      '🚪 Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              // 1. Đăng xuất Firebase Auth
              await signOut(auth);
              
              // 2. Reset Redux state về initial
              dispatch(resetProfile());
              
              // 3. Navigate về Login screen
              if (navigation) {
                navigation.replace('LoginScreen');
              }
              
              console.log('✅ Logout successful');
            } catch (error) {
              console.error('❌ Logout error:', error);
              Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        <Image
          source={coverImage ? { uri: coverImage } : defaultCover}
          style={styles.coverImage}
        />

        {/* Icon menu (3 chấm) */}
        <TouchableOpacity style={styles.moreIcon} onPress={() => setShowMenu(!showMenu)}>
          <MaterialIcons name="more-horiz" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Dropdown menu */}
        {showMenu && (
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItemRow} onPress={handleLogout}>
              <MaterialIcons name="logout" size={20} color="#ff4444" />
              <Text style={[styles.menuItem, { color: '#ff4444' }]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Nút chỉnh sửa ảnh bìa */}
        <AppCircleButton
          icon="edit"
          size={20}
          backgroundColor="#478ae8ff"
          color="#fff"
          onPress={handleEditCover}
          style={styles.editCoverBtn}
        />
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={avatar ? { uri: avatar } : defaultAvatar}
          style={styles.avatar}
        />
        <AppCircleButton
          icon="edit"
          size={18}
          backgroundColor="#478ae8ff"
          color="#fff"
          onPress={handleEditAvatar}
          style={styles.editAvatarBtn}
        />
      </View>

      {/* Info */}
      <Text style={styles.name}>{name || "Người dùng"}</Text>
      <Text style={styles.zodiac}>{zodiac || "Chưa cập nhật"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 20 },

  coverContainer: {
    position: 'relative',
    width: '100%',
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  moreIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  menuContainer: {
    position: 'absolute',
    top: 45,
    right: 18,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuItem: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  editCoverBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },

  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginTop: -60,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#fff',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 5,
  },

  name: { fontSize: 20, color: '#fff', fontWeight: '600', marginTop: 10 },
  zodiac: { fontSize: 16, color: '#999', marginTop: 5 },
});