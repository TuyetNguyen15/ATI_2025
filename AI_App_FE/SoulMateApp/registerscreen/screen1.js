import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  Animated, Easing, ActivityIndicator, Alert, Dimensions,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen1({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ✨ breathing + stars
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

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('⚠️ Thiếu thông tin', 'Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('❌ Lỗi', 'Mật khẩu nhập lại không khớp.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Khởi tạo hồ sơ: chưa hoàn tất
      await setDoc(
        doc(db, 'user_info', user.uid),
        {
          email,
          profileComplete: false,
          step: 1,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert('✅ Thành công', 'Bước 1 hoàn tất! Hãy điền thêm thông tin cá nhân.');
      navigation.navigate('RegisterScreen2', { uid: user.uid });
    } catch (error) {
      console.log('Firebase Auth Error:', error);
      let message = 'Có lỗi xảy ra. Vui lòng thử lại.';
      if (error.code === 'auth/email-already-in-use') message = 'Email này đã được đăng ký.';
      else if (error.code === 'auth/invalid-email') message = 'Email không hợp lệ.';
      else if (error.code === 'auth/weak-password') message = 'Mật khẩu quá yếu (tối thiểu 6 ký tự).';
      Alert.alert('❌ Lỗi đăng ký', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor:'#000', opacity: glowAnim.interpolate({ inputRange:[0.5,1], outputRange:[0.9,1] }) }]} />
      <Animated.View style={[StyleSheet.absoluteFill, { alignItems:'center', justifyContent:'center', transform:[{ rotate }] }]}>
        {stars.map((s, i) => (
          <View key={i} style={{ position:'absolute', top:s.y, left:s.x, width:s.size, height:s.size, borderRadius:s.size/2, backgroundColor:s.color }} />
        ))}
      </Animated.View>

      <View style={[styles.card, { zIndex:10 }]}>
        <Text style={styles.title}>Tạo tài khoản</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email của bạn"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Nhập lại mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <Pressable
          onPress={handleRegister}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }, loading && { backgroundColor: '#9ca3af' }]}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Tiếp tục</Text>}
        </Pressable>

        <Pressable onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.switchText}>Đã có tài khoản? <Text style={{ color:'#ff77a9' }}>Đăng nhập</Text></Text>
        </Pressable>
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
  switchText:{ color:'#fff', marginTop:25, fontSize:14 },
});
