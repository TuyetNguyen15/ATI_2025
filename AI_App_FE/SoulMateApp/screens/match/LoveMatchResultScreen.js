import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";


import { useSelector } from "react-redux";
import { ELEMENT_MAP } from "../../constants/astrologyMap";

import MysticProfile from "./MysticProfile";

const { width } = Dimensions.get("window");
const CENTER = width / 2;

const cards = [
  require("../../assets/cards/card5.jpg"),
  require("../../assets/cards/card1.jpg"),
  require("../../assets/cards/card3.jpg"),
  require("../../assets/cards/card4.jpg"),
  require("../../assets/cards/card21.jpg"),
];

export default function LoveMatchResultScreen({ type, people }) {
  const [selected, setSelected] = useState(null);
  const navigation = useNavigation();

  // Lấy dữ liệu user đang đăng nhập
  const profile = useSelector((state) => state.profile);

  if (!people || people.length < 5) {
    return <Text style={{ color: "#fff", marginTop: 20 }}>Không đủ dữ liệu</Text>;
  }

  // RENDER TỪNG CARD
  const renderCard = (index, person, baseStyle) => {
    const isSelected = selected === index;

    const cardImg = cards[index % cards.length];

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.9}
        onPress={() => setSelected(index)}
        style={[styles.cardAbsolute, baseStyle]}
      >
        <Image
          source={cardImg}
          style={{
            width: baseStyle.width,
            height: baseStyle.height,
            borderRadius: baseStyle.borderRadius,
            resizeMode: "cover",
          }}
        />

        {isSelected && (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFillObject, styles.activeBorder]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn lá bài để khám phá</Text>

      <View style={styles.board}>
        {renderCard(2, people[2], {
          ...styles.cardLarge,
          left: CENTER - width * 0.32 / 2,
          zIndex: 10,
        })}

        {renderCard(1, people[1], {
          ...styles.cardMedium,
          left: CENTER - 140,
          zIndex: 7,
          transform: [{ rotate: "-10deg" }],
        })}

        {renderCard(0, people[0], {
          ...styles.cardSmall,
          left: CENTER - 190,
          zIndex: 5,
          transform: [{ rotate: "-20deg" }],
        })}

        {renderCard(3, people[3], {
          ...styles.cardMedium,
          left: CENTER + 40,
          zIndex: 6,
          transform: [{ rotate: "10deg" }],
        })}

        {renderCard(4, people[4], {
          ...styles.cardSmall,
          left: CENTER + 110,
          zIndex: 4,
          transform: [{ rotate: "20deg" }],
        })}
      </View>

      {/* HỒ SƠ CHIÊM TINH — CHỈ HIỂN THỊ KHI CHỌN CARD */}
      {selected !== null && (
        <MysticProfile
          info={{
            ...people[selected],
            myUid: profile.uid, 
            myZodiac: profile.sun,
            myElement: ELEMENT_MAP[profile.sun],

            otherZodiac: people[selected].zodiac,
            otherElement: people[selected].element,
          }}
          
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingBottom: 100,
    alignItems: "center",
  },
  title: {
    color: "#e6dfd0",
    fontSize: 26,
    fontWeight: "600",
    fontFamily: "Georgia",
    letterSpacing: 1,
    marginBottom: 40,
  },
  
  board: {
    width: width,
    height: width * 0.55,
    position: "relative",
  },

  cardAbsolute: {
    position: "absolute",
  },

  activeBorder: {
    borderWidth: 2,
    borderColor: "#d9d4ff",
    borderRadius: 12,
    opacity: 0.8,
  },

  cardSmall: {
    width: width * 0.22,
    height: width * 0.35,
    borderRadius: 12,
  },
  cardMedium: {
    width: width * 0.26,
    height: width * 0.40,
    borderRadius: 12,
  },
  cardLarge: {
    width: width * 0.32,
    height: width * 0.48,
    borderRadius: 12,
  },
});
