import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Layout,
  Smartphone,
} from 'lucide-react'

// Dữ liệu từ các nội dung đã chuẩn hóa trước đó
const experiences = [
  {
    role: 'Flutter Mobile Developer',
    company: 'ByteTech JSC',
    period: 'Oct 2022 - Present',
    icon: <Smartphone className="text-blue-500" size={24} />,
    color: 'border-blue-500/20 hover:border-blue-500/50',
    bgHover: 'hover:bg-blue-500/5',
    description:
      'Chuyên sâu về tối ưu hiệu năng ứng dụng Mobile và kiến trúc hệ thống Clean Architecture.',
    achievements: [
      "Tối ưu thời gian khởi động App giảm <span class='text-blue-600 dark:text-blue-400 font-bold'>45%</span> nhờ chiến lược Lazy Loading & Caching.",
      "Đảm bảo hiệu suất mượt mà <span class='text-blue-600 dark:text-blue-400 font-bold'>60fps</span> ngay cả trên thiết bị cấu hình thấp.",
      "Tái cấu trúc (Refactor) code cũ sang <span class='font-semibold'>Clean Architecture (BLoC)</span>, giảm 30% bugs.",
      'Xây dựng module phức tạp: Booking, Loyalty Rewards & Real-time Notifications.',
    ],
    stack: ['Flutter', 'Dart', 'BLoC', 'Firebase', 'CI/CD'],
  },
  {
    role: 'Frontend Developer (Zalo Mini App)',
    company: 'ByteTech JSC',
    period: '2021 - 2022',
    icon: <Layout className="text-cyan-500" size={24} />,
    color: 'border-cyan-500/20 hover:border-cyan-500/50',
    bgHover: 'hover:bg-cyan-500/5',
    description:
      'Phát triển hệ sinh thái Zalo Mini App và các công cụ Dynamic Form cho doanh nghiệp.',
    achievements: [
      "Phát triển App TMĐT <span class='font-semibold'>'1Touch'</span> & <span class='font-semibold'>'Sell'</span> tích hợp sâu vào Zalo.",
      "Xây dựng <span class='text-cyan-600 dark:text-cyan-400 font-bold'>Dynamic Form Engine</span>, giảm 40% thời gian setup chiến dịch Marketing.",
      'Thiết kế hệ thống Reward System xử lý logic đa chiến dịch (Multi-campaign).',
      'Tích hợp thanh toán Token ZaloPay & xác thực người dùng bảo mật.',
    ],
    stack: ['React', 'ZMP', 'TypeScript', 'Tailwind', 'Node.js'],
  },
]

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="py-20 md:py-32 bg-secondary/10 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(#444cf7 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      ></div>

      <div className="container px-4 md:px-6 mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          >
            <Briefcase size={14} className="mr-2" />
            Professional Journey
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Work{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Experience
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Hành trình giải quyết các bài toán kỹ thuật phức tạp và mang lại giá
            trị thực tế.
          </p>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {experiences.map((exp, index) => (
            <Card
              key={index}
              className={`relative bg-background/80 backdrop-blur-sm border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${exp.color} ${exp.bgHover}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-secondary rounded-xl shadow-sm border border-border">
                    {exp.icon}
                  </div>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 font-medium"
                  >
                    <Calendar size={12} /> {exp.period}
                  </Badge>
                </div>

                <CardTitle className="text-2xl font-bold">{exp.role}</CardTitle>
                <div className="text-lg font-medium text-muted-foreground">
                  {exp.company}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-foreground/80 leading-relaxed italic border-l-2 border-primary/30 pl-4">
                  "{exp.description}"
                </p>

                {/* Achievements List */}
                <ul className="space-y-3">
                  {exp.achievements.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 shrink-0">
                        <CheckCircle2 size={18} className="text-green-500" />
                      </div>
                      <span
                        className="text-sm md:text-base text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 pt-6 border-t border-border/50 mt-auto">
                {exp.stack.map((tech, t) => (
                  <Badge key={t} variant="outline" className="bg-background">
                    {tech}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
