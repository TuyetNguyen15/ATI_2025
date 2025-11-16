// src/components/MatchedHistory.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const matchedData = [
  {
    id: '1',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    name: 'Chi Nguyễn',
    zodiac: 'Sư Tử',
    duration: '2 tháng',
  },
  {
    id: '2',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    name: 'Minh Trần',
    zodiac: 'Bọ Cạp',
    duration: '1 ngày',
  },
  {
    id: '3',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    name: 'Hương Phạm',
    zodiac: 'Cự Giải',
    duration: '3 giờ',
  },
  {
    id: '4',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    name: 'Tuấn Lê',
    zodiac: 'Thiên Bình',
    duration: '1 năm',
  },
  {
    id: '5',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    name: 'Trang Đỗ',
    zodiac: 'Xử Nữ',
    duration: '6 tháng',
  },
];

const MatchedHistory = () => {
  const handleSeeMore = () => {
    // Xử lý khi nhấn vào "Xem thêm" (điều hướng sang màn hình chi tiết)
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lịch sử ghép đôi</Text>
        <TouchableOpacity onPress={handleSeeMore}>
          <Text style={styles.seeMore}>Xem thêm</Text>
        </TouchableOpacity>
      </View>

      {matchedData.map((item) => (
        <View key={item.id} style={styles.cardWrapper}>
          <LinearGradient
            colors={['#ff7bbf', '#b36dff', '#ff7bbf']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.card}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.zodiac}>{item.zodiac}</Text>
              </View>
              <Text style={styles.duration}>{item.duration}</Text>
            </View>
          </LinearGradient>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    marginBottom: 40,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeMore: {
    fontSize: 16,
    color: '#ff7bbf',
    fontWeight: 'bold',
  },
  cardWrapper: {
    marginBottom: 12,
    // Shadow blur effect (glowing)
    shadowColor: '#ff7acb',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  gradientBorder: {
    borderRadius: 12,
    padding: 2, // Độ dày viền gradient
  },
  card: {
    flexDirection: 'row',
    padding: 22,
    backgroundColor: '#161616ff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  zodiac: {
    fontSize: 16,
    color: '#abababff',
    marginTop: 2,
  },
  duration: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MatchedHistory;