import { motion } from 'framer-motion' // Import framer-motion

type Props = {
  mode: 'phone' | 'browser'
  children: React.ReactNode
  href?: string
}

const Interface = ({ mode, children, href }: Props) => {
  if (mode == 'phone') {
    return (
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
        {children}
      </motion.div>
    )
  }
  return (
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
      <div className="h-8 bg-muted/95 backdrop-blur-md border-b border-border flex items-center px-4 gap-2 z-20 absolute top-0 w-full">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="ml-4 flex-1 h-5 bg-background/50 rounded-md text-[10px] text-muted-foreground flex items-center px-2 truncate">
          {href ? href : 'https://localhost:3000'}
        </div>
      </div>
      <div className="pt-8 h-full">{children}</div>
    </motion.div>
  )
}
export default Interface
