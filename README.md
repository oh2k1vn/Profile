# 🖥️ Nguyễn Minh Hiếu - Portfolio & CLI Terminal Workspace (iOS Liquid Glass Edition)

Chào mừng bạn đến với Repository website giới thiệu năng lực cá nhân và không gian lập trình tương tác của **Nguyễn Minh Hiếu** - Middle Frontend & Mobile Developer.

Dự án được thiết kế hoàn toàn theo ngôn ngữ giao diện **iOS 18 / VisionOS Liquid Glass (Glassmorphism)**, kết hợp giữa hiệu ứng kính mờ đa tầng, các khối chuyển động Mesh Gradient lỏng, tương tác cơ học âm thanh 8-bit và cấu trúc quản lý trang chuyên nghiệp.

---

## 🎨 Quy Chuẩn Thiết Kế (iOS Liquid Glass Design System)

Mọi đóng góp hoặc phát triển thêm tính năng cho dự án đều tuân thủ các quy tắc trong [.agents/AGENTS.md](file:///d:/Profile/.agents/AGENTS.md):

* **Ambient Light Mesh Background**: Các khối đèn chuyển động đa tầng (`mesh-float-1`, `mesh-float-2`) nằm cố định phía sau lớp kính tạo độ sâu cho toàn bộ ứng dụng.
* **Liquid Glass Surfaces & Specular Edge Highlights**: Bề mặt kính mờ độ phân giải cao (`backdrop-blur-xl`, `backdrop-saturate-180`), kết hợp viền kính phản quang mỏng (`border-white/14`) và vệt sáng ánh kim trượt khi hover.
* **iOS Geometry & Controls**: Bo góc mềm mại (`rounded-3xl`, `rounded-2xl`, `rounded-full`), thanh điều hướng floating pill navbar nổi bồng bềnh, và bộ chọn tab **iOS Segmented Control**.
* **Thanh Cuộn iOS**: Thanh cuộn trong suốt kính mờ bo tròn chuẩn iOS (`::-webkit-scrollbar-thumb`).

---

## 🚀 Các Tính Năng Nổi Bật

### 1. 🖼️ Liquid Glass 3D Avatar Card (Hero Section)
* **Tương tác 3D theo chuột**: Khi di chuyển con trỏ chuột, khung chân dung tự động nghiêng (`rotateX`, `rotateY`) và phóng to nhẹ theo tọa độ 3D.
* **Liquid Glass HUD**: Tích hợp các chi tiết thiết kế công nghệ giả lập chẩn đoán hệ thống (`SYS_STATUS`) trong thẻ kính bồng bềnh và đường viền phát sáng đáy.
* **Chuyển đổi màu sắc**: Ảnh tự động phóng to mượt mà và phủ dải ánh sáng kính lỏng khi rê chuột vào.

### 2. 🚦 Phân Trang & Điều Hướng Floating Pill Navbar (React Router)
* **Floating iOS Navbar**: Thanh menu kính mờ dạng viên thuốc nổi cố định ở đầu trang (`sticky top-4`), hiển thị indicator nền kính mờ cho tab đang kích hoạt.
* **URL Paths Sạch**:
  * `/` : Trang giới thiệu chi tiết (Hero, Giới thiệu, Kỹ năng, Dự án).
  * `/playground` : Không gian tương tác dòng lệnh (CLI Terminal & Sổ lưu bút).
  * `/blog` : Kho lưu trữ bài viết, bài lưu ý kỹ thuật cá nhân.
  * `/blog/:id` : Đọc chi tiết bài viết, hỗ trợ kết xuất nội dung Markdown.
* **Điều phối Nav-Scroll chéo**: Tự động chuyển hướng từ các trang con về trang chủ và cuộn mượt mà (`smooth scroll`) tìm đúng thẻ ID tương ứng (`#about`, `#skills`, `#projects`).

### 3. 📟 Trình Giả Lập CLI Terminal & Sổ Lưu Bút Kính Mờ
* **Terminal.app Window**: Khung dòng lệnh bọc trong cửa sổ kính iOS mờ với 3 chấm nút traffic-light (Đỏ, Vàng, Xanh) phát sáng. Hỗ trợ các câu lệnh đặc trưng (`help`, `about`, `skills`, `projects`, `clear`, `date`, `cat`, `sudo rm -rf /`).
* **Guestbook Board**: Bảng tin lưu bút kính mờ cho phép mọi người gửi lời nhắn trực tiếp lên giao diện.

### 4. 📝 Trang Blog Tích Hợp Firebase Firestore
* **Firestore Realtime Database**: Đồng bộ hóa dữ liệu bài viết hai chiều thời gian thực (Realtime updates).
* **Blog Editor Modal**: Khung soạn thảo bài viết kính mờ hỗ trợ tiêu đề, tags, và viết bài bằng cú pháp **Markdown**.
* **Markdown Renderer tự viết**: Không phụ thuộc vào thư viện bên ngoài, tự động parse các thẻ Markdown thông dụng (`#`, `##`, `***`, `**`, \`code\`, \`\`\`code-block\`\`\`, list `*`, link `[]()`, phân tách dòng `---`).
* **Fallback thông minh**: Nếu chưa cấu hình Firebase `.env` hoặc DB trống, trang Blog tự động tải các bài viết chuyên môn chất lượng cao (về Flutter, React Performance, Zalo Mini App) từ local memory.

### 5. 🔊 Hiệu Ứng Âm Thanh & Glitch Alert
* Bộ quản lý âm thanh 8-bit sống động khi nhấn nút, chuyển trang hoặc kích hoạt sự kiện.
* Tích hợp nút bật/tắt (Mute) âm thanh dạng viên thuốc kính mờ lưu trạng thái vào LocalStorage.
* Hiệu ứng rung màn hình, cảnh báo đỏ (glitch overlay) khi phát hiện lệnh sudo lạ hoặc lỗi giả lập.

---

## 🛠️ Công Nghệ Sử Dụng

* **Core**: React 19 (TypeScript), Vite.
* **Styling**: Tailwind CSS v4 + Custom iOS Liquid Glass Utilities + Keyframe Animations.
* **Routing**: React Router DOM v7.
* **Database**: Firebase Client SDK v12 (Firestore Database).
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
```

### 2. Cấu hình biến môi trường
Tạo file `.env` nằm ở thư mục gốc của dự án và sao chép định dạng từ `.env.example`:

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
```
Mở trình duyệt truy cập: [http://localhost:5173](http://localhost:5173)

### 4. Biên dịch cho Production
```bash
npm run build
```
Mã nguồn tối ưu sẽ được xuất ra thư mục `/dist` sẵn sàng để đưa lên Vercel, Netlify hoặc GitHub Pages.
