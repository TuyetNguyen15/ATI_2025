
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useSelector } from "react-redux";
import LoveMatchResultScreen from "../match/LoveMatchResultScreen";
import { BASE_URL } from "../../config/api";
const { width } = Dimensions.get("window");


const CATEGORIES = [
  { key: "redflag", title: "Red Flag", img: require("../../assets/type/redflag.png") },
  { key: "greenflag", title: "Green Flag", img: require("../../assets/type/greenflag.png") },
  { key: "karmic", title: "Karmic", img: require("../../assets/type/karmic.png") },
  { key: "destiny", title: "Destiny", img: require("../../assets/type/destiny.png") },
  { key: "twinflame", title: "Twin Flame", img: require("../../assets/type/twin.png") },
];
const DESC_MAP = {
  redflag: "Năng lượng mạnh nhưng khó kiểm soát. Hai người dễ kích hoạt điểm yếu của nhau, tạo ra va chạm và thử thách liên tục.",
  greenflag: "Sự kết nối dễ chịu và an toàn. Cả hai hỗ trợ nhau phát triển, ít mâu thuẫn và luôn thấy thoải mái khi ở cạnh nhau.",
  karmic: "Cuộc gặp gỡ mang tính định mệnh từ quá khứ. Hai linh hồn có duyên nợ và đến để dạy nhau bài học quan trọng.",
  destiny: "Một kết nối dẫn lối tương lai. Cảm giác thân thuộc mạnh mẽ, dễ phát triển về lâu dài.",
  twinflame: "Năng lượng cao nhất và hiếm nhất. Như hai bản thể phản chiếu nhau, kích hoạt sự trưởng thành mạnh mẽ.",
};

export default function LoveMatchSelectScreen() {
  const user = useSelector((state) => state.profile);

  const [selectedType, setSelectedType] = useState("greenflag");   // AUTO CHỌN GREEN FLAG
  const [singleMatchData, setSingleMatchData] = useState(null);
  const [loading, setLoading] = useState(false);

  // GỌI API
  const loadSingleMatching = async (type) => {
    try {
      setLoading(true);
      setSingleMatchData(null);
  
      // 1️⃣ CHECK FIRESTORE TRƯỚC
      const cached = await fetch(
        `${BASE_URL}/love-matching/history/${user.uid}/${type}`
      ).then(res => res.json());
  
      console.log("📌 CACHE CHECK:", cached);
  
      if (cached.success && cached.cached && cached.users.length > 0) {
        console.log("⚡ LOAD FROM DB:", type);
        setSingleMatchData(cached.users);
        setLoading(false);
        return;
      }
  
      // KHÔNG CÓ CACHE → GỌI AI
      console.log("🤖 CALL AI:", type);
      const res = await axios.post(`${BASE_URL}/love-matching/${type}`, {
        uid: user.uid,
      });
  
      if (res.data?.users) {
        setSingleMatchData(res.data.users);
      } else {
        setSingleMatchData([]);
      }
  
    } catch (err) {
      console.log("LOAD MATCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // AUTO LOAD GREEN FLAG NGAY KHI VÀO
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleSelect("greenflag");
    }, 200);
  
    return () => clearTimeout(timer);
  }, []);
  

  // Khi chọn loại khác
  const handleSelect = (type) => {
    setSelectedType(type);
    loadSingleMatching(type);
  };

  const selectedItem = CATEGORIES.find((c) => c.key === selectedType);

  return (
    <ImageBackground
      source={require("../../assets/background/matchingbg1.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(10,0,30,0.7)", "rgba(20,0,50,0.5)"]}
        style={styles.overlay}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Chọn Năng Lượng Giữa Hai Bạn</Text>
        {/* 2 BOX TRÊN */}
        <View style={styles.row2}>
          {CATEGORIES.slice(0, 2).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.cardWrapperBig}
              onPress={() => handleSelect(item.key)}
            >
              <View
                style={[
                  styles.cardBig,
                  selectedType === item.key ? styles.cardActive : styles.cardInactive
                ]}
              >
                <Image source={item.img} style={styles.imgBig} />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3 BOX DƯỚI */}
        <View style={styles.row3}>
          {CATEGORIES.slice(2).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.cardWrapperSmall}
              onPress={() => handleSelect(item.key)}
            >
              <View
                style={[
                  styles.cardSmall,
                  selectedType === item.key ? styles.cardActive : styles.cardInactive
                ]}
              >

                <Image source={item.img} style={styles.imgSmall} />
                <Text style={styles.cardTitleSmall}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* BOX GIẢI THÍCH CATEGORY */}
        {selectedItem && !loading && (
          <View style={styles.detailBox}>
            <Text style={styles.detailDesc}>{DESC_MAP[selectedItem.key]}</Text>
          </View>
        )}

        {/* LOADING RIÊNG CHO MỖI LOẠI */}
        {loading && (
          <View style={{ marginTop: 40 }}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{ color: "#fff", marginTop: 10 }}>Đang phân tích...</Text>
          </View>
        )}

        {/* HIỂN THỊ 5 NGƯỜI */}
        {!loading && selectedItem && singleMatchData && (
          <LoveMatchResultScreen type={selectedItem.key} people={singleMatchData} />
        )}

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject },
  title: {
    color: "#e6dfd0",
    fontSize: 26,
    fontWeight: "600",
    fontFamily: "Georgia",
    letterSpacing: 1,
    marginBottom: 40,
  },
  scroll: {
    paddingTop: 80,
    paddingBottom: 100,
    alignItems: "center",
  },

  row2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.88,
    marginBottom: 35,
  },

  cardWrapperBig: { width: width * 0.42 },
  cardBig: { alignItems: "center", backgroundColor: "transparent" },
  imgBig: { width: 65, height: 65, marginBottom: 6 },

  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.88,
  },
  detailBox: {
    marginTop: 40,
    width: width * 0.88,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  detailDesc: {
    fontSize: 14,
    color: "#cfcfcf",
    textAlign: "center",
    lineHeight: 20,
  },
  cardInactive: {
    opacity: 0.35,   // xám mờ
  },
  cardActive: {
    opacity: 1,      // sáng bình thường
  },
  cardWrapperSmall: { width: width * 0.28 },
  cardSmall: { alignItems: "center" },
  imgSmall: { width: 55, height: 55, marginBottom: 4 },

  cardTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  cardTitleSmall: { fontSize: 20, fontWeight: "700", color: "#fff" },
});
