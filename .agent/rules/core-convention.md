---
name: core-convention
description: Bộ quy tắc mã nguồn cốt lõi và tiêu chuẩn phát triển bắt buộc cho dự án OptiFlow (Zalo Mini App).
---

### 1. Nền tảng Công nghệ (Tech Stack)

- **Framework:** ReactJS (v18+) trên nền tảng **Zalo Mini App (ZMP)**.
- **Ngôn ngữ:** TypeScript (Strict Mode).
- **Styling:** Tailwind CSS v4 (Utility-first).
- **UI Libraries:**
  - **ZMP UI:** Sử dụng cho các component tiêu chuẩn của Zalo (Header, ButtonZalo, List...).
  - **Custom UI:** Các component tùy chỉnh nằm trong `@/components/ui/`, xây dựng dựa trên Tailwind và Framer Motion.
- **State Management:** Jotai.
- **Routing:** React Router DOM v7.
- **Icons:** Lucide React.
- **Animations:** Framer Motion.

### 2. Tiêu chuẩn TypeScript & React

- **Strict Typing:** Bắt buộc định nghĩa `interface` hoặc `type` cho tất cả props và state. Tuyệt đối không sử dụng `any`.
- **Component:** Viết dưới dạng Functional Components sử dụng Arrow Functions.
- **Hooks:** Ưu tiên tách logic phức tạp ra Custom Hooks trong thư viện `@/hooks/`.
- **Export:** Sử dụng **Named Exports** để tăng khả năng gợi ý (Intellisense) và refactor. Tránh Default Exports trừ trường hợp đặc biệt.
- **Path Alias:** Luôn sử dụng `@/` để trỏ vào thư mục `src`.

### 3. Quy chuẩn Styling (Tailwind CSS)

- Chỉ sử dụng utility classes của Tailwind CSS.
- **Lưu ý:** Dự án sử dụng Tailwind v4, cấu hình trực tiếp trong `@/css/tailwind.css` hoặc qua các plugin Vite.
- Tuyệt đối không dùng inline styles (`style={{...}}`) trừ khi xử lý giá trị động từ state/props mà Tailwind không hỗ trợ.
- Sử dụng utility `cn(...)` từ `@/utils/cn` để gộp class một cách an toàn.
- Tuân thủ Mobile-First (vd: `text-sm md:text-base`).

### 4. Tích hợp Component & UI

- Khi cần component, ưu tiên kiểm tra theo thứ tự:
  1. Thư viện `zmp-ui` (nếu cần giao diện chuẩn Zalo).
  2. Thư mục `@/components/ui/` (các component dùng chung đã có).
  3. Chỉ tự code mới khi không tìm thấy component tương đương.
- Đường dẫn import chuẩn: `@/components/ui/[tên-component]`.

### 5. Quy tắc Vận hành AI & Clean Code

- **Ngôn ngữ:**
  - Code logic, tên biến/hàm, comments, git commit: **Tiếng Anh**.
  - Nội dung hiển thị trên giao diện (UI Text): **Tiếng Việt**.
- **Performance:** Sử dụng `memo`, `useCallback`, `useMemo` đúng lúc để tối ưu render trên thiết bị di động.
- **Dọn dẹp:** Xóa bỏ `console.log` và code bị comment-out (dead code) trước khi bàn giao.
- **ZMP SDK:** Tuân thủ các giới hạn và API đặc thù của `zmp-sdk` khi tương tác với hệ thống Zalo.
