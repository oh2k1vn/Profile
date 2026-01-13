import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/$name')({
  loader: async ({ params }) => {
    console.log('🚀 Log test data ', params)
    return { name: params.name }
  },
  pendingComponent: () => <div>Loading...</div>,
  component: RouteComponent,
})

function RouteComponent() {
  const { name } = Route.useParams()
  return <div>Hello "/_authenticated/{name}"!</div>
}
