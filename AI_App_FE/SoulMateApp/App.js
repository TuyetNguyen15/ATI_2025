import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * CHỌN ĐÚNG BASE URL CHO BACKEND:
   * - Android emulator: 10.0.2.2
   * - iOS simulator: 127.0.0.1
   * - Thiết bị thật (Expo Go): ĐỔI thành IP LAN của máy bạn, ví dụ 192.168.1.23
   */
  const defaultLocal =
    Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

  // ⚠️ Nếu bạn chạy trên thiết bị thật (Expo Go), đổi LAN_IP bên dưới rồi bật:
  const LAN_IP = ''; // ví dụ: 'http://192.168.1.23:8000'
  const baseURL = useMemo(() => (LAN_IP ? LAN_IP : defaultLocal), [LAN_IP, defaultLocal]);

  const getPrediction = async () => {
    const q = question.trim();
    if (!q) {
      Alert.alert('Lỗi', 'Vui lòng nhập câu hỏi');
      return;
    }

    setLoading(true);
    setAnswer('');
    try {
      // Backend của bạn trả: { question: string, answer: string }
      const res = await axios.post(`${baseURL}/chat`, { question: q }, { timeout: 10000 });
      const data = res?.data;
      if (typeof data?.answer === 'string') {
        setAnswer(data.answer);
      } else {
        setAnswer('Phản hồi không đúng định dạng.');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Có lỗi xảy ra khi gọi API. Kiểm tra lại kết nối và server.';
      Alert.alert('Lỗi', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>🔮 Chatbox Bói Toán</Text>
        <Text style={styles.subtitle}>
          Đặt câu hỏi của bạn và nhận lời “tiên tri” từ server FastAPI.
        </Text>

        <Text style={styles.label}>Câu hỏi</Text>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: Hôm nay có may mắn không?"
          value={question}
          onChangeText={setQuestion}
          autoCapitalize="sentences"
          returnKeyType="send"
          onSubmitEditing={getPrediction}
        />

        <Pressable
          onPress={getPrediction}
          style={({ pressed }) => [
            styles.button,
            (pressed || loading) && { opacity: 0.8 },
            loading && { backgroundColor: '#9ca3af' },
          ]}
          disabled={loading}
        >
          {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Lấy dự đoán</Text>}
        </Pressable>

        {answer ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Kết quả</Text>
            <Text style={styles.answer}>{answer}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Backend: <Text style={styles.mono}>{baseURL}</Text>
          </Text>
          <Text style={styles.hint}>
            * Nếu dùng thiết bị thật, hãy đổi <Text style={styles.mono}>LAN_IP</Text> ở đầu file.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: '#f7f7fb',
    minHeight: '100%',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111827',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  card: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTitle: {
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
    fontSize: 16,
  },
  answer: {
    fontSize: 18,
    color: '#047857',
    fontWeight: '700',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
    gap: 4,
  },
  footerText: { color: '#6b7280' },
  hint: { color: '#9ca3af', fontSize: 12, textAlign: 'center' },
  mono: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
