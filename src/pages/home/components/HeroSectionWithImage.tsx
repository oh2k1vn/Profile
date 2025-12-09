import { motion } from 'framer-motion'
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

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { Variants } from 'framer-motion' // Import framer-motion

export default function HeroSectionWithImage() {
  // Variants cho container chứa text để chạy hiệu ứng so le (stagger)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut', // Giờ TS đã hiểu đây là Easing type
      },
    },
  }

  return (
    <section className="relative w-full overflow-hidden bg-background py-12 md:py-20 lg:py-32">
      {/* Background Decor - Có thêm hiệu ứng pulse nhẹ */}
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 transform"
      >
        <div className="h-[500px] w-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
      </motion.div>
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 transform"
      >
        <div className="h-[400px] w-[400px] bg-cyan-500/10 blur-[100px] rounded-full" />
      </motion.div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* COLUMN 1: TEXT CONTENT */}
          <motion.div
            className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Availability Badge */}
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-flex items-center rounded-full border border-border bg-background/80 px-3 py-1 text-sm font-medium backdrop-blur-sm shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Available for new projects
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight"
            >
              Building{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
                Scalable Apps
              </span>{' '}
              <br />
              on Mobile & Web.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg"
            >
              Expert in{' '}
              <strong className="text-foreground">Flutter Performance</strong>{' '}
              and the <strong className="text-foreground">Zalo Mini App</strong>{' '}
              ecosystem. I transform complex logic into smooth, high-speed user
              experiences.
            </motion.p>

            {/* Tech Stack */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-2 mb-10"
            >
              {[
                { icon: Smartphone, label: 'Flutter', color: 'text-blue-500' },
                { icon: Layers, label: 'React', color: 'text-cyan-500' },
                { icon: Zap, label: 'Zalo Mini App', color: 'text-yellow-500' },
              ].map((tech, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 py-1.5 text-sm flex gap-2 items-center bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <tech.icon size={14} className={tech.color} /> {tech.label}
                </Badge>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button
                asChild
                size="lg"
                className="gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View My Work <ArrowRight size={16} />
                </motion.button>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 cursor-pointer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Download CV
                </motion.button>
              </Button>
            </motion.div>

            {/* Socials */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex gap-6 text-muted-foreground"
            >
              {[
                { icon: Github, href: 'https://github.com/oh2k1vn' },
                {
                  icon: Linkedin,
                  href: 'https://www.linkedin.com/in/hieu-nguyen-879101241/',
                },
                {
                  icon: Facebook,
                  href: 'https://www.facebook.com/GeminiDev1606/',
                },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  className="hover:text-blue-600 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={22} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* COLUMN 2: PROFILE IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-[280px] h-[350px] md:w-[350px] md:h-[420px] lg:w-[400px] lg:h-[480px]">
              <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-cyan-400 rounded-4xl rotate-6 opacity-20 blur-lg"></div>

              <motion.div
                whileHover={{ rotate: 0 }}
                className="absolute inset-0 bg-linear-to-tr from-blue-500 to-cyan-400 rounded-4xl p-1 shadow-2xl rotate-3 transition-transform duration-500"
              >
                <div className="w-full h-full relative rounded-[1.8rem] bg-gray-900">
                  <img
                    src="https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/304301744_646096167073918_6201416130930987462_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHIHgy3WYzL2vW1TfxR5xWeWj4cQU-puNRaPhxBT6m41KV5HBCqP2gkMXQHviEhjN22eBSS00X6Y1CeTYbu9y_N&_nc_ohc=bz2-mn6187IQ7kNvwGV4DBk&_nc_oc=AdmIBneCMPq_UKGs88jsf_CFvMvVp-itnuXBINMLB0SwsbgpvNiUH1fby1FHlc-YGfo&_nc_zt=23&_nc_ht=scontent.fsgn5-12.fna&_nc_gid=TUZK6D2ZNWdw0Al34kQ04Q&oh=00_AfngG5edVBhr6oW15nZ-sl6AZE1Nu7RtqlRXQaFyJ55XeQ&oe=693C8AB6"
                    alt="Portrait"
                    className="w-full h-full object-cover rounded-[1.8rem]"
                    style={{
                      WebkitBoxReflect:
                        'below 0px linear-gradient(to bottom, transparent, transparent 80%, rgba(255,255,255,0.2))',
                    }}
                  />
                </div>
              </motion.div>

              {/* Floating Card 1: Experience */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -left-4 top-10 md:-left-12 md:top-16 bg-background/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl flex items-center gap-3"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600">
                  <Code2 size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Experience
                  </p>
                  <p className="text-sm font-bold text-foreground">3+ Years</p>
                </div>
              </motion.div>

              {/* Floating Card 2: Performance */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -right-4 bottom-10 md:-right-8 md:bottom-16 bg-background/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl flex items-center gap-3"
              >
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
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 h-screen w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]"></div>
    </section>
  )
}
