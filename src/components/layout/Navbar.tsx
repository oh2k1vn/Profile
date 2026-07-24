import React from 'react';
import { BookOpen, Sparkles, Layout, Terminal as TerminalIcon, Volume2, VolumeX, LayoutDashboard } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { audioService } from '../../services/audioService';
import { useProfile } from '../../contexts/ProfileContext';

interface NavbarProps {
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ soundMuted, onToggleSound }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useProfile();

  const isHome = location.pathname === '/';
  const isPlayground = location.pathname === '/playground';
  const isBlog = location.pathname.startsWith('/blog');
  const isDashboard = location.pathname.startsWith('/dashboard');

  const navAndScroll = (to: string, elementId?: string) => {
    audioService.playClick();
    if (location.pathname !== to) {
      navigate(to);
      if (elementId) {
        setTimeout(() => {
          const el = document.getElementById(elementId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    } else if (elementId) {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="sticky top-3 sm:top-5 z-40 max-w-5xl mx-auto w-full px-3 sm:px-6">
      <header className="liquid-glass rounded-full px-4 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between gap-4 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300">

        {/* Logo */}
        <button
          onClick={() => navAndScroll('/')}
          className="flex items-center space-x-2 font-sans select-none bg-transparent border-none text-left cursor-pointer group"
        >
          <span className="text-sm font-extrabold tracking-wider bg-linear-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent group-hover:to-indigo-400 transition-all">
            MINHHIEU<span className="text-sky-400 font-mono text-xs ml-0.5">.DEV</span>
          </span>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-1.5 text-xs font-medium text-slate-300 bg-black/25 backdrop-blur-md p-1 rounded-full border border-white/10">
          <button
            onClick={() => navAndScroll('/', 'about')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer bg-transparent border-none ${isHome ? 'bg-white/15 text-white font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.25)] border border-white/20' : 'hover:text-white hover:bg-white/5'}`}
          >
            Giới thiệu
          </button>
          <button
            onClick={() => navAndScroll('/', 'skills')}
            className="px-4 py-1.5 rounded-full transition-all cursor-pointer bg-transparent border-none hover:text-white hover:bg-white/5"
          >
            Kỹ năng
          </button>
          <button
            onClick={() => navAndScroll('/', 'projects')}
            className="px-4 py-1.5 rounded-full transition-all cursor-pointer bg-transparent border-none hover:text-white hover:bg-white/5"
          >
            Dự án
          </button>
          <button
            onClick={() => navAndScroll('/blog')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer bg-transparent border-none flex items-center gap-1.5 ${isBlog ? 'bg-white/15 text-sky-400 font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.25)] border border-white/20' : 'hover:text-white hover:bg-white/5'}`}
          >
            <BookOpen size={13} className="text-sky-400" />
            Blog
          </button>
          <button
            onClick={() => navAndScroll('/playground')}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer bg-transparent border-none flex items-center gap-1 ${isPlayground ? 'bg-white/15 text-sky-400 font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.25)] border border-white/20' : 'hover:text-white hover:bg-white/5'}`}
          >
            <Sparkles size={13} className="text-purple-400" />
            Trải nghiệm
          </button>

          {/* Render Dashboard tab when logged in */}
          {user && (
            <button
              onClick={() => navAndScroll('/dashboard')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer bg-transparent border-none flex items-center gap-1.5 ${isDashboard ? 'bg-emerald-500/25 text-emerald-300 font-semibold shadow-[0_2px_10px_rgba(16,185,129,0.3)] border border-emerald-400/30' : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'}`}
            >
              <LayoutDashboard size={13} className="text-emerald-400" />
              Dashboard
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              audioService.playClick();
              if (location.pathname === '/playground') {
                navigate('/');
              } else {
                navigate('/playground');
              }
            }}
            title={isPlayground ? "Hiển thị portfolio đầy đủ" : "Chỉ hiển thị dòng lệnh Retro CLI"}
            className="liquid-glass-pill p-2 text-slate-200 hover:text-white rounded-full cursor-pointer transition-all duration-200"
          >
            {isPlayground ? <Layout size={16} className="text-sky-400" /> : <TerminalIcon size={16} className="text-purple-400" />}
          </button>

          <button
            onClick={onToggleSound}
            className="liquid-glass-pill p-2 text-slate-200 hover:text-white rounded-full cursor-pointer transition-all duration-200"
          >
            {soundMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-sky-400" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Bar */}
      <div className="md:hidden mt-2 liquid-glass rounded-full px-3 py-1.5 flex items-center justify-around overflow-x-auto scrollbar-none text-[11px] font-medium text-slate-300 border border-white/15">
        <button onClick={() => navAndScroll('/', 'about')} className={`whitespace-nowrap px-2.5 py-1 rounded-full cursor-pointer bg-transparent border-none ${isHome ? 'text-sky-400 font-semibold bg-white/10' : ''}`}>Giới thiệu</button>
        <button onClick={() => navAndScroll('/', 'skills')} className="whitespace-nowrap px-2.5 py-1 rounded-full cursor-pointer bg-transparent border-none">Kỹ năng</button>
        <button onClick={() => navAndScroll('/', 'projects')} className="whitespace-nowrap px-2.5 py-1 rounded-full cursor-pointer bg-transparent border-none">Dự án</button>
        <button onClick={() => navAndScroll('/blog')} className={`whitespace-nowrap px-2.5 py-1 rounded-full cursor-pointer bg-transparent border-none flex items-center gap-1 ${isBlog ? 'text-sky-400 font-semibold bg-white/10' : ''}`}>
          <BookOpen size={11} />
          Blog
        </button>
        <button onClick={() => navAndScroll('/playground')} className={`whitespace-nowrap px-2.5 py-1 rounded-full cursor-pointer bg-transparent border-none ${isPlayground ? 'text-sky-400 font-semibold bg-white/10' : ''}`}>Trải nghiệm</button>
        {user && (
          <button onClick={() => navAndScroll('/dashboard')} className={`whitespace-nowrap px-2.5 py-1 rounded-full cursor-pointer bg-transparent border-none flex items-center gap-1 text-emerald-400 ${isDashboard ? 'font-semibold bg-emerald-500/20' : ''}`}>
            <LayoutDashboard size={11} />
            Dashboard
          </button>
        )}
      </div>
    </div>
  );
};
