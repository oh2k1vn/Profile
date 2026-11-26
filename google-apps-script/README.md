# Hướng dẫn kết nối Google Sheets & Bảo mật Zero-Trust

Hạ tầng này cho phép website React/Vite đọc và ghi dữ liệu trực tiếp vào **Google Sheets** qua **Google Apps Script Web App**, đồng thời xác thực hoàn toàn trên **Server (Apps Script)** để không lộ bất kỳ mật khẩu, hash hay API key nào ra trình duyệt.

---

## 1. Tạo Google Sheets & cài đặt Apps Script

1. Tạo một Google Sheet mới tại [sheets.google.com](https://sheets.google.com).
2. Chọn **Extensions (Tiện ích mở rộng) → Apps Script**.
3. Dán toàn bộ nội dung file [`Code.gs`](./Code.gs) vào `Code.gs` và lưu (**Ctrl + S**).

## 2. Khởi tạo các Tab Database ban đầu

1. Chọn hàm **`setupDatabaseSheets`** trên thanh công cụ → nhấn **Run** và cấp quyền truy cập Sheet.
2. Các tab `Profile`, `Skills`, `Projects`, `Posts`, `Categories`, `Guestbook` sẽ tự động được tạo.

## 3. Thiết lập Mã Truy Cập (Mã hóa Salted Iterated SHA-256 trên Server)

1. Trong `Code.gs`, tìm hàm `setupAuthPasscode(rawPasscode)`, tạm thay `'THAY_MA_BI_MAT_CUA_BAN'` bằng mã bí mật của bạn (tối thiểu 6 ký tự).
2. Chọn hàm **`setupAuthPasscode`** trên thanh công cụ → nhấn **Run**.
3. **Quan trọng**: Sau khi chạy xong, xóa mã bí mật bạn vừa gõ khỏi `Code.gs` (trả lại `'THAY_MA_BI_MAT_CUA_BAN'`) và nhấn **Ctrl + S**.
   - Lúc này mã thật đã được băm 10,000 vòng + Salt ngẫu nhiên và lưu trong **Project Settings → Script Properties**, không thể đọc ngược.

## 4. Deploy thành Web App

1. Nhấn **Deploy → New deployment** → chọn **Web app**:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
2. Copy **Web app URL** (`https://script.google.com/macros/s/.../exec`).

## 5. Cấu hình `.env` trên Frontend

Copy `.env.example` thành `.env` và chỉ điền duy nhất URL Web App (không chứa bất kỳ secret/hash nào ở Frontend):
```env
VITE_SHEETS_WEBAPP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```
