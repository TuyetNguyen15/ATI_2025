from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore, auth
import json
import re
import base64
import cloudinary
import cloudinary.uploader
import requests

# 🚀 Load biến môi trường
base_dir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(base_dir, ".env"))

api_key = os.getenv("GEMINI_API_KEY")
firebase_api_key = os.getenv("FIREBASE_API_KEY") 

if not api_key:
    raise ValueError("⚠️ Chưa load được GEMINI_API_KEY!")

# 🔮 Cấu hình Gemini
genai.configure(api_key=api_key)

# 🔥 Firebase Admin (chỉ Firestore)
cred = credentials.Certificate(os.path.join(base_dir, "firebase-key.json"))
firebase_admin.initialize_app(cred)
db = firestore.client()

# ☁️ Cấu hình Cloudinary (MIỄN PHÍ)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", "YOUR_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY", "YOUR_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", "YOUR_API_SECRET")
)

# 🚀 Flask setup
app = Flask(__name__)
CORS(app)

MODEL_NAME = "gemini-1.5-flash"


# -------------------------------------------------
# 🧠 Lấy dữ liệu cache Firestore
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
# 💾 Lưu dữ liệu vào Firestore
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
# 🔐 Route Verify Password (XÁC THỰC MẬT KHẨU)
# -------------------------------------------------
@app.route("/verify-password", methods=["POST"])
def verify_password():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        
        print(f"=== VERIFY PASSWORD DEBUG ===")
        print(f"Email nhận được: {email}")
        print(f"Password length: {len(password) if password else 0}")
        print(f"Firebase API Key có tồn tại: {bool(firebase_api_key)}")
        
        if not email or not password:
            return jsonify({"success": False, "error": "Thiếu email hoặc password"}), 400
        
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={firebase_api_key}"
        
        payload = {
            "email": email.strip(),  # ✅ Thêm strip() để loại bỏ khoảng trắng
            "password": password,
            "returnSecureToken": True
        }
        
        print(f"Gửi request đến Firebase Auth...")
        response = requests.post(url, json=payload)
        result = response.json()
        
        print(f"Response status: {response.status_code}")
        print(f"Response body: {result}")
        
        if response.status_code == 200 and result.get("idToken"):
            print(f"Xác thực thành công cho {email}")
            return jsonify({"success": True}), 200
        else:
            error_msg = result.get("error", {}).get("message", "Invalid password")
            print(f"Xác thực thất bại: {error_msg}")
            return jsonify({"success": False, "error": "Mật khẩu không đúng"}), 401
            
    except Exception as e:
        print(f"❌ Verify error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


# -------------------------------------------------
# 📝 Route Update Profile (CẬP NHẬT AUTHENTICATION)
# -------------------------------------------------
@app.route("/update-profile", methods=["POST"])
def update_profile():
    """
    Cập nhật profile bao gồm Firebase Authentication
    """
    try:
        data = request.get_json()
        uid = data.get("uid")
        fields = data.get("fields", {})
        
        if not uid or not fields:
            return jsonify({"error": "Thiếu uid hoặc fields"}), 400
        
        # ✅ Cập nhật Firebase Authentication nếu có email hoặc password
        auth_updated = False
        auth_updates = {}
        
        if "email" in fields:
            auth_updates["email"] = fields["email"]
            auth_updated = True
        
        if "password" in fields:
            auth_updates["password"] = fields["password"]
            auth_updated = True
        
        # Cập nhật Authentication
        if auth_updated:
            try:
                auth.update_user(uid, **auth_updates)
                print(f"✅ Đã cập nhật Firebase Authentication cho {uid}")
                
                # Không lưu password vào Firestore
                if "password" in fields:
                    del fields["password"]
                    
            except Exception as e:
                print(f"❌ Lỗi cập nhật Authentication: {str(e)}")
                return jsonify({"error": f"Không thể cập nhật thông tin xác thực: {str(e)}"}), 500
        
        # Cập nhật Firestore (không bao gồm password)
        if fields:
            user_ref = db.collection("users").document(uid)
            fields["updatedAt"] = firestore.SERVER_TIMESTAMP
            user_ref.update(fields)
            print(f"✅ Đã cập nhật Firestore cho user {uid}")
        
        return jsonify({
            "success": True,
            "message": "Cập nhật thành công",
            "authUpdated": auth_updated
        }), 200
        
    except Exception as e:
        print(f"❌ Update error: {str(e)}")
        return jsonify({"error": str(e)}), 500


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

    # ⚡ Kiểm tra cache Firestore
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
        Không dùng emoji, không dùng các ký tự, không chào hỏi, không mở đầu hay kết thúc dư thừa.
        """,
        "love": f"""
        {category_map['love']} cho {day_map.get(day)}:
        - Tên: {name}
        - Mặt Trời: {sun}, Mặt Trăng: {moon}

        Mô tả cảm xúc, mối quan hệ hoặc cơ hội trong tình yêu, cùng lời khuyên thực tế.
        Không dùng emoji, không dùng các ký tự, không chào hỏi, không văn phong hoa mỹ.
        """,
        "work": f"""
        {category_map['work']} cho {day_map.get(day)}:
        - Tên: {name}
        - Mặt Trời: {sun}, Mặt Trăng: {moon}

        Tập trung vào năng lượng làm việc, cơ hội và thách thức nghề nghiệp.
        Kết thúc bằng lời khuyên ngắn, không dùng emoji, không dùng các ký tự, hay lời chào.
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

        text = re.sub(r"(```json|```|'''|\"\"\")", "", text).strip()
        if category == "love_metrics":
            try:
                cleaned = re.sub(r"^.*?(\{.*\}).*$", r"\1", text, flags=re.DOTALL)
                data = json.loads(cleaned)
            except Exception as e:
                print("JSON Parse Error:", e)
                print("Gemini trả về không hợp lệ → dùng fallback.")
                data = {
                    "love_luck": 80,
                    "best_match": "Kim Ngưu",
                    "compatibility": 85,
                    "quote": "Tình yêu là hành trình tự khám phá bản thân qua ánh mắt người khác."
                }

            save_prediction(uid, name, sun, moon, category, day, data)
            print(f"Đã lưu Firestore: {name} ({uid}) - love_metrics ({day})")
            return jsonify({**data, "cached": False})

        # ✨ Các loại khác (daily/love/work)
        save_prediction(uid, name, sun, moon, category, day, text)
        print(f"Đã lưu Firestore: {name} ({uid}) - {category} ({day})")

        return jsonify({"prediction": text, "cached": False})

    except Exception as e:
        print("Gemini Error:", e)
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# 🌐 Route test server
# -------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return "Flask server đang hoạt động bình thường!"


# -------------------------------------------------
# 📸 Route Upload Image (CLOUDINARY)
# -------------------------------------------------
@app.route("/upload-image", methods=["POST"])
def upload_image():
    """
    Upload ảnh lên Cloudinary (MIỄN PHÍ)
    """
    try:
        data = request.get_json()
        uid = data.get("uid")
        image_type = data.get("imageType", "avatar")
        image_data = data.get("imageData")
        
        if not uid or not image_data:
            return jsonify({"error": "Thiếu uid hoặc imageData"}), 400
        
        # Decode base64
        try:
            if "," in image_data:
                header, image_data = image_data.split(",", 1)
            
            # Upload lên Cloudinary
            upload_result = cloudinary.uploader.upload(
                f"data:image/jpeg;base64,{image_data}",
                folder=f"astrolove/{image_type}",
                public_id=f"{uid}_{image_type}",
                overwrite=True,
                resource_type="image"
            )
            
            image_url = upload_result.get("secure_url")
            
        except Exception as e:
            return jsonify({"error": f"Lỗi upload: {str(e)}"}), 400
        
        # Cập nhật Firestore
        user_ref = db.collection("users").document(uid)
        user_ref.update({
            image_type: image_url,
            "updatedAt": firestore.SERVER_TIMESTAMP
        })
        
        print(f"✅ Đã upload {image_type} cho user {uid}: {image_url}")
        
        return jsonify({
            "success": True,
            "imageUrl": image_url,
            "imageType": image_type
        }), 200
        
    except Exception as e:
        print(f"❌ Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# 🗑️ Route Delete Image (CLOUDINARY)
# -------------------------------------------------
@app.route("/delete-image", methods=["POST"])
def delete_image():
    """
    Xóa ảnh từ Cloudinary
    """
    try:
        data = request.get_json()
        uid = data.get("uid")
        image_type = data.get("imageType")
        image_url = data.get("imageUrl")
        
        if not uid or not image_type:
            return jsonify({"error": "Thiếu uid hoặc imageType"}), 400
        
        # Xóa từ Cloudinary
        if image_url and "cloudinary" in image_url:
            try:
                # Extract public_id từ URL
                public_id = f"astrolove/{image_type}/{uid}_{image_type}"
                cloudinary.uploader.destroy(public_id)
                print(f"🗑️ Đã xóa ảnh: {public_id}")
            except Exception as e:
                print(f"⚠️ Không thể xóa ảnh: {str(e)}")
        
        # Reset field trong Firestore
        user_ref = db.collection("users").document(uid)
        user_ref.update({
            image_type: "",
            "updatedAt": firestore.SERVER_TIMESTAMP
        })
        
        return jsonify({
            "success": True,
            "message": "Đã xóa ảnh"
        }), 200
        
    except Exception as e:
        print(f"❌ Delete error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
    
# -------------------------------------------------
# 🔮 Route phân tích bản đồ sao
# -------------------------------------------------
@app.route("/natal-analysis", methods=["POST"])
def natal_chart_analysis():
    """
    Phân tích chi tiết bản đồ sao dựa trên thông tin chiêm tinh
    """
    try:
        data = request.get_json()
        uid = data.get("uid", "")
        
        # Lấy thông tin từ request
        user_info = {
            "name": data.get("name", ""),
            "sun": data.get("sun", ""),
            "moon": data.get("moon", ""),
            "mercury": data.get("mercury", ""),
            "venus": data.get("venus", ""),
            "mars": data.get("mars", ""),
            "jupiter": data.get("jupiter", ""),
            "saturn": data.get("saturn", ""),
            "uranus": data.get("uranus", ""),
            "neptune": data.get("neptune", ""),
            "pluto": data.get("pluto", ""),
            "ascendant": data.get("ascendant", ""),
            "descendant": data.get("descendant", ""),
            "mc": data.get("mc", ""),
            "ic": data.get("ic", ""),
        }
        
        # Lấy thông tin houses
        houses = {
            f"house{i}": data.get(f"house{i}", "") for i in range(1, 13)
        }
        
        # Lấy thông tin aspects
        aspects = {
            "conjunction": data.get("conjunctionAspect", ""),
            "opposition": data.get("oppositionAspect", ""),
            "trine": data.get("trineAspect", ""),
            "square": data.get("squareAspect", ""),
            "sextile": data.get("sextileAspect", ""),
        }
        
        # Lấy tỷ lệ nguyên tố
        elemental_ratios = {
            "fire": data.get("fireRatio", 0),
            "earth": data.get("earthRatio", 0),
            "air": data.get("airRatio", 0),
            "water": data.get("waterRatio", 0),
        }
        
        if not user_info["name"] or not user_info["sun"] or not user_info["moon"]:
            return jsonify({"error": "Thiếu thông tin cơ bản"}), 400
        
        # ⚡ Kiểm tra cache Firestore
        cache_query = (
            db.collection("natal_analysis")
            .where("uid", "==", uid)
            .limit(1)
            .stream()
        )
        
        for doc in cache_query:
            cached_data = doc.to_dict()
            print(f"✅ Cache phân tích có sẵn cho {user_info['name']} ({uid})")
            return jsonify({
                "analysis": cached_data.get("analysis", ""),
                "cached": True
            })
        
        print(f"⚙️ Không có cache → Gọi Gemini để phân tích")
        
        # 🔮 Tạo prompt phân tích chi tiết
        prompt = f"""
        Phân tích bản đồ sao chi tiết cho người có thông tin sau:
        
        **Thông tin cơ bản:**
        - Tên: {user_info['name']}
        - Mặt Trời: {user_info['sun']}
        - Mặt Trăng: {user_info['moon']}
        - Thủy tinh: {user_info['mercury']}
        - Kim tinh: {user_info['venus']}
        - Hỏa tinh: {user_info['mars']}
        - Mộc tinh: {user_info['jupiter']}
        - Thổ tinh: {user_info['saturn']}
        - Thiên Vương tinh: {user_info['uranus']}
        - Hải Vương tinh: {user_info['neptune']}
        - Diêm Vương tinh: {user_info['pluto']}
        
        **Điểm đặc biệt:**
        - Ascendant (Cung Thăng): {user_info['ascendant']}
        - Descendant: {user_info['descendant']}
        - MC (Midheaven): {user_info['mc']}
        - IC: {user_info['ic']}
        
        **Các nhà (Houses):**
        {chr(10).join([f"- Nhà {i}: {houses[f'house{i}']}" for i in range(1, 13) if houses[f'house{i}']])}
        
        **Các góc tương tác (Aspects):**
        - Conjunction: {aspects['conjunction']}
        - Opposition: {aspects['opposition']}
        - Trine: {aspects['trine']}
        - Square: {aspects['square']}
        - Sextile: {aspects['sextile']}
        
        **Tỷ lệ nguyên tố:**
        - Lửa: {elemental_ratios['fire']}%
        - Đất: {elemental_ratios['earth']}%
        - Khí: {elemental_ratios['air']}%
        - Nước: {elemental_ratios['water']}%
        
        Hãy phân tích chi tiết và sâu sắc bản đồ sao này theo các mục sau:
        
        1. **Tổng quan tính cách**: Dựa vào Mặt Trời, Mặt Trăng và Ascendant
        2. **Cảm xúc và nội tâm**: Phân tích sâu về Mặt Trăng và các hành tinh cá nhân
        3. **Sự nghiệp và mục tiêu**: Dựa vào MC, Mặt Trời, và các nhà liên quan
        4. **Tình yêu và quan hệ**: Phân tích Kim tinh, Nhà 7, và Descendant
        5. **Thế mạnh và thách thức**: Dựa vào các aspects và vị trí hành tinh
        6. **Cân bằng nguyên tố**: Ý nghĩa của tỷ lệ Lửa-Đất-Khí-Nước
        7. **Lời khuyên phát triển**: Hướng dẫn cụ thể để phát huy tiềm năng
        8. **Đối tượng ghép cặp phù hợp**: Phân tích kiểu người, năng lượng và cung hoàng đạo phù hợp nhất 
        với bản đồ sao này. Giải thích vì sao những đặc điểm đó tạo ra sự hòa hợp trong cảm xúc, trí tuệ và 
        giá trị sống, đồng thời chỉ ra những dạng năng lượng dễ xung khắc hoặc cần học cách dung hòa.
        
        Yêu cầu:
        - Viết bằng tiếng Việt, văn phong chuyên nghiệp nhưng dễ hiểu
        - Mỗi mục khoảng 2-3 đoạn văn
        - Không dùng emoji, không dùng ký tự đặc biệt
        - Không chào hỏi hay văn phong dư thừa
        - Tập trung vào phân tích sâu, có căn cứ chiêm tinh học
        """
        
        # Gọi Gemini API
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        analysis_text = response.text if hasattr(response, "text") else str(response)
        
        # Làm sạch text
        analysis_text = re.sub(r"(```|'''|\"\"\")", "", analysis_text).strip()
        
        # Lưu vào Firestore
        analysis_doc = {
            "uid": uid,
            "name": user_info["name"],
            "analysis": analysis_text,
            "created_at": datetime.now().isoformat(),
            "user_data": {**user_info, **houses, **aspects, **elemental_ratios}
        }
        
        db.collection("natal_analysis").add(analysis_doc)
        print(f"✅ Đã lưu phân tích cho {user_info['name']} ({uid})")
        
        return jsonify({
            "analysis": analysis_text,
            "cached": False
        }), 200
        
    except Exception as e:
        print(f"❌ Error in natal analysis: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

# -------------------------------------------------
# 🚀 Run Flask App
# -------------------------------------------------
if __name__ == "__main__":
    print("Flask nhận request /generate, /upload-image, /update-profile, /verify-password")
    app.run(debug=True, host="0.0.0.0", port=5000)