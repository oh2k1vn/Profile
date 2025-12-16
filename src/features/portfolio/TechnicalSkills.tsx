import { HERO_CONSTANTS } from '@/constants/hero'
import { motion } from 'framer-motion'
import { GitBranch, Layers, Layout, Palette, Server } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

import type { Variants } from 'framer-motion'

const CLUSTER_ICONS: Record<string, any> = {
  frontend_core: Layout,
  ui_styling: Palette,
  backend_mobile: Server,
  tools_workflow: GitBranch,
}

export default function TechnicalSkills() {
  // Variants cho tiêu đề và text
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  // Variants cho container chứa các Card để chạy Stagger
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Mỗi card hiện cách nhau 0.15s
      },
    },
  }

  // Variants cho từng Card
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  const isDarkIcon = (key: string) =>
    ['nextjs', 'shadcn', 'github', 'git'].includes(key)

  return (
    <section
      id="skills"
      className="py-24 bg-secondary/10 relative overflow-hidden"
    >
      {/* Decorative Blur Background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"
      />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 border-primary/30 text-primary bg-primary/5"
          >
            Chuyên Môn Kỹ Thuật
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
              Tech Stack
            </span>{' '}
            Của Tôi
          </h2>
          <p className="text-muted-foreground text-lg">
            Bộ công cụ toàn diện giúp xây dựng ứng dụng hiệu năng cao, dễ mở
            rộng trên đa nền tảng Mobile và Web.
          </p>
        </motion.div>

        {/* --- INFINITE MARQUEE (Dải băng chạy) --- */}
        {/* Lưu ý: Nếu HERO_CONSTANTS.myTechStack chưa có, hãy đảm bảo define nó hoặc dùng SkillClusters flat ra */}
        {HERO_CONSTANTS.myTechStack && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full overflow-hidden mb-20 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          >
            <div className="flex w-max items-center animate-scroll hover:paused">
              {HERO_CONSTANTS.myTechStack.map((tech: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-2xl font-bold mx-8 text-muted-foreground/50 hover:text-foreground transition-colors cursor-default whitespace-nowrap"
                >
                  <img src={tech.image} alt="" className="w-8" /> {tech.name}
                </div>
              ))}
              {/* Duplicate list để chạy vô tận nếu cần */}
              {HERO_CONSTANTS.myTechStack.map((tech: any, index: number) => (
                <div
                  key={`dup-${index}`}
                  className="flex items-center gap-2 text-2xl font-bold mx-8 text-muted-foreground/50 hover:text-foreground transition-colors cursor-default whitespace-nowrap"
                >
                  <img src={tech.image} alt="" className="w-8" /> {tech.name}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- SKILL CLUSTERS (Grid Cards) --- */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {HERO_CONSTANTS.skillCluster.map((category, _) => {
            const Icon = CLUSTER_ICONS[category.id] || Layout

            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                className="h-full"
              >
                <Card className="cursor-pointer group relative h-full overflow-hidden border-border/40 bg-background/60 backdrop-blur-md hover:border-primary/50 hover:shadow-lg transition-all duration-500">
                  {/* Hover Gradient Line */}
                  <div
                    className={cn(
                      'absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left',
                      category.color.replace('bg-', 'bg-'),
                    )}
                  />

                  {/* Header */}
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-colors duration-300',
                          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
                          `group-hover:text-white group-hover:${category.color}`,
                        )}
                        style={
                          {
                            '--hover-color': 'var(--primary)',
                          } as React.CSSProperties
                        }
                      >
                        <Icon size={20} />
                      </div>
                      <CardTitle className="text-lg font-bold text-foreground">
                        {category.label}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                      {category.description}
                    </CardDescription>
                  </CardHeader>

                  {/* Content Grid */}
                  <CardContent>
                    <div className="grid grid-cols-4 gap-3">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.key}
                          className="group/item flex flex-col items-center gap-2 relative"
                        >
                          <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-border transition-all group-hover/item:scale-110 group-hover/item:shadow-sm group-hover/item:bg-background">
                            <img
                              src={skill.image}
                              alt={skill.name}
                              className={cn(
                                'w-7 h-7 object-contain transition-all duration-300',
                                'filter grayscale opacity-70 group-hover/item:grayscale-0 group-hover/item:opacity-100',
                                isDarkIcon(skill.key) && 'dark:invert',
                              )}
                            />
                          </div>

                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-sm opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border">
                            {skill.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* --- SYSTEM ARCHITECTURE NOTE --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 p-6 rounded-2xl bg-linear-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="p-3 rounded-full bg-blue-500/20 text-blue-500"
            >
              <Layers size={24} />
            </motion.div>
            <div>
              <h4 className="font-bold text-lg">Tư Duy Kiến Trúc Hệ Thống</h4>
              <p className="text-muted-foreground text-sm">
                Tôi không chỉ viết code tính năng đơn thuần; tôi thiết kế hệ
                thống bền vững dựa trên Clean Architecture, nguyên lý SOLID và
                Design Patterns.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
