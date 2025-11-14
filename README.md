chạy Be : uvicorn main:app 
chạy fe: npm install => npm start

// Git cmd
1. git pull origin master (luôn pull code mới từ master về trước khi code thêm tính năng nào/ bẻ thêm nhánh mới/ push code lên master)
2. git checkout -b feature/view-chicken-page (tạo một nhánh tính năng mới để code)
3. git checkout *tên nhánh (lệnh dùng để đi tới một nhánh nào đó - để sửa code hoặc theo dõi)
4. git add . (dùng để add code mới để commit)
5. git commit -m "ghi commit thay đổi mói ở đây" (lệnh commit)
6. git push origin (dùng để push code lên chính nhánh đang ở)
7. git push origin  master (dùng để push code lên nhánh chính master)
**// để chạy đúng dự đoán trang home cần thay đổi ip theo máy tính của bạn**
- nếu chạy trên expo điện thoại thì:
  + vào cmd gọi ipconfig ->copy ipv4 address của phần wifi paste vào phần ... trong const Base_URL = "http://...:5000"; ở file config/api
- Chạy trên giả lập Android / iOS (trên máy tính)
Android Emulator (AVD) không hiểu localhost là máy tính host đâu, nên phải dùng:
const API_URL = "http://10.0.2.2:5000/generate";
iOS Simulator (Mac) thì hiểu localhost, nên dùng được:
const API_URL = "http://localhost:5000/generate";
