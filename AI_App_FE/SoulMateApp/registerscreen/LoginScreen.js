// screens/LoginScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { colors } from '../effectColor.js/BGColor';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('✅ Thành công', 'Đăng nhập thành công!');
      navigation.navigate('RegisterScreen2'); // hoặc Home nếu bạn có
    } catch (err) {
      Alert.alert('❌ Lỗi', 'Email hoặc mật khẩu không đúng');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        onPress={handleLogin}
        style={[styles.button, loading && { backgroundColor: '#9ca3af' }]}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng nhập</Text>}
      </Pressable>

      <Pressable onPress={() => navigation.navigate('RegisterScreen1')}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký ngay</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.blackBackground },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.whiteText, textAlign: 'center', marginBottom: 20 },
  input: { height: 48, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12 },
  button: { height: 48, backgroundColor: colors.blueButton, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: colors.blueButton, textAlign: 'center', marginTop: 15 },
});
