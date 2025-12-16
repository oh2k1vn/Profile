import { createFileRoute, Outlet } from '@tanstack/react-router'
// Giả sử bạn dùng icon từ lucide-react (rất phổ biến với Tailwind)

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  return <Outlet />
}
