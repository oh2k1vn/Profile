import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import Header from '@/components/Header'
import ErrorPage from '@/pages/error'
import NotFoundPage from '@/pages/notFound'
import { createRootRouteWithContext } from '@tanstack/react-router'

interface MyRouterContext {
  auth: {
    isAuthenticated: boolean
    token: string | null
  }
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
})
