// RegisterScreen2.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../components/BGColor';
import { db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { fetchAstrologyData } from '../services/astrologyService';

export default function RegisterScreen2({ route, navigation }) {
  const { uid, email, password } = route.params;
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleSubmit = async () => {
    // Validate input
    if (!fullName || !birthDate || !birthTime || !birthPlace) {
      Alert.alert('⚠️ Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthDate)) {
      Alert.alert('⚠️ Lỗi', 'Ngày sinh phải theo định dạng YYYY-MM-DD (ví dụ: 2000-03-15)');
      return;
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(birthTime)) {
      Alert.alert('⚠️ Lỗi', 'Giờ sinh phải theo định dạng HH:MM (ví dụ: 14:30)');
      return;
    }

    setLoading(true);
    
    try {
      // Step 1: Call Astrology API
      setLoadingMessage('Đang tính toán biểu đồ chiêm tinh...');
      const astrologyData = await fetchAstrologyData(birthDate, birthTime, birthPlace);
      
      // Step 2: Save to Firestore
      setLoadingMessage('Đang lưu thông tin...');
      await setDoc(doc(db, 'users', uid), {
        // Basic info
        name: fullName,
        age: astrologyData.age || 0,
        birthDate,
        birthTime,
        birthPlace,
        email: email || '',
        password: password || '',
        
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
        
        // Metadata
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert('🎉 Hoàn tất', 'Tài khoản của bạn đã được tạo thành công!');
      navigation.replace('Main');
      
    } catch (error) {
      console.error('🔥 Error:', error);
      
      let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
      if (error.message.includes('API')) {
        errorMessage = 'Không thể kết nối đến dịch vụ chiêm tinh. Vui lòng thử lại sau.';
      } else if (error.message.includes('Firestore')) {
        errorMessage = 'Không thể lưu dữ liệu. Vui lòng kiểm tra kết nối.';
      }
      
      Alert.alert('❌ Lỗi', errorMessage);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin bổ sung</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Nhập họ và tên" 
          value={fullName} 
          onChangeText={setFullName}
          editable={!loading}
        />

        <Text style={styles.label}>Ngày sinh (YYYY-MM-DD)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="VD: 2000-03-15" 
          value={birthDate} 
          onChangeText={setBirthDate}
          editable={!loading}
        />

        <Text style={styles.label}>Giờ sinh (HH:MM)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="VD: 14:30" 
          value={birthTime} 
          onChangeText={setBirthTime}
          editable={!loading}
        />

        <Text style={styles.label}>Nơi sinh</Text>
        <TextInput 
          style={styles.input} 
          placeholder="VD: Hà Nội, Việt Nam" 
          value={birthPlace} 
          onChangeText={setBirthPlace}
          editable={!loading}
        />

        {loading && loadingMessage && (
          <Text style={styles.loadingText}>{loadingMessage}</Text>
        )}

        <Pressable 
          onPress={handleSubmit} 
          style={[styles.button, loading && { backgroundColor: '#9ca3af' }]} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Hoàn tất đăng ký</Text>
          )}
        </Pressable>

        <Pressable 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>⬅ Quay lại</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: colors.blackBackground 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    textAlign: 'center', 
    marginBottom: 20, 
    color: colors.whiteText 
  },
  box: { 
    padding: 20, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    elevation: 5 
  },
  label: { 
    fontSize: 14, 
    color: colors.blackText, 
    fontWeight: '600', 
    marginBottom: 6 
  },
  input: { 
    height: 48, 
    borderWidth: 1, 
    borderColor: colors.borderGray, 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    fontSize: 16, 
    marginBottom: 12 
  },
  loadingText: {
    textAlign: 'center',
    color: colors.blueButton,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  button: { 
    height: 48, 
    borderRadius: 12, 
    backgroundColor: colors.blueButton, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  buttonText: { 
    color: colors.whiteText, 
    fontWeight: '700', 
    fontSize: 16 
  },
  backButton: { 
    marginTop: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10, 
    backgroundColor: colors.borderGray, 
    borderRadius: 12 
  },
  backButtonText: { 
    color: '#000', 
    fontWeight: '600' 
  },
});