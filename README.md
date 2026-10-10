# 🚀 Hệ Thống Điều Phối & Giao Nhận Thông Minh (Smart Logistics & Delivery System)

Một hệ thống nền tảng giao hàng công nghệ thời gian thực (Real-time Delivery Platform) được thiết kế theo kiến trúc Micro-components. Dự án mô phỏng chính xác luồng vận hành của các siêu ứng dụng gọi xe hiện nay, tập trung vào thuật toán điều phối động và trải nghiệm thực tế của Đối tác Tài xế.

## 🌟 Tính Năng Nổi Bật (Key Features)

### 1. Thuật Toán Lõi (Core Algorithms)
* **Dynamic Batching (Gom đơn động):** Thuật toán sử dụng công thức **Haversine** (tính khoảng cách tọa độ) và **Tích Vô Hướng Vector** (Dot Product) để tự động nhận diện và ép ghép các đơn hàng cùng chiều di chuyển vào một chuyến xe, giúp tối ưu hóa thu nhập cho tài xế.
* **Location-based Dispatching:** Quét và "nổ" đơn trực tiếp cho các tài xế đang Online trong bán kính 3km xung quanh điểm lấy hàng.
* **Geofencing & POD (Proof of Delivery):** Chặn tài xế hoàn thành đơn nếu cách vị trí ghim trên bản đồ quá 500m. Yêu cầu bắt buộc chụp ảnh xác thực tại Điểm lấy và Điểm giao.

### 2. Dành cho Khách Hàng (Customer App)
* Đặt đơn thông minh qua bản đồ tương tác (Leaflet + OSRM Routing).
* Tự động tính toán cước phí dựa trên khoảng cách thực tế, phụ thu cồng kềnh, phí tận cửa.
* Hệ thống áp dụng **Mã Khuyến Mãi (Vouchers)** thông minh.
* Theo dõi lộ trình đơn hàng và Chat thời gian thực với Tài xế / Admin.
* Kênh hỗ trợ CSKH tự động (Chatbot) nhận diện từ khóa.

### 3. Dành cho Đối tác Tài xế (Driver App)
* Công tắc trạng thái (Online / Nghỉ ngơi) để điều khiển Radar quét đơn.
* Giao diện vuốt để xác nhận (Swipe to Action) mượt mà.
* **Ví Điện Tử (Driver Wallet):** Tự chủ nạp/rút tiền. Sổ cái giao dịch ghi nhận chi tiết: Cước phí, Tiền Tip, Phụ phí cồng kềnh, Khấu trừ hoa hồng.
* Liên kết trực tiếp Google Maps bằng tọa độ GPS chuẩn xác.

### 4. Dành cho Quản trị viên (Admin Dashboard)
* Thống kê dòng tiền, doanh thu và lợi nhuận thực tế theo thời gian thực.
* Quản lý trạng thái hồ sơ người dùng (Duyệt hồ sơ tài xế mới, Khóa/Mở tài khoản).
* **Còi báo động 1-Sao:** Cảnh báo đỏ tức thời qua WebSocket khi có tài xế nhận đánh giá 1 sao.
* Quản lý tạo/hủy Mã Khuyến Mãi.
* Trực tiếp can thiệp và chat hỗ trợ giải quyết khiếu nại của khách hàng.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Backend (Core Engine)
* **Framework:** Python / FastAPI
* **Database:** SQLite & SQLAlchemy (ORM)
* **Authentication:** JWT (JSON Web Tokens) & Passlib (Bcrypt)
* **Real-time Communication:** WebSockets

### Frontend (User Interface)
* **Framework:** ReactJS (Vite)
* **Styling & UI Components:** React-Bootstrap
* **Maps & Routing:** Leaflet, React-Leaflet, OSRM API, ArcGIS Geocoding API
* **State Management & Data Fetching:** React Hooks, Axios

---

## ⚙️ Hướng Dẫn Cài Đặt & Khởi Chạy (Installation)

### 1. Khởi chạy Backend (Server)
Yêu cầu: Đã cài đặt Python 3.9+

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt đồng loạt tất cả thư viện từ file requirements
pip install -r requirements.txt

# Khởi chạy server FastAPI (Mặc định chạy ở cổng 8000)
uvicorn main:app --reload
```

Lưu ý: Ngay lần chạy đầu tiên, hệ thống sẽ tự động gieo mầm (Seed) Database và tạo ra 4 tài khoản mẫu (Admin, Khách hàng, Tài xế Xe máy, Tài xế Container) với mật khẩu mặc định là 1.

### 2. Khởi chạy Frontend (Client)
Yêu cầu: Đã cài đặt Node.js (v22+)

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt các modules từ package.json
npm install

# Khởi chạy giao diện web
npm run dev
```

### 3. Trỏ Frontend về Backend chạy ở máy
Mặc định Frontend gọi lên server Render (`https://datquang-backend.onrender.com`). Để dùng Backend ở máy, tạo file `frontend/.env.local` từ file mẫu rồi chạy lại `npm run dev`:

```bash
cd frontend
cp .env.example .env.local   # nội dung: VITE_API_URL=http://localhost:8000
```

Khi deploy Frontend (Vercel), có thể đặt biến môi trường `VITE_API_URL` để đổi địa chỉ Backend mà không cần sửa code.

---

## 🔁 CI/CD (GitHub Actions)

File cấu hình: `.github/workflows/ci-cd.yml`. Pipeline chạy khi có push hoặc Pull Request vào `main`.

| Job | Nội dung |
| --- | --- |
| Frontend | `npm ci` → `npm run lint` → `npm run build` |
| Backend | Cài `requirements.txt` → kiểm tra cú pháp → khởi động thử server |
| Deploy Backend | Chỉ khi push vào `main` và hai job trên đều qua: gọi Deploy Hook của Render |

Để bật phần deploy Backend:
1. Trên Render: vào service Backend → **Settings → Deploy Hook**, sao chép URL.
2. Trên GitHub: **Settings → Secrets and variables → Actions**, thêm secret `RENDER_DEPLOY_HOOK_URL` với URL vừa sao chép.
3. Trên Render: tắt **Auto-Deploy** để Render chỉ deploy sau khi CI qua.

Nếu chưa có secret, job deploy sẽ tự bỏ qua. Frontend do Vercel tự deploy khi `main` thay đổi.

---

## 🩹 Các Lỗi Đã Sửa & Cách Kiểm Tra

| Lỗi | Cách sửa | Cách kiểm tra |
| --- | --- | --- |
| Đăng ký tài xế báo lỗi 500 | Thêm `license_plate` vào `schemas.UserCreate`; trùng SĐT / biển số trả 400 | Đăng ký tài khoản Tài xế kèm biển số → thành công, chờ Admin duyệt |
| Khóa một tài khoản làm mọi tài xế bị đăng xuất | `DriverDashboard` chỉ đăng xuất khi `user_id` trong sự kiện là chính mình | Mở 2 tài xế, Admin khóa 1 người → chỉ người đó bị đăng xuất |
| Mất sự kiện real-time | Toàn bộ ứng dụng dùng chung một WebSocket (`frontend/src/realtime.js`) | Tab Network (WS) chỉ có 1 kết nối `/ws/...`; trạng thái đơn tự cập nhật |
| Popup đánh giá hiện lại mãi, đánh giá được nhiều lần | `/orders/{id}/details` trả thêm `rating`, `feedback`; Backend chặn đánh giá trùng | Đánh giá một đơn đã hoàn thành rồi tải lại trang → hiện số sao, không hỏi lại |
| Còi báo động 1 sao không kêu | Backend phát sự kiện `bad_review_alert` khi có đánh giá 1 sao | Mở Admin Dashboard, khách đánh giá 1 sao → Admin nhận cảnh báo |
| Ghép đơn không bao giờ chạy | Nhãn đơn xe máy đổi thành `XE MÁY - GIAO NHANH` cho khớp điều kiện ở Backend | Đặt 2 đơn xe máy có điểm lấy và điểm giao cách nhau dưới 2km, cùng chiều → đơn hiện là đơn ghép |
| Cước xe máy 3–5km tính sai | 3–5km cố định 25.000đ, trên 5km cộng 6.500đ/km | Đặt đơn 3,5km → cước gốc 25.000đ |
| URL Backend viết cứng trong code | Đọc từ `VITE_API_URL` (`frontend/src/config.js`) | Xem mục 3 ở phần Cài đặt |

Quy ước khi viết code mới ở Frontend:
* Gọi API bằng `` `${API_URL}/...` `` (import từ `src/config.js`), không viết cứng địa chỉ server.
* Nhận sự kiện real-time bằng `subscribeRealtime(userInfo, handler)` từ `src/realtime.js`, không tự tạo `new WebSocket(...)`. Hàm trả về hàm hủy đăng ký, dùng làm cleanup của `useEffect`.

### Hạn chế còn tồn tại (chưa sửa)
* Hầu hết API chưa yêu cầu đăng nhập và chưa kiểm tra vai trò (toàn bộ `/admin/*`, nạp/rút ví, nhận đơn, upload ảnh).
* Giá đơn hàng do Frontend gửi lên, Backend chưa tính lại.
* `SECRET_KEY` đang viết cứng trong `backend/core.py`.
* Điều phối theo bán kính 3km và chặn hoàn thành đơn ngoài 500m chưa được thực hiện ở Backend (hiện chỉ là cảnh báo ở Frontend).
* Hoàn thành đơn qua `PUT /orders/{id}/status` không cộng/trừ ví; chỉ luồng chụp ảnh POD mới tính tiền.
* SQLite và thư mục `static/` trên Render sẽ mất dữ liệu khi deploy lại.

---

## 📂 Cấu Trúc Thư Mục Tiêu Biểu (Clean Architecture)

```
📦 Project
 ┣ 📂 .github/workflows/   # Pipeline CI/CD (GitHub Actions)
 ┣ 📂 backend
 ┃ ┣ 📂 routers/           # Chứa các API phân theo module (auth, orders, wallet, admin, support)
 ┃ ┣ 📜 main.py            # File cấu hình gốc, đăng ký Routers và WebSockets
 ┃ ┣ 📜 core.py            # Trái tim hệ thống: JWT, WebSockets Manager, Thuật toán Haversine
 ┃ ┣ 📜 models.py          # Định nghĩa Database Tables (SQLAlchemy)
 ┃ ┗ 📜 schemas.py         # Định nghĩa Pydantic Models để validate dữ liệu
 ┃
 ┗ 📂 frontend
   ┣ 📂 src
   ┃ ┣ 📂 components/      # Các thành phần tái sử dụng (SwipeButton, Map, ChatBox, Skeleton)
   ┃ ┣ 📂 pages/           # Các trang chính (Booking, OrderDetail, WalletPage)
   ┃ ┃ ┗ 📂 dashboards/    # Trạm điều phối riêng biệt cho từng Role (Customer, Driver, Admin)
   ┃ ┣ 📜 config.js        # Địa chỉ Backend (đọc từ VITE_API_URL)
   ┃ ┣ 📜 realtime.js      # WebSocket dùng chung cho toàn ứng dụng
   ┃ ┗ 📜 App.jsx          # Cấu hình React Router DOM
```
