import { Terminal as TerminalIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { audioService } from '../services/audioService';
import { Terminal } from '../components/playground/Terminal';
import { GuestbookWidget } from '../components/playground/GuestbookWidget';

import { useSEO } from '../hooks/useSEO';

interface PlaygroundPageProps {
  onTriggerGlitch: () => void;
}

export default function PlaygroundPage({ onTriggerGlitch }: PlaygroundPageProps) {
  const navigate = useNavigate();

  useSEO({
    title: 'Interactive CLI Terminal & Guestbook',
    description: 'Không gian tương tác dòng lệnh CLI giả lập và sổ lưu bút của Nguyễn Minh Hiếu.',
    keywords: 'CLI Terminal, Guestbook, Interactive Workspace, Developer Playground, Nguyễn Minh Hiếu',
  });


  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 space-y-12">
      <section id="playground" className="space-y-8 scroll-mt-24">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400">
              <TerminalIcon size={20} />
            </div>
            <h2 className="text-xl font-bold font-sans text-white tracking-wide">Trải nghiệm tương tác</h2>
          </div>
          <button
            onClick={() => { audioService.playClick(); navigate('/'); }}
            className="liquid-glass-pill px-4 py-2 rounded-full text-xs font-semibold text-sky-400 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Quay lại Portfolio
          </button>
        </div>

        {/* CLI Terminal */}
        <div className="w-full flex flex-col">
          <Terminal onTriggerGlitch={onTriggerGlitch} />
        </div>

        {/* Guestbook Board */}
        <div className="w-full">
          <GuestbookWidget />
        </div>
      </section>
    </main>
  );
}
