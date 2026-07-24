# 🎨 DESIGN RULES & GUIDELINES — iOS Liquid Glass Design System

Tài liệu quy chuẩn thiết kế dành cho các nhà phát triển và AI Agent xây dựng / mở rộng hệ thống website Portfolio của **Nguyễn Minh Hiếu**.

Toàn bộ ứng dụng sử dụng ngôn ngữ thiết kế **iOS 18 / VisionOS Liquid Glass (Glassmorphism)**. Bất kỳ thành phần UI mới nào được thêm vào **bắt buộc phải tuân thủ** các quy tắc thiết kế dưới đây.

---

## 1. 🌈 Color Palette & Ambient Atmosphere (Bảng Màu & Khí Quyển)

- **Nền Tảng Đáy (Base Canvas)**: Nền tối Deep Dark Slate/Indigo `#07090e`.
- **Khối Đèn Nền Chuyển Động (Ambient Light Mesh)**: Đặt cố định bên dưới các lớp kính mờ để tạo độ sâu thị giác:
  - **Orb 1 (Sky Blue)**: `from-sky-500/20 via-blue-600/15`
  - **Orb 2 (Indigo/Purple)**: `from-indigo-500/20 via-purple-600/15`
  - **Orb 3 (Cyan/Teal)**: `from-teal-500/15 via-sky-600/10`
- **Hệ Thống Phân Cấp Chữ (Typography)**:
  - **Tiêu đề chính**: Trắng tinh `#ffffff` hoặc dải màu Gradient Liquid Glass (`glow-text-ios` - Trắng sang Sky Blue sang Indigo).
  - **Văn bản chính (Primary)**: `text-slate-100` / `#f8fafc`.
  - **Văn bản phụ (Secondary)**: `text-slate-300` / `text-slate-400`.
  - **Màu Accent (Điểm nhấn)**: Sky Blue `#38bdf8`, Indigo `#6366f1`, Purple `#a855f7`, Emerald `#10b981`, Rose `#f43f5e`.

---

## 2. 💎 Liquid Glass Surfaces & Specular Borders (Bề Mặt Kính Lỏng)

- **Thẻ & Khung Chứa Kính (Cards & Containers)**: Sử dụng các lớp tiện ích `.liquid-glass` hoặc `.liquid-glass-card`.
  - Background: `linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)`
  - Backdrop Blur: `backdrop-filter: blur(18px) saturate(180%)`
  - Viền kính phản quang (Specular Border): `1px solid rgba(255, 255, 255, 0.14)` (khi hover chuyển thành `rgba(255, 255, 255, 0.35)`).
  - Đường viền sáng bên trong (Inset Specular Highlight): `inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`.
- **Tương Tác Khi Hover (Micro-Interactions)**:
  - Ánh kim vệt sáng quét ngang qua thẻ (`::before` skew pseudo-element).
  - Nâng nhẹ khối thẻ lên trên (`hover:-translate-y-1.5`).
  - Viền phát sáng nhẹ màu Sky Blue (`0 0 20px 2px rgba(56, 189, 248, 0.2)`).

---

## 3. 🔘 iOS Geometry & Controls (Hình Học & Nút Bấm iOS)

- **Độ Bo Góc (Corner Radii)**: Chuẩn hóa theo phong cách hình học bo tròn của iOS:
  - **Khung chứa lớn / Modal / Layout chính**: `rounded-3xl` (24px).
  - **Thẻ card & Khung form**: `rounded-3xl` hoặc `rounded-2xl` (16px - 24px).
  - **Nút bấm & Viên thuốc (Pills)**: `rounded-full` (9999px) hoặc `rounded-2xl`.
- **Thanh Điều Hướng Floating Navbar**: Đặt nổi cố định ở đầu trang (`sticky top-3 sm:top-5 rounded-full px-6 py-3 liquid-glass`). Tab đang chọn phải dùng hiệu ứng viền kính nổi (`bg-white/15 text-sky-400 font-semibold border border-white/20 shadow-md`).
- **Bộ Chọn Tab (iOS Segmented Control)**: Dùng `.glass-segmented-control` với chỉ báo tab chủ đạo hình viên thuốc kính nổi.
- **Ô Nhập Liệu (Input Fields)**: Dùng `.glass-input` (`bg-slate-900/50 backdrop-blur-xl border border-white/12 focus:border-sky-400/60 focus:ring-sky-400/20 rounded-2xl`).
- **Nút Bấm Hành Động (CTA Buttons)**:
  - Nút chính (Primary CTA): Sử dụng `.liquid-glass-accent-btn`.
  - Nút phụ (Secondary CTA): Sử dụng `.liquid-glass-pill`.

---

## 4. 🪟 Windows & Modals (Khung Cửa Sổ & Sheet)

- **Cửa Sổ Terminal**: Đóng gói trong khung kính iOS mờ kèm 3 nút tròn điều hướng giao diện macOS/iOS (`bg-rose-500`, `bg-amber-400`, `bg-emerald-400`) phát sáng nhè nhẹ.
- **Modal Chi Tiết (Project Modal)**: Định dạng dạng **iOS Bottom Sheet** với bo góc `rounded-3xl` và thanh nắm kéo (drag handle) ở cạnh trên (`w-12 h-1.5 rounded-full bg-white/25`).

---

## 5. 🛠 Quy Chuẩn Mã Nguồn & Phát Triển Mới

- **CSS Centralization**: Tất cả các utility class liên quan đến hiệu ứng kính mờ và keyframe animation bắt buộc nằm trong `src/index.css`.
- **Tương Thích Thiết Bị Di Động (Responsive)**: Luôn duy trì layout 2 chế độ (`hidden md:flex`, `flex-col sm:flex-row`) và thanh điều hướng rút gọn dạng pill di động.
- **Phản Hồi Cơ Học & Âm Thanh (Tactile Audio Feedback)**: Giữ nguyên các lời gọi `audioService.playClick()`, `audioService.playSuccess()`, `audioService.playError()` khi người dùng thực hiện hành động trên UI.
