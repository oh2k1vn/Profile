# 🖥️ Nguyễn Minh Hiếu - Portfolio & CLI Terminal Workspace

Chào mừng bạn đến với Repository website giới thiệu năng lực cá nhân và không gian lập trình tương tác của **Nguyễn Minh Hiếu** - Middle Frontend & Mobile Developer.

Dự án được xây dựng với định hướng giao diện mang phong cách **Cyberpunk / Retro CLI Terminal**, kết hợp hài hòa giữa tính tương tác cơ học, hiệu ứng âm thanh 8-bit và cấu trúc quản lý trang chuyên nghiệp.

---

## 🚀 Các Tính Năng Nổi Bật

### 1. 🖼️ Holographic 3D Avatar Card (Hero Section)
* **Tương tác 3D theo chuột**: Khi di chuyển con trỏ chuột, khung chân dung tự động nghiêng (`rotateX`, `rotateY`) và phóng to nhẹ theo tọa độ 3D.
* **Cyber HUD**: Tích hợp các chi tiết thiết kế công nghệ giả lập chẩn đoán hệ thống (`SYS_STATUS`), radar quét chỉ số (`RDR: LOCK`) và hiển thị khung lưới quét CRT scanlines.
* **Chuyển đổi màu sắc**: Ảnh tự động chuyển từ đen trắng (grayscale) phủ ma trận xanh sang ảnh màu thực tế sắc nét khi rê chuột vào.

### 2. 🚦 Phân Trang & Điều Hướng Thông Minh (React Router)
* **URL Paths Sạch**: Quản lý các trang thông qua Router thay vì các state cục bộ thủ công:
  * `/` : Trang giới thiệu chi tiết (Hero, Giới thiệu, Kỹ năng, Dự án).
  * `/playground` : Không gian tương tác dòng lệnh (CLI Terminal & Sổ lưu bút).
  * `/blog` : Kho lưu trữ bài viết, bài lưu ý kỹ thuật cá nhân.
  * `/blog/:id` : Đọc chi tiết bài viết, hỗ trợ kết xuất nội dung Markdown.
* **Điều phối Nav-Scroll chéo**: Tự động chuyển hướng từ các trang con về trang chủ và cuộn mượt mà (`smooth scroll`) tìm đúng thẻ ID tương ứng (`#about`, `#skills`, `#projects`).

### 3. 📟 Trình Giả Lập CLI Terminal & Sổ Lưu Bút
* **CLI Terminal**: Hỗ trợ nhập và thực thi các câu lệnh đặc trưng (`help`, `about`, `skills`, `projects`, `clear`). Lệnh `clear` giữ lại dòng gợi ý hệ thống tránh trống trải. Sửa triệt để lỗi nhảy cuộn trang (viewport jump) khi ấn Enter.
* **Guestbook Board**: Cho phép mọi người truy cập gửi lời nhắn lưu bút trực tiếp lên giao diện.

### 4. 📝 Trang Blog Tích Hợp Firebase Firestore
* **Firestore Realtime Database**: Đồng bộ hóa dữ liệu bài viết hai chiều thời gian thực (Realtime updates).
* **Blog Editor**: Cho phép soạn thảo bài viết mới hỗ trợ tiêu đề, tags, và viết bài bằng cú pháp **Markdown**.
* **Markdown Renderer tự viết**: Không phụ thuộc vào thư viện bên ngoài, tự động parse các thẻ Markdown thông dụng (`#`, `##`, `***`, `**`, \`code\`, \`\`\`code-block\`\`\`, list `*`, link `[]()`, phân tách dòng `---`).
* **Fallback thông minh**: Nếu chưa cấu hình Firebase `.env` hoặc DB trống, trang Blog tự động tải 3 bài viết chuyên môn chất lượng cao (về Flutter, React Performance, Zalo Mini App) từ local memory để chạy demo mượt mà.

### 5. 🔊 Hiệu Ứng Âm Thanh & Glitch Alert
* Bộ quản lý âm thanh 8-bit sống động khi nhấn nút, chuyển trang hoặc kích hoạt sự kiện.
* Tích hợp nút bật/tắt (Mute) âm thanh lưu trạng thái vào LocalStorage.
* Hiệu ứng rung màn hình, hú còi cảnh báo đỏ (glitch overlay) khi phát hiện lệnh sudo lạ hoặc lỗi giả lập.

---

## 🛠️ Công Nghệ Sử Dụng

* **Core**: React 19 (TypeScript), Vite.
* **Styling**: Tailwind CSS + Custom CSS Keyframes (độ tương thích hiệu ứng mượt mà tối đa).
* **Routing**: React Router DOM v6+.
* **Database**: Firebase Client SDK v10 (Firestore Database).
* **Icons**: Lucide React.
* **Audio**: HTML5 Audio Context.

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Dưới Local

### 1. Clone dự án và cài đặt dependencies
```bash
# Di chuyển vào thư mục dự án
cd Profile

# Cài đặt các gói thư viện
npm install
# hoặc
yarn install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` nằm ở thư mục gốc của dự án (đã cấu hình sẵn trong `.gitignore` để tránh rò rỉ key) và sao chép định dạng từ `.env.example`:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL_HERE
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

### 3. Chạy môi trường Development
```bash
npm run dev
# hoặc
yarn dev
```
Mở trình duyệt truy cập: [http://localhost:5173](http://localhost:5173)

### 4. Biên dịch cho Production
```bash
npm run build
# hoặc
yarn build
```
Mã nguồn tối ưu sẽ được xuất ra thư mục `/dist` sẵn sàng để đưa lên Vercel, Netlify hoặc GitHub Pages.
