import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Code2,
  Facebook,
  Github,
  Layers,
  Linkedin,
  Rocket,
  Smartphone,
  Zap,
} from 'lucide-react'

export default function HeroSectionWithImage() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-12 md:py-20 lg:py-32">
      {/* Background Decor - Giữ lại ánh sáng nền nhưng nhẹ hơn */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 transform">
        <div className="h-[500px] w-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 transform">
        <div className="h-[400px] w-[400px] bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* COLUMN 1: TEXT CONTENT */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            {/* Availability Badge */}
            <div className="mb-6 inline-flex items-center rounded-full border border-border bg-background/80 px-3 py-1 text-sm font-medium backdrop-blur-sm shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Available for new projects
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Building{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
                Scalable Apps
              </span>{' '}
              <br />
              on Mobile & Web.
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Expert in{' '}
              <strong className="text-foreground">Flutter Performance</strong>{' '}
              and the <strong className="text-foreground">Zalo Mini App</strong>{' '}
              ecosystem. I transform complex logic into smooth, high-speed user
              experiences.
            </p>

            {/* Tech Stack - Căn chỉnh lại cho gọn */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-10">
              <Badge
                variant="outline"
                className="px-3 py-1.5 text-sm flex gap-2 items-center bg-background/50"
              >
                <Smartphone size={14} className="text-blue-500" /> Flutter
              </Badge>
              <Badge
                variant="outline"
                className="px-3 py-1.5 text-sm flex gap-2 items-center bg-background/50"
              >
                <Layers size={14} className="text-cyan-500" /> React
              </Badge>
              <Badge
                variant="outline"
                className="px-3 py-1.5 text-sm flex gap-2 items-center bg-background/50"
              >
                <Zap size={14} className="text-yellow-500" /> Zalo Mini App
              </Badge>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="gap-2 shadow-lg shadow-blue-500/20">
                View My Work <ArrowRight size={16} />
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                Download CV
              </Button>
            </div>

            {/* Socials - Nhỏ gọn bên dưới */}
            <div className="mt-8 flex gap-6 text-muted-foreground">
              <a
                href="https://github.com/oh2k1vn"
                target="_blank"
                className="hover:text-blue-600 transition-colors"
              >
                <Github size={22} />
              </a>
              <a
                href="https://www.linkedin.com/in/hieu-nguyen-879101241/"
                target="_blank"
                className="hover:text-blue-600 transition-colors"
              >
                <Linkedin size={22} />
              </a>
              <a
                href="https://www.facebook.com/GeminiDev1606/"
                target="_blank"
                className="hover:text-blue-600 transition-colors"
              >
                <Facebook size={22} />
              </a>
            </div>
          </div>

          {/* COLUMN 2: PROFILE IMAGE */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            {/* Image Container with Gradient Border */}
            <div className="relative w-[280px] h-[350px] md:w-[350px] md:h-[420px] lg:w-[400px] lg:h-[480px]">
              {/* Decorative blob behind image */}
              <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-cyan-400 rounded-4xl rotate-6 opacity-20 blur-lg"></div>

              {/* Main Image Frame */}
              <div className="absolute inset-0 bg-linear-to-tr from-blue-500 to-cyan-400 rounded-4xl p-1 shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500">
                {/* 1. Đã bỏ 'overflow-hidden' để bóng phản chiếu có thể hiển thị ra ngoài.
      2. Đã bỏ 'bg-slate...' vì img đã che hết, trừ khi ảnh transparent.
  */}
                <div className="w-full h-full relative">
                  <img
                    src="https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/304301744_646096167073918_6201416130930987462_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHIHgy3WYzL2vW1TfxR5xWeWj4cQU-puNRaPhxBT6m41KV5HBCqP2gkMXQHviEhjN22eBSS00X6Y1CeTYbu9y_N&_nc_ohc=bz2-mn6187IQ7kNvwGV4DBk&_nc_oc=AdmIBneCMPq_UKGs88jsf_CFvMvVp-itnuXBINMLB0SwsbgpvNiUH1fby1FHlc-YGfo&_nc_zt=23&_nc_ht=scontent.fsgn5-12.fna&_nc_gid=TUZK6D2ZNWdw0Al34kQ04Q&oh=00_AfngG5edVBhr6oW15nZ-sl6AZE1Nu7RtqlRXQaFyJ55XeQ&oe=693C8AB6"
                    alt="Developer Portrait"
                    className="w-full h-full object-cover rounded-[1.8rem] grayscale hover:grayscale-0 transition-all duration-500 hover:[-webkit-box-reflect:below_0px_linear-gradient(to_bottom,transparent,transparent_70%,rgba(255,255,255,0.3))]
      dark:hover:[-webkit-box-reflect:below_0px_linear-gradient(to_bottom,transparent,transparent_70%,rgba(255,255,255,0.1))]"
                  />
                </div>
              </div>

              {/* Floating Card 1: Experience */}
              <div className="absolute -left-4 top-10 md:-left-12 md:top-16 bg-background/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-1000 delay-300">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600">
                  <Code2 size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Experience
                  </p>
                  <p className="text-sm font-bold text-foreground">3+ Years</p>
                </div>
              </div>

              {/* Floating Card 2: Performance */}
              <div className="absolute -right-4 bottom-10 md:-right-8 md:bottom-16 bg-background/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-1000 delay-500">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600">
                  <Rocket size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Optimization
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    High Perf.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 -z-10 h-screen w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]"></div>
    </section>
  )
}
