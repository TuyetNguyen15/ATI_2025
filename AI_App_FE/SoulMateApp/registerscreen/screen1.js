import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { colors } from '../effectColor.js/BGColor';

export default function RegisterScreen1({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Xử lý đăng ký tài khoản thật bằng Firebase Auth
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('⚠️ Thiếu thông tin', 'Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('❌ Lỗi', 'Mật khẩu nhập lại không khớp.');
      return;
    }

    // Regex check định dạng email đơn giản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('📧 Email không hợp lệ', 'Vui lòng nhập đúng định dạng email.');
      return;
    }

    setLoading(true);
    try {
      // 🔥 Tạo tài khoản Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 💾 Lưu thêm dữ liệu vào Firestore (tùy chọn)
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
      });

      Alert.alert('🎉 Thành công', 'Tài khoản đã được tạo!');
      navigation.navigate('RegisterScreen2');
    } catch (error) {
      console.log('Firebase Auth Error:', error);
      let message = 'Có lỗi xảy ra. Vui lòng thử lại.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email này đã được đăng ký.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email không hợp lệ.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Mật khẩu quá yếu (tối thiểu 6 ký tự).';
      }
      Alert.alert('❌ Lỗi đăng ký', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo tài khoản</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Nhập lại mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable
          onPress={handleRegister}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.8 },
            loading && { backgroundColor: '#9ca3af' },
          ]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Đăng ký</Text>
          )}
        </Pressable>

        {/* Nút chuyển sang đăng nhập */}
        <Pressable onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.switchText}>
            Đã có tài khoản? <Text style={{ color: colors.blueButton }}>Đăng nhập</Text>
          </Text>
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
  switchText: { 
    textAlign: 'center', 
    marginTop: 12, 
    color: colors.blackText 
  },
});
