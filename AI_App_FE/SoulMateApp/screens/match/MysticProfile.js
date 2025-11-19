import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { ELEMENT_MAP, ELEMENT_COLORS, ZODIAC_ICONS } from '../../constants/astrologyMap';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { openDirectChat } from "../../services/chatService";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

// SIZE HÌNH LỚN Ở GIỮA
const CENTER_IMAGE_SIZE = width * 0.45;

// BÁN KÍNH INFO XOAY QUANH
const RADIUS = CENTER_IMAGE_SIZE * 0.75;

export default function MysticProfile({ info }) {
  const navigation = useNavigation();

  const infoItems = [
    { label: `Tên: ${info.name || "Không rõ"}`, row: 1, col: 1 },
    { label: `Cung: ${info.zodiac || info.planets?.sun || "Không rõ"}`, row: 1, col: 2 },

    { label: `Tuổi: ${info.age || "Không rõ"}`, row: 2, col: 1 },
    { label: `Hợp: ${info.compatibility_score || info.compatScore || 0}%`, row: 2, col: 2 },

    { label: `Nguyên tố: ${info.element || "Không rõ"}`, row: 3, col: 1 },
    { label: `Tính cách: ${info.personality || "Không rõ"}`, row: 3, col: 2 },
  ];

  const angleMap = {
    2: 300,
    5: 60,
    0: 240,
    4: 120,
    3: 180,
    1: 0,
  };
  const openChatWith = async (person) => {
    const result = await openDirectChat(myUid, myName, person);
    if (!result) return;
  
    navigation.navigate("ChatRoomScreen", {
      chatId: result.id,
      chatName: result.chatName,
    });
  };
  
  
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>

        <Text style={styles.title}>Bí mật chiêm tinh hé lộ</Text>

        {/* 🟣 HÌNH LỚN Ở GIỮA */}
        <Image
          source={require("../../assets/zodiac_circle.jpg")}
          style={styles.centerImage}
        />

        {/* 🔵 INFO XOAY QUANH */}
        {infoItems.map((item, i) => {
          const deg = angleMap[i];
          const rad = (deg * Math.PI) / 180;

          const x = Math.cos(rad) * RADIUS;
          const y = Math.sin(rad) * RADIUS;

          return (
            <View
              key={i}
              style={[
                styles.infoDot,
                { transform: [{ translateX: x }, { translateY: y }] }
              ]}
            >
              <Text style={styles.infoText}>{item.label}</Text>
            </View>
          );
        })}

      </View>

      {/* Compatibility */}
      <View style={styles.compatBox}>
        <Text style={styles.compatTitle}>Hòa hợp chiêm tinh</Text>
        <Text style={styles.compatSub}>Dựa trên phân tích chiêm tinh từ hệ thống</Text>

        {/* ICON 2 CUNG */}
        <View style={styles.zodiacCircleBox}>
          {/* Icon cung của bạn */}
          <View style={[styles.zodiacItem, { left: width * 0.10 }]}>
            <View style={styles.iconBg}>
              <Image
                source={ZODIAC_ICONS[info.myZodiac] || ZODIAC_ICONS["Không xác định"]}
                style={styles.zodiacIcon}
              />
            </View>
          </View>

          {/* Icon cung đối phương */}
          <View style={[styles.zodiacItem, { right: width * 0.10 }]}>
            <View style={styles.iconBg}>
              <Image
                source={ZODIAC_ICONS[info.otherZodiac] || ZODIAC_ICONS["Không xác định"]}
                style={styles.zodiacIcon}
              />
            </View>
          </View>

          {/* Điểm hợp ở giữa */}
          <View style={styles.scoreCenter}>
            <Text style={styles.scoreNumber}>
              {info.compatibility_score || info.compatScore || 0}%
            </Text>
          </View>
        </View>

        {/* 4 Chỉ số */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricColumn}>
            <Metric label="Love" value={info.love} color="#ff5f5f" />
            <Metric label="Trust" value={info.trust} color="#f4ca57" />
          </View>

          <View style={styles.metricColumn}>
            <Metric label="Communication" value={info.communication} color="#58a7f8" />
            <Metric label="Marriage" value={info.marriage} color="#5ff7a2" />
          </View>
        </View>
      </View>


      <TouchableOpacity
        onPress={() => openChatWith(info)}
        style={{ marginTop: 25 }}
      >
        <LinearGradient
          colors={["#ffb6d9", "#b36dff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.detailGradient}
        >
          <Text style={styles.detailText}>Kết nối</Text>
        </LinearGradient>
      </TouchableOpacity>


    </View>
  );
}

function Metric({ label, value = 0, color }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricLine}>
        <View style={[styles.metricFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.metricValue}>{value}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", width: "100%" },
  container: {
    marginTop: 50,
    width: width * 0.9,
    height: width * 1.0,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  title: {
    position: "absolute",
    top: -10,
    color: "#e6dfd0",
    fontSize: 26,
    fontWeight: "600",
    fontFamily: "Georgia",
  },
  centerImage: {
    width: CENTER_IMAGE_SIZE,
    height: CENTER_IMAGE_SIZE,
    resizeMode: "contain",
    position: "absolute",
  },
  infoDot: {
    position: "absolute",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 12,
    maxWidth: width * 0.35,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 20,
    flexWrap: "wrap",
    maxWidth: width * 0.33,
  },
  compatBox: {
    width: width * 0.92,
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  compatTitle: {
    color: "#e6dfd0",
    fontSize: 26,
    fontWeight: "600",
    fontFamily: "Georgia",
    textAlign: "center",
  },
  compatSub: {
    textAlign: "center",
    color: "#ccc",
    fontSize: 18,
    marginTop: 4,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  metricColumn: { width: "48%" },
  metricLabel: { color: "#fff", fontSize: 16, marginBottom: 4 },
  metricLine: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    overflow: "hidden",
  },
  metricFill: { height: 6, borderRadius: 10 },
  metricValue: { color: "#fff", fontSize: 18, marginTop: 2 },
  zodiacCircleBox: {
    width: width * 0.9,
    height: width * 0.42,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  zodiacItem: {
    position: "absolute",
    top: "30%",
    alignItems: "center",
  },
  zodiacIcon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  scoreCenter: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreNumber: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "800",
    textShadowColor: "rgba(255,255,255,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  iconBg: {
    width: 90,
    height: 90,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ffffff",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
  },
  detailGradient: {
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ffb6d9",
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  detailText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
