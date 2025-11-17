import React, { useState } from "react";
import {
    View,
    Image,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import MysticProfile from "./MysticProfile";

const { width } = Dimensions.get("window");
const CENTER = width / 2;

export default function MatchPersonList() {
    const [selected, setSelected] = useState(null);

    const cards = [
        require("../../assets/cards/card5.jpg"),
        require("../../assets/cards/card1.jpg"),
        require("../../assets/cards/card3.jpg"),
        require("../../assets/cards/card4.jpg"),
        require("../../assets/cards/card21.jpg"),
    ];

    // ⭐ DỮ LIỆU INFO CHO TỪNG CARD
    const info = [
        { name: "Minh Anh", zodiac: "Bạch Dương", age: 21 },
        { name: "Hoài Thương", zodiac: "Kim Ngưu", age: 22 },
        { name: "Hạ Vy", zodiac: "Song Tử", age: 20 },
        { name: "Lan Chi", zodiac: "Cự Giải", age: 23 },
        { name: "Khánh Linh", zodiac: "Sư Tử", age: 21 },
    ];

    // ➤ PURE OVERLAY — không động style gốc
    const renderCard = (index, source, baseStyle) => {
        const isSelected = selected === index;

        return (
            <TouchableOpacity
                onPress={() => setSelected(index)}
                style={[baseStyle, { position: "absolute" }]}
            >
                <Image
                    source={source}
                    style={{
                        width: baseStyle.width,
                        height: baseStyle.height,
                        borderRadius: baseStyle.borderRadius,
                    }}
                />

                {isSelected && (
                    <View
                        pointerEvents="none"
                        style={[
                            StyleSheet.absoluteFillObject,
                            {
                                borderWidth: 1.5,
                                borderColor: "#c3c0ed",
                                borderRadius: baseStyle.borderRadius,
                                opacity: 0.7,
                                shadowColor: "#FFD700",
                                shadowOpacity: 0.9,
                                shadowRadius: 12,
                                shadowOffset: { width: 0, height: 0 },
                            },
                        ]}
                    />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>5 người hợp nhóm này</Text>

            <View style={styles.board}>
                {renderCard(2, cards[2], {
                    ...styles.cardLarge,
                    position: "absolute",
                    left: CENTER - width * 0.32 / 2,
                    zIndex: 10,
                })}

                {renderCard(1, cards[1], {
                    ...styles.cardMedium,
                    position: "absolute",
                    left: CENTER - 140,
                    zIndex: 7,
                    transform: [{ rotate: "-10deg" }],
                })}

                {renderCard(0, cards[0], {
                    ...styles.cardSmall,
                    position: "absolute",
                    left: CENTER - 190,
                    zIndex: 5,
                    transform: [{ rotate: "-20deg" }],
                })}

                {renderCard(3, cards[3], {
                    ...styles.cardMedium,
                    position: "absolute",
                    left: CENTER + 40,
                    zIndex: 6,
                    transform: [{ rotate: "10deg" }],
                })}

                {renderCard(4, cards[4], {
                    ...styles.cardSmall,
                    position: "absolute",
                    left: CENTER + 110,
                    zIndex: 4,
                    transform: [{ rotate: "20deg" }],
                })}
            </View>

            {/* ⭐ BOX HIỂN THỊ INFO NGAY BÊN DƯỚI */}
            {selected !== null && (
                <MysticProfile info={info[selected]} />
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
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 20,
    },
    board: {
        width: width,
        height: width * 0.55,
        position: "relative",
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

    // ⭐ THÔNG TIN BÊN DƯỚI
    infoBox: {
        marginTop: 25,
        backgroundColor: "rgba(255,255,255,0.12)",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 14,
        alignItems: "center",
        width: width * 0.65,
    },
    infoName: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    infoZodiac: {
        color: "#d8b4ff",
        fontSize: 16,
        marginTop: 4,
    },
    infoAge: {
        color: "#fff",
        fontSize: 15,
        marginTop: 2,
        opacity: 0.8,
    },
});
