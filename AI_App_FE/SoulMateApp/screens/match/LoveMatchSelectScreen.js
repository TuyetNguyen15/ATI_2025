import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  { key: "redflag", title: "Red Flag", colors: ["#ff4d4d", "#800000"] },
  { key: "greenflag", title: "Green Flag", colors: ["#4ddf6a", "#0a7a2a"] },
  { key: "karma", title: "Karmic", colors: ["#ff8f24", "#cc5200"] },
  { key: "destiny", title: "Destiny", colors: ["#6a5acd", "#302b63"] },
  { key: "twinflame", title: "Twin Flame", colors: ["#ff75e6", "#b30092"] },
];

export default function LoveMatchSelectScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/background/matchingbg.jpg")} 
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Chọn loại kết nối</Text>

        {/* 2 card trên */}
        <View style={styles.row2}>
          {CATEGORIES.slice(0, 2).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.cardWrapper}
              onPress={() =>
                navigation.navigate("MatchingListScreen", { type: item.key })
              }
            >
              <LinearGradient colors={item.colors} style={styles.cardBig}>
                <Text style={styles.cardText}>{item.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3 card dưới */}
        <View style={styles.row3}>
          {CATEGORIES.slice(2).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.cardWrapperSmall}
              onPress={() =>
                navigation.navigate("MatchingListScreen", { type: item.key })
              }
            >
              <LinearGradient colors={item.colors} style={styles.cardSmall}>
                <Text style={styles.cardTextSmall}>{item.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    
  },
  scroll: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "white",
    marginBottom: 25,
    fontWeight: "700",
    textAlign: "center",
  },

  /* 2 card lớn trên */
  row2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.9,
    marginBottom: 20,
  },
  cardBig: {
    width: width * 0.42,
    height: 150,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },

  /* 3 card nhỏ dưới */
  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.9,
  },
  cardSmall: {
    width: width * 0.28,
    height: 120,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTextSmall: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },

  /* Wrapper */
  cardWrapper: {
    borderRadius: 18,
  },
  cardWrapperSmall: {
    borderRadius: 18,
  },
});
