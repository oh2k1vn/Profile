import Header from '@/components/Header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing')({
  component: MarketingLayout,
})

function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* --- HEADER (Global cho Profile) --- */}
      <Header />

      {/* --- MAIN CONTENT (Nơi nội dung các page con sẽ hiển thị) --- */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
