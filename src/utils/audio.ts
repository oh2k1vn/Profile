let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// Initialize sound state from localStorage
if (typeof window !== 'undefined') {
  soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
}

function getAudioContext(): AudioContext | null {
  if (!audioCtx && typeof window !== 'undefined') {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioCtxClass();
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser:", e);
    }
  }
  
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const audioService = {
  isSoundEnabled(): boolean {
    return soundEnabled;
  },

  setSoundEnabled(enabled: boolean) {
    soundEnabled = enabled;
    localStorage.setItem('sound_enabled', enabled ? 'true' : 'false');
  },

  playClick() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  },

  playSuccess() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const duration = 0.1;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + duration);
    });
  },

  playError() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(110, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  },

  playCoffee() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 2.5; // Brewing sounds duration

    // Create a series of random water bubbling blips
    for (let i = 0; i < 30; i++) {
      const startTime = now + (i * (duration / 30)) + Math.random() * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Coffee drip sound frequency
      const freq = 600 + Math.random() * 1200;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq - 300, startTime + 0.08);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.03, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.09);
    }

    // Low rumble of the machine
    const rumbleOsc = ctx.createOscillator();
    const rumbleGain = ctx.createGain();

    rumbleOsc.type = 'sawtooth';
    rumbleOsc.frequency.setValueAtTime(60, now);
    
    // Low pass filter to make it sound like a hum
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);

    rumbleGain.gain.setValueAtTime(0, now);
    rumbleGain.gain.linearRampToValueAtTime(0.04, now + 0.2);
    rumbleGain.gain.linearRampToValueAtTime(0.04, now + duration - 0.2);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    rumbleOsc.connect(filter);
    filter.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);

    rumbleOsc.start(now);
    rumbleOsc.stop(now + duration);
  },

  playGlitch() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    for (let i = 0; i < 15; i++) {
      const startTime = now + (i * 0.06);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
      osc.frequency.setValueAtTime(100 + Math.random() * 800, startTime);

      gain.gain.setValueAtTime(0.04, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.06);
    }
  }
};
