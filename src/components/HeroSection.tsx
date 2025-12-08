import { Badge } from '@/components/ui/badge' // Shadcn Badge
import { Button } from '@/components/ui/button' // Shadcn Button
import {
  ArrowRight,
  Github,
  Layers,
  Linkedin,
  Smartphone,
  Terminal,
  Zap,
} from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-12 md:py-24 lg:py-32 xl:py-40">
      {/* Background Decor - Hiệu ứng ánh sáng nền */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 transform">
        <div className="h-[300px] w-[600px] bg-blue-500/20 blur-[100px] rounded-full mix-blend-multiply dark:bg-blue-500/10 dark:mix-blend-normal" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col items-center text-center">
        {/* Top Badge - Giới thiệu ngắn gọn vị trí */}
        <div className="mb-6 inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          Available for new projects
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-backwards delay-100">
          Building{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Scalable Apps
          </span>{' '}
          <br className="hidden md:block" />
          on Mobile & Web.
        </h1>

        {/* Sub-headline - Sử dụng nội dung "Option 1" đã chốt */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-backwards delay-200">
          Expert in{' '}
          <strong className="text-foreground">Flutter Performance</strong> and
          the <strong className="text-foreground">Zalo Mini App</strong>{' '}
          ecosystem. I transform complex logic into smooth, high-speed user
          experiences.
        </p>

        {/* Tech Stack Pills - Hiển thị kỹ năng chính */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-backwards delay-300">
          <Badge
            variant="secondary"
            className="px-4 py-2 text-sm flex gap-2 items-center"
          >
            <Smartphone size={16} className="text-blue-500" /> Flutter
          </Badge>
          <Badge
            variant="secondary"
            className="px-4 py-2 text-sm flex gap-2 items-center"
          >
            <Layers size={16} className="text-cyan-500" /> React / Next.js
          </Badge>
          <Badge
            variant="secondary"
            className="px-4 py-2 text-sm flex gap-2 items-center"
          >
            <Zap size={16} className="text-yellow-500" /> Zalo Mini App
          </Badge>
          <Badge
            variant="secondary"
            className="px-4 py-2 text-sm flex gap-2 items-center"
          >
            <Terminal size={16} className="text-green-500" /> TypeScript
          </Badge>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-backwards delay-500">
          <Button size="lg" className="gap-2 font-semibold">
            View My Work <ArrowRight size={16} />
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            Download CV
          </Button>
        </div>

        {/* Social Links (Optional) */}
        <div className="mt-12 flex gap-6 text-muted-foreground animate-in fade-in duration-1000 delay-700">
          <a href="#" className="hover:text-foreground transition-colors">
            <Github size={24} />
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            <Linkedin size={24} />
          </a>
        </div>
      </div>

      {/* Decorative Grid Bottom - Tạo cảm giác technical */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </section>
  )
}
