import { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Terminal as TerminalIcon, Layout,
  Heart, ShieldAlert, ExternalLink, BookOpen
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { audioService } from './utils/audio';
import { Companion } from './components/Companion';

// Pages
import HomePage from './pages/HomePage';
import PlaygroundPage from './pages/PlaygroundPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [soundMuted, setSoundMuted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Glitch event state
  const [glitchActive, setGlitchActive] = useState(false);

  // Initialize from local storage
  useEffect(() => {
    const soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
    setSoundMuted(!soundEnabled);
    audioService.setSoundEnabled(soundEnabled);
  }, []);

  // Sound toggle
  const handleToggleSound = () => {
    const nextState = !soundMuted;
    setSoundMuted(nextState);
    audioService.setSoundEnabled(!nextState);
    audioService.playClick();
  };

  // Terminal glitch effect trigger
  const handleTriggerGlitch = () => {
    if (glitchActive) return;
    setGlitchActive(true);
    audioService.playGlitch();
    audioService.playError();
    setTimeout(() => {
      setGlitchActive(false);
      audioService.playSuccess();
    }, 3200);
  };

  // Determine active nav for highlighting
  const isHome = location.pathname === '/';
  const isPlayground = location.pathname === '/playground';
  const isBlog = location.pathname.startsWith('/blog');

  return (
    <div className={`min-h-screen flex flex-col relative transition-all duration-300 ${glitchActive ? 'glitch-screen bg-red-950/20' : 'bg-gradient-to-b from-[#0a0f0a] via-[#040804] to-[#010401]'}`}>

      {/* Visual background ambient grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,176,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,176,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 border-b border-light-green/10 bg-[#0a0f0a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-3 py-3 sm:px-4 sm:py-4 flex items-center justify-between gap-4">
          <button onClick={() => navAndScroll('/')} className="flex items-center space-x-2 font-mono select-none bg-transparent border-none text-left cursor-pointer">
            <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-heading-primary animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-heading-primary tracking-wider uppercase glow-text">MINHHIEU.DEV</span>
          </button>

          {/* Nav items */}
          <nav className="hidden md:flex items-center space-x-6 text-xs uppercase font-mono tracking-widest text-text-green">
            <button
              onClick={() => navAndScroll('/', 'about')}
              className={`hover:text-heading-primary transition-colors cursor-pointer bg-transparent border-none ${isHome ? 'text-text-green' : ''}`}
            >
              Giới thiệu
            </button>
            <button
              onClick={() => navAndScroll('/', 'skills')}
              className="hover:text-heading-primary transition-colors cursor-pointer bg-transparent border-none"
            >
              Kỹ năng
            </button>
            <button
              onClick={() => navAndScroll('/', 'projects')}
              className="hover:text-heading-primary transition-colors cursor-pointer bg-transparent border-none"
            >
              Dự án
            </button>
            <button
              onClick={() => navAndScroll('/blog')}
              className={`hover:text-heading-primary transition-colors cursor-pointer bg-transparent border-none flex items-center gap-1.5 ${isBlog ? 'text-heading-primary' : ''}`}
            >
              <BookOpen size={12} />
              Blog
            </button>
            <button
              onClick={() => navAndScroll('/playground')}
              className={`hover:text-heading-primary transition-colors cursor-pointer bg-transparent border-none ${isPlayground ? 'text-heading-primary' : ''}`}
            >
              Trải nghiệm
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            {/* View Mode Switcher */}
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
              className="p-2 border border-light-green/20 hover:border-light-green/50 bg-light-green/10 hover:bg-light-green/20 text-text-light rounded-lg cursor-pointer transition-all duration-200"
            >
              {isPlayground ? <Layout size={16} /> : <TerminalIcon size={16} />}
            </button>

            {/* Mute button */}
            <button
              onClick={handleToggleSound}
              className="p-2 border border-light-green/20 hover:border-light-green/50 bg-light-green/10 hover:bg-light-green/20 text-text-light rounded-lg cursor-pointer transition-all duration-200"
            >
              {soundMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-heading-accent" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-light-green/10 px-3 py-2 flex items-center gap-3 overflow-x-auto scrollbar-none text-[10px] uppercase font-mono tracking-widest text-text-green">
          <button onClick={() => navAndScroll('/', 'about')} className={`whitespace-nowrap hover:text-heading-primary transition-colors cursor-pointer bg-transparent border-none ${isHome ? 'text-heading-accent' : ''}`}>Giới thiệu</button>
          <button onClick={() => navAndScroll('/', 'skills')} className="whitespace-nowrap hover:text-heading-primary transition-colors cursor-pointer bg-transparent border-none">Kỹ năng</button>
          <button onClick={() => navAndScroll('/', 'projects')} className="whitespace-nowrap hover:text-heading-primary transition-colors cursor-pointer bg-transparent border-none">Dự án</button>
          <button onClick={() => navAndScroll('/blog')} className={`whitespace-nowrap hover:text-heading-primary transition-colors cursor-pointer bg-transparent border-none flex items-center gap-1 ${isBlog ? 'text-heading-accent' : ''}`}>
            <BookOpen size={10} />
            Blog
          </button>
          <button onClick={() => navAndScroll('/playground')} className={`whitespace-nowrap hover:text-heading-primary transition-colors cursor-pointer bg-transparent border-none ${isPlayground ? 'text-heading-accent' : ''}`}>Trải nghiệm</button>
        </div>
      </header>

      {/* GLITCH OVERLAY ALERTS */}
      {glitchActive && (
        <div className="fixed inset-0 z-50 bg-red-950/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 font-mono text-center p-6 pointer-events-none select-none">
          <ShieldAlert size={64} className="text-red-500 animate-bounce" />
          <h2 className="text-2xl font-bold text-red-500 glow-text uppercase">Phát Hiện Lệnh Sudo: Đang Format Root</h2>
          <p className="text-sm text-red-400 max-w-md">Cảnh báo: Tệp tin cốt lõi bị unlinked. Điện thế quá tải. Đang tiến hành chuẩn hóa lại luồng máy chủ...</p>
          <div className="w-48 h-2 bg-red-950 border border-red-500 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 animate-[pulse_0.4s_infinite]" style={{ width: '80%' }} />
          </div>
        </div>
      )}

      {/* Route Views */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/playground" element={<PlaygroundPage onTriggerGlitch={handleTriggerGlitch} />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
      </Routes>

      {/* COMPANION PIXEL WIDGET */}
      <Companion glitchActive={glitchActive} />

      {/* FOOTER */}
      <footer className="border-t border-light-green/10 bg-[#060a06] py-10 mt-20 text-center font-mono text-xs text-text-green">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-1.5">
            <Heart size={12} className="text-red-500 animate-pulse" />
            <span>Xây dựng bởi Antigravity tại Node <code>d:\Profile</code></span>
          </div>

          <div className="flex space-x-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" onClick={() => audioService.playClick()} className="hover:text-heading-primary transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" onClick={() => audioService.playClick()} className="hover:text-heading-primary transition-colors flex items-center gap-1.5">
              <ExternalLink size={14} /> LinkedIn
            </a>
          </div>

          <div>
            <span>© 2026 Space-Time Nodes</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
