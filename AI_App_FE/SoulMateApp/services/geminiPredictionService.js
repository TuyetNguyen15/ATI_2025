import axios from "axios";

export async function generatePrediction(userData) {
  try {
    const response = await axios.post(
      "http://192.168.1.3:5000/generate",
      {
        userData,
        category: userData.category || "daily",
        day: userData.day || "today",
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 7000,
      }
    );

    console.log("✅ Flask response:", response.data);
    return response.data;
  } catch (error) {
    console.log("❌ Axios error full:", JSON.stringify(error, null, 2));
    return null;
  }
}
