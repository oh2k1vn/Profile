import { Check, Code2, Smartphone, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'

const services = [
  {
    title: 'Mobile App Development',
    icon: Smartphone,
    description:
      'Xây dựng ứng dụng Mobile đa nền tảng (iOS/Android) với Flutter. Tập trung vào trải nghiệm mượt mà (60fps) và giao diện Pixel-perfect.',
    features: [
      'Cross-platform (iOS & Android)',
      'Publish lên Store (AppStore/CHPlay)',
      'Tích hợp Firebase & API',
      'Bảo hành 6 tháng',
    ],
    popular: false,
  },
  {
    title: 'Zalo Mini App Solution',
    icon: Zap,
    description:
      'Triển khai Mini App trên hệ sinh thái Zalo. Tận dụng 70 triệu người dùng có sẵn. Tích hợp Zalo Pay, OA và Social API.',
    features: [
      'UI/UX chuẩn Design System Zalo',
      'Tích hợp thanh toán Zalo Pay',
      'Xử lý duyệt App nhanh chóng',
      'Tối ưu dung lượng < 2MB',
    ],
    popular: true, // Highlight gói này
  },
  {
    title: 'Performance & Audit',
    icon: Code2,
    description:
      'Dành cho các dự án đã có nhưng chạy chậm hoặc nhiều bug. Tôi sẽ phân tích, refactor code và tối ưu hóa hệ thống.',
    features: [
      'Phân tích Performance Profile',
      'Refactor Code cũ (Legacy)',
      'Nâng cấp Architecture',
      'Giảm thời gian load app',
    ],
    popular: false,
  },
]

export default function ServicesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Services I <span className="text-cyan-500">Offer</span>
          </h2>
          <p className="text-muted-foreground">
            Giải pháp kỹ thuật chất lượng cao phù hợp với nhu cầu của bạn.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl ${service.popular ? 'border-blue-500 bg-blue-500/5 shadow-blue-500/10' : 'border-border bg-card'}`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${service.popular ? 'bg-blue-500 text-white' : 'bg-secondary text-foreground'}`}
              >
                <service.icon size={28} />
              </div>

              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-8 flex-1">
                {service.description}
              </p>

              <ul className="space-y-4 mb-8">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center shrink-0">
                      <Check size={14} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={service.popular ? 'default' : 'outline'}
                className="w-full"
              >
                Book This Service
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
