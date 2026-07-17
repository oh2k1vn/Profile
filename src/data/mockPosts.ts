export interface BlogPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
  isMock?: boolean;
}

export const MOCK_POSTS: BlogPost[] = [
  {
    id: "flutter-async-state-management",
    title: "Lập trình bất đồng bộ & State Management trong Flutter: Bloc vs Provider",
    content: `# Quản lý trạng thái hiệu năng cao trong Flutter

Trong thế giới phát triển ứng dụng di động với **Flutter**, việc quản lý trạng thái (State Management) và xử lý luồng dữ liệu bất đồng bộ (Asynchronous Programming) đóng vai trò quyết định đến hiệu năng và cấu trúc source code của dự án. 

Hôm nay, mình sẽ chia sẻ góc nhìn thực tế sau nhiều năm phát triển app Flutter về việc lựa chọn giữa **Bloc (Business Logic Component)** và **Provider**, cũng như cách kết hợp chúng với lập trình bất đồng bộ để tối ưu UI render.

---

## 1. Bản chất bất đồng bộ trong Dart: Future và Stream

Dart là ngôn ngữ đơn luồng (single-threaded) chạy trên cơ chế **Event Loop**. Điều này có nghĩa là mọi tác vụ I/O nặng (như gọi API, truy vấn local database) cần được xử lý thông qua cơ chế bất đồng bộ:

- **Future**: Đại diện cho một giá trị sẽ trả về trong tương lai (Single Value). Sử dụng cú pháp \`async/await\` quen thuộc.
- **Stream**: Đại diện cho một luồng dữ liệu liên tục thay đổi theo thời gian (Iterable/Multiple Values). Đây là xương sống của kiến trúc Reactive Programming.

\`\`\`dart
// Ví dụ về Stream tạo ra luồng sự kiện mỗi giây
Stream<int> counterStream() async* {
  int count = 0;
  while (true) {
    await Future.delayed(Duration(seconds: 1));
    yield ++count;
  }
}
\`\`\`

---

## 2. So sánh Bloc vs Provider dưới góc độ thực tế

Cả hai thư viện đều giải quyết bài toán chia sẻ và cập nhật dữ liệu xuyên suốt widget tree mà không cần truyền prop lồng nhau (Prop Drilling). Tuy nhiên, triết lý thiết kế của chúng rất khác nhau:

### Provider (Đơn giản & Trực quan)
Provider hoạt động xoay quanh lớp \`ChangeNotifier\`. Khi dữ liệu thay đổi, ta gọi phương thức \`notifyListeners()\` để kích hoạt vẽ lại các widget đang lắng nghe.
- **Ưu điểm**: Dễ học, code ngắn, phù hợp cho các dự án quy mô vừa và nhỏ.
- **Nhược điểm**: Nếu không quản lý tốt, việc gọi \`notifyListeners()\` vô tội vạ sẽ dẫn đến thừa thãi Render (Over-rendering).

### Bloc (Kiểm soát tuyệt đối)
Bloc chia ứng dụng thành các luồng sự kiện rõ rệt: **Event -> Bloc -> State**. Bloc nhận Event, xử lý bất đồng bộ, sau đó bắn ra State mới thông qua Stream.
- **Ưu điểm**: Tách biệt hoàn toàn Business Logic khỏi UI, dễ viết Unit Test, kiểm soát trạng thái cực kỳ chặt chẽ.
- **Nhược điểm**: Cần viết nhiều boilerplate code (Event, State, Bloc classes).

---

## 3. Lời khuyên thiết kế kiến trúc

Nếu dự án có độ phức tạp cao, nhiều luồng tương tác đan xen hoặc làm việc theo nhóm, hãy ưu tiên dùng **Bloc/Cubit**. Nó giúp thống nhất cấu trúc code và dễ dàng debug thông qua \`BlocObserver\`.

Với các màn hình đơn giản, việc dùng \`Cubit\` hoặc \`Provider\` sẽ giúp tiết kiệm thời gian phát triển và giữ cho dự án gọn nhẹ.`,
    tags: ["flutter", "dart", "state-management"],
    createdAt: { seconds: 1784260000, nanoseconds: 0 },
    updatedAt: { seconds: 1784260000, nanoseconds: 0 },
    isMock: true
  },
  {
    id: "react-nextjs-performance-2026",
    title: "Tối ưu hiệu năng ứng dụng React và Next.js toàn diện trong thực tế",
    content: `# Bí quyết tối ưu hiệu năng React & Next.js

Hiệu năng trang web (Web Vitals) là yếu tố sống còn ảnh hưởng trực tiếp đến trải nghiệm người dùng và điểm SEO Google. 

Trong bài viết này, mình sẽ đi thẳng vào các kỹ thuật tối ưu hóa cốt lõi dành cho ứng dụng **React** và **Next.js** mà mình thường xuyên áp dụng trong các dự án thực tế.

---

## 1. Tránh Over-rendering (Vẽ lại thừa thãi)

React mặc định sẽ render lại widget con khi component cha thay đổi trạng thái. Để tối ưu hóa việc này, ta cần làm chủ bộ ba:

- **React.memo**: Cache lại component con nếu props của nó không thay đổi.
- **useMemo**: Ghi nhớ kết quả tính toán đắt đỏ để không phải tính lại ở mỗi lượt render.
- **useCallback**: Ghi nhớ tham chiếu hàm (function reference) để tránh tạo mới bộ nhớ khi truyền xuống component con dưới dạng prop.

\`\`\`javascript
// Ghi nhớ component con để tránh re-render
const ExpensiveComponent = React.memo(({ data, onItemClick }) => {
  return (
    <ul>
      {data.map(item => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});
\`\`\`

---

## 2. Chia nhỏ Bundle & Tải chậm (Code-Splitting / Lazy Loading)

Đừng bắt trình duyệt tải toàn bộ code JavaScript của ứng dụng trong lần đầu tiên. Hãy chia nhỏ ứng dụng ra bằng **React.lazy** và **Suspense** (hoặc \`next/dynamic\` trong Next.js).

Tải chậm các component không xuất hiện trên khung nhìn ban đầu (như Modals, Charts, Widgets) sẽ giúp giảm chỉ số **LCP (Largest Contentful Paint)** đáng kể.

---

## 3. Tận dụng tối đa Next.js Image Component

Đừng bao giờ dùng thẻ \`<img>\` thô nếu bạn dùng Next.js. Thẻ \`<Image>\` đi kèm các tối ưu hóa cực kỳ đáng giá:
- Tự động chuyển đổi định dạng ảnh sang WebP/AVIF hiện đại.
- Lazy load tự động (chỉ tải khi cuộn tới).
- Phục vụ ảnh với kích thước tùy biến theo độ phân giải màn hình của thiết bị khách.`,
    tags: ["react", "nextjs", "performance"],
    createdAt: { seconds: 1784270000, nanoseconds: 0 },
    updatedAt: { seconds: 1784270000, nanoseconds: 0 },
    isMock: true
  },
  {
    id: "zalo-mini-app-performance-tips",
    title: "Bí quyết tối ưu hóa và làm chủ hệ sinh thái Zalo Mini App",
    content: `# Xây dựng Zalo Mini App hiệu năng cao

Hệ sinh thái **Zalo Mini App** đang phát triển bùng nổ tại Việt Nam nhờ lợi thế tiếp cận tệp khách hàng khổng lồ của Zalo chỉ với một cú chạm. 

Tuy nhiên, môi trường Mini App đi kèm với những ràng buộc tài nguyên khắt khe. Bài viết này đúc kết các kinh nghiệm xương máu giúp bạn xây dựng ứng dụng mượt mà và tối ưu hóa thời gian tải trang.

---

## 1. Giới hạn dung lượng Bundle dưới 10MB

Zalo Mini App yêu cầu gói build cuối cùng phải nhẹ để tải nhanh qua mạng di động 4G. Để đạt được chỉ số này:
- **Hạn chế thư viện ngoài**: Tránh cài các bộ thư viện UI quá cồng kềnh. Hãy ưu tiên viết CSS thuần hoặc TailwindCSS.
- **Tách gói (Multi-subpackages)**: Sử dụng cấu hình của Zalo để chia app thành một gói chính (Main Package) và các gói con (Subpackages) tải chậm theo nhu cầu.
- **Tối ưu hình ảnh**: Đưa toàn bộ tài nguyên hình ảnh lên CDN bên ngoài, không đóng gói trực tiếp vào thư mục \`assets\` của Mini App.

---

## 2. Tận dụng API Native của Zalo SDK

Thay vì tự xây dựng các luồng xác thực phức tạp, hãy tận dụng tối đa sức mạnh phần cứng và quyền lợi hệ thống thông qua các hàm Native SDK của Zalo:

\`\`\`javascript
// Gọi Zalo native API lấy thông tin người dùng cực nhanh
import { getUserInfo } from 'zmp-sdk/apis';

const fetchUserData = async () => {
  try {
    const { userInfo } = await getUserInfo({});
    console.log("User:", userInfo.name);
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng native", error);
  }
};
\`\`\`

---

## 3. Tối ưu thời gian khởi động (Startup Time)

Mục tiêu cốt lõi của Mini App là người dùng mở lên là dùng được ngay trong vòng dưới 2 giây.
- Giảm thiểu số lượng request API trong hàm khởi động app (\`onLaunch\` / \`useEffect\` gốc).
- Sử dụng cache lưu trữ tạm thời thông qua \`zmp-sdk\` storage để hiển thị bộ khung UI (skeleton screen) trước khi dữ liệu mới nhất được fetch về thành công.`,
    tags: ["zalo-mini-app", "optimization", "vuejs"],
    createdAt: { seconds: 1784280000, nanoseconds: 0 },
    updatedAt: { seconds: 1784280000, nanoseconds: 0 },
    isMock: true
  }
];
