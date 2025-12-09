import ContactSection from './components/ContactSection'
import ExperienceSection from './components/ExperienceSection'
import FeaturedProjects from './components/FeaturedProjects'
import HeroSectionWithImage from './components/HeroSectionWithImage'
import TechnicalSkills from './components/TechnicalSkills'
import WorkflowSection from './components/WorkflowSection'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSectionWithImage />
      <TechnicalSkills />
      <FeaturedProjects />
      <ExperienceSection />
      {/* <ServicesSection /> */}
      <WorkflowSection />
      {/* <TestimonialsSection /> */}
      <ContactSection />
    </div>
  )
}
