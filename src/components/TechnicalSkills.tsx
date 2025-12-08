import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Code2,
  Database,
  Layers,
  Layout,
  Smartphone,
  Wrench,
} from 'lucide-react'

// --- DỮ LIỆU KỸ NĂNG ---
const skillCategories = [
  {
    title: 'Mobile Ecosystem',
    icon: Smartphone,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    skills: [
      'Flutter',
      'Dart',
      'BLoC Pattern',
      'Riverpod',
      'Clean Architecture',
      'Method Channels',
      'App Optimization',
    ],
  },
  {
    title: 'Frontend & Zalo Mini App',
    icon: Layout,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    skills: [
      'React.js',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Zalo Mini App (ZMP)',
      'Framer Motion',
      'Shadcn UI',
    ],
  },
  {
    title: 'Backend & Services',
    icon: Database,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    skills: [
      'Node.js',
      'Firebase',
      'Supabase',
      'RESTful API',
      'GraphQL',
      'Authentication',
      'Cloud Functions',
    ],
  },
  {
    title: 'Tools & DevOps',
    icon: Wrench,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    skills: [
      'Git / GitHub',
      'CI/CD Pipelines',
      'Docker',
      'Figma',
      'Jira',
      'VS Code Power User',
      'Performance Profiling',
    ],
  },
]

// Danh sách icon chạy marquee (có thể thay bằng Logo ảnh nếu muốn)
const techMarquee = [
  'Flutter',
  'React',
  'TypeScript',
  'Dart',
  'Node.js',
  'Firebase',
  'Tailwind',
  'Next.js',
  'Zalo Platform',
  'Git',
  'Figma',
  'Supabase',
]

export default function TechnicalSkills() {
  return (
    <section
      id="skills"
      className="py-24 bg-secondary/10 relative overflow-hidden"
    >
      {/* Decorative Blur Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 border-primary/30 text-primary bg-primary/5"
          >
            Technical Expertise
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            My{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Tech Stack
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A comprehensive toolset for building scalable, high-performance
            applications across mobile and web platforms.
          </p>
        </div>

        {/* --- INFINITE MARQUEE (Dải băng chạy) --- */}
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] mb-20">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll">
            {/* Lặp lại 2 lần để tạo hiệu ứng vô tận */}
            {[...techMarquee, ...techMarquee].map((tech, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-2xl font-bold text-muted-foreground/50 hover:text-foreground transition-colors cursor-default"
              >
                <Code2 size={24} className="opacity-50" /> {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* --- SKILL CLUSTERS (Grid Cards) --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Gradient Border Bottom Effect */}
              <div
                className={cn(
                  'absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-transparent via-primary to-transparent',
                  category.bg.replace('/10', ''),
                )}
              />

              <CardHeader>
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-background',
                    category.bg,
                    category.color,
                  )}
                >
                  <category.icon size={24} />
                </div>
                <CardTitle className="text-xl font-bold">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-colors cursor-default border-transparent hover:border-primary/20 border"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional "Architecture" Note */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/20 text-blue-500">
              <Layers size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg">System Architecture Mindset</h4>
              <p className="text-muted-foreground text-sm">
                I don't just code features; I design scalable systems using
                Clean Architecture, SOLID principles, and Design Patterns.
              </p>
            </div>
          </div>
          {/* Nếu có Github stats hoặc chứng chỉ thì để nút ở đây */}
        </div>
      </div>
    </section>
  )
}
