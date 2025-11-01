import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  Animated, Easing, ActivityIndicator, Alert, Dimensions,
} from 'react-native';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ✨ Hiệu ứng breathing + sao
  const glowAnim = useRef(new Animated.Value(0.7)).current;
  const stars = useRef(
    Array.from({ length: 250 }).map(() => ({
      x: Math.random() * width * 1.5 - width * 0.25,
      y: Math.random() * height * 1.5 - height * 0.25,
      size: Math.random() * 2.2 + 0.5,
      color:
        Math.random() > 0.7
          ? 'rgba(255,200,255,0.9)'
          : 'rgba(255,255,255,0.9)',
    }))
  ).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 90000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // 🔍 Kiểm tra trạng thái login hiện tại (auto login từ Register1)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'user_info', user.uid));
        const done = snap.exists() && snap.data()?.profileComplete === true;
        if (done) {
          navigation.replace('Main');
        } else {
          navigation.replace('RegisterScreen2', { uid: user.uid, from: 'login' });
        }
      } catch (e) {
        console.log('Auth check error:', e);
      }
    });
    return () => unsub();
  }, [navigation]);

  // 🧠 Hàm xử lý đăng nhập
  const handleLogin = async () => {
    if (!email || !password)
      return Alert.alert('⚠️', 'Vui lòng nhập email và mật khẩu');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const snap = await getDoc(doc(db, 'user_info', uid));
      const done = snap.exists() && snap.data()?.profileComplete === true;

      if (done) {
        navigation.replace('Main');
      } else {
        Alert.alert('📝 Cần bổ sung', 'Vui lòng hoàn tất thông tin trước khi vào ứng dụng.');
        navigation.replace('RegisterScreen2', { uid, from: 'login' }); // ✅ thêm from:'login'
      }
    } catch (e) {
      console.log('Login error:', e);
      Alert.alert('❌ Lỗi', 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🌌 Nền breathing */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: '#000',
            opacity: glowAnim.interpolate({
              inputRange: [0.5, 1],
              outputRange: [0.9, 1],
            }),
          },
        ]}
      />
      {/* 🌠 Sao xoay quanh */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate }],
          },
        ]}
      >
        {stars.map((s, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              top: s.y,
              left: s.x,
              width: s.size,
              height: s.size,
              borderRadius: s.size / 2,
              backgroundColor: s.color,
            }}
          />
        ))}
      </Animated.View>

      {/* 📋 Form đăng nhập */}
      <View style={[styles.card, { zIndex: 10 }]}>
        <Text style={styles.title}>Đăng nhập</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable onPress={handleLogin} style={styles.button} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Đăng nhập</Text>
          )}
        </Pressable>

        <Pressable onPress={() => navigation.navigate('RegisterScreen1')}>
          <Text style={styles.link}>
            Chưa có tài khoản?{' '}
            <Text style={{ color: '#ff77a9', fontWeight: '600' }}>Đăng ký ngay</Text>
          </Text>
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
  link:{ color:'#fff', marginTop:25, fontSize:14 },
});
