import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatScreen({ route, navigation }) {
  const { partner } = route.params;

  const [messages, setMessages] = useState([
    { id: "1", text: "Hello 😄", mine: false },
    { id: "2", text: "Hi bạn ơi 😆", mine: true },
  ]);

  const [text, setText] = useState("");

  const sendMessage = () => {
    if (text.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text, mine: true },
      ]);
      setText("");
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        
        {/* BACK BUTTON */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* NAME */}
        <Text style={styles.name}>{partner.name}</Text>

        {/* MENU BUTTON */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ConnectionActions", {
              partnerName: partner.name,
              partnerId: partner.id,
              avatar: partner.avatar,
            })
          }
        >
          <Ionicons name="ellipsis-horizontal" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        style={styles.list}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.mine ? styles.myBubble : styles.theirBubble,
            ]}
          >
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          placeholder="Nhắn gì đó..."
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={26} color="#ff8bd7" />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0014" },
  
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#12001f",
  },

  name: { color: "#fff", fontSize: 20, fontWeight: "600" },

  list: { padding: 20 },

  bubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 5,
  },
  myBubble: {
    backgroundColor: "#ff6ab8",
    alignSelf: "flex-end",
  },
  theirBubble: {
    backgroundColor: "#42214a",
    alignSelf: "flex-start",
  },

  msgText: { color: "#fff", fontSize: 16 },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#12001f",
  },

  input: {
    flex: 1,
    height: 45,
    color: "#fff",
    backgroundColor: "#1b0330",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
});
