import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { blockUser } from "../../services/blockService";
import { auth } from "../../config/firebaseConfig";

const actions = [
  { id: "icebreaker", label: "Ice-breaker", color: "#ffb6d5" },
  { id: "profile", label: "Xem trang cá nhân", color: "#ffb6d5" },
  { id: "compat", label: "Xem báo cáo tương thích chi tiết", color: "#ffb6d5" },
  { id: "block", label: "Block người này", color: "#ff6b6b", danger: true },
];

export default function ConnectionActionsScreen({ navigation, route }) {

  // ⭐ LẤY UID NGƯỜI ĐỐI DIỆN
  const partnerId = route?.params?.partnerId;
  const partnerName = route?.params?.partnerName;


  console.log("🔍 ConnectionActionsScreen - partnerId:", partnerId);

  const handlePress = (action) => {
    if (!partnerId) {
      Alert.alert("Lỗi", "Không tìm thấy UID người đối diện!");
      return;
    }

    switch (action.id) {
      case "icebreaker":
        navigation.navigate("IceBreakerScreen", { 
          uid: partnerId,
          
        });
        break;

      case "profile":
        navigation.navigate("UserProfileScreen", { uid: partnerId });
        break;

      case "compat":
        navigation.navigate("DetailedCompatibilityScreen", { uid: partnerId });
        break;

      case "block":
        confirmBlockUser();
        break;
    }
  };

  const confirmBlockUser = () => {
    Alert.alert(
      "Block người này?",
      "Bạn có chắc muốn block người này không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Block", style: "destructive", onPress: blockThisUser },
      ]
    );
  };

  const blockThisUser = async () => {
    const myUid = auth.currentUser?.uid;

    if (!myUid || !partnerId) {
      Alert.alert("Lỗi", "Không xác định được người dùng.");
      return;
    }

    await blockUser(myUid, partnerId);
    Alert.alert("Đã block thành công!");
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={["#050009", "#260014", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Cài Đặt</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* ACTION LIST */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glowWrapper}>
          <LinearGradient
            colors={["rgba(255, 105, 180,0.7)", "rgba(0,0,0,0.9)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.glowArea}
          >
            {actions.map((action, index) => (
              <View key={action.id} style={styles.actionRowWrapper}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handlePress(action)}
                  style={styles.actionRow}
                >
                  <Ionicons
                    name="flower-outline"
                    size={20}
                    color={action.danger ? "#ff6b6b" : "#ffd6f4"}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      action.danger && styles.dangerText,
                    ]}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>

                {index !== actions.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  glowWrapper: { flex: 1, marginTop: 20, alignItems: "center" },
  glowArea: {
    width: "100%",
    borderRadius: 40,
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  actionRowWrapper: { marginVertical: 6 },
  actionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  actionText: { fontSize: 16, color: "#ffe9ff", flexShrink: 1 },
  dangerText: { color: "#ff8080" },
  divider: {
    marginTop: 8,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});
