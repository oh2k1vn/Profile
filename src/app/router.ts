import { createRouter } from '@tanstack/react-router'

import { routeTree } from '@/routeTree.gen'
import type { useFirebaseAuth } from '@/shared/hooks/useFirebaseAuth'

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined! as ReturnType<typeof useFirebaseAuth>,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,


})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
