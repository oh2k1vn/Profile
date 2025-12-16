import { createRootRoute, Outlet } from '@tanstack/react-router'

import ErrorPage from '@/pages/error'
import NotFoundPage from '@/pages/notFound'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
})
