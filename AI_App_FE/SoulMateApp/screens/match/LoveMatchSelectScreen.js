import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MatchPersonList from "../match/LoveMatchResultScreen";

const { width } = Dimensions.get("window");

// 👉 Thay image require thành ảnh thật của bạn
const CATEGORIES = [
  {
    key: "redflag",
    title: "Red Flag",
    desc: "Năng lượng mạnh nhưng khó kiểm soát. Hai người dễ kích hoạt điểm yếu của nhau, tạo ra va chạm và thử thách liên tục.",
    img: require("../../assets/zodiacsigns/cugiai.png"),
  },
  {
    key: "greenflag",
    title: "Green Flag",
    desc: "Sự kết nối dễ chịu và an toàn. Cả hai hỗ trợ nhau phát triển, ít mâu thuẫn, và luôn cảm thấy thoải mái khi ở cạnh nhau.",
    img: require("../../assets/zodiacsigns/cugiai.png"),
  },
  {
    key: "karma",
    title: "Karmic",
    desc: "Cuộc gặp gỡ không ngẫu nhiên. Hai linh hồn có duyên nợ từ quá khứ, đến để dạy nhau những bài học quan trọng.",
    img: require("../../assets/zodiacsigns/cugiai.png"),
  },
  {
    key: "destiny",
    title: "Destiny",
    desc: "Một dạng kết nối dẫn lối tương lai. Cảm giác thân thuộc mạnh mẽ, như thể hai bạn đã biết nhau từ rất lâu. Dễ phát triển lâu dài.",
    img: require("../../assets/zodiacsigns/cugiai.png"),
  },
  {
    key: "twinflame",
    title: "Twin Flame",
    desc: "Năng lượng cao nhất và hiếm nhất. Người này giống như phiên bản phản chiếu của bạn—mang đến sự thấu hiểu cực sâu và sự trưởng thành mạnh mẽ.",
    img: require("../../assets/zodiacsigns/cugiai.png"),
  },
];

export default function LoveMatchSelectScreen() {

  const [selectedType, setSelectedType] = useState(null);

  const handleSelect = (key) => {
    // nếu nhấn lại -> ẩn component
    setSelectedType(prev => (prev === key ? null : key));
  };

  const selectedItem = CATEGORIES.find((item) => item.key === selectedType);

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

        {/* 2 BOX TRÊN */}
        <View style={styles.row2}>
          {CATEGORIES.slice(0, 2).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.cardWrapperBig}
              onPress={() => handleSelect(item.key)}
            >
              <View style={styles.cardBig}>
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
              <View style={styles.cardSmall}>
                <Image source={item.img} style={styles.imgSmall} />
                <Text style={styles.cardTitleSmall}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔮 COMPONENT HIỂN THỊ DƯỚI */}
        {selectedItem && (
          <>
            <View style={styles.detailBox}>
              {/* <Image source={selectedItem.img} style={styles.detailImg} /> */}
              <Text style={styles.detailTitle}>{selectedItem.title}</Text>
              <Text style={styles.detailDesc}>{selectedItem.desc}</Text>
            </View>

            {/* COMPONENT 5 NGƯỜI */}
            <MatchPersonList type={selectedItem.key} />
          
          </>
        )}


      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject },

  scroll: {
    paddingTop: 80,
    paddingBottom: 100,
    alignItems: "center",
  },

  /* 2 BOX TRÊN */
  row2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.88,
    marginBottom: 35,
  },
  cardWrapperBig: { width: width * 0.42 },
  cardBig: { alignItems: "center", backgroundColor: "transparent" },
  imgBig: { width: 65, height: 65, marginBottom: 6 },

  /* 3 BOX DƯỚI */
  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.88,
  },
  cardWrapperSmall: { width: width * 0.28 },
  cardSmall: { alignItems: "center" },
  imgSmall: { width: 55, height: 55, marginBottom: 4 },

  cardTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  cardTitleSmall: { fontSize: 20, fontWeight: "700", color: "#fff" },

  /* 🔮 COMPONENT HIỂN THỊ Ở DƯỚI */
  detailBox: {
    marginTop: 40,
    width: width * 0.88,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    alignItems: "center",
  },
  detailImg: {
    width: 70,
    height: 70,
    marginBottom: 12,
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
});
