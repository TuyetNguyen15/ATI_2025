import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const API_URL = "http://192.168.1.3:5000/generate";

export default function PredictionScreen({ route }) {
  const [category, setCategory] = useState("daily");
  const [day, setDay] = useState("today");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const userData = route?.params?.userData || {};

  const getDateString = () => {
    const today = new Date();
    if (day === "yesterday") today.setDate(today.getDate() - 1);
    if (day === "tomorrow") today.setDate(today.getDate() + 1);
    return today.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  // 🎯 Hàm gọi Flask API mỗi khi đổi category hoặc day
  const fetchPrediction = async () => {
    try {
      setLoading(true);
      const response = await axios.post(API_URL, {
        userData,
        category,
        day,
      });

      if (response.data.error) throw new Error(response.data.error);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("❌ Fetch error:", error);
      Alert.alert("Lỗi", "Không thể lấy dữ liệu chiêm tinh. Hãy thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Gọi lại API khi category hoặc day thay đổi
  useEffect(() => {
    fetchPrediction();
  }, [category, day]);

  // 🎨 Gradient theo category
  const getGradientColors = () => {
    switch (category) {
      case "love":
        return ["#101020", "#c85d86", "#ef659a"];
      case "work":
        return ["#101020", "#507140", "#429a1c"];
      default:
        return ["#101020", "#383a6f", "#0b1196"];
    }
  };

  return (
    <LinearGradient colors={getGradientColors()} style={styles.container}>
      {/* 🌙 Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dự đoán</Text>
        <Text style={styles.subtitle}>
          {category === "daily"
            ? "Chiêm tinh"
            : category === "love"
            ? "Tình duyên"
            : "Công việc"}
        </Text>
      </View>

      {/* 🔮 Tabs chọn category */}
      <View style={styles.categoryTabs}>
        {[
          { key: "daily", label: "Hằng ngày" },
          { key: "love", label: "Tình duyên" },
          { key: "work", label: "Công việc" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.categoryButton,
              category === tab.key && getActiveButtonColor(tab.key),
            ]}
            onPress={() => setCategory(tab.key)}
          >
            <Text
              style={[
                styles.categoryText,
                category === tab.key && styles.categoryTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 📆 Tabs chọn ngày */}
      <View style={styles.dayTabs}>
        {[
          { key: "yesterday", label: "Hôm qua" },
          { key: "today", label: "Hôm nay" },
          { key: "tomorrow", label: "Ngày mai" },
        ].map((tab) => (
          <TouchableOpacity key={tab.key} onPress={() => setDay(tab.key)}>
            <Text
              style={[styles.dayText, day === tab.key && styles.dayTextActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 📜 Box nội dung */}
      <View style={styles.predictionBox}>
        <Text style={styles.predictionTitle}>
          {category === "daily"
            ? "Dự đoán hằng ngày của bạn"
            : category === "love"
            ? "Dự đoán tình duyên của bạn"
            : "Dự đoán công việc của bạn"}
        </Text>
        <Text style={styles.predictionDate}>{getDateString()}</Text>

        <ScrollView style={styles.predictionScroll}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />
          ) : (
            <Text style={styles.predictionText}>
              {prediction || "Không có dữ liệu chiêm tinh nào được tạo ra 😢"}
            </Text>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const getActiveButtonColor = (key) => {
  switch (key) {
    case "love":
      return { backgroundColor: "#ff8fd6" };
    case "work":
      return { backgroundColor: "#2d6f1a" };
    default:
      return { backgroundColor: "#6c5ce7" };
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingBottom: 80 },
  header: { marginTop: 60, alignSelf: "flex-start", paddingHorizontal: 40 },
  title: { fontSize: 36, color: "#fff", fontWeight: "500" },
  subtitle: { fontSize: 32, color: "#d6ceff", fontWeight: "400", marginTop: 4 },
  categoryTabs: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 25,
    padding: 5,
    marginTop: 25,
  },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20 },
  categoryText: { color: "#bfb9d9", fontSize: 15, fontWeight: "600" },
  categoryTextActive: { color: "#fff" },
  dayTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    marginTop: 25,
  },
  dayText: { color: "#b8b4d9", fontSize: 16 },
  dayTextActive: { color: "#fff", fontWeight: "700" },
  predictionBox: {
    flex: 1,
    width: width * 0.9,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(180,150,255,0.4)",
    padding: 18,
    marginTop: 25,
  },
  predictionScroll: { flexGrow: 0 },
  predictionTitle: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 4 },
  predictionDate: { color: "#cfc9ff", fontSize: 16, marginBottom: 10 },
  predictionText: { color: "#dcd6ff", fontSize: 17, lineHeight: 26, textAlign: "justify" },
});
