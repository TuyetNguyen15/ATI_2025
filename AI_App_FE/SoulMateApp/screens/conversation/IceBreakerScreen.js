// 📄 src/screens/IceBreakerScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import aiClient from "../../services/aiClient";


export default function IceBreakerScreen({ navigation, route }) {
  const uid = route?.params?.uid;

  const partnerName = route?.params?.partnerName ?? "người này";

  // ❌ XÓA 3 DEMO — GIỮ DANH SÁCH TRỐNG
  const [suggestions, setSuggestions] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleGenerateMore = async () => {
    try {
      setLoading(true);

      // ⭐ Prompt Fireworks AI
      const prompt = `
      Bạn là AI tạo câu mở đầu cuộc trò chuyện thật tự nhiên. 
      Hãy tạo một câu Ice-breaker cực duyên để bắt chuyện với "${partnerName}".
      Câu văn ngắn gọn, ấm áp, dễ mở đầu.
      Trả về chỉ 1 câu, không giải thích.
      `;

      const response = await aiClient.generateText(prompt);

      const text = response?.trim() || "Hỏi họ về điều khiến họ vui gần đây nhé!";

      const newItem = {
        id: Date.now().toString(),
        time: "Vừa xong",
        text,
      };

      setSuggestions((prev) => [newItem, ...prev]);
    } catch (err) {
      console.log("AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#050009", "#260014", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Ice-breaker</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Sub label */}
      <View style={styles.subHeader}>
        <Text style={styles.subLabel}>
          Gợi ý để bắt chuyện với {partnerName}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {suggestions.map((item) => (
          <View key={item.id} style={styles.itemWrapper}>
            <Text style={styles.timeText}>{item.time}</Text>

            <LinearGradient
              colors={["#4d0129", "#a6275f"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bubble}
            >
              <View style={styles.bubbleHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="flower" size={16} color="#ffe9ff" />
                </View>
              </View>
              <Text style={styles.bubbleText}>{item.text}</Text>
            </LinearGradient>
          </View>
        ))}

        {/* Loading indicator */}
        {loading && (
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <ActivityIndicator size="large" color="#ff77a9" />
            <Text style={{ color: "#fff", marginTop: 6 }}>Đang tạo gợi ý...</Text>
          </View>
        )}
      </ScrollView>

      {/* Bóng đèn */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleGenerateMore}
          disabled={loading}
          style={styles.bulbButtonWrapper}
        >
          <LinearGradient
            colors={["#ffdd7f", "#ff9b4a"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.bulbButton}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#3b1100" />
            ) : (
              <Ionicons name="bulb" size={26} color="#3b1100" />
            )}
          </LinearGradient>
          <Text style={styles.bulbLabel}>Gợi ý thêm câu mở đầu</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, color: "#ffffff", fontWeight: "600" },
  subHeader: { paddingHorizontal: 20, paddingBottom: 8 },
  subLabel: { fontSize: 13, color: "rgba(255,255,255,0.6)" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  itemWrapper: { marginBottom: 18 },
  timeText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 6,
  },
  bubble: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  bubbleHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleText: {
    fontSize: 14,
    color: "#ffe9ff",
    lineHeight: 20,
  },
  bottomBar: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bulbButtonWrapper: { alignItems: "center" },
  bulbButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  bulbLabel: {
    marginTop: 8,
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
});
