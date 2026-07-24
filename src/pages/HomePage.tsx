import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { SkillsSection } from '../components/home/SkillsSection';
import { ProjectsSection } from '../components/home/ProjectsSection';

export default function HomePage() {
  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-14 space-y-20 sm:space-y-24">
      {/* HERO SECTION */}
      <HeroSection />

      {/* ABOUT ME SECTION */}
      <AboutSection />

      {/* SKILLS SECTION */}
      <SkillsSection />

      {/* PROJECTS SECTION */}
      <ProjectsSection />
    </main>
  );
}

