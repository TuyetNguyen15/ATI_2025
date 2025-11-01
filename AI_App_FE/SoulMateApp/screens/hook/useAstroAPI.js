import { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-native";

/**
 * Custom Hook quản lý API chiêm tinh
 * @param {string} API_URL - URL backend Flask (http://xxx:5000/generate)
 * @param {object} profile - Dữ liệu hồ sơ người dùng (name, sun, moon, ...)
 * @param {string} scope - "astro" | "love"
 * @param {object} navigation - React Navigation để điều hướng
 */
export const useAstroAPI = (API_URL, profile, scope, navigation) => {
  // 🌞 State lưu các chỉ số tình duyên
  const [loveLuck, setLoveLuck] = useState(0);
  const [bestMatch, setBestMatch] = useState('');
  const [compatibility, setCompatibility] = useState(0);
  const [quote, setQuote] = useState('');
  const [loadingLove, setLoadingLove] = useState(false);

  // 🔮 Gọi API để sinh dự đoán (daily/love/work)
  const handleGeneratePrediction = async (category = "daily") => {
    try {
      const userData = {
        uid: profile.uid,
        name: profile.name,
        sun: profile.sun,
        moon: profile.moon,
        birthDate: profile.birthDate,
      };

      const response = await axios.post(API_URL, {
        userData,
        category,
        day: "today",
      });

      if (response.data.error) throw new Error(response.data.error);

      navigation.navigate("Prediction", {
        prediction: response.data.prediction,
        userData,
      });
    } catch (error) {
      console.error("❌ Lỗi dự đoán:", error);
      Alert.alert("Lỗi", "Không thể tạo dự đoán. Hãy thử lại sau!");
    }
  };

  // 💕 Gọi API để lấy chỉ số tình duyên (widget)
  const fetchLoveMetrics = async () => {
    try {
      setLoadingLove(true);
      const res = await axios.post(API_URL, {
        userData: {
          name: profile.name,
          sun: profile.sun,
          moon: profile.moon,
        },
        category: "love_extra", // Flask xử lý category này
        day: "today",
      });

      setLoveLuck(res.data.love_luck || 0);
      setBestMatch(res.data.best_match || '...');
      setCompatibility(res.data.compatibility || 0);
      setQuote(res.data.quote || '');
    } catch (err) {
      console.error("❌ Lỗi lấy love metrics:", err);
    } finally {
      setLoadingLove(false);
    }
  };

  // ⏳ Tự động gọi khi scope === 'love'
  useEffect(() => {
    if (scope === "love") {
      fetchLoveMetrics();
    }
  }, [scope]);

  // 🔁 Xuất các hàm & state ra ngoài
  return {
    handleGeneratePrediction,
    loveLuck,
    bestMatch,
    compatibility,
    quote,
    loadingLove,
  };
};
