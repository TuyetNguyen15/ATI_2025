from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict this later for better security)
    allow_credentials=True,
    allow_methods=["*"],  # Allow any HTTP method (GET, POST, etc.)
    allow_headers=["*"],  # Allow any headers
)

# Sample fortune-telling predictions
predictions = [
    "Hôm nay bạn sẽ gặp nhiều may mắn 🍀",
    "Cẩn thận với những quyết định vội vàng ⚠️",
    "Tình duyên đang nở rộ 💕",
    "Có quý nhân phù trợ, hãy tự tin tiến bước 🌟",
    "Một cơ hội mới sẽ đến, đừng bỏ lỡ 🚀"
]

# Model request
class Message(BaseModel):
    question: str

@app.get("/")
def home():
    return {"message": "Chatbox Bói Toán Backend đang chạy!"}

@app.post("/chat")
def chat(msg: Message):
    response = random.choice(predictions)
    return {"question": msg.question, "answer": response}
