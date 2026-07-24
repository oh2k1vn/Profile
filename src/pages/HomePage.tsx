import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { SkillsSection } from '../components/home/SkillsSection';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { useSEO } from '../hooks/useSEO';
import { useProfile } from '../contexts/ProfileContext';

export default function HomePage() {
  const { profile } = useProfile();

  useSEO({
    title: profile?.jobTitle ? `${profile.displayName} | ${profile.jobTitle}` : 'Nguyễn Minh Hiếu | Middle Frontend & Mobile Developer Portfolio',
    description: profile?.bio || 'Portfolio cá nhân của Nguyễn Minh Hiếu - Middle Frontend & Mobile Developer với 4+ năm kinh nghiệm. Chuyên Flutter, React, TypeScript & Zalo Mini App.',
    keywords: 'Nguyễn Minh Hiếu, Frontend Developer, Mobile Developer, Flutter Developer, React Developer, TypeScript, Zalo Mini App, Portfolio',
  });

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
