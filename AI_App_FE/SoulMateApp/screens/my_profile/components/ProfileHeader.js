import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import { auth } from '../../../config/firebaseConfig';
import { resetProfile } from '../profileSlice';

export default function ProfileHeader({ navigation, menuVisible, setMenuVisible }) {
  const { name, sun, avatar, coverImage } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const defaultCover = require('../../../assets/default_cover_image.jpg');
  const defaultAvatar = require('../../../assets/default_avatar.jpg');

  const handleEditCover = () => {
    setMenuVisible(false);
    navigation.navigate('UpdateAvatar', { imageType: 'coverImage' });
  };

  const handleEditAvatar = () => {
    setMenuVisible(false);
    navigation.navigate('UpdateAvatar', { imageType: 'avatar' });
  };

  const handleLogout = () => {
    console.log('🔴 handleLogout được gọi'); // Debug log
    setMenuVisible(false);
    
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
              await signOut(auth);
              dispatch(resetProfile());
              
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

  const toggleMenu = () => {
    console.log('🔵 toggleMenu - menuVisible:', !menuVisible); // Debug log
    setMenuVisible(!menuVisible);
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
        <TouchableOpacity 
          style={styles.moreIcon} 
          onPress={toggleMenu}
          activeOpacity={0.7}
        >
          <MaterialIcons name="more-horiz" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Nút chỉnh sửa ảnh bìa - Gradient Button */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleEditCover}
          style={styles.editCoverBtn}
        >
          <LinearGradient
            colors={['#ff7bbf', '#b36dff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Dropdown menu với Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            console.log('🟡 Overlay pressed - closing menu');
            setMenuVisible(false);
          }}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItemRow} 
              onPress={(e) => {
                e.stopPropagation();
                console.log('🟢 Logout button pressed');
                handleLogout();
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="logout" size={20} color="#ff4444" />
              <Text style={[styles.menuItem, { color: '#ff4444' }]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={avatar ? { uri: avatar } : defaultAvatar}
          style={styles.avatar}
        />
        
        {/* Nút chỉnh sửa avatar - Gradient Button */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleEditAvatar}
          style={styles.editAvatarBtn}
        >
          <LinearGradient
            colors={['#ff7bbf', '#b36dff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <MaterialIcons name="edit" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <Text style={styles.name}>{name || "Người dùng"}</Text>
      <Text style={styles.zodiac}>{sun || "Chưa cập nhật"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center', 
    marginBottom: 20 
  },

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 55,
    paddingRight: 18,
  },
  menuContainer: {
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
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
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

  // Gradient button styles
  gradientButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff7acb',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },

  name: { 
    fontSize: 20, 
    color: '#fff', 
    fontWeight: '600', 
    marginTop: 10 
  },
  zodiac: { 
    fontSize: 16, 
    color: '#999', 
    marginTop: 5 
  },
});