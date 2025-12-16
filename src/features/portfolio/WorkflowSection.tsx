import { HERO_CONSTANTS } from '@/constants/hero' // Import data
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function WorkflowSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container px-4 mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Quy Trình
            <span className="text-blue-500">Làm Việc</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cách tôi chuyển đổi các yêu cầu phức tạp thành sản phẩm chất lượng
            cao.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Connecting Line (Desktop only) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-secondary -z-10 overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-blue-500/0 via-blue-500 to-blue-500/0"
              initial={{ x: '-100%' }}
              whileInView={{ x: '100%' }}
              transition={{
                duration: 2,
                ease: 'linear',
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          </div>
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-linear-to-r from-background via-transparent to-background -z-10" />

          {/* Render Steps từ Data */}
          {HERO_CONSTANTS.workflow.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative pt-8"
            >
              {/* Step Number */}
              <div className="text-6xl font-black text-secondary/40 absolute -top-4 -left-2 select-none group-hover:text-blue-500/10 transition-colors">
                {step.id}
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-16 h-16 mx-auto bg-secondary rounded-2xl flex items-center justify-center mb-6 border border-border group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-colors shadow-lg group-hover:shadow-blue-500/20"
              >
                <step.icon
                  size={32}
                  className="text-foreground group-hover:text-blue-500 transition-colors"
                />
              </motion.div>

              {/* Content */}
              <div className="text-center px-4 pb-4">
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
