import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ExternalLink, Github, Globe, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'

type ProjectItem = {
  id: number
  title: string
  category: string
  description: string
  tech: string[]
  type: 'mobile' | 'web' // Định nghĩa chính xác kiểu literal ở đây
  links: { demo: string; git: string }
  images: string[]
}

// --- DỮ LIỆU DỰ ÁN (Thay ảnh thật của bạn vào đây) ---
const projects: ProjectItem[] = [
  {
    id: 1,
    title: 'Loyalty Booking App',
    category: 'Flutter Mobile App',
    description:
      'Appointment booking and reward points accumulation application for Spa chain with 50+ branches. Optimize user experience with Lazy Loading and Clean Architecture',
    tech: ['Flutter', 'Bloc', 'Firebase', 'Google Maps API'],
    type: 'mobile', // Kiểu hiển thị khung điện thoại
    links: { demo: '#', git: '#' },
    images: [
      'https://pangocdp.com/wp-content/uploads/pangoCDP.20240617174533.137.jpg',
      'https://pangocdp.com/wp-content/uploads/pangoCDP.20230912093155.968.jpg',
      'https://lh7-us.googleusercontent.com/docsz/AD_4nXcizYfDJzjKhTPEKcG9lWPHZNUtKBDFZYvVkYWZQNCZ4lGVfthXiljPikFuTMIRnJdJHwbu6EfRLNbIIPyRsM23RRy-MVvGGyTjYf0uRkImtoVB5gk1VuO2TYq1MZJKIXvbSAI_wpxV1NtzuCGuU44rd6xK?key=_4iYAxa0TV9lNS3pGytTnA',
    ],
  },
  {
    id: 2,
    title: '1Touch E-commerce',
    category: 'Zalo Mini App',
    description:
      'E-commerce system running on Zalo platform. Integrated Dynamic Form Engine helps Admin to configure sales campaigns.',
    tech: ['React', 'ZMP', 'Tailwind', 'Node.js'],
    type: 'web', // Kiểu hiển thị khung trình duyệt
    links: { demo: '#', git: '#' },
    images: [
      'https://pangocdp.com/wp-content/uploads/pangoCDP.20240617174533.137.jpg',
      'https://pangocdp.com/wp-content/uploads/pangoCDP.20230912093155.968.jpg',
      'https://lh7-us.googleusercontent.com/docsz/AD_4nXcizYfDJzjKhTPEKcG9lWPHZNUtKBDFZYvVkYWZQNCZ4lGVfthXiljPikFuTMIRnJdJHwbu6EfRLNbIIPyRsM23RRy-MVvGGyTjYf0uRkImtoVB5gk1VuO2TYq1MZJKIXvbSAI_wpxV1NtzuCGuU44rd6xK?key=_4iYAxa0TV9lNS3pGytTnA',
    ],
  },
]

// --- COMPONENT CON: IMAGE SLIDESHOW (XỬ LÝ AUTOPLAY) ---
const ProjectSlideshow = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000) // Chuyển ảnh mỗi 3 giây
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Screenshot ${index + 1}`}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out',
            index === currentIndex
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105',
          )}
        />
      ))}

      {/* Progress Indicator (Dấu chấm nhỏ bên dưới) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300 shadow-sm',
              idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40',
            )}
          />
        ))}
      </div>
    </div>
  )
}

// --- COMPONENT CHÍNH ---
export default function FeaturedProjects() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500/5 blur-[120px] rounded-full" />

      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 border-blue-500/30 text-blue-500 bg-blue-500/5"
          >
            Portfolio
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Featured{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
              Projects
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Explore real-world projects I've built, focusing on performance,
            user experience, and system architecture.
          </p>
        </div>

        <div className="grid gap-20">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={cn(
                'flex flex-col lg:flex-row items-center gap-12',
                index % 2 === 1 && 'lg:flex-row-reverse', // Đảo chiều layout cho dự án số chẵn
              )}
            >
              {/* --- PHẦN HÌNH ẢNH (MOCKUP) --- */}
              <div className="w-full lg:w-1/2 flex justify-center">
                {project.type === 'mobile' ? (
                  // --- MOCKUP ĐIỆN THOẠI (Cho Flutter App) ---
                  <div className="relative w-[280px] h-[580px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl shadow-blue-500/20 overflow-hidden ring-1 ring-white/10">
                    {/* Notch tai thỏ */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
                    <ProjectSlideshow images={project.images} />
                  </div>
                ) : (
                  // --- MOCKUP TRÌNH DUYỆT (Cho Web/Zalo App) ---
                  <div className="relative w-full max-w-xl aspect-video bg-gray-900 rounded-xl border border-border shadow-2xl shadow-cyan-500/20 overflow-hidden ring-1 ring-white/10 group">
                    {/* Browser Header Bar */}
                    <div className="h-8 bg-muted/80 backdrop-blur-md border-b border-border flex items-center px-4 gap-2 z-20 absolute top-0 w-full">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <div className="ml-4 flex-1 h-5 bg-background/50 rounded-md text-[10px] text-muted-foreground flex items-center px-2">
                        zalo-miniapp.com/store/1touch
                      </div>
                    </div>
                    {/* Content Slideshow */}
                    <div className="pt-8 h-full">
                      <ProjectSlideshow images={project.images} />
                    </div>
                  </div>
                )}
              </div>

              {/* --- PHẦN THÔNG TIN (CONTENT) --- */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      project.type === 'mobile'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                        : 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30',
                    )}
                  >
                    {project.type === 'mobile' ? (
                      <Smartphone size={24} />
                    ) : (
                      <Globe size={24} />
                    )}
                  </div>
                  <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold">
                  {project.title}
                </h3>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="px-3 py-1 text-sm bg-secondary/50"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-4 pt-4 border-t border-border/40">
                  <Button className="gap-2 shadow-lg shadow-primary/20">
                    Live Demo <ExternalLink size={16} />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    Source Code <Github size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
