import { Code, PenTool, Rocket, Search } from 'lucide-react'

const steps = [
  {
    id: '01',
    title: 'Discovery & Analysis',
    icon: Search,
    description:
      'Tôi bắt đầu bằng việc hiểu rõ nghiệp vụ. Với kinh nghiệm làm E-commerce và Booking, tôi phân tích kỹ các edge-cases trước khi viết dòng code đầu tiên.',
  },
  {
    id: '02',
    title: 'Architecture Design',
    icon: PenTool,
    description:
      'Lên kế hoạch cấu trúc dự án. Dù là Clean Architecture cho Flutter hay Modular cho React, tôi đảm bảo code dễ mở rộng và bảo trì.',
  },
  {
    id: '03',
    title: 'Development',
    icon: Code,
    description:
      'Viết code sạch (Clean Code), tối ưu hiệu năng ngay trong quá trình phát triển. Tích hợp CI/CD và Unit Test để giảm thiểu lỗi.',
  },
  {
    id: '04',
    title: 'Optimization & Launch',
    icon: Rocket,
    description:
      'Đo lường các chỉ số Core Web Vitals hoặc FPS. Refactor và tinh chỉnh để sản phẩm đạt tốc độ cao nhất trước khi đến tay người dùng.',
  },
]

export default function WorkflowSection() {
  return (
    <section className="py-24 bg-background relative">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How I <span className="text-blue-500">Work</span>
          </h2>
          <p className="text-muted-foreground">
            Quy trình biến yêu cầu phức tạp thành sản phẩm chất lượng cao.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="group relative bg-background pt-8">
              {/* Step Number */}
              <div className="text-6xl font-black text-secondary/40 absolute -top-4 -left-2 select-none group-hover:text-blue-500/10 transition-colors">
                {step.id}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto bg-secondary rounded-2xl flex items-center justify-center mb-6 border border-border group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/20">
                <step.icon
                  size={32}
                  className="text-foreground group-hover:text-blue-500 transition-colors"
                />
              </div>

              {/* Content */}
              <div className="text-center px-4">
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
