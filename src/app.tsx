import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useSound } from './hooks/useSound';
import { audioService } from './services/audioService';

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/playground" element={<PlaygroundPage onTriggerGlitch={handleTriggerGlitch} />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
