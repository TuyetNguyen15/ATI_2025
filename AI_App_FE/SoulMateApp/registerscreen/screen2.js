import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Alert,
  Animated, Easing, ActivityIndicator, Dimensions,
} from 'react-native';
import { db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen2({ route, navigation }) {
  const { uid, from, email } = route.params || {};
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [loading, setLoading] = useState(false);

  const glowAnim = useRef(new Animated.Value(0.7)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const stars = useRef(Array.from({ length: 250 }).map(() => ({
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    size: Math.random() * 2.2 + 0.5,
    color: Math.random() > 0.7 ? 'rgba(255,200,255,0.9)' : 'rgba(255,255,255,0.9)',
  }))).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 90000, easing: Easing.linear, useNativeDriver: true })).start();
  }, []);
  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const handleSubmit = async () => {
    if (!fullName || !birthDate || !birthTime || !birthPlace)
      return Alert.alert('⚠️', 'Điền đầy đủ thông tin');
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', uid), {
        email,
        fullName,
        birthDate,
        birthTime,
        birthPlace,
        profileComplete: true,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      Alert.alert('🎉', 'Đăng ký hoàn tất!');
      navigation.replace('Main');
    } catch (err) {
      console.log(err);
      Alert.alert('❌', 'Không thể lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor:'#000', opacity: glowAnim }]} />
      <Animated.View style={[StyleSheet.absoluteFill, { alignItems:'center', justifyContent:'center', transform:[{ rotate }] }]}>
        {stars.map((s, i) => <View key={i} style={{ position:'absolute', top:s.y, left:s.x, width:s.size, height:s.size, borderRadius:s.size/2, backgroundColor:s.color }} />)}
      </Animated.View>

      <View style={styles.card}>
        <Text style={styles.title}>Thông tin bổ sung</Text>
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Họ và tên" value={fullName} onChangeText={setFullName} />
          <TextInput style={styles.input} placeholder="Ngày sinh (YYYY-MM-DD)" value={birthDate} onChangeText={setBirthDate} />
          <TextInput style={styles.input} placeholder="Giờ sinh (HH:MM)" value={birthTime} onChangeText={setBirthTime} />
          <TextInput style={styles.input} placeholder="Nơi sinh" value={birthPlace} onChangeText={setBirthPlace} />
        </View>
        <Pressable onPress={handleSubmit} style={styles.button}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Hoàn tất</Text>}
        </Pressable>

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
  container:{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#000' },
  card:{ width:'85%', alignItems:'center', paddingVertical:50, borderRadius:25, backgroundColor:'rgba(0,0,0,0.55)' },
  formContainer:{ width:'80%' },
  title:{ fontSize:28, color:'#fff', fontWeight:'700', marginBottom:30 },
  input:{ width:'100%', backgroundColor:'#fff', borderRadius:20, height:45, paddingHorizontal:12, marginBottom:15 },
  button:{ width:'80%', height:45, borderRadius:25, justifyContent:'center', alignItems:'center', backgroundColor:'#ff77a9' },
  buttonText:{ color:'#fff', fontWeight:'700', fontSize:16 },
  backButton:{ marginTop:15, alignItems:'center', paddingVertical:10, width:'70%', backgroundColor:'rgba(255,255,255,0.15)', borderRadius:20 },
  backButtonText:{ color:'#fff', fontWeight:'600', fontSize:15 },
});
