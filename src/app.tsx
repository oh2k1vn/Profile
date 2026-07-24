import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useSound } from './hooks/useSound';
import { audioService } from './services/audioService';

// Lazy Loaded Pages for Code Splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
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
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;

