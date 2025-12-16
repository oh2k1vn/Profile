import { Quote, Star } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Nguyen Van A',
    role: 'Project Manager at ByteTech',
    content:
      'Ấn tượng nhất ở bạn là khả năng giải quyết vấn đề. Task khó về tối ưu hiệu năng Flutter mà team loay hoay cả tuần, bạn chỉ mất 2 ngày để tìm ra nguyên nhân và fix triệt để.',
    avatar: 'https://i.pravatar.cc/150?u=a',
    rating: 5,
  },
  {
    name: 'Tran Thi B',
    role: 'Product Owner (Zalo Mini App Project)',
    content:
      'Hệ thống Dynamic Form bạn xây dựng giúp team Marketing của chúng tôi tiết kiệm 40% thời gian setup chiến dịch. Code clean, ít bug và bàn giao rất đúng hạn.',
    avatar: 'https://i.pravatar.cc/150?u=b',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Tech Lead at Global Corp',
    content:
      "A developer with a true 'System Mindset'. He doesn't just write code; he thinks about scalability and maintenance. Highly recommended for complex architectural roles.",
    avatar: 'https://i.pravatar.cc/150?u=c',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-secondary/10">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Trusted by <span className="text-blue-500">Professionals</span>
          </h2>
          <p className="text-muted-foreground">
            Đừng chỉ nghe tôi nói, hãy xem đồng nghiệp và đối tác nói gì.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <Card
              key={index}
              className="bg-background border-none shadow-lg relative overflow-visible mt-6"
            >
              {/* Quote Icon Floating */}
              <div className="absolute -top-6 left-8 bg-blue-500 text-white p-3 rounded-xl shadow-lg shadow-blue-500/30">
                <Quote size={24} />
              </div>

              <CardContent className="pt-12 pb-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4 text-yellow-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{item.content}"
                </p>
              </CardContent>

              <CardHeader className="border-t border-border/50 bg-secondary/20 pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={item.avatar} />
                    <AvatarFallback>{item.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
