import { motion } from 'framer-motion'
import { Code2, Mail, MapPin, Phone, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import type { Variants } from 'framer-motion'

export default function ContactSection() {
  // Variants cho hiệu ứng xuất hiện dần
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  // Variants cho container bên trái (Text info)
  const staggerLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  return (
    <footer
      id="contact"
      className="bg-background pt-24 pb-12 relative overflow-hidden border-t border-border"
    >
      {/* Decorative Elements - Background Breathing */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start mb-20">
          {/* Left Column: Contact Info */}
          <motion.div
            variants={staggerLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6"
            >
              Get in touch
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            >
              Let's build something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                amazing together.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              Are you looking for the optimal solution for Mobile App or Zalo
              Mini App? Or need advice on system architecture? Leave a message,
              I will respond within 24 hours.
            </motion.p>

            <div className="space-y-6">
              {/* Email Card */}
              <motion.a
                variants={fadeInUp}
                whileHover={{ scale: 1.02, x: 10 }}
                href="mailto:oh2k1vn@gmail.com"
                className="flex items-center gap-4 group p-4 rounded-2xl transition-all hover:bg-secondary/50 border border-transparent hover:border-border cursor-pointer"
              >
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border group-hover:border-blue-500 group-hover:text-blue-500 transition-colors shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Email me at
                  </p>
                  <p className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                    oh2k1vn@gmail.com
                  </p>
                </div>
              </motion.a>

              {/* Phone Card */}
              <motion.a
                variants={fadeInUp}
                whileHover={{ scale: 1.02, x: 10 }}
                href="tel:+84972350070"
                className="flex items-center gap-4 group p-4 rounded-2xl transition-all hover:bg-secondary/50 border border-transparent hover:border-border cursor-pointer"
              >
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border group-hover:border-green-500 group-hover:text-green-500 transition-colors shadow-sm">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Call or Zalo
                  </p>
                  <p className="font-semibold text-foreground group-hover:text-green-600 transition-colors">
                    (+84) 0972 350 070
                  </p>
                </div>
              </motion.a>

              {/* Location Card */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-4 p-4"
              >
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border shadow-sm">
                  <MapPin className="text-muted-foreground" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Based in
                  </p>
                  <p className="font-semibold text-foreground">
                    Ho Chi Minh City, Vietnam
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border shadow-2xl shadow-blue-500/5 relative overflow-hidden"
          >
            {/* Background Icon Rotation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-10 -right-10 p-6 opacity-[0.03] text-foreground pointer-events-none"
            >
              <Code2 size={200} />
            </motion.div>

            <h3 className="text-2xl font-bold mb-2">Send a message</h3>
            <p className="text-muted-foreground mb-8 text-sm">
              Fill out the form below and I'll get back to you shortly.
            </p>

            <form className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                    Name
                  </label>
                  <Input
                    placeholder="John Doe"
                    className="bg-background focus-visible:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                    Email
                  </label>
                  <Input
                    placeholder="john@example.com"
                    type="email"
                    className="bg-background focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  Subject
                </label>
                <Input
                  placeholder="Project Discussion"
                  className="bg-background focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  Message
                </label>
                <Textarea
                  className="min-h-[150px] resize-none bg-background focus-visible:ring-blue-500"
                  placeholder="Tell me about your project needs..."
                />
              </div>

              <Button
                asChild
                size="lg"
                className="w-full gap-2 font-bold shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message <Send size={16} />
                </motion.button>
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-border pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
        >
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <span className="font-semibold text-foreground">HieuNguyen</span>.
            All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with{' '}
            <span className="text-foreground font-medium">React</span>,{' '}
            <span className="text-foreground font-medium">Tailwind</span> &{' '}
            <span className="text-foreground font-medium">Shadcn UI</span>.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
