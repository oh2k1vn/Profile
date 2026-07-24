import type { BlogPost } from '../types/blog';

export const MOCK_POSTS: BlogPost[] = [
  {
    id: 'flutter-performance-optimization',
    title: 'Tối ưu hóa hiệu năng và bộ đệm Widget trong Flutter App',
    slug: 'toi-uu-hoa-hieu-nang-widget-flutter',
    summary: 'Kiểm soát số lần rebuild của Widget tree giúp ứng dụng Flutter đạt tốc độ mượt mà 60FPS - 120FPS.',
    category: 'Mobile',
    tags: ['Flutter', 'Dart', 'Performance', 'Mobile App'],
    authorName: 'Nguyễn Minh Hiếu',
    readTime: '4 phút đọc',
    published: true,
    views: 128,
    createdAt: { seconds: 1784300000, nanoseconds: 0 },
    updatedAt: { seconds: 1784300000, nanoseconds: 0 },
    content: `Trong quá trình phát triển ứng dụng di động bằng **Flutter**, việc kiểm soát số lần render lại (rebuild) của Widget tree là yếu tố quyết định giúp ứng dụng đạt mượt mà 60FPS đến 120FPS.

### 1. Sử dụng từ khóa \`const\` đúng nơi đúng lúc
Khi khai báo Widget static với từ khóa \`const\`, Flutter Engine sẽ lưu bản sao Widget đó vào bộ nhớ và không bao giờ biên dịch hay rebuild lại Widget đó khi State cha thay đổi.

\`\`\`dart
// ❌ Chưa tối ưu
Widget build(BuildContext context) {
  return Container(
    padding: EdgeInsets.all(16.0),
    child: Text('Hello World'),
  );
}

// ✅ Đã tối ưu với const
Widget build(BuildContext context) {
  return const Padding(
    padding: EdgeInsets.all(16.0),
    child: Text('Hello World'),
  );
}
\`\`\`

### 2. Tách nhỏ Widget Tree thay vì viết hàm helper trả về Widget
Nhiều bạn có thói quen viết các hàm dạng \`Widget _buildHeader() { ... }\` thay vì tạo một \`StatelessWidget\` độc lập.

- **Dùng hàm helper**: Khi State thay đổi, toàn bộ cây mẹ sẽ rebuild lại cả đoạn code trong hàm helper.
- **Dùng StatelessWidget**: Flutter sẽ cô lập phạm vi rebuild chỉ nằm trong Widget con đó.

---

### Kết luận
Tối ưu ứng dụng Flutter là một hành trình liên tục từ việc chọn cấu trúc State (Bloc / Riverpod) đến việc quản lý bộ nhớ hình ảnh với \`cached_network_image\`.`,
  },
  {
    id: 'zalo-mini-app-sdk-tips',
    title: 'Kinh nghiệm thực chiến phát triển Zalo Mini App cho ngành E-Commerce',
    slug: 'kinh-nghiem-phat-trien-zalo-mini-app-ecommerce',
    summary: 'Giải pháp tiếp cận hàng chục triệu người dùng Zalo không cần cài đặt thêm app ngoài.',
    category: 'Zalo Mini App',
    tags: ['Zalo Mini App', 'Vuejs', 'TailwindCSS', 'SDK'],
    authorName: 'Nguyễn Minh Hiếu',
    readTime: '3 phút đọc',
    published: true,
    views: 245,
    createdAt: { seconds: 1784200000, nanoseconds: 0 },
    updatedAt: { seconds: 1784200000, nanoseconds: 0 },
    content: `Hệ sinh thái **Zalo Mini App** đang bùng nổ tại Việt Nam nhờ khả năng tiếp cận hàng chục triệu người dùng mà không cần cài đặt thêm ứng dụng ngoài.

## Các thách thức cốt lõi khi làm Zalo Mini App

1. **Giới hạn dung lượng bundle dưới 10MB**: Bạn cần loại bỏ các thư viện quá nặng và tận dụng tối đa Tree-shaking.
2. **Tối ưu đăng nhập một chạm**: Sử dụng API \`zmp-sdk\` để lấy thông tin user nhanh chóng.

\`\`\`javascript
import { getUserInfo } from "zmp-sdk/apis";

const fetchUserProfile = async () => {
  try {
    const { userInfo } = await getUserInfo({});
    console.log("User Name:", userInfo.name);
    console.log("Avatar:", userInfo.avatar);
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng Zalo:", error);
  }
};
\`\`\`

---

*Lưu ý: Luôn test kỹ ứng dụng trên cả 2 hệ điều hành iOS và Android vì WebView của hai nền tảng này có một số điểm khác biệt về CSS Flexbox.*`,
  },
  {
    id: 'react-glassmorphism-tailwind-v4',
    title: 'Xây dựng hệ thống Liquid Glassmorphism với CSS & Tailwind v4',
    slug: 'xay-dung-he-thong-liquid-glassmorphism-tailwind-v4',
    summary: 'Hướng dẫn thiết kế giao diện kính lỏng iOS 18 / VisionOS đẳng cấp sử dụng Tailwind v4.',
    category: 'Frontend',
    tags: ['React', 'CSS', 'TailwindCSS', 'UI UX', 'Design System'],
    authorName: 'Nguyễn Minh Hiếu',
    readTime: '5 phút đọc',
    published: true,
    views: 310,
    createdAt: { seconds: 1784100000, nanoseconds: 0 },
    updatedAt: { seconds: 1784100000, nanoseconds: 0 },
    content: `Phong cách thiết kế **iOS 18 Liquid Glass** mang lại cảm giác sang trọng, trong suốt và mượt mà cho giao diện Web hiện đại.

### Các thuộc tính CSS cốt lõi

- \`backdrop-filter: blur(20px) saturate(180%)\`: Tạo độ mờ chiều sâu và tăng cường độ bão hòa màu sắc cho lớp nền bên dưới.
- \`border: 1px solid rgba(255, 255, 255, 0.14)\`: Đường viền phản quang vi mô (Specular border).
- \`box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.2)\`: Đường viền sáng bên trong phía trên tạo chiều sâu nổi.

\`\`\`css
.liquid-glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
}
\`\`\`

Bằng cách kết hợp với các hiệu ứng chuyển động keyframe, chúng ta tạo ra được một sản phẩm web hoàn toàn thu hút ánh nhìn đầu tiên của người dùng!`,
  },
];
