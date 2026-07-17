import { Terminal as TerminalIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { audioService } from '../utils/audio';
import { Terminal } from '../components/Terminal';
import { GuestbookWidget } from '../components/GuestbookWidget';

interface PlaygroundPageProps {
  onTriggerGlitch: () => void;
}

export default function PlaygroundPage({ onTriggerGlitch }: PlaygroundPageProps) {
  const navigate = useNavigate();

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12 space-y-12">
      <section id="playground" className="space-y-6 scroll-mt-20">
        <div className="flex items-center justify-between border-b border-light-green/10 pb-2">
          <div className="flex items-center space-x-3">
            <TerminalIcon className="text-heading-primary" size={22} />
            <h2 className="text-xl font-bold font-mono uppercase text-heading-primary tracking-widest">Trải nghiệm tương tác</h2>
          </div>
          <button
            onClick={() => { audioService.playClick(); navigate('/'); }}
            className="text-xs font-mono text-heading-accent hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none font-bold"
          >
            ← Quay lại Portfolio
          </button>
        </div>

        {/* Dashboard Row 1: Full-width CLI Terminal */}
        <div className="w-full flex flex-col">
          <Terminal onTriggerGlitch={onTriggerGlitch} />
        </div>

        {/* Dashboard Row 2: Full-width Guestbook Board */}
        <div className="w-full">
          <GuestbookWidget />
        </div>
      </section>
    </main>
  );
}
