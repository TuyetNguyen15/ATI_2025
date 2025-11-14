import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Chào mừng bạn đến với Duyên.',
    text: 'Công cụ kết nối tình yêu duy nhất sử dụng sức mạnh Khoa học chiêm tinh.',
  },
  {
    key: '2',
    title: 'Giải mã Bản Đồ Sao cá nhân.',
    text: 'Chỉ cần nhập ngày, giờ, và nơi sinh chính xác để hiểu rõ về ngôn ngữ tình yêu và nhu cầu cảm xúc sâu kín của chính mình.',
  },
  {
    key: '3',
    title: 'Dùng tính năng Soi Chiếu Hợp Mệnh.',
    text: 'Ứng dụng sẽ chồng hai bản đồ sao lên nhau và chỉ ra mức độ hòa hợp thực sự qua các hành tinh.',
  },
];

const SlideItem = ({ item, isLastSlide, onStartPress }) => {
  return (
    <View style={styles.slideContainer}>
      <View style={styles.textBubble}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.bodyText}>{item.text}</Text>
        {isLastSlide && (
          <TouchableOpacity style={styles.startButton} onPress={onStartPress}>
            <Text style={styles.startButtonText}>Bắt đầu khám phá</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function OnboardingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;
  
  const handleStartPress = () => {
    navigation.navigate('LoginScreen'); 
  };

  return (
    <ImageBackground
      source={require('../assets/bg_onboard.png')} // <-- Tên ảnh của bạn
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        
        {/* --- PHẦN TRÊN (Tự động co giãn) --- */}
        <View style={styles.topContainer}>
          <Image
            source={require('../assets/planet.png')} // <-- Tên ảnh của bạn
            style={styles.planet} // <-- Chỉnh size ở đây
          />
          <Text style={styles.subtitle}>
            Khám phá kết nối định mệnh với người ấy
          </Text>
        </View>

        {/* --- PHẦN DƯỚI (Ghim cố định) --- */}
        <View style={styles.bottomContainer}>
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={({ item, index }) => (
              <SlideItem 
                item={item} 
                isLastSlide={index === slides.length - 1}
                onStartPress={handleStartPress}
              />
            )}
            keyExtractor={(item) => item.key}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
          {/* Dấu chấm Pagination */}
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { opacity: index === activeIndex ? 1 : 0.4 },
                ]}
              />
            ))}
          </View>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  container: {
    flex: 1,
  },
  
  topContainer: {
    alignItems: 'center',
  },
  planet: {
    width: width * 1, 
    height: width * 1,
    resizeMode: 'contain',
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  bottomContainer: {
    position: 'absolute', 
    bottom: 100, 
    left: 0,
    right: 0,
    width: '100%',
  },

  slideContainer: {
    width: width, 
    alignItems: 'center',
    paddingTop: 30,
  },
  textBubble: {
    width: '85%',
    backgroundColor: 'rgba(85, 84, 84, 0.7)',
    borderRadius: 20,
    padding: 25,
    minHeight: 250, 
  },
  titleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  bodyText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#f168a1ff', 
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 70,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // --- Pagination Styles (Giữ nguyên) ---
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40, // Đẩy lên cao
    marginTop: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginHorizontal: 8,
  },
});