import { HERO_CONSTANTS } from '@/constants/hero'
import { motion } from 'framer-motion'
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { Variants } from 'framer-motion'

type Language = 'en' | 'vi'

export default function ExperienceSection({
  lang = 'vi',
}: {
  lang?: Language
}) {
  // Variants (Giữ nguyên)
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <section
      id="experience"
      className="py-20 md:py-32 bg-secondary/10 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: 'radial-gradient(#444cf7 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      ></motion.div>

      <div className="container px-4 md:px-6 mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={headerVariants}
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          >
            <Briefcase size={14} className="mr-2" />
            {lang === 'vi' ? 'Hành Trình Sự Nghiệp' : 'Professional Journey'}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {lang === 'vi' ? 'Kinh Nghiệm ' : 'Work '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {lang === 'vi' ? 'Làm Việc' : 'Experience'}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {lang === 'vi'
              ? 'Hành trình giải quyết các bài toán kỹ thuật phức tạp và mang lại giá trị thực tế.'
              : 'The journey of solving complex technical problems and delivering real value.'}
          </p>
        </motion.div>

        {/* Experience Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {HERO_CONSTANTS.experience.map((exp, index) => (
            <motion.div
              key={exp.id} // Dùng ID thay vì index
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariants}
              transition={{ delay: index * 0.2 }}
            >
              <Card
                className={`group relative h-full flex flex-col bg-background/80 backdrop-blur-sm border-2 transition-all duration-300 ${exp.theme.border} ${exp.theme.bgHover}`}
              >
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `0 0 40px -10px ${exp.theme.glow}`,
                  }}
                />

                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="p-3 bg-secondary rounded-xl shadow-sm border border-border"
                    >
                      {/* Render Icon component */}
                      <exp.icon className={exp.theme.iconColor} size={24} />
                    </motion.div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 font-medium bg-secondary/50"
                    >
                      <Calendar size={12} /> {exp.period}
                    </Badge>
                  </div>

                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    {exp.role}
                  </CardTitle>
                  <div className="text-lg font-medium text-muted-foreground">
                    {exp.company}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 grow">
                  <p className="text-foreground/80 leading-relaxed italic border-l-2 border-primary/30 pl-4">
                    "{exp.description}"
                  </p>

                  {/* Achievements List */}
                  <ul className="space-y-3">
                    {exp.achievements.map((item, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <div className="mt-1 shrink-0">
                          <CheckCircle2 size={18} className="text-green-500" />
                        </div>
                        <span
                          className="text-sm md:text-base text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="flex flex-wrap gap-2 pt-6 border-t border-border/50 mt-auto">
                  {exp.stack.map((tech, t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="bg-background hover:bg-secondary transition-colors cursor-default"
                    >
                      {tech}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
