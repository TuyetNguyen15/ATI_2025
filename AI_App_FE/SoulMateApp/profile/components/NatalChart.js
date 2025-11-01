import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';

export default function NatalChart() {
  const navigation = useNavigation();

  // Lấy ảnh từ Redux store
  const { natalChartImage } = useSelector((state) => state.profile);
  const defaultNatalChartImage = require('../../assets/default_natal_chart_image.jpg');

  return (
    <View style={styles.container}>
      {/* Header: title + button */}
      <View style={styles.header}>
        <Text style={styles.title}>Bản đồ sao</Text>
        <AppButton
          buttonTitle="Xem phân tích"
          color='#478ae8'
          fontSize={14}
          backgroundColor="#000"
          borderColor='#478ae8'
          borderWidth={1}
          borderRadius={22}
          onPress={() => navigation.navigate('NatalChartAnalysis')}
        />
      </View>

      {/* Image */}
      <Image
        source={
          natalChartImage
            ? { uri: natalChartImage }
            : defaultNatalChartImage
        }
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 22,
    paddingHorizontal: 32,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  image: {
    width: '100%',
    height: 600,
    borderRadius: 16,
  },
});
