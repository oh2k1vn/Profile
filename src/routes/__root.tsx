import { Outlet, createRootRoute } from '@tanstack/react-router'

import { AuthProvider } from '@/app/providers/AuthProvider'


export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  ),
})
