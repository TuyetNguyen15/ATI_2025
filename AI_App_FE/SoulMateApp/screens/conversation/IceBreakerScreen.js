// 📄 src/screens/IceBreakerScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const initialSuggestions = [
  {
    id: "1",
    time: "12h trước",
    text: "Nghe nói Bạch Dương hay thích thử thách, hãy thử hỏi họ về những trải nghiệm phiêu lưu hoặc hoạt động thể thao mà họ yêu thích.",
  },
  {
    id: "2",
    time: "Hôm qua",
    text: "Hỏi họ xem gần đây có bộ phim, cuốn sách hay bài nhạc nào làm họ nhớ mãi không rồi bắt chuyện từ đó.",
  },
  {
    id: "3",
    time: "Gần đây",
    text: "Rủ họ kể về một kỷ niệm vui gần đây nhất, sau đó chia sẻ câu chuyện của bạn để tạo cảm giác đồng điệu.",
  },
];

export default function IceBreakerScreen({ navigation, route }) {
  const partnerName = route?.params?.partnerName ?? "người này";

  const [suggestions, setSuggestions] = useState(initialSuggestions);

  const handleGenerateMore = () => {
    // Tạm thời random thêm 1 suggestion demo.
    const newItem = {
      id: Date.now().toString(),
      time: "Vừa xong",
      text: `Thử hỏi ${partnerName} xem chuyến đi mà họ mơ ước nhất là ở đâu, rồi gợi ý “hay là sau này mình đi chung nhỉ”.`,
    };
    setSuggestions((prev) => [newItem, ...prev]);
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

      {/* Thời gian / nhãn nhỏ trên đầu */}
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
      </ScrollView>

      {/* Nút bóng đèn dưới đáy màn hình */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleGenerateMore}
          style={styles.bulbButtonWrapper}
        >
          <LinearGradient
            colors={["#ffdd7f", "#ff9b4a"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.bulbButton}
          >
            <Ionicons name="bulb" size={26} color="#3b1100" />
          </LinearGradient>
          <Text style={styles.bulbLabel}>Gợi ý thêm câu mở đầu</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  subHeader: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  subLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  itemWrapper: {
    marginBottom: 18,
  },
  timeText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#ff6fae",
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  bubbleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
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
  bulbButtonWrapper: {
    alignItems: "center",
  },
  bulbButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ffdd7f",
    shadowOpacity: 0.8,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  bulbLabel: {
    marginTop: 8,
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
});
