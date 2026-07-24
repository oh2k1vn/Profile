import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MainLayout } from './components/layout/MainLayout';
import { useSound } from './hooks/useSound';
import { audioService } from './services/audioService';
import { ProfileProvider } from './contexts/ProfileContext';

// Lazy Loaded Pages for Code Splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function App() {
  return (
    <ProfileProvider>
      <Router>
        <AppContent />
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(16px)',
            borderRadius: '1rem',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#38bdf8',
              secondary: '#0f172a',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#0f172a',
            },
          },
        }}
      />
    </ProfileProvider>
  );
}

function AppContent() {
  const { soundMuted, toggleSound } = useSound();
  const [glitchActive, setGlitchActive] = useState(false);

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

  return (
    <MainLayout
      glitchActive={glitchActive}
      soundMuted={soundMuted}
      onToggleSound={toggleSound}
    >
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/playground" element={<PlaygroundPage onTriggerGlitch={handleTriggerGlitch} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;
