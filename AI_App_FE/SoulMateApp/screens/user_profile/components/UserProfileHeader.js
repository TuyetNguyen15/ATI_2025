import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function UserProfileHeader({ user, navigation }) {
  const { name, sun, avatar, coverImage } = user || {};

  const defaultCover = require('../../../assets/default_cover_image.jpg');
  const defaultAvatar = require('../../../assets/default_avatar.jpg');

  const handleGoBack = () => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.coverContainer}>
        <Image
          source={coverImage ? { uri: coverImage } : defaultCover}
          style={styles.coverImage}
        />
        
        {/* Nút Back */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarContainer}>
        <Image
          source={avatar ? { uri: avatar } : defaultAvatar}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.name}>{name || "Người dùng"}</Text>
      <Text style={styles.zodiac}>{sun || "Chưa cập nhật"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coverContainer: {
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  avatarContainer: {
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
  name: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginTop: 10,
  },
  zodiac: {
    fontSize: 16,
    color: '#999',
    marginTop: 5,
  },
});