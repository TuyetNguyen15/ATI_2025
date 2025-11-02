from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import json

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
# 🧠 Lấy dữ liệu cache Firestore (thêm uid)
# -------------------------------------------------
def get_cached_prediction(uid, name, sun, moon, category, day):
    query = (
        db.collection("user_prediction")
        .where("uid", "==", uid)
        .where("name", "==", name)
        .where("sun", "==", sun)
        .where("moon", "==", moon)
        .where("category", "==", category)
        .where("day", "==", day)
        .limit(1)
        .stream()
    )
    for doc in query:
        return doc.to_dict()
    return None


# -------------------------------------------------
# 💾 Lưu dữ liệu vào Firestore (thêm uid)
# -------------------------------------------------
def save_prediction(uid, name, sun, moon, category, day, data):

    doc = {
        "uid": uid,
        "name": name,
        "sun": sun,
        "moon": moon,
        "category": category,
        "day": day,
        "created_at": datetime.now().isoformat(),
    }

    if isinstance(data, dict):
        doc.update(data)
    else:
        doc["prediction"] = data

    db.collection("user_prediction").add(doc)


# -------------------------------------------------
# 🔮 Route chính: /generate
# -------------------------------------------------
@app.route("/generate", methods=["POST"])
def generate_prediction():
    data = request.get_json()
    user_data = data.get("userData", {})
    category = data.get("category", "daily")
    day = data.get("day", "today")

    uid = user_data.get("uid", "")
    name = user_data.get("name", "")
    sun = user_data.get("sun", "")
    moon = user_data.get("moon", "")

    if not name or not sun or not moon:
        return jsonify({"error": "Thiếu thông tin người dùng"}), 400

    # ⚡ Kiểm tra cache Firestore (thêm uid)
    cached_doc = get_cached_prediction(uid, name, sun, moon, category, day)
    if cached_doc:
        print(f"✅ Cache Firestore có sẵn cho {name} ({uid}) - {category} ({day})")

        if category == "love_metrics":
            return jsonify({
                "love_luck": cached_doc.get("love_luck"),
                "best_match": cached_doc.get("best_match"),
                "compatibility": cached_doc.get("compatibility"),
                "quote": cached_doc.get("quote"),
                "cached": True
            })

        return jsonify({"prediction": cached_doc.get("prediction", ""), "cached": True})

    print(f"⚙️ Không có cache → Gọi Gemini ({category}, {day})")

    # 🪐 Map tiếng Việt
    category_map = {
        "daily": "Dự đoán hằng ngày",
        "love": "Dự đoán tình duyên",
        "work": "Dự đoán công việc",
        "love_metrics": "Chỉ số tình duyên và cung hợp",
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
        Không dùng emoji, không dùng các kí tự, không chào hỏi, không mở đầu hay kết thúc dư thừa.
        """,
        "love": f"""
        {category_map['love']} cho {day_map.get(day)}:
        - Tên: {name}
        - Mặt Trời: {sun}, Mặt Trăng: {moon}

        Mô tả cảm xúc, mối quan hệ hoặc cơ hội trong tình yêu, cùng lời khuyên thực tế.
        Không dùng emoji, không dùng các kí tự, không chào hỏi, không văn phong hoa mỹ.
        """,
        "work": f"""
        {category_map['work']} cho {day_map.get(day)}:
        - Tên: {name}
        - Mặt Trời: {sun}, Mặt Trăng: {moon}

        Tập trung vào năng lượng làm việc, cơ hội và thách thức nghề nghiệp.
        Kết thúc bằng lời khuyên ngắn, không dùng emoji, không dùng các kí tự, hay lời chào.
        """,
        "love_metrics": f"""
        Phân tích chỉ số may mắn trong chuyện tình duyên {day_map.get(day)} cho người có:
        - Tên: {name}
        - Mặt Trời: {sun}, Mặt Trăng: {moon}

        Trả về một JSON đúng định dạng:
        {{
          "love_luck": <một số nguyên từ 0 đến 100>,
          "best_match": "<tên một trong 12 cung hoàng đạo tiếng Việt>",
          "compatibility": <một số nguyên 50..100>,
          "quote": "<một câu quote ngắn gọn, sâu sắc, không emoji>"
        }}

        Yêu cầu:
        - Không in gì khác ngoài JSON (không lời chào, không mô tả).
        """,
    }

    prompt = prompt_templates.get(category, prompt_templates["daily"])

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        text = response.text if hasattr(response, "text") else str(response)


        if category == "love_metrics":
            try:
                data = json.loads(text)
            except json.JSONDecodeError:
                data = {
                    "love_luck": 80,
                    "best_match": "Kim Ngưu",
                    "compatibility": 85,
                    "quote": "Tình yêu là hành trình tự khám phá bản thân qua ánh mắt người khác."
                }

            save_prediction(uid, name, sun, moon, category, day, data)
            print(f"✅ Đã lưu Firestore: {name} ({uid}) - love_metrics ({day})")
            return jsonify({**data, "cached": False})

        # ✨ Các loại khác (daily/love/work)
        save_prediction(uid, name, sun, moon, category, day, text)
        print(f"✅ Đã lưu Firestore: {name} ({uid}) - {category} ({day})")

        return jsonify({"prediction": text, "cached": False})

    except Exception as e:
        print("❌ Gemini Error:", e)
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# 🌐 Route test server
# -------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return "✅ Flask server đang hoạt động bình thường!"


print("✅ Flask nhận request /generate")

# -------------------------------------------------
# 🚀 Run app
# -------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
