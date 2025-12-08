import { Button } from '@/components/ui/button'
import { useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'

// Interface này nhận props từ TanStack Router
interface ErrorPageProps {
  error: Error
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter()
  useEffect(() => {
    // Log lỗi ra console hoặc gửi về service tracking (như Sentry)
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex max-w-md flex-col items-center gap-6"
      >
        {/* Icon cảnh báo */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
          <AlertTriangle className="h-12 w-12" />
        </div>

        {/* Tiêu đề & Mô tả */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Đã có lỗi xảy ra!
          </h1>
          <p className="text-muted-foreground">
            Hệ thống gặp sự cố không mong muốn. Chúng tôi đã ghi nhận lỗi này.
          </p>
        </div>

        {/* Khu vực hiển thị chi tiết lỗi (Chỉ hiện khi ở môi trường DEV) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="w-full max-w-full overflow-hidden rounded-md bg-muted p-4 text-left text-xs font-mono text-muted-foreground">
            <p className="mb-2 font-bold text-destructive">
              Error Details (Dev only):
            </p>
            <div className="wrap-break-word">{error.message}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={reset} // Hàm reset của TanStack Router giúp reload lại route bị lỗi
            size="lg"
            iconLeft={<RefreshCcw className="h-4 w-4" />}
          >
            Thử lại
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.navigate({ to: '/' })}
            iconLeft={<Home className="h-4 w-4" />}
          >
            Về trang chủ
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
