import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Github, Globe, Smartphone } from 'lucide-react'

// Import component Device Mockup (Hãy đảm bảo đường dẫn đúng)
import Interface from '@/components/Interface'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Import Data
import { HERO_CONSTANTS } from '@/constants/hero'

type Language = 'en' | 'vi'

// --- COMPONENT CON: IMAGE SLIDESHOW ---
const ProjectSlideshow = ({ images }: { images: Array<string> }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Tự động chuyển ảnh sau 4s
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative w-full h-full bg-gray-900 group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Project Screenshot`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Lớp phủ gradient để text dễ đọc hơn nếu có */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

      {/* Progress Indicator (Dấu chấm) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, idx) => (
          <motion.div
            key={idx}
            className="h-1.5 rounded-full shadow-sm bg-white cursor-pointer"
            onClick={() => setCurrentIndex(idx)} // Cho phép click để chuyển ảnh
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
export default function FeaturedProjects({ lang = 'vi' }: { lang?: Language }) {
  return (
    <section
      className="py-24 bg-background relative overflow-hidden"
      id="projects"
    >
      {/* Background Decor */}
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
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-20"
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5"
          >
            Portfolio
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {lang === 'vi' ? 'Dự Án ' : 'Featured '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
              {lang === 'vi' ? 'Tiêu Biểu' : 'Projects'}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {lang === 'vi'
              ? 'Khám phá các dự án thực tế tôi đã xây dựng, tập trung vào hiệu năng, trải nghiệm người dùng và kiến trúc hệ thống.'
              : "Explore real-world projects I've built, focusing on performance, user experience, and system architecture."}
          </p>
        </motion.div>

        {/* Projects List */}
        <div className="grid gap-24 lg:gap-32">
          {HERO_CONSTANTS.projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                'flex flex-col lg:flex-row items-center gap-12 lg:gap-20',
                index % 2 === 1 && 'lg:flex-row-reverse', // Đảo chiều so le
              )}
            >
              {/* --- CỘT 1: HÌNH ẢNH (MOCKUP) --- */}
              <div className="w-full lg:w-1/2 flex justify-center perspective-1000 group">
                {/* Truyền prop 'type' đúng kiểu vào Interface */}
                <Interface mode={project.type as 'phone' | 'browser'}>
                  <ProjectSlideshow images={project.images} />
                </Interface>
              </div>

              {/* --- CỘT 2: THÔNG TIN (CONTENT) --- */}
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
                {/* Category & Icon */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="flex items-center gap-3"
                >
                  <div
                    className={cn(
                      'p-2.5 rounded-xl shadow-sm border border-transparent',
                      project.type === 'phone'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800'
                        : 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:border-cyan-800',
                    )}
                  >
                    {project.type === 'phone' ? (
                      <Smartphone size={20} strokeWidth={2.5} />
                    ) : (
                      <Globe size={20} strokeWidth={2.5} />
                    )}
                  </div>
                  <span className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                    {project.category}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h3
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="text-3xl md:text-4xl font-bold text-foreground"
                >
                  {project.title}
                </motion.h3>

                {/* Description */}
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
                  className="flex flex-wrap gap-2 py-2"
                >
                  {project.tech.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="px-3 py-1 text-sm font-medium bg-secondary hover:bg-secondary/80 transition-colors border border-border/50"
                    >
                      {t}
                    </Badge>
                  ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex gap-4 pt-4 border-t border-border/40"
                >
                  <Button
                    asChild
                    className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                  >
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {lang === 'vi' ? 'Xem Demo' : 'View Demo'}{' '}
                      <ExternalLink size={16} />
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="gap-2 hover:bg-secondary transition-colors"
                  >
                    <a
                      href={project.links.git}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={16} /> Source Code
                    </a>
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
