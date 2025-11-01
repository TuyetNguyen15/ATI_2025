import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Alert,
  Animated, Easing, ActivityIndicator, Dimensions,
} from 'react-native';
import { db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen2({ route, navigation }) {
  // 🧠 Nhận thêm biến from để biết đến từ đâu
  const { uid, from } = route.params || {};
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [loading, setLoading] = useState(false);

  // ✨ Hiệu ứng nền
  const glowAnim = useRef(new Animated.Value(0.7)).current;
  const stars = useRef(
    Array.from({ length: 250 }).map(() => ({
      x: Math.random() * width * 1.5 - width * 0.25,
      y: Math.random() * height * 1.5 - height * 0.25,
      size: Math.random() * 2.2 + 0.5,
      color: Math.random() > 0.7 ? 'rgba(255,200,255,0.9)' : 'rgba(255,255,255,0.9)',
    }))
  ).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 3500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 3500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [glowAnim]);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 90000, easing: Easing.linear, useNativeDriver: true })).start();
  }, [rotateAnim]);
  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const handleSubmit = async () => {
    if (!fullName || !birthDate || !birthTime || !birthPlace) {
      Alert.alert('⚠️ Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      await setDoc(
        doc(db, 'user_info', uid),
        {
          fullName,
          birthDate,
          birthTime,
          birthPlace,
          profileComplete: true,
          step: 2,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert('🎉 Hoàn tất', 'Tài khoản của bạn đã được tạo thành công!');
      navigation.replace('Main');
    } catch (error) {
      console.log('🔥 Firestore error:', error);
      Alert.alert('❌ Lỗi', 'Không thể lưu dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor:'#000', opacity: glowAnim.interpolate({ inputRange:[0.5,1], outputRange:[0.9,1] }) },
        ]}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { alignItems:'center', justifyContent:'center', transform:[{ rotate }] },
        ]}
      >
        {stars.map((s, i) => (
          <View key={i} style={{ position:'absolute', top:s.y, left:s.x, width:s.size, height:s.size, borderRadius:s.size/2, backgroundColor:s.color }} />
        ))}
      </Animated.View>

      <View style={[styles.card, { zIndex:10 }]}>
        <Text style={styles.title}>Thông tin bổ sung</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput style={styles.input} placeholder="Nhập họ và tên" placeholderTextColor="#999" value={fullName} onChangeText={setFullName} />

          <Text style={styles.label}>Ngày sinh</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#999" value={birthDate} onChangeText={setBirthDate} />

          <Text style={styles.label}>Giờ sinh</Text>
          <TextInput style={styles.input} placeholder="HH:MM" placeholderTextColor="#999" value={birthTime} onChangeText={setBirthTime} />

          <Text style={styles.label}>Nơi sinh</Text>
          <TextInput style={styles.input} placeholder="Nhập nơi sinh" placeholderTextColor="#999" value={birthPlace} onChangeText={setBirthPlace} />
        </View>

        <Pressable onPress={handleSubmit} style={[styles.button, loading && { backgroundColor:'#9ca3af' }]} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Hoàn tất đăng ký</Text>}
        </Pressable>

        {/* ❌ Ẩn nút Quay lại nếu đến từ Login */}
        {from !== 'login' && (
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>⬅ Quay lại</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#000', alignItems:'center', justifyContent:'center', overflow:'hidden' },
  card:{ width:'85%', alignItems:'center', paddingVertical:50, borderRadius:25, backgroundColor:'rgba(0,0,0,0.55)' },
  formContainer:{ width:'80%' },
  title:{ fontSize:28, color:'#fff', fontWeight:'700', marginBottom:30 },
  label:{ color:'#fff', fontSize:15, fontWeight:'500', marginBottom:6, marginLeft:5 },
  input:{ width:'100%', backgroundColor:'#fff', borderRadius:20, height:45, paddingHorizontal:12, marginBottom:15, fontSize:16, color:'#000' },
  button:{ width:'80%', height:45, borderRadius:25, alignItems:'center', justifyContent:'center', marginTop:10, backgroundColor:'#ff77a9', shadowColor:'#ff77a9', shadowOpacity:0.6, shadowRadius:10, elevation:8 },
  buttonText:{ color:'#fff', fontWeight:'700', fontSize:16 },
  backButton:{ marginTop:15, alignItems:'center', justifyContent:'center', paddingVertical:10, borderRadius:20, width:'70%', backgroundColor:'rgba(255,255,255,0.15)' },
  backButtonText:{ color:'#fff', fontWeight:'600', fontSize:15 },
});
