import { useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { API } from "../config/api";



export default function useAstroAPI() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState("");

  // Hàm chung gọi Flask API
  const fetchPrediction = async (userData, category = "daily", day = "today") => {
    try {
      setLoading(true);
      console.log(`🚀 Gọi Flask API (${category}, ${day})...`);
      const response = await axios.post(API.generate, { userData, category, day }, { timeout: 60000 });

      if (response.data.error) throw new Error(response.data.error);
      setPrediction(response.data.prediction);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Astro API Error:", error.message);
      setPrediction("Hệ thống đang bận, vui lòng thử lại sau!");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Dự đoán hằng ngày
  const generatePrediction = async (userData, navigation) => {
    try {
      console.log("Gọi dự đoán daily...");
      const res = await axios.post(API.generate, {
        userData,
        category: "daily",
        day: "today",
      });
      navigation.navigate("Prediction", {
        userData,
        initialPrediction: res.data.prediction,
      });
    } catch (err) {
      console.error("Prediction Error:", err);
      Alert.alert("Lỗi", "Không thể tạo dự đoán. Hãy thử lại.");
    }
  };

  // Tình duyên
  const generateLoveMetrics = async (userData) => {
    try {
    
      const res = await axios.post(API.generate, {
        userData,
        category: "love_metrics",
        day: "today",
      }, { timeout: 60000 });

    
      if (res.data.love_luck && res.data.best_match) {
        return res.data;
      } else {
        console.warn("Flask không trả dữ liệu love_metrics hợp lệ:", res.data);
        return null;
      }
    } catch (err) {
      console.error("Love Metrics Error:", err.message);
      return null;
    }
  };

  return { fetchPrediction, generatePrediction, generateLoveMetrics, loading, prediction };
}
