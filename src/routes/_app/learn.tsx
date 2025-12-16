import DeviceMockup from '@/components/DeviceMockup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/learn')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <DeviceMockup type="mobile">Xin chào</DeviceMockup>
      <DeviceMockup type="tablet">Xin chào</DeviceMockup>
      <DeviceMockup type="desktop">Xin chào</DeviceMockup>
    </div>
  )
}
