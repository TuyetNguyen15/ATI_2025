// src/components/MatchedHistory.js
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

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
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.zodiac}>{item.zodiac}</Text>
      </View>
      <Text style={styles.duration}>{item.duration}</Text>
    </View>
  );

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

      <FlatList
        data={matchedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
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
    color: '#478ae8',
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    padding: 22,
    backgroundColor: '#000000ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#478ae8',
    marginBottom: 12,
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
