import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../effectColor.js/BGColor';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function RegisterScreen2({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fullName || !birthDate || !birthTime || !birthPlace) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      // ✅ Lưu dữ liệu vào Firestore
      await addDoc(collection(db, 'user_info'), {
        fullName,
        birthDate,
        birthTime,
        birthPlace,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('✅ Thành công', 'Thông tin đã được lưu vào Firebase!');
      navigation.navigate('Home'); // hoặc màn hình khác tùy bạn muốn
    } catch (error) {
      console.log('🔥 Firestore error:', error);
      Alert.alert('❌ Lỗi', 'Không thể lưu dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin bổ sung</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ và tên của bạn"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Ngày sinh</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập ngày sinh (YYYY-MM-DD)"
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <Text style={styles.label}>Giờ sinh</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập giờ sinh (HH:MM)"
          value={birthTime}
          onChangeText={setBirthTime}
        />

        <Text style={styles.label}>Nơi sinh</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập nơi sinh"
          value={birthPlace}
          onChangeText={setBirthPlace}
        />

        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8 },
            loading && { backgroundColor: '#9ca3af' },
          ]}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Hoàn tất</Text>}
        </Pressable>

        {/* Nút quay lại */}
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Quay lại</Text>
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
    backgroundColor: colors.blackBackground,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.whiteText,
  },
  box: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    color: colors.blackText,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.borderGray,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.blueButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.whiteText,
    fontWeight: '700',
    fontSize: 16,
  },
  backButton: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: colors.borderGray,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#000',
    fontWeight: '600',
  },
});
