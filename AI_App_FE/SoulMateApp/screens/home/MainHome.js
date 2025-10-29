import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen( {navigation }) {
  const [scope, setScope] = useState('astro');
  return (
    <ImageBackground
      source={require('../../assets/sky.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* <Image source={require('../../assets/moon.jpg')} style={styles.moon} /> */}

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 🌙 Header */}
        <View style={styles.header}>
          <Text style={styles.date}>Thứ 6, ngày 3/10/2025</Text>
          <Text style={styles.welcome}>Xin Chào, Tuyết</Text>
        </View>

        <View style={styles.segmentContainer}>
          <View style={styles.segmentBg}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setScope('astro')}
              style={[styles.segmentItem, scope === 'astro' && styles.segmentItemActive]}
            >
              <Text style={[styles.segmentText, scope === 'astro' && styles.segmentTextActive]}>
                Chiêm tinh
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setScope('love')}
              style={[styles.segmentItem, scope === 'love' && styles.segmentItemActive]}
            >
              <Text style={[styles.segmentText, scope === 'love' && styles.segmentTextActive]}>
                Tình Duyên
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- NỘI DUNG THEO SCOPE ---- */}
        {scope === 'astro' ? (
          <>
            {/* 🔮 Zodiac Info */}
            <View style={styles.zodiacBox}>
              {/* Hàng 1 */}
              <View style={styles.row}>
                <Text style={styles.infoText}>
                  <Text style={{ fontSize: 14, color: "#a8a8a8" }}>Mặt trời{'\n'}</Text>
                  <Text style={{ fontSize: 20 }}>Bọ Cạp</Text>
                </Text>

                <Text style={styles.infoText}>
                  <Text style={{ fontSize: 14, color: "#a8a8a8" }}>Mặt trăng{'\n'}</Text>
                  <Text style={{ fontSize: 20 }}>Bọ Cạp</Text>
                </Text>
              </View>

              {/* 🪐 Hành tinh nằm giữa */}
              <View style={styles.centerCircle}>
                <View style={styles.outerRing} />
                <View style={styles.innerRing} />
                <View style={styles.topinnerRing} />
                <View style={styles.middleRing} />
                <LinearGradient
                  colors={['#61a4ff', '#913efe']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  locations={[0, 0.8]}
                  style={styles.circleGradient}
                >
                  <Image
                    source={require('../../assets/zodiacsigns/thienyet.png')}
                    style={styles.zodiacIcon}
                    resizeMode="contain"
                  />
                </LinearGradient>
              </View>

              {/* Hàng 2 */}
              <View style={styles.row}>
                <Text style={styles.infoText}>
                  <Text style={{ fontSize: 14, color: "#a8a8a8" }}>Điểm mọc{'\n'}</Text>
                  <Text style={{ fontSize: 20 }}>Bọ Cạp</Text>
                </Text>

                <Text style={styles.infoText}>
                  <Text style={{ fontSize: 14, color: "#a8a8a8" }}>Nguyên tố{'\n'}</Text>
                  <Text style={{ fontSize: 20 }}>Bọ Cạp</Text>
                </Text>
              </View>
            </View>

            {/* 🔘 Button */}
            <TouchableOpacity
             style={styles.button}
             onPress={() => navigation.navigate('Prediction')}
             >
              <LinearGradient
                colors={['#61a4ff', '#913efe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Dự đoán</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* 💞 Widget hàng ngang: Vận may & Cung tương hợp */}
            <View style={styles.loveRow}>
              {/* Widget 1: Vận may tình duyên */}
              <LinearGradient
                colors={[
                  'rgba(255, 154, 201, 0.2)',  // hồng nhạt mờ
                  'rgba(179, 109, 255, 0.2)',  // tím nhạt mờ
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loveBox}
              >
                <Ionicons name="heart" size={35} color="rgba(255, 182, 217, 0.8)" style={styles.loveIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.loveTitle}>Tình duyên</Text>
                  <View style={styles.loveBarBackground}>
                    <LinearGradient
                      colors={['#ffb6d9', '#b36dff']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.loveBarFill, { width: '80%' }]}
                    />
                  </View>
                  <Text style={styles.lovePercent}>80%</Text>
                </View>
              </LinearGradient>

              {/* Widget 2: Cung tương hợp */}
              <LinearGradient
                colors={[
                  'rgba(255, 154, 201, 0.2)',  // hồng nhạt mờ
                  'rgba(179, 109, 255, 0.2)',  // tím nhạt mờ
                ]}
                style={styles.matchBox}
              >
                <Text style={styles.matchTitle}>Cung hợp</Text>
                <View style={styles.matchContent}>
                  <Image
                    source={require('../../assets/zodiacsigns/kimnguu.png')}
                    style={styles.matchAvatar}
                  />
                  <View>
                    <Text style={styles.matchName}>Kim Ngưu </Text>
                    <Text style={styles.matchPercent}>85%</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
            {/* 🌟 Quote Section (Tình duyên) */}
            <View style={styles.quoteBox}>
              <LinearGradient
                colors={[
                  'rgba(255, 154, 201, 0.2)',  // hồng nhạt mờ
                  'rgba(179, 109, 255, 0.2)',  // tím nhạt mờ
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quoteGradient}
              >
                <Text style={styles.quoteText}>
                  "Những vì sao không định đoạt số phận — chính chúng ta viết nên bản đồ trời đêm của mình."
                </Text>
              </LinearGradient>
            </View>




          </>
        )}
        {/* 🔮 Tương hợp – Box trong suốt */}
<View style={styles.compatibilitySection}>
  <Text style={styles.sectionTitle}>Tương hợp</Text>

  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {[
      {
        name: 'Hwang Min Hyun',
        zodiac: 'Ma Kết',
        avatar: { uri: 'https://i.pinimg.com/1200x/14/53/6e/14536e887f26dfde53d711e8cc6492b5.jpg' },
      },
      {
        name: 'Khánh Linh',
        zodiac: 'Cự Giải',
        avatar: { uri: 'https://i.pinimg.com/1200x/e7/2e/0d/e72e0db6ad46eac62c59883c9f49a96e.jpg' },
      },
      {
        name: 'Bảo Nam',
        zodiac: 'Sư Tử',
        avatar: { uri: 'https://i.pinimg.com/1200x/e5/38/08/e53808d563550fbf1cf9a46410decfa9.jpg' },
      },
    ].map((item, index) => (
      <View key={index} style={styles.glassBox}>
        <Image source={item.avatar} style={styles.glassImage} />
        <View style={styles.glassOverlay} />
        <View style={styles.glassInfo}>
          <Text style={styles.glassName}>{item.name}</Text>
          <Text style={styles.glassZodiac}>{item.zodiac}</Text>
        </View>
      </View>
    ))}

    <TouchableOpacity style={styles.exploreButton}>
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.exploreGradient}
      >
        <Ionicons name="arrow-forward" size={32} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  </ScrollView>
</View>




      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  moon: {
    position: 'absolute',
    top: 0,
    width: '100%',       // full chiều ngang
    height: 280,          // bạn có thể tăng hoặc giảm tùy ảnh
    resizeMode: 'cover',  // hoặc 'contain' nếu muốn giữ tỉ lệ
    opacity: 0.9,
    transform: [{ rotate: '0deg' }],  // nếu muốn xoay thêm thì chỉnh ở đây
  },
  /* 💞 Hai widget nằm ngang */
  loveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    marginTop: 60,
  },

  /* 💘 Widget 1: Tình duyên */
  loveBox: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    shadowColor: '#ff9ac9',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  loveIcon: {
    marginRight: 10,
    shadowColor: '#fff',
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  loveTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  loveBarBackground: {
    width: '100%',
    height: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  loveBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  lovePercent: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'right',
  },


  /* 💫 Widget 2: Cung tương hợp */
  matchBox: {
    width: '48%',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#b36dff',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  matchTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,

  },
  matchContent: { flexDirection: 'row', alignItems: 'center' },
  matchAvatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  matchName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  matchPercent: { color: '#ffb6d9', fontSize: 14, marginTop: 2 },
  matchAvatar: { width: 55, height: 55, borderRadius: 28, marginRight: 15 },
  matchName: { color: '#fff', fontSize: 17, fontWeight: '600' },
  matchPercent: { color: '#ffb6d9', fontSize: 15 },


  zodiacIcon: {
    width: 90,
    height: 90,
    tintColor: '#fff', // ✅ làm icon hoà với màu ánh sáng trắng
    opacity: 0.95,
  },

  segmentContainer: {
    width: '70%',
    marginTop: 130,
    alignSelf: 'center',
  },
  segmentBg: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)', // nền pill mờ
    borderRadius: 28,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(146,132,255,0.25)',
  },
  segmentItem: {
    flex: 1,
    height: 40,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: 'rgba(20,10,60,0.6)',      // phần được chọn tối hơn
    borderWidth: 0.7,
    borderColor: '#8a82ff',                      // viền tím nhạt như ảnh
    shadowColor: '#8a82ff',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  segmentText: {
    color: '#bfb9d9',                            // chữ xám nhạt (inactive)
    fontSize: 16,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#ffffff',                            // chữ trắng (active)
  },
  quoteBox: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },

  quoteGradient: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#83d2ff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },

  quoteText: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.6,
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },


  background: { flex: 1 },
  // moon: {
  //   position: 'absolute',
  //   top: 0,
  //   width: '100%',
  //   height: 250,
  //   resizeMode: 'cover',
  //   opacity: 0.9,
  // },
  scroll: { alignItems: 'center', paddingBottom: 120 },
  header: { bottom: 30, zIndex: 2, alignItems: 'center', marginTop: 100 },
  date: {
    color: '#dcdcdc',
    fontSize: 24,
    marginTop: 8,
    opacity: 0.8,

  },
  welcome: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'semibold',
    marginTop: 6,
    // fontStyle: 'italic',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  zodiacBox: {
    width: '90%',
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 40,
  },
  infoText: {
    color: '#fff',
    fontSize: 21,
    width: '30%',
    textAlign: 'center',
    lineHeight: 30,
  },
  centerCircle: {
    position: 'absolute',
    top: '28%',
    alignSelf: 'center',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#83d2ff',
    borderRightColor: '#83d2ff',
    transform: [{ rotate: '35deg' }],
    opacity: 0.8,
  },
  innerRing: {
    position: 'absolute',
    width: 145,
    height: 145,
    borderRadius: 102.5,
    borderWidth: 2,
    borderColor: 'transparent',
    borderBottomColor: '#83d2ff',
    borderRightColor: '#83d2ff',
    transform: [{ rotate: '20deg' }],
    opacity: 0.7,
  },
  topinnerRing: {
    position: 'absolute',
    width: 145,
    height: 145,
    borderRadius: 102.5,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#83d2ff',
    transform: [{ rotate: '-30deg' }],
    opacity: 0.7,
  },
  middleRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#83d2ff',
    transform: [{ rotate: '-95deg' }],
    opacity: 0.8,
  },
  circleGradient: {
    width: 130,
    height: 130,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  button: { marginTop: 0 },
  buttonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  /* --- Tarot Section --- */
  compatibilitySection: {
    width: '100%',
    marginTop: 65,
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
  },
  compatibilitySection: {
    width: '100%',
    marginTop: 60,
    paddingLeft: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
  },

  glassBox: {
    width: 180,
    height: 230,
    marginRight: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(200, 120, 255, 0.6)',
    justifyContent: 'flex-start', 
    paddingVertical: 15,          
    paddingHorizontal:15, 
   alignItems:"center",
    shadowColor: '#b36dff',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  glassImage: {
    width: 150,      
    height: 150,
    borderRadius: 15,
    resizeMode: 'cover',
   
  },

  glassInfo: {
    marginTop: 10,
    alignItems: 'flex-start',
  width: '100%',
  },
  glassName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    
  },
  glassZodiac: {
    color: '#d8d8d8',
    fontSize: 13,
    marginTop: 2,
  },

  exploreButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
  },
  exploreGradient: {
    width: 65,
    height: 65,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff7acb',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },



});
