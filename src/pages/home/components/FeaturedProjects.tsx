import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion' // Import framer-motion
import { ExternalLink, Github, Globe, Smartphone } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ProjectItem = {
  id: number
  title: string
  category: string
  description: string
  tech: Array<string>
  type: 'mobile' | 'web'
  links: { demo: string; git: string }
  images: Array<string>
}

// --- DỮ LIỆU DỰ ÁN ---
const projects: Array<ProjectItem> = [
  {
    id: 1,
    title: 'Loyalty Booking App',
    category: 'Flutter Mobile App',
    description:
      'Appointment booking and reward points accumulation application for Spa chain with 50+ branches. Optimize user experience with Lazy Loading and Clean Architecture',
    tech: ['Flutter', 'Bloc', 'Firebase', 'Google Maps API'],
    type: 'mobile',
    links: { demo: '#', git: '#' },
    images: [
      'https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=1000&auto=format&fit=crop', // Ảnh demo ví dụ
      'https://images.unsplash.com/photo-1626218174358-77b7f9a4fa7c?q=80&w=1000&auto=format&fit=crop',
    ],
  },
  {
    id: 2,
    title: '1Touch E-commerce',
    category: 'Zalo Mini App',
    description:
      'E-commerce system running on Zalo platform. Integrated Dynamic Form Engine helps Admin to configure sales campaigns.',
    tech: ['React', 'ZMP', 'Tailwind', 'Node.js'],
    type: 'web',
    links: { demo: '#', git: '#' },
    images: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop', // Ảnh demo ví dụ
      'https://images.unsplash.com/photo-1559028013-cae7ca572571?q=80&w=1000&auto=format&fit=crop',
    ],
  },
]

// --- COMPONENT CON: IMAGE SLIDESHOW ---
const ProjectSlideshow = ({ images }: { images: Array<string> }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000) // Tăng thời gian lên 4s cho dễ nhìn
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative w-full h-full bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Screenshot ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }} // Fade mượt hơn bằng motion
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, idx) => (
          <motion.div
            key={idx}
            className="h-1.5 rounded-full shadow-sm bg-white"
            animate={{
              width: idx === currentIndex ? 24 : 6,
              opacity: idx === currentIndex ? 1 : 0.4,
            }}
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
      {/* Background Decor - Hiệu ứng thở nhẹ */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-16"
        >
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
        </motion.div>

        <div className="grid gap-20">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                'flex flex-col lg:flex-row items-center gap-12',
                index % 2 === 1 && 'lg:flex-row-reverse',
              )}
            >
              {/* --- PHẦN HÌNH ẢNH (MOCKUP) --- */}
              <div className="w-full lg:w-1/2 flex justify-center perspective-1000">
                {project.type === 'mobile' ? (
                  // --- MOCKUP ĐIỆN THOẠI (Floating Animation) ---
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    className="relative w-[280px] h-[580px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl shadow-blue-500/20 overflow-hidden ring-1 ring-white/10"
                  >
                    {/* Notch tai thỏ */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
                    <ProjectSlideshow images={project.images} />
                  </motion.div>
                ) : (
                  // --- MOCKUP TRÌNH DUYỆT (Floating Animation) ---
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5,
                    }}
                    whileHover={{ scale: 1.02 }}
                    className="relative w-full max-w-xl aspect-video bg-gray-900 rounded-xl border border-border shadow-2xl shadow-cyan-500/20 overflow-hidden ring-1 ring-white/10 group"
                  >
                    {/* Browser Header Bar */}
                    <div className="h-8 bg-muted/95 backdrop-blur-md border-b border-border flex items-center px-4 gap-2 z-20 absolute top-0 w-full">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <div className="ml-4 flex-1 h-5 bg-background/50 rounded-md text-[10px] text-muted-foreground flex items-center px-2 truncate">
                        zalo-miniapp.com/store/1touch
                      </div>
                    </div>
                    {/* Content Slideshow */}
                    <div className="pt-8 h-full">
                      <ProjectSlideshow images={project.images} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* --- PHẦN THÔNG TIN (CONTENT) --- */}
              <motion.div
                className="w-full lg:w-1/2 space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="flex items-center gap-3"
                >
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
                </motion.div>

                <motion.h3
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="text-3xl md:text-4xl font-bold"
                >
                  {project.title}
                </motion.h3>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  {project.description}
                </motion.p>

                {/* Tech Stack Tags */}
                <motion.div
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  className="flex flex-wrap gap-2"
                >
                  {project.tech.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="px-3 py-1 text-sm bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      {t}
                    </Badge>
                  ))}
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex gap-4 pt-4 border-t border-border/40"
                >
                  <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                    Live Demo <ExternalLink size={16} />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    Source Code <Github size={16} />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
