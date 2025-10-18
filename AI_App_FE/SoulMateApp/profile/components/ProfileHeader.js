import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function ProfileHeader() {
  const { name, zodiac, avatar, coverPage } = useSelector((state) => state.profile);

  const defaultCover = require('../../assets/default_cover_image.png');
  const defaultAvatar = require('../../assets/default_avatar.jpg');

  return (
    <View style={styles.container}>
      <Image
  source={coverPage ? { uri: coverPage } : defaultCover}
  style={styles.coverPage}
/>
<Image
  source={avatar ? { uri: avatar } : defaultAvatar}
  style={styles.avatar}
/>

      <Text style={styles.name}>{name || ""}</Text>
      <Text style={styles.zodiac}>{zodiac || "hhhh"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 10},
  coverPage: { width: '100%', height: 200, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatar: { width: 130, height: 130, borderRadius: 100, marginTop: -60, borderWidth: 2, borderColor: '#fff' },
  name: { fontSize: 20, color: '#fff', fontWeight: '600', marginTop: 10 },
  zodiac: { fontSize: 16, color: '#999', marginTop: 5 },
});
