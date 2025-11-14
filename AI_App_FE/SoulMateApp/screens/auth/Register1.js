import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  Animated, Easing, ActivityIndicator, Alert, Dimensions,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen1({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ✨ Hiệu ứng breathing + sao + quay
  const glowAnim = useRef(new Animated.Value(0.7)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

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
        Animated.timing(glowAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 90000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  // 🧠 Xử lý đăng ký
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword)
      return Alert.alert('⚠️ Thiếu thông tin', 'Vui lòng điền đầy đủ.');
    if (password !== confirmPassword)
      return Alert.alert('❌', 'Mật khẩu không khớp.');

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        email,
        profileComplete: false,
        createdAt: serverTimestamp(),
      });
      Alert.alert('✅', 'Bước 1 hoàn tất!');
      navigation.navigate('RegisterScreen2', { uid: cred.user.uid, email, password });
    } catch (err) {
      console.log(err);
      Alert.alert('❌', 'Không thể tạo tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: glowAnim }]} />
      <Animated.View style={[StyleSheet.absoluteFill, { alignItems:'center', justifyContent:'center', transform:[{ rotate }] }]}>
        {stars.map((s, i) => <View key={i} style={{ position:'absolute', top:s.y, left:s.x, width:s.size, height:s.size, borderRadius:s.size/2, backgroundColor:s.color }} />)}
      </Animated.View>

      <View style={styles.card}>
        <Text style={styles.title}>Tạo tài khoản</Text>
        <View style={styles.formContainer}>
          <TextInput placeholder="Email" placeholderTextColor="#999" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' />
          <TextInput placeholder="Mật khẩu" placeholderTextColor="#999" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
          <TextInput placeholder="Nhập lại mật khẩu" placeholderTextColor="#999" style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        </View>

        <Pressable onPress={handleRegister} style={styles.button}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Tiếp tục</Text>}
        </Pressable>

        <Pressable onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>Đã có tài khoản? <Text style={{ color:'#ff77a9' }}>Đăng nhập</Text></Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#000' },
  card:{ width:'85%', alignItems:'center', paddingVertical:50, borderRadius:25, backgroundColor:'rgba(0,0,0,0.55)' },
  formContainer:{ width:'80%' },
  title:{ fontSize:28, color:'#fff', fontWeight:'700', marginBottom:30 },
  input:{ width:'100%', backgroundColor:'#fff', borderRadius:20, height:45, paddingHorizontal:12, marginBottom:15 },
  button:{ width:'80%', height:45, borderRadius:25, justifyContent:'center', alignItems:'center', backgroundColor:'#ff77a9' },
  buttonText:{ color:'#fff', fontWeight:'700', fontSize:16 },
  link:{ color:'#fff', marginTop:25 },
});
