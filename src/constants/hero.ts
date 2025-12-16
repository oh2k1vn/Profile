import Logo from '@/assets/images/logo.png'
import {
  BookOpen,
  Code,
  Facebook,
  Github,
  Home,
  Layers,
  Layout,
  Linkedin,
  PenTool,
  Rocket,
  Search,
  Smartphone,
  Zap,
} from 'lucide-react'

export const HERO_CONSTANTS = {
  logo: Logo,
  textLogo: 'HieuNguyen.',
  profileImage:
    'https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/304301744_646096167073918_6201416130930987462_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHIHgy3WYzL2vW1TfxR5xWeWj4cQU-puNRaPhxBT6m41KV5HBCqP2gkMXQHviEhjN22eBSS00X6Y1CeTYbu9y_N&_nc_ohc=bz2-mn6187IQ7kNvwGV4DBk&_nc_oc=AdmIBneCMPq_UKGs88jsf_CFvMvVp-itnuXBINMLB0SwsbgpvNiUH1fby1FHlc-YGfo&_nc_zt=23&_nc_ht=scontent.fsgn5-12.fna&_nc_gid=TUZK6D2ZNWdw0Al34kQ04Q&oh=00_AfngG5edVBhr6oW15nZ-sl6AZE1Nu7RtqlRXQaFyJ55XeQ&oe=693C8AB6',
  socials: [
    { icon: Github, href: 'https://github.com/oh2k1vn' },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/hieu-nguyen-879101241/',
    },
    { icon: Facebook, href: 'https://www.facebook.com/GeminiDev1606/' },
  ],
  techStack: [
    { key: 'flutter', icon: Smartphone, color: 'text-blue-500' },
    { key: 'react', icon: Layers, color: 'text-cyan-500' },
    { key: 'zalo', icon: Zap, color: 'text-yellow-500' },
  ],
  menuHeader: [
    { name: 'Home', href: '/', icon: Home },
    { name: 'learn', href: '/learn', icon: BookOpen },
  ],
  myTechStack: [
    {
      key: 'react',
      name: 'React',
      image: 'https://cdn.simpleicons.org/react/61DAFB',
    },
    {
      key: 'typescript',
      name: 'TypeScript',
      image: 'https://cdn.simpleicons.org/typescript/3178C6',
    },
    {
      key: 'nextjs',
      name: 'Next.js',
      image: 'https://cdn.simpleicons.org/nextdotjs/000000',
    },
    {
      key: 'vue',
      name: 'Vue.js',
      image: 'https://cdn.simpleicons.org/vuedotjs/4FC08D',
    },
    {
      key: 'nuxt',
      name: 'Nuxt.js',
      image: 'https://cdn.simpleicons.org/nuxt/00DC82',
    },
    {
      key: 'dart',
      name: 'Dart',
      image: 'https://cdn.simpleicons.org/dart/0175C2',
    },
    {
      key: 'tailwindcss',
      name: 'Tailwind CSS',
      image: 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
    },
    {
      key: 'sass',
      name: 'Sass',
      image: 'https://cdn.simpleicons.org/sass/CC6699',
    },
    {
      key: 'shadcn',
      name: 'shadcn/ui',
      image: 'https://cdn.simpleicons.org/shadcnui/000000',
    },
    {
      key: 'antd',
      name: 'Ant Design',
      image: 'https://cdn.simpleicons.org/antdesign/0170FE',
    },
    {
      key: 'bootstrap',
      name: 'Bootstrap',
      image: 'https://cdn.simpleicons.org/bootstrap/7952B3',
    },
    {
      key: 'nodejs',
      name: 'Node.js',
      image: 'https://cdn.simpleicons.org/nodedotjs/339933',
    },
    {
      key: 'firebase',
      name: 'Firebase',
      image: 'https://cdn.simpleicons.org/firebase/FFCA28',
    },
    {
      key: 'git',
      name: 'Git',
      image: 'https://cdn.simpleicons.org/git/F05032',
    },
    {
      key: 'figma',
      name: 'Figma',
      image: 'https://cdn.simpleicons.org/figma/F24E1E',
    },
  ],
  skillCluster: [
    {
      id: 'frontend_core',
      label: 'Frontend Hiện Đại',
      description: 'Xây dựng ứng dụng giao diện hiệu năng cao, dễ mở rộng.',
      color: 'bg-blue-500',
      skills: [
        {
          key: 'react',
          name: 'React',
          image: 'https://cdn.simpleicons.org/react/61DAFB',
        },
        {
          key: 'nextjs',
          name: 'Next.js',
          image: 'https://cdn.simpleicons.org/nextdotjs/000000',
        },
        {
          key: 'typescript',
          name: 'TypeScript',
          image: 'https://cdn.simpleicons.org/typescript/3178C6',
        },
        {
          key: 'vue',
          name: 'Vue.js',
          image: 'https://cdn.simpleicons.org/vuedotjs/4FC08D',
        },
        {
          key: 'nuxt',
          name: 'Nuxt.js',
          image: 'https://cdn.simpleicons.org/nuxt/00DC82',
        },
      ],
    },
    {
      id: 'ui_styling',
      label: 'Lập Trình Giao Diện',
      description:
        'Thiết kế giao diện đẹp mắt, tương thích mọi thiết bị và dễ tiếp cận.',
      color: 'bg-pink-500',
      skills: [
        {
          key: 'tailwindcss',
          name: 'Tailwind CSS',
          image: 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
        },
        {
          key: 'shadcn',
          name: 'shadcn/ui',
          image: 'https://cdn.simpleicons.org/shadcnui/000000',
        },
        {
          key: 'sass',
          name: 'Sass',
          image: 'https://cdn.simpleicons.org/sass/CC6699',
        },
        {
          key: 'antd',
          name: 'Ant Design',
          image: 'https://cdn.simpleicons.org/antdesign/0170FE',
        },
        {
          key: 'bootstrap',
          name: 'Bootstrap',
          image: 'https://cdn.simpleicons.org/bootstrap/7952B3',
        },
      ],
    },
    {
      id: 'backend_mobile',
      label: 'Backend & Di Động',
      description: 'Xử lý logic dữ liệu và phát triển ứng dụng đa nền tảng.',
      color: 'bg-green-500',
      skills: [
        {
          key: 'nodejs',
          name: 'Node.js',
          image: 'https://cdn.simpleicons.org/nodedotjs/339933',
        },
        {
          key: 'firebase',
          name: 'Firebase',
          image: 'https://cdn.simpleicons.org/firebase/FFCA28',
        },
        {
          key: 'dart',
          name: 'Dart (Flutter)',
          image: 'https://cdn.simpleicons.org/dart/0175C2',
        },
      ],
    },
    {
      id: 'tools_workflow',
      label: 'Công Cụ & Quy Trình',
      description:
        'Tối ưu hóa quy trình quản lý mã nguồn và chuyển giao thiết kế.',
      color: 'bg-orange-500',
      skills: [
        {
          key: 'git',
          name: 'Git',
          image: 'https://cdn.simpleicons.org/git/F05032',
        },
        {
          key: 'figma',
          name: 'Figma',
          image: 'https://cdn.simpleicons.org/figma/F24E1E',
        },
      ],
    },
  ],
  workflow: [
    {
      id: '01',
      icon: Search,
      title: 'Phân Tích & Nghiên Cứu',
      description:
        'Tôi bắt đầu bằng việc thấu hiểu sâu sắc yêu cầu nghiệp vụ. Tận dụng kinh nghiệm về hệ thống E-commerce và Booking, tôi phân tích kỹ lưỡng các trường hợp ngoại lệ (edge-cases) trước khi viết dòng code đầu tiên.',
    },
    {
      id: '02',
      icon: PenTool,
      title: 'Thiết Kế Kiến Trúc',
      description:
        'Lên kế hoạch cấu trúc dự án. Dù là Clean Architecture cho Flutter hay Modular cho React, tôi luôn đảm bảo mã nguồn có khả năng mở rộng (scalable) và dễ bảo trì (maintainable).',
    },
    {
      id: '03',
      icon: Code,
      title: 'Phát Triển (Development)',
      description:
        'Viết Clean Code và tối ưu hóa hiệu năng ngay trong quá trình phát triển. Tôi tích hợp quy trình CI/CD và Unit Testing để giảm thiểu tối đa lỗi (bugs) khi vận hành thực tế.',
    },
    {
      id: '04',
      icon: Rocket,
      title: 'Tối Ưu & Triển Khai',
      description:
        'Đo lường các chỉ số Core Web Vitals hoặc FPS. Tôi tinh chỉnh (refactor) sản phẩm để đạt hiệu suất cao nhất trước khi bàn giao chính thức cho người dùng.',
    },
  ],
  experience: [
    {
      id: 'flutter_dev',
      role: 'Lập Trình Viên Mobile Flutter',
      company: 'ByteTech JSC',
      period: '10/2022 - Present',
      icon: Smartphone,
      theme: {
        iconColor: 'text-blue-500',
        border: 'border-blue-500/20 group-hover:border-blue-500/50',
        bgHover: 'group-hover:bg-blue-500/5',
        glow: 'rgba(59, 130, 246, 0.15)',
      },
      description:
        'Chuyên sâu về tối ưu hóa hiệu năng ứng dụng và thiết kế hệ thống theo mô hình Clean Architecture.',
      achievements: [
        "Giảm <span class='text-blue-600 dark:text-blue-400 font-bold'>45%</span> thời gian khởi động App nhờ chiến lược Caching & Lazy Loading.",
        "Duy trì hiệu năng <span class='text-blue-600 dark:text-blue-400 font-bold'>60fps</span> mượt mà ngay cả trên thiết bị cấu hình thấp.",
        "Refactor code cũ sang <span class='font-semibold'>Clean Architecture (BLoC)</span>, giảm 30% lượng bug phát sinh.",
        'Xây dựng các module phức tạp: Đặt lịch, Tích điểm đổi quà & Thông báo thời gian thực.',
      ],
      stack: ['Flutter', 'Dart', 'BLoC', 'Firebase', 'CI/CD'],
    },
    {
      id: 'zalo_dev',
      role: 'Frontend Developer (Zalo Mini App)',
      company: 'ByteTech JSC',
      period: '2021 - 2022',
      icon: Layout,
      theme: {
        iconColor: 'text-cyan-500',
        border: 'border-cyan-500/20 group-hover:border-cyan-500/50',
        bgHover: 'group-hover:bg-cyan-500/5',
        glow: 'rgba(6, 182, 212, 0.15)',
      },
      description:
        'Phát triển hệ sinh thái Zalo Mini App và công cụ Dynamic Form cho doanh nghiệp.',
      achievements: [
        "Phát triển ứng dụng E-commerce <span class='font-semibold'>'1Touch'</span> & <span class='font-semibold'>'Sell'</span> tích hợp sâu vào Zalo.",
        "Xây dựng <span class='text-cyan-600 dark:text-cyan-400 font-bold'>Dynamic Form Engine</span>, giảm 40% thời gian setup chiến dịch Marketing.",
        'Thiết kế hệ thống Đổi Thưởng (Reward System) xử lý logic đa chiến dịch phức tạp.',
        'Tích hợp thanh toán ZaloPay Token & xác thực người dùng bảo mật.',
      ],
      stack: ['React', 'ZMP', 'TypeScript', 'Tailwind', 'Node.js'],
    },
  ],
  projects: [
    {
      id: 1,
      title: 'Hệ thống Booking & Loyalty Spa',
      category: 'Flutter Mobile App',
      description:
        'Ứng dụng đặt lịch và tích điểm thưởng cho chuỗi Spa với hơn 50 chi nhánh. Tối ưu hóa trải nghiệm người dùng, giảm 45% thời gian khởi động nhờ kiến trúc Clean Architecture và chiến lược Caching thông minh.',
      tech: ['Flutter', 'BLoC', 'Firebase', 'Google Maps API', 'CI/CD'],
      type: 'phone', // Dùng cho Device Mockup
      links: { demo: '#', git: '#' },
      // Bạn hãy thay bằng đường dẫn ảnh thật trong thư mục public của bạn
      images: [
        'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
      ],
    },
    {
      id: 2,
      title: '1Touch - Zalo Mini App',
      category: 'Zalo Mini App',
      description:
        'Hệ thống thương mại điện tử tích hợp sâu vào hệ sinh thái Zalo. Xây dựng "Dynamic Form Engine" giúp Admin tự cấu hình các chiến dịch bán hàng phức tạp mà không cần can thiệp code.',
      tech: ['React', 'ZMP SDK', 'Tailwind CSS', 'Recoil', 'Node.js'],
      type: 'browser', // Dùng cho Device Mockup
      links: { demo: '#', git: '#' },
      images: [
        'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
      ],
    },
  ],
}
