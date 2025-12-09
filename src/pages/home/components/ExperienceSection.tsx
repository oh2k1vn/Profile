import { motion } from 'framer-motion'
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Layout,
  Smartphone,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { Variants } from 'framer-motion'

const experiences = [
  {
    role: 'Flutter Mobile Developer',
    company: 'ByteTech JSC',
    period: 'Oct 2022 - Present',
    icon: <Smartphone className="text-blue-500" size={24} />,
    color: 'border-blue-500/20 group-hover:border-blue-500/50',
    bgHover: 'group-hover:bg-blue-500/5',
    description:
      'Specializing in mobile app performance optimization and Clean Architecture system design.',
    achievements: [
      "Reduced app startup time by <span class='text-blue-600 dark:text-blue-400 font-bold'>45%</span> using Lazy Loading & Caching strategies.",
      "Maintained smooth <span class='text-blue-600 dark:text-blue-400 font-bold'>60fps</span> performance even on low-end devices.",
      "Refactored legacy code to <span class='font-semibold'>Clean Architecture (BLoC)</span>, reducing bugs by 30%.",
      'Built complex modules: Booking, Loyalty Rewards & Real-time Notifications.',
    ],
    stack: ['Flutter', 'Dart', 'BLoC', 'Firebase', 'CI/CD'],
  },
  {
    role: 'Frontend Developer (Zalo Mini App)',
    company: 'ByteTech JSC',
    period: '2021 - 2022',
    icon: <Layout className="text-cyan-500" size={24} />,
    color: 'border-cyan-500/20 group-hover:border-cyan-500/50',
    bgHover: 'group-hover:bg-cyan-500/5',
    description:
      'Developing the Zalo Mini App ecosystem and Dynamic Form tools for enterprises.',
    achievements: [
      "Developed e-commerce apps <span class='font-semibold'>'1Touch'</span> & <span class='font-semibold'>'Sell'</span> deeply integrated into Zalo.",
      "Built a <span class='text-cyan-600 dark:text-cyan-400 font-bold'>Dynamic Form Engine</span>, cutting marketing campaign setup time by 40%.",
      'Designed a Reward System handling complex multi-campaign logic.',
      'Integrated ZaloPay Token payments & secure user authentication.',
    ],
    stack: ['React', 'ZMP', 'TypeScript', 'Tailwind', 'Node.js'],
  },
]

export default function ExperienceSection() {
  // Variants cho tiêu đề
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  // Variants cho từng thẻ Card
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
      {/* Background Pattern - Fade In nhẹ nhàng */}
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
            Professional Journey
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Work{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Experience
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            The journey of solving complex technical problems and delivering
            real value.
          </p>
        </motion.div>

        {/* Experience Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariants}
              transition={{ delay: index * 0.2 }} // Stagger thủ công dựa vào index
            >
              <Card
                className={`group relative h-full flex flex-col bg-background/80 backdrop-blur-sm border-2 transition-all duration-300 ${exp.color} ${exp.bgHover}`}
              >
                {/* Hiệu ứng Glow nhẹ khi hover sử dụng motion */}
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: '0 0 40px -10px rgba(59, 130, 246, 0.15)',
                  }}
                />

                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="p-3 bg-secondary rounded-xl shadow-sm border border-border"
                    >
                      {exp.icon}
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
