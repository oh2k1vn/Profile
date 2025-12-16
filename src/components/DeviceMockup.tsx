import { cn } from '@/lib/utils' // Giả sử bạn có utility này (clsx + tailwind-merge)
import { Lock } from 'lucide-react' // Cần cài lucide-react nếu chưa có

type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface DeviceMockupProps {
  type?: DeviceType
  children: React.ReactNode
  url?: string
  className?: string
}

const DeviceMockup = ({
  type = 'desktop',
  children,
  url,
  className,
}: DeviceMockupProps) => {
  // --- 1. MOBILE MOCKUP (iPhone Style) ---
  if (type === 'mobile') {
    return (
      <div
        className={cn(
          ' relative mx-auto w-[280px] h-[580px] rounded-[3rem] border-8 border-slate-900 shadow-2xl shadow-slate-500/20 ring-1 ring-white/10 z-10',
          className,
        )}
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-20 flex justify-center items-center">
          <div className="w-16 h-4 bg-slate-800/50 rounded-full" />
        </div>

        {/* Screen Area */}
        <div
          className="relative w-full h-full overflow-hidden rounded-[2.5rem]"
          style={{
            backgroundImage:
              'url(https://cdn.tgdd.vn/News/1533408/1-845x1831.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {/* Status Bar Fake */}
          <div className="h-8 w-full bg-transparent z-10 absolute top-0" />

          {/* Content Scrollable Area */}
          <div className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth">
            {children}
          </div>
        </div>
      </div>
    )
  }

  // --- 2. TABLET MOCKUP (iPad Pro Style) ---
  if (type === 'tablet') {
    return (
      <div
        className={cn(
          'relative mx-auto w-full max-w-[600px] aspect-3/4 md:aspect-4/3 rounded-4xl border-8 border-slate-800 bg-slate-800 shadow-2xl shadow-slate-500/20 ring-1 ring-white/10',
          className,
        )}
      >
        {/* Camera Dot */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-1 h-12 bg-slate-700 rounded-l-md" />{' '}
        {/* Button fake */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-900/80 z-20" />
        {/* Screen Area */}
        <div
          className="relative w-full h-full overflow-hidden rounded-3xl"
          style={{
            backgroundImage:
              'url(https://cellphones.com.vn/sforum/wp-content/uploads/2022/06/7411.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div className="w-full h-full overflow-y-auto no-scrollbar">
            {children}
          </div>
        </div>
      </div>
    )
  }

  // --- 3. DESKTOP MOCKUP (Browser Style) ---
  return (
    <div
      className={cn(
        'relative w-full max-w-4xl aspect-video rounded-xl border border-border/50 bg-white dark:bg-slate-950 shadow-2xl shadow-indigo-500/10 overflow-hidden ring-1 ring-black/5 dark:ring-white/10 group',
        className,
      )}
    >
      {/* Browser Header */}
      <div className="h-10 bg-slate-50 dark:bg-slate-900 backdrop-blur-md border-b border-border flex items-center px-4 gap-4 z-20 absolute top-0 w-full select-none">
        {/* Traffic Lights (Window Controls) */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-500 transition-colors shadow-sm" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-2xl mx-auto h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md flex items-center px-3 gap-2 text-xs text-muted-foreground shadow-sm transition-colors group-hover:border-blue-400/50">
          <Lock size={10} className="text-green-600 dark:text-green-500" />
          <span className="truncate flex-1 font-mono opacity-80">
            {url || 'https://localhost:3000'}
          </span>
        </div>

        {/* Placeholder for right actions */}
        <div className="w-12 hidden sm:block" />
      </div>

      {/* Main Content Area */}
      <div
        className="pt-10 w-full h-full relative"
        style={{
          backgroundImage:
            'url(https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-stock-2880x1800-1455.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {/* Scrollable Container */}
        <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DeviceMockup
