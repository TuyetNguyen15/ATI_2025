import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// SIZE HÌNH LỚN Ở GIỮA
const CENTER_IMAGE_SIZE = width * 0.45;

// BÁN KÍNH INFO XOAY QUANH
const RADIUS = CENTER_IMAGE_SIZE * 0.85;

export default function MysticProfile({ info }) {
  const infoItems = [
    { label: `Tên: ${info.name}` },
    { label: `Cung: ${info.zodiac}` },
    { label: `${info.age} tuổi` },
    { label: `Hợp: ${info.score || "92%"}` },
    { label: `Nguyên tố: ${info.element || "Lửa"}` },
    { label: `Tính cách: ${info.personality || "Năng "}` },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>

        <Text style={styles.title}>Hồ sơ chiêm tinh</Text>

        {/* 🟣 HÌNH LỚN Ở GIỮA */}
        <Image
          source={require("../../assets/zodiac_circle.jpg")}
          style={styles.centerImage}
        />

        {/* 🔵 INFO XOAY QUANH */}
        {infoItems.map((item, i) => {
          const angle = (i / infoItems.length) * 2 * Math.PI;
          const x = Math.cos(angle) * RADIUS;
          const y = Math.sin(angle) * RADIUS;

          return (
            <View
              key={i}
              style={[
                styles.infoDot,
                { transform: [{ translateX: x }, { translateY: y }] },
              ]}
            >
              <Text style={styles.infoText}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      {/* ⭐ THÊM ZODIAC COMPATIBILITY Ở ĐÂY ⭐ */}
      <View style={styles.compatBox}>
        <Text style={styles.compatTitle}>Zodiac Compatibility</Text>
        <Text style={styles.compatSub}>
          Based on your responses and birth data, it looks like you have a match
        </Text>

        {/* ICON 2 CUNG */}
        <View style={styles.compatRow}>
          {/* YOU */}
          <View style={styles.zodiacSide}>
            <View style={styles.zodiacGlowWrapper}>
              <View style={styles.zodiacGlow} />
              <Image
                source={require("../../assets/zodiacsigns/cugiai.png")}
                style={styles.zodiacIcon}
              />
            </View>

            <Text style={styles.zName}>{info.myZodiac}</Text>
            <Text style={styles.element}>{info.myElement}</Text>
          </View>

          {/* SCORE */}
          <View style={styles.scoreBox}>
            <Text style={styles.percent}>{info.compatScore || 60}%</Text>

          </View>

          {/* PARTNER */}
          <View style={styles.zodiacSide}>
            <View style={styles.zodiacGlowWrapper}>
              <View style={styles.zodiacGlow} />
              <Image
                source={require("../../assets/zodiacsigns/cugiai.png")}
                style={styles.zodiacIcon}
              />
            </View>

            <Text style={styles.zName}>{info.otherZodiac}</Text>
            <Text style={styles.element}>{info.otherElement}</Text>
          </View>
        </View>

        {/* 4 CHỈ SỐ */}
        <View style={styles.metricsContainer}>
          {/* Cột trái */}
          <View style={styles.metricColumn}>
            <Metric label="Love" value={info.love || 55} color="#ff5f5f" />
            <Metric label="Trust" value={info.trust || 55} color="#f4ca57" />
          </View>

          {/* Cột phải */}
          <View style={styles.metricColumn}>
            <Metric
              label="Communication"
              value={info.communication || 45}
              color="#58a7f8"
            />
            <Metric label="Marriage" value={info.marriage || 55} color="#5ff7a2" />
          </View>
        </View>


        <Text style={styles.otherText}>Other best matches</Text>
      </View>
    </View>
  );
}

// Component thanh thông số
function Metric({ label, value, color }) {
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

  zodiacGlowWrapper: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  zodiacGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: "rgba(200, 100, 255, 0.25)",
    blurRadius: 20,         // iOS
    opacity: 0.6,
  },

  zodiacIcon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },


  wrapper: {
    alignItems: "center",
    width: "100%",
  },

  container: {
    marginTop: 40,
    width: width * 0.9,
    height: width * 1.0,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  title: {
    position: "absolute",
    top: -10,
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
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
    fontWeight: "600",
    textAlign: "center",
  },

  /* --- ZODIAC COMPATIBILITY BOX --- */
  compatBox: {
    width: width * 0.92,
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
  },

  compatTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },

  compatSub: {
    textAlign: "center",
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },

  compatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  zodiacSide: {
    width: width * 0.23,
    alignItems: "center",
  },

  zodiacIcon: {
    width: 65,
    height: 65,
    resizeMode: "contain",
  },

  zName: {
    color: "#fff",
    marginTop: 6,
    fontSize: 14,
  },

  element: {
    color: "#bbb",
    fontSize: 12,
  },

  scoreBox: {
    alignItems: "center",
    justifyContent: "center",
  },

  percent: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
  },

  wave: {
    width: 60,
    height: 20,
    resizeMode: "contain",
    marginTop: -4,
  },

  metricLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },

  metricLine: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    overflow: "hidden",
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },

  metricColumn: {
    width: "48%",
  },

  metricFill: {
    height: 6,
    borderRadius: 10,
  },

  metricValue: {
    color: "#fff",
    fontSize: 18,
    marginTop: 2,
  },

  otherText: {
    textAlign: "center",
    marginTop: 20,
    color: "#fff",
    fontSize: 15,
    opacity: 0.85,
  },
});
