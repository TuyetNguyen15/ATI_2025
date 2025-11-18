import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function UserProfileHeader({ user }) {
  const { name, sun, avatar, coverImage } = user || {};

  const defaultCover = require('../../../assets/default_cover_image.jpg');
  const defaultAvatar = require('../../../assets/default_avatar.jpg');

  return (
    <View style={styles.container}>
      <View style={styles.coverContainer}>
        <Image
          source={coverImage ? { uri: coverImage } : defaultCover}
          style={styles.coverImage}
        />
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
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
