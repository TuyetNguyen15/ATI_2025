import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function PredictionScreen() {
  const [category, setCategory] = useState("daily");
  const [day, setDay] = useState("today");

  // 🎨 Màu gradient khác nhau cho từng category
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
    <Text style={styles.subtitle}>Chiêm tinh</Text>
  </View>

  {/* 🔮 Category Tabs */}
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

  {/* 📆 Day Tabs */}
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

  {/* 📜 Prediction Box */}
  <View style={styles.predictionBox}>
    <Text style={styles.predictionTitle}>
      {category === "daily"
        ? "Dự đoán hằng ngày của bạn"
        : category === "love"
        ? "Dự đoán tình duyên của bạn"
        : "Dự đoán công việc của bạn"}
    </Text>
    <Text style={styles.predictionDate}>Thứ 6, 3/10/2025</Text>

    {/* 🔽 Scroll nội dung bên trong */}
    <ScrollView style={styles.predictionScroll}>
      <Text style={styles.predictionText}>
        Ngoài câu chuyện “Thầy bói xem voi” kể trên, còn có rất nhiều
        các câu chuyện cười dân gian Việt Nam được Thế giới văn học sưu
        tầm và chọn lọc. Những câu chuyện này thường phê phán một cách
        hóm hỉnh những thói hư tật xấu trong nhân gian, hay đả kích một
        cách sâu cay tính chất bóc lột và xảo trá của tầng lớp thống trị
        trong xã hội cũ.{"\n\n"}
        Đừng bỏ qua những phút giây giải trí tại Thế giới văn học!
        Ngoài câu chuyện “Thầy bói xem voi” kể trên, còn có rất nhiều
        các câu chuyện cười dân gian Việt Nam được Thế giới văn học sưu
        tầm và chọn lọc. Những câu chuyện này thường phê phán một cách
        hóm hỉnh những thói hư tật xấu trong nhân gian, hay đả kích một
        cách sâu cay tính chất bóc lột và xảo trá của tầng lớp thống trị
        trong xã hội cũ.{"\n\n"}
        Đừng bỏ qua những phút giây giải trí tại Thế giới văn học!
      </Text>
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
  container: {
    flex: 1,
    paddingBottom: 80, 
    alignItems: "center",
  },

  header: {
    marginTop: 60,
    alignSelf: "flex-start",
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 32,
    color: "#d6ceff",
    fontWeight: "400",
    marginTop: 4,
  },

  categoryTabs: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 25,
    padding: 5,
    marginTop: 25,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  categoryText: {
    color: "#bfb9d9",
    fontSize: 15,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#fff",
  },

  dayTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    marginTop: 25,
  },
  dayText: {
    color: "#b8b4d9",
    fontSize: 16,
  },
  dayTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  // 📜 Box kéo dài đến gần bottom
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
  predictionScroll: {
    flexGrow: 0, // tránh scroll toàn trang
  },
  predictionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  predictionDate: {
    color: "#cfc9ff",
    fontSize: 16,
    marginBottom: 10,
  },
  predictionText: {
    color: "#dcd6ff",
    fontSize: 17,
    lineHeight: 26,
    textAlign: "justify",
  },
});
