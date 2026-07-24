import { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';

export function useSound() {
  const [soundMuted, setSoundMuted] = useState(false);

  useEffect(() => {
    const soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
    setSoundMuted(!soundEnabled);
    audioService.setSoundEnabled(soundEnabled);
  }, []);

  const toggleSound = () => {
    const nextState = !soundMuted;
    setSoundMuted(nextState);
    audioService.setSoundEnabled(!nextState);
    audioService.playClick();
  };

  return { soundMuted, toggleSound };
}
