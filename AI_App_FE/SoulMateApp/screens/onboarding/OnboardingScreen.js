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
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Chào mừng bạn đến với AstroLove.',
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
      <BlurView intensity={40} tint="dark" style={styles.glassCard}>
        <View style={styles.cardContent}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.bodyText}>{item.text}</Text>
          
          {isLastSlide && (
            <TouchableOpacity 
              style={styles.startButton} 
              onPress={onStartPress}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>Bắt đầu khám phá</Text>
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
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
      source={require('../../assets/bg_onboard.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        
        {/* --- PLANET (Responsive) --- */}
        <View style={styles.planetContainer}>
          <Image
            source={require('../../assets/planet.png')}
            style={styles.planet}
            resizeMode="contain"
          />
          
          <Text style={styles.subtitle}>
            Khám phá kết nối định mệnh với người ấy
          </Text>
        </View>

        {/* --- GLASS CARD SLIDES --- */}
        <View style={styles.slidesWrapper}>
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
            bounces={false}
          />
          
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { 
                    width: index === activeIndex ? 24 : 8,
                    opacity: index === activeIndex ? 1 : 0.4,
                  },
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
    justifyContent: 'space-between',
  },
  
  // --- PLANET SECTION ---
  planetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
  },
  planet: {
    width: width * 0.4,
    height: width * 0.4,
    maxWidth: 500,
    maxHeight: 500,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: Math.min(width * 0.045, 18),
    fontStyle: 'italic',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: width * 0.1,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  // --- SLIDES SECTION ---
  slidesWrapper: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
  },
  slideContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  
  glassCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardContent: {
    padding: Math.min(width * 0.07, 32),
    minHeight: height * 0.30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // --- TEXT STYLES ---
  titleText: {
    color: 'rgba(255, 255, 255, 0.98)',
    fontSize: Math.min(width * 0.055, 22),
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: Math.min(width * 0.07, 28),
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  bodyText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: Math.min(width * 0.038, 15),
    lineHeight: Math.min(width * 0.055, 22),
    fontWeight: '400',
    letterSpacing: 0.2,
    textAlign: 'center',
    marginBottom: 24,
  },
  
  // --- START BUTTON ---
  startButton: {
    backgroundColor: '#ff7bbf',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '80%',
    shadowColor: 'rgba(98, 149, 255, 0.5)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: Math.min(width * 0.042, 15),
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  
  // --- PAGINATION ---
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 4,
    transition: 'all 0.3s ease',
  },
});