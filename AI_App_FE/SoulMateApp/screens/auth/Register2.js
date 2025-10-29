// RegisterScreen2.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../../components/BGColor';
import { db } from '../../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function RegisterScreen2({ route, navigation }) {
  const { uid } = route.params; // 👈 nhận uid từ bước 1
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fullName || !birthDate || !birthTime || !birthPlace) {
      Alert.alert('⚠️ Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      // 💾 Lưu thông tin người dùng gắn với uid thật
      await setDoc(doc(db, 'user_info', uid), {
        fullName,
        birthDate,
        birthTime,
        birthPlace,
        createdAt: serverTimestamp(),
      });

      Alert.alert('🎉 Hoàn tất', 'Tài khoản của bạn đã được tạo thành công!');
      navigation.replace('Main'); // ✅ sang trang Home sau khi đăng ký hoàn chỉnh
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
        <TextInput style={styles.input} placeholder="Nhập họ và tên" value={fullName} onChangeText={setFullName} />

        <Text style={styles.label}>Ngày sinh</Text>
        <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={birthDate} onChangeText={setBirthDate} />

        <Text style={styles.label}>Giờ sinh</Text>
        <TextInput style={styles.input} placeholder="HH:MM" value={birthTime} onChangeText={setBirthTime} />

        <Text style={styles.label}>Nơi sinh</Text>
        <TextInput style={styles.input} placeholder="Nhập nơi sinh" value={birthPlace} onChangeText={setBirthPlace} />

        <Pressable onPress={handleSubmit} style={[styles.button, loading && { backgroundColor: '#9ca3af' }]} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Hoàn tất đăng ký</Text>}
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>⬅ Quay lại</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.blackBackground },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 20, color: colors.whiteText },
  box: { padding: 20, backgroundColor: '#fff', borderRadius: 12, elevation: 5 },
  label: { fontSize: 14, color: colors.blackText, fontWeight: '600', marginBottom: 6 },
  input: { height: 48, borderWidth: 1, borderColor: colors.borderGray, borderRadius: 12, paddingHorizontal: 12, fontSize: 16, marginBottom: 12 },
  button: { height: 48, borderRadius: 12, backgroundColor: colors.blueButton, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: colors.whiteText, fontWeight: '700', fontSize: 16 },
  backButton: { marginTop: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, backgroundColor: colors.borderGray, borderRadius: 12 },
  backButtonText: { color: '#000', fontWeight: '600' },
});
