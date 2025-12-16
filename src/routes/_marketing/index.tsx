import {
  ContactSection,
  ExperienceSection,
  FeaturedProjects,
  HeroSectionWithImage,
  TechnicalSkills,
  WorkflowSection,
} from '@/features/portfolio'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <HeroSectionWithImage />
      <TechnicalSkills />
      <FeaturedProjects />
      <ExperienceSection />
      <WorkflowSection />
      <ContactSection />
    </>
  )
}
