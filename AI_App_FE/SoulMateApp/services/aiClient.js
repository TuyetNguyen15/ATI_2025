const API_KEY = "fw_3ZRU8nHvQqbLcynsQAdPyBee";

const MODEL_ID = "accounts/fireworks/models/llama-v3p1-8b-instruct";

async function generateText(prompt) {
  try {
    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            { role: "system", content: "Bạn là AI giúp tạo câu mở đầu siêu duyên." },
            { role: "user", content: prompt },
          ],
          max_tokens: 120,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch (err) {
    console.log("🔥 Fireworks FE Error:", err);
    return null;
  }
}

export default {
  generateText,
};
