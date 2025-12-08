import { Button } from '@/components/ui/button' // Hoặc đường dẫn tới Button component của bạn
import { useNavigate } from '@tanstack/react-router' // Hoặc 'react-router-dom' tùy setup
import { motion } from 'framer-motion'
import { ArrowLeft, Ghost, Home } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  // Hàm quay lại trang trước (xử lý tùy theo router library)
  const handleGoBack = () => {
    window.history.back()
  }

  // Hàm về trang chủ
  const handleGoHome = () => {
    // Với TanStack Router: navigate({ to: '/' })
    // Với React Router DOM: navigate('/')
    navigate({ to: '/' })
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Background Effect: Grid Pattern & Gradient Blob */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-[100px]" />
      </div>

      <div className="z-10 container mx-auto flex max-w-lg flex-col items-center text-center px-4">
        {/* Animated Icon / Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted/50 dark:bg-muted/20 ring-1 ring-border shadow-xl backdrop-blur-sm">
            <Ghost className="h-16 w-16 text-primary" strokeWidth={1.5} />
          </div>
          {/* Floating badge */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -right-2 -top-2 rotate-12 rounded-lg border bg-card px-3 py-1 text-xs font-bold text-destructive shadow-sm"
          >
            Error 404
          </motion.div>
        </motion.div>

        {/* Main Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Lạc đường rồi?
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển
            đi nơi khác.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
        >
          {/* Button Quay lại */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleGoBack}
            className="w-full sm:w-auto"
            iconLeft={<ArrowLeft className="h-4 w-4" />}
          >
            Quay lại
          </Button>

          {/* Button Về Home */}
          <Button
            size="lg"
            onClick={handleGoHome}
            className="w-full sm:w-auto shadow-lg shadow-primary/20"
            iconLeft={<Home className="h-4 w-4" />}
          >
            Về trang chủ
          </Button>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 text-xs text-muted-foreground/60"
        >
          Error Code: 404_PAGE_NOT_FOUND
        </motion.div>
      </div>
    </div>
  )
}
