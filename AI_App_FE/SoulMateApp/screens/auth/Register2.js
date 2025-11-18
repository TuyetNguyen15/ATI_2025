import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Alert,
  Animated, Easing, ActivityIndicator, Dimensions,
} from 'react-native';
import { db } from '../../config/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { fetchAstrologyData } from '../../services/astrologyService';
const { width, height } = Dimensions.get('window');

export default function RegisterScreen2({ route, navigation }) {
  const { uid, from, email } = route.params || {};
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
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
    // Validate input
    if (!fullName || !birthDate || !birthTime || !birthPlace) {
      return Alert.alert('⚠️', 'Điền đầy đủ thông tin');
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthDate)) {
      return Alert.alert('⚠️', 'Ngày sinh phải có định dạng YYYY-MM-DD (VD: 1999-06-27)');
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(birthTime)) {
      return Alert.alert('⚠️', 'Giờ sinh phải có định dạng HH:MM (VD: 03:20)');
    }

    setLoading(true);
    try {
      // Step 1: Fetch astrology data
      console.log('📡 Fetching astrology data...');
      setLoadingMessage('Đang tính toán biểu đồ chiêm tinh...');
      const astrologyData = await fetchAstrologyData(birthDate, birthTime, birthPlace);
      console.log('✅ Astrology data received:', astrologyData);
      
      // Step 2: Prepare user data
      const userData = {
        // Basic info
        name: fullName,
        age: astrologyData.age || 0,
        birthDate,
        birthTime,
        birthPlace,
        email: email || '',
        
        // Planets
        sun: astrologyData.sun || '',
        moon: astrologyData.moon || '',
        mercury: astrologyData.mercury || '',
        venus: astrologyData.venus || '',
        mars: astrologyData.mars || '',
        jupiter: astrologyData.jupiter || '',
        saturn: astrologyData.saturn || '',
        uranus: astrologyData.uranus || '',
        neptune: astrologyData.neptune || '',
        pluto: astrologyData.pluto || '',
        ascendant: astrologyData.ascendant || '',
        descendant: astrologyData.descendant || '',
        mc: astrologyData.mc || '',
        ic: astrologyData.ic || '',
        
        // Houses
        house1: astrologyData.house1 || '',
        house2: astrologyData.house2 || '',
        house3: astrologyData.house3 || '',
        house4: astrologyData.house4 || '',
        house5: astrologyData.house5 || '',
        house6: astrologyData.house6 || '',
        house7: astrologyData.house7 || '',
        house8: astrologyData.house8 || '',
        house9: astrologyData.house9 || '',
        house10: astrologyData.house10 || '',
        house11: astrologyData.house11 || '',
        house12: astrologyData.house12 || '',
        
        // Aspects
        conjunctionAspect: astrologyData.conjunctionAspect || '',
        oppositionAspect: astrologyData.oppositionAspect || '',
        trineAspect: astrologyData.trineAspect || '',
        squareAspect: astrologyData.squareAspect || '',
        sextileAspect: astrologyData.sextileAspect || '',
        
        // Natal Chart
        natalChartImage: astrologyData.natalChartImage || '',
        
        // Elemental Ratios
        fireRatio: astrologyData.fireRatio || 0,
        earthRatio: astrologyData.earthRatio || 0,
        airRatio: astrologyData.airRatio || 0,
        waterRatio: astrologyData.waterRatio || 0,
        
        // Default values for other fields
        avatar: '',
        coverImage: '',
        gender: '',
        height: null,
        weight: null,
        job: '',
        relationshipStatus: 'Độc thân',
        
        // IMPORTANT: Mark profile as complete
        profileComplete: true,
        
        // Metadata
        updatedAt: serverTimestamp(),
      };

      // Step 3: Save to Firestore with MERGE option
      console.log('💾 Saving to Firestore...');
      setLoadingMessage('Đang lưu thông tin...');
      
      await setDoc(doc(db, 'users', uid), userData, { merge: true }); // ⭐ KEY FIX: Added merge option
      
      console.log('✅ Data saved successfully to Firestore');
      Alert.alert('✅ Thành công!', 'Đăng ký hoàn tất!', [
        { text: 'OK', onPress: () => navigation.replace('Main') }
      ]);
    } catch (err) {
      console.error('❌ Error in handleSubmit:', err);
      console.error('Error details:', err.message);
      Alert.alert(
        '❌ Lỗi', 
        `Không thể lưu dữ liệu: ${err.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setLoadingMessage('');
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
          <TextInput 
            style={styles.input} 
            placeholder="Họ và tên" 
            placeholderTextColor="#999" 
            value={fullName} 
            onChangeText={setFullName} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Ngày sinh (YYYY-MM-DD)" 
            placeholderTextColor="#999" 
            value={birthDate} 
            onChangeText={setBirthDate} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Giờ sinh (HH:MM)" 
            placeholderTextColor="#999" 
            value={birthTime} 
            onChangeText={setBirthTime} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Nơi sinh" 
            placeholderTextColor="#999" 
            value={birthPlace} 
            onChangeText={setBirthPlace} 
          />
        </View>

        {loadingMessage ? (
          <Text style={{ color: '#fff', marginBottom: 10, fontSize: 14 }}>
            {loadingMessage}
          </Text>
        ) : null}

        <Pressable onPress={handleSubmit} style={styles.button} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Hoàn tất</Text>}
        </Pressable>

        {from !== 'login' && (
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton} disabled={loading}>
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