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
from datetime import datetime, timedelta
import uuid

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

MODEL_NAME = "gemini-2.5-flash"


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
# 📨 Route: Gửi lời mời ghép đôi
# -------------------------------------------------
@app.route("/send-match-request", methods=["POST"])
def send_match_request():
    """
    Gửi lời mời ghép đôi từ user A đến user B
    """
    try:
        data = request.get_json()
        sender_id = data.get("senderId")  # UID người gửi
        receiver_id = data.get("receiverId")  # UID người nhận
        message = data.get("message", "")  # Lời nhắn kèm theo
        
        if not sender_id or not receiver_id:
            return jsonify({"error": "Thiếu thông tin sender hoặc receiver"}), 400
        
        # Lấy thông tin người gửi
        sender_doc = db.collection("users").document(sender_id).get()
        if not sender_doc.exists:
            return jsonify({"error": "Không tìm thấy người gửi"}), 404
        
        sender_data = sender_doc.to_dict()
        
        # Kiểm tra xem đã gửi lời mời chưa
        existing_request = (
            db.collection("match_requests")
            .where("senderId", "==", sender_id)
            .where("receiverId", "==", receiver_id)
            .where("status", "==", "pending")
            .limit(1)
            .stream()
        )
        
        for doc in existing_request:
            return jsonify({"error": "Bạn đã gửi lời mời cho người này rồi"}), 400
        
        # Tạo request ID
        request_id = str(uuid.uuid4())
        
        # Lưu lời mời ghép đôi
        match_request = {
            "requestId": request_id,
            "senderId": sender_id,
            "receiverId": receiver_id,
            "message": message,
            "status": "pending",  # pending, accepted, rejected
            "createdAt": firestore.SERVER_TIMESTAMP,
        }
        
        db.collection("match_requests").document(request_id).set(match_request)
        
        # Tạo thông báo cho người nhận
        notification = {
            "id": str(uuid.uuid4()),
            "userId": receiver_id,  # Người nhận thông báo
            "type": "match_request",
            "title": f"Lời mời ghép đôi từ {sender_data.get('name', 'Người dùng')}",
            "message": message or "Xin chào! Tôi thấy chúng ta có nhiều điểm chung...",
            "read": False,
            "navigable": True,
            "navigationData": {
                "screen": "MatchRequestDetail",
                "params": {
                    "requestId": request_id,
                    "senderId": sender_id,
                    "senderName": sender_data.get("name", ""),
                    "senderAvatar": sender_data.get("avatar", ""),
                    "message": message,
                    "senderAge": sender_data.get("age", 0),
                    "senderJob": sender_data.get("job", ""),
                }
            },
            "createdAt": firestore.SERVER_TIMESTAMP,
        }
        
        db.collection("notifications").add(notification)
        
        print(f"✅ Đã gửi lời mời ghép đôi từ {sender_id} đến {receiver_id}")
        
        return jsonify({
            "success": True,
            "requestId": request_id,
            "message": "Đã gửi lời mời ghép đôi"
        }), 200
        
    except Exception as e:
        print(f"❌ Send match request error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# ✅ Route: Chấp nhận lời mời ghép đôi
# -------------------------------------------------
@app.route("/accept-match-request", methods=["POST"])
def accept_match_request():
    """
    Chấp nhận lời mời ghép đôi và tạo match
    """
    try:
        data = request.get_json()
        request_id = data.get("requestId")
        receiver_id = data.get("receiverId")
        response_message = data.get("responseMessage", "")  # Thư đáp lễ (optional)
        
        if not request_id or not receiver_id:
            return jsonify({"error": "Thiếu requestId hoặc receiverId"}), 400
        
        # Lấy thông tin match request
        request_doc = db.collection("match_requests").document(request_id).get()
        if not request_doc.exists:
            return jsonify({"error": "Không tìm thấy lời mời"}), 404
        
        request_data = request_doc.to_dict()
        
        if request_data.get("status") != "pending":
            return jsonify({"error": "Lời mời đã được xử lý"}), 400
        
        sender_id = request_data.get("senderId")
        
        # Cập nhật trạng thái request
        db.collection("match_requests").document(request_id).update({
            "status": "accepted",
            "responseMessage": response_message,
            "acceptedAt": firestore.SERVER_TIMESTAMP,
        })
        
        # Tạo match ID
        match_id = str(uuid.uuid4())
        
        # Tạo match record
        match_record = {
            "matchId": match_id,
            "user1": sender_id,
            "user2": receiver_id,
            "requestId": request_id,
            "createdAt": firestore.SERVER_TIMESTAMP,
            "status": "active"
        }
        
        db.collection("matches").document(match_id).set(match_record)
        
        # Cập nhật relationshipStatus cho cả 2 người
        db.collection("users").document(sender_id).update({
            "relationshipStatus": "Đang trong mối quan hệ",
            "partnerId": receiver_id,
            "matchId": match_id,
            "updatedAt": firestore.SERVER_TIMESTAMP,
        })
        
        db.collection("users").document(receiver_id).update({
            "relationshipStatus": "Đang trong mối quan hệ",
            "partnerId": sender_id,
            "matchId": match_id,
            "updatedAt": firestore.SERVER_TIMESTAMP,
        })
        
        # Lấy thông tin người nhận
        receiver_doc = db.collection("users").document(receiver_id).get()
        receiver_data = receiver_doc.to_dict()
        
        # Tạo thông báo cho người gửi (sender)
        notification_for_sender = {
            "id": str(uuid.uuid4()),
            "userId": sender_id,
            "type": "match_accepted",
            "title": f"{receiver_data.get('name', 'Người dùng')} đã chấp nhận ghép đôi",
            "message": response_message or "Hãy bắt đầu trò chuyện ngay!",
            "read": False,
            "navigable": True,
            "navigationData": {
                "screen": "Chat",
                "params": {
                    "matchId": match_id,
                    "partnerId": receiver_id,
                    "partnerName": receiver_data.get("name", ""),
                }
            },
            "createdAt": firestore.SERVER_TIMESTAMP,
        }
        
        db.collection("notifications").add(notification_for_sender)
        
        print(f"✅ Match thành công: {sender_id} <-> {receiver_id}")
        
        return jsonify({
            "success": True,
            "matchId": match_id,
            "message": "Đã chấp nhận ghép đôi thành công",
            "responseMessage": response_message
        }), 200
        
    except Exception as e:
        print(f"❌ Accept match error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# ❌ Route: Từ chối lời mời ghép đôi
# -------------------------------------------------
@app.route("/reject-match-request", methods=["POST"])
def reject_match_request():
    """
    Từ chối lời mời ghép đôi
    """
    try:
        data = request.get_json()
        request_id = data.get("requestId")
        receiver_id = data.get("receiverId")
        
        if not request_id or not receiver_id:
            return jsonify({"error": "Thiếu requestId hoặc receiverId"}), 400
        
        # Lấy thông tin match request
        request_doc = db.collection("match_requests").document(request_id).get()
        if not request_doc.exists:
            return jsonify({"error": "Không tìm thấy lời mời"}), 404
        
        request_data = request_doc.to_dict()
        
        if request_data.get("status") != "pending":
            return jsonify({"error": "Lời mời đã được xử lý"}), 400
        
        # Cập nhật trạng thái request
        db.collection("match_requests").document(request_id).update({
            "status": "rejected",
            "rejectedAt": firestore.SERVER_TIMESTAMP,
        })
        
        print(f"✅ Đã từ chối lời mời {request_id}")
        
        return jsonify({
            "success": True,
            "message": "Đã từ chối lời mời"
        }), 200
        
    except Exception as e:
        print(f"❌ Reject match error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# 📋 Route: Lấy danh sách thông báo của user
# -------------------------------------------------
@app.route("/get-notifications", methods=["GET"])
def get_notifications():
    """
    Lấy tất cả thông báo của một user
    """
    try:
        user_id = request.args.get("userId")
        
        if not user_id:
            return jsonify({"error": "Thiếu userId"}), 400
        
        # Lấy notifications từ Firestore, sắp xếp theo thời gian mới nhất
        notifications_ref = (
            db.collection("notifications")
            .where("userId", "==", user_id)
            .order_by("createdAt", direction=firestore.Query.DESCENDING)
            .limit(50)  # Giới hạn 50 thông báo gần nhất
        )
        
        notifications = []
        for doc in notifications_ref.stream():
            notif_data = doc.to_dict()
            notif_data["id"] = doc.id
            
            # Chuyển đổi timestamp
            if "createdAt" in notif_data and notif_data["createdAt"]:
                created_at = notif_data["createdAt"]
                time_diff = datetime.now() - created_at
                
                if time_diff.days > 0:
                    notif_data["time"] = f"{time_diff.days} ngày trước"
                elif time_diff.seconds // 3600 > 0:
                    notif_data["time"] = f"{time_diff.seconds // 3600} giờ trước"
                else:
                    notif_data["time"] = f"{time_diff.seconds // 60} phút trước"
            else:
                notif_data["time"] = "Vừa xong"
            
            # Xác định icon dựa trên type
            icon_map = {
                "match_request": "favorite",
                "match_accepted": "check-circle",
                "prediction": "stars",
                "love": "favorite",
            }
            notif_data["icon"] = icon_map.get(notif_data.get("type"), "notifications")
            
            notifications.append(notif_data)
        
        return jsonify({
            "success": True,
            "notifications": notifications,
            "count": len(notifications)
        }), 200
        
    except Exception as e:
        print(f"❌ Get notifications error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# ✓ Route: Đánh dấu thông báo đã đọc
# -------------------------------------------------
@app.route("/mark-notification-read", methods=["POST"])
def mark_notification_read():
    """
    Đánh dấu một hoặc nhiều thông báo đã đọc
    """
    try:
        data = request.get_json()
        notification_ids = data.get("notificationIds", [])
        
        if not notification_ids:
            return jsonify({"error": "Thiếu notificationIds"}), 400
        
        # Cập nhật từng thông báo
        for notif_id in notification_ids:
            db.collection("notifications").document(notif_id).update({
                "read": True,
                "readAt": firestore.SERVER_TIMESTAMP,
            })
        
        return jsonify({
            "success": True,
            "message": f"Đã đánh dấu {len(notification_ids)} thông báo"
        }), 200
        
    except Exception as e:
        print(f"❌ Mark read error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# 🗑️ Route: Xóa thông báo
# -------------------------------------------------
@app.route("/delete-notification", methods=["POST"])
def delete_notification():
    """
    Xóa một thông báo
    """
    try:
        data = request.get_json()
        notification_id = data.get("notificationId")
        
        if not notification_id:
            return jsonify({"error": "Thiếu notificationId"}), 400
        
        db.collection("notifications").document(notification_id).delete()
        
        return jsonify({
            "success": True,
            "message": "Đã xóa thông báo"
        }), 200
        
    except Exception as e:
        print(f"❌ Delete notification error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# 📊 Route: Lấy danh sách match requests của user
# -------------------------------------------------
@app.route("/get-match-requests", methods=["GET"])
def get_match_requests():
    """
    Lấy tất cả lời mời ghép đôi của user (cả đã gửi và đã nhận)
    """
    try:
        user_id = request.args.get("userId")
        request_type = request.args.get("type", "received")  # received, sent, all
        
        if not user_id:
            return jsonify({"error": "Thiếu userId"}), 400
        
        requests_list = []
        
        # Lấy requests đã nhận
        if request_type in ["received", "all"]:
            received_ref = (
                db.collection("match_requests")
                .where("receiverId", "==", user_id)
                .order_by("createdAt", direction=firestore.Query.DESCENDING)
            )
            
            for doc in received_ref.stream():
                req_data = doc.to_dict()
                req_data["requestId"] = doc.id
                req_data["direction"] = "received"
                requests_list.append(req_data)
        
        # Lấy requests đã gửi
        if request_type in ["sent", "all"]:
            sent_ref = (
                db.collection("match_requests")
                .where("senderId", "==", user_id)
                .order_by("createdAt", direction=firestore.Query.DESCENDING)
            )
            
            for doc in sent_ref.stream():
                req_data = doc.to_dict()
                req_data["requestId"] = doc.id
                req_data["direction"] = "sent"
                requests_list.append(req_data)
        
        return jsonify({
            "success": True,
            "requests": requests_list,
            "count": len(requests_list)
        }), 200
        
    except Exception as e:
        print(f"❌ Get match requests error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# 💑 Route: Lấy thông tin match hiện tại
# -------------------------------------------------
@app.route("/get-current-match", methods=["GET"])
def get_current_match():
    """
    Lấy thông tin về match hiện tại của user
    """
    try:
        user_id = request.args.get("userId")
        
        if not user_id:
            return jsonify({"error": "Thiếu userId"}), 400
        
        # Lấy thông tin user
        user_doc = db.collection("users").document(user_id).get()
        if not user_doc.exists:
            return jsonify({"error": "Không tìm thấy user"}), 404
        
        user_data = user_doc.to_dict()
        match_id = user_data.get("matchId")
        partner_id = user_data.get("partnerId")
        
        if not match_id or not partner_id:
            return jsonify({
                "success": True,
                "hasMatch": False,
                "message": "User chưa có match"
            }), 200
        
        # Lấy thông tin match
        match_doc = db.collection("matches").document(match_id).get()
        match_data = match_doc.to_dict() if match_doc.exists else {}
        
        # Lấy thông tin partner
        partner_doc = db.collection("users").document(partner_id).get()
        partner_data = partner_doc.to_dict() if partner_doc.exists else {}
        
        return jsonify({
            "success": True,
            "hasMatch": True,
            "match": {
                "matchId": match_id,
                "partnerId": partner_id,
                "partnerName": partner_data.get("name", ""),
                "partnerAvatar": partner_data.get("avatar", ""),
                "partnerAge": partner_data.get("age", 0),
                "partnerJob": partner_data.get("job", ""),
                "createdAt": match_data.get("createdAt"),
                "status": match_data.get("status", "active")
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Get current match error: {str(e)}")
        return jsonify({"error": str(e)}), 500
        

# -------------------------------------------------
# 🚀 Run Flask App
# -------------------------------------------------
if __name__ == "__main__":
    print("Flask nhận request /generate, /upload-image, /update-profile, /verify-password")
    app.run(debug=True, host="0.0.0.0", port=5000)