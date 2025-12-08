import { createRootRoute, Outlet } from '@tanstack/react-router'

import ChatBot from '@/components/ChatBot'
import Header from '@/components/Header'
import ErrorPage from '@/pages/error'
import NotFoundPage from '@/pages/notFound'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <ChatBot />
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </>
  ),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
})
