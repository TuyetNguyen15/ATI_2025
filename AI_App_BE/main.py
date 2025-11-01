from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

# 🚀 Load biến môi trường
base_dir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(base_dir, ".env"))

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("⚠️ Chưa load được GEMINI_API_KEY!")

# 🔮 Cấu hình Gemini
genai.configure(api_key=api_key)

# 🔥 Firebase Admin
cred = credentials.Certificate(os.path.join(base_dir, "firebase-key.json"))
firebase_admin.initialize_app(cred)
db = firestore.client()

# 🚀 Flask setup
app = Flask(__name__)
CORS(app)

MODEL_NAME = "gemini-2.5-flash"

# -------------------------------------------------
# 🧠 Lấy dữ liệu cache Firestore
# -------------------------------------------------
def get_cached_prediction(name, sun, moon, category, day):
    docs = (
        db.collection("user_prediction")
        .where("name", "==", name)
        .where("sun", "==", sun)
        .where("moon", "==", moon)
        .where("category", "==", category)
        .where("day", "==", day)
        .limit(1)
        .stream()
    )
    for doc in docs:
        return doc.to_dict().get("prediction")
    return None


# -------------------------------------------------
# 💾 Lưu dữ liệu vào Firestore
# -------------------------------------------------
def save_prediction(name, sun, moon, category, day, prediction):
    db.collection("user_prediction").add({
        "name": name,
        "sun": sun,
        "moon": moon,
        "category": category,
        "day": day,
        "prediction": prediction,
        "created_at": datetime.now().isoformat(),
    })


# -------------------------------------------------
# 🔮 Route chính: /generate
# -------------------------------------------------
@app.route("/generate", methods=["POST"])
def generate_prediction():
    data = request.get_json()
    user_data = data.get("userData", {})
    category = data.get("category", "daily")
    day = data.get("day", "today")

    name = user_data.get("name", "")
    sun = user_data.get("sun", "")
    moon = user_data.get("moon", "")

    if not name or not sun or not moon:
        return jsonify({"error": "Thiếu thông tin người dùng"}), 400

    # ⚡ Kiểm tra cache
    cached = get_cached_prediction(name, sun, moon, category, day)
    if cached:
        print(f"✅ Cache Firestore có sẵn cho {name} - {category} ({day})")
        return jsonify({"prediction": cached, "cached": True})

    print(f"⚙️ Không có cache → Gọi Gemini ({category}, {day})")


    category_map = {
        "daily": "Dự đoán hằng ngày",
        "love": "Dự đoán tình duyên",
        "work": "Dự đoán công việc",
    }
    day_map = {
        "yesterday": "hôm qua",
        "today": "hôm nay",
        "tomorrow": "ngày mai",
    }

    # ✨ Prompt riêng từng loại
    prompt_templates = {
        "daily": f"""
        {category_map['daily']} cho {day_map.get(day)}:
        - Tên: {name}
        - Mặt Trời: {sun}, Mặt Trăng: {moon}

         Tập trung mô tả năng lượng, cảm xúc và xu hướng chính trong ngày, kèm một lời khuyên ngắn.
        Không dùng emoji, không chào hỏi, không mở đầu hay kết thúc dư thừa.
        """,
        "love": f"""
        {category_map['love']} cho {day_map.get(day)}:
        - Tên: {name}
        - Mặt Trời: {sun}, Mặt Trăng: {moon}
  Mô tả cảm xúc, mối quan hệ hoặc cơ hội trong tình yêu, cùng lời khuyên thực tế.
        Không dùng emoji, không chào hỏi, không văn phong hoa mỹ.
        """,
        "work": f"""
        💼 {category_map['work']} cho {day_map.get(day)}:
        - Tên: {name}
        - Mặt Trời: {sun}, Mặt Trăng: {moon}

      Tập trung vào năng lượng làm việc, cơ hội và thách thức nghề nghiệp.
        Kết thúc bằng lời khuyên ngắn, không dùng emoji hay lời chào.
        """,
    }

    prompt = prompt_templates.get(category, prompt_templates["daily"])

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        text = response.text if hasattr(response, "text") else str(response)

        # 💾 Lưu vào Firestore
        save_prediction(name, sun, moon, category, day, text)
        print(f"✅ Đã lưu Firestore: {name} - {category} ({day})")

        return jsonify({"prediction": text, "cached": False})
    except Exception as e:
        print("❌ Gemini Error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
