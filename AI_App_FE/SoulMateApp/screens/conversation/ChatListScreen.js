import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const dummyChats = [
  {
    id: "1",
    name: "Minh Anh",
    avatar: "https://i.pravatar.cc/300?img=12",
    lastMessage: "Tối nay rảnh không? 😆",
    time: "2 phút trước",
    unread: true,        // ⭐ CHƯA ĐỌC
  },
  {
    id: "2",
    name: "Hoài Thương",
    avatar: "https://i.pravatar.cc/300?img=20",
    lastMessage: "Ngủ chưa đó bé 😴",
    time: "1 giờ",
    unread: false,       // ⭐ ĐÃ ĐỌC
  },
];

export default function ChatListScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/stars-bg.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        
        <Text style={styles.header}>Trò chuyện</Text>

        <FlatList
          data={dummyChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                navigation.navigate("ChatDetail", {
                  partner: item,
                })
              }
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.name,
                    item.unread && { fontWeight: "800", color: "#fff" },
                  ]}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.lastMessage,
                    item.unread ? { color: "#fff" } : { color: "#aaa" },
                  ]}
                >
                  {item.lastMessage}
                </Text>
              </View>

              {/* TIME */}
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.time}>{item.time}</Text>

                {/* DOT UNREAD */}
                {item.unread && <View style={styles.unreadDot} />}
              </View>

            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  
  header: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },

  avatar: { width: 55, height: 55, borderRadius: 30, marginRight: 15 },

  name: { color: "#ddd", fontSize: 17, fontWeight: "600" },

  lastMessage: { fontSize: 14, marginTop: 2 },

  time: { color: "#ccc", fontSize: 12, marginBottom: 6 },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
});
