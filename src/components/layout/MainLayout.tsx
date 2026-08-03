import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GlitchAlert } from '../common/GlitchAlert';

interface MainLayoutProps {
  children: React.ReactNode;
  glitchActive: boolean;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  glitchActive,
  soundMuted,
  onToggleSound,
}) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-all duration-500 bg-dark-bg text-slate-100 ${glitchActive ? 'glitch-screen bg-red-950/20' : ''}`}>

      {/* AMBIENT LIQUID GLASS MESH LIGHT BLOBS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-137.5 h-137.5 rounded-full bg-linear-to-br from-sky-500/20 via-blue-600/15 to-transparent blur-[120px] animate-mesh-1" />
        <div className="absolute top-1/3 -right-32 w-150 h-150 rounded-full bg-linear-to-bl from-indigo-500/20 via-purple-600/15 to-transparent blur-[130px] animate-mesh-2" />
        <div className="absolute -bottom-40 left-1/4 w-162.5 h-162.5 rounded-full bg-linear-to-t from-teal-500/15 via-sky-600/10 to-transparent blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[24px_24px] opacity-40" />
      </div>

      {/* Header Navbar */}
      {!isDashboard && <Navbar soundMuted={soundMuted} onToggleSound={onToggleSound} />}

      {/* Glitch Overlay Alert */}
      {glitchActive && <GlitchAlert />}

      {/* Main Route Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>

      {/* Footer */}
      {!isDashboard && <Footer />}
    </div>
  );
};

