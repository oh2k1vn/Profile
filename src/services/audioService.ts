/**
 * Tactile Web Audio feedback service for UI interactions.
 * Uses Web Audio API without external audio assets.
 */
class AudioService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private playTone(freq: number, durationSec: number, type: OscillatorType, gainPeak: number): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainPeak, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch {
      // Ignore audio errors when browser autoplay policy blocks playback
    }
  }

  public playClick(): void {
    this.playTone(620, 0.045, 'sine', 0.04);
  }

  public playSuccess(): void {
    this.playTone(587.33, 0.09, 'sine', 0.05);
    setTimeout(() => this.playTone(880, 0.14, 'sine', 0.05), 70);
  }

  public playError(): void {
    this.playTone(220, 0.12, 'triangle', 0.06);
    setTimeout(() => this.playTone(170, 0.16, 'triangle', 0.05), 90);
  }
}

export const audioService = new AudioService();
