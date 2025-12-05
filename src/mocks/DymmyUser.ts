export const DUMMY_USER: UserProfile = {
  name: 'Nguyễn Minh Hiếu',
  role: 'Senior Frontend Engineer',
  location: 'TP. Hồ Chí Minh, Việt Nam',
  email: 'dev.nguyen@example.com',
  phone: '(+84) 909 123 456',
  website: 'nguyenvandev.io',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80',
  coverImage:
    'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=1600&q=80',
  about:
    'Tôi là một lập trình viên đam mê với hơn 5 năm kinh nghiệm chuyên sâu về hệ sinh thái React. Tôi yêu thích việc xây dựng các giao diện người dùng đẹp mắt, tối ưu hiệu năng và mang lại trải nghiệm tốt nhất cho người dùng. Hiện tại, tôi đang tập trung nghiên cứu về Next.js và Web Performance.',
  skills: [
    'React',
    'TypeScript',
    'Next.js',
    'Tailwind CSS',
    'Node.js',
    'GraphQL',
    'Figma',
    'AWS',
  ],
  experiences: [
    {
      id: 1,
      role: 'Senior Frontend Developer',
      company: 'Tech Unicorn Vietnam',
      period: '2021 - Hiện tại',
      description:
        'Dẫn dắt team Frontend 5 người, xây dựng design system nội bộ và tối ưu hóa core product giúp tăng 40% performance.',
    },
    {
      id: 2,
      role: 'Frontend Developer',
      company: 'Creative Agency Global',
      period: '2019 - 2021',
      description:
        'Phát triển các landing page và web app cho khách hàng quốc tế. Làm việc trực tiếp với UI/UX Designer.',
    },
  ],
  projects: [
    {
      id: 1,
      title: 'E-commerce Dashboard',
      category: 'Web Application',
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      tech: ['React', 'Recharts', 'Tailwind'],
    },
    {
      id: 2,
      title: 'SaaS Landing Page',
      category: 'Marketing Site',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      tech: ['Next.js', 'Framer Motion'],
    },
    {
      id: 3,
      title: 'Task Management App',
      category: 'Productivity',
      image:
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
      tech: ['Vue.js', 'Firebase'],
    },
  ],
  socials: {
    github: 'github.com/nguyenvandev',
    linkedin: 'linkedin.com/in/nguyenvandev',
    twitter: 'twitter.com/nguyenvandev',
  },
}
