/**
 * Web Audio API synthesizer for "Toko Pecahan Ceria"
 * Operates 100% offline without external audio files.
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmIntervalId: number | null = null;
  private bgmStep: number = 0;
  private isBgmPlaying: boolean = false;
  private isRushHour: boolean = false;

  constructor() {
    const savedMute = localStorage.getItem('tokoperahan_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.isMuted ? 0 : 0.15;
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.isMuted ? 0 : 0.35;
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('tokoperahan_muted', String(this.isMuted));
    if (this.bgmGain) {
      this.bgmGain.gain.value = this.isMuted ? 0 : 0.15;
    }
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.isMuted ? 0 : 0.35;
    }
    return this.isMuted;
  }

  // Soft button tap
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Soft food placing (blop)
  public playBlop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Pouring juice liquid (glug glug)
  public playGlug() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const freqs = [350, 420, 500, 600];
    freqs.forEach((freq, idx) => {
      const startTime = this.ctx!.currentTime + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq + 90, startTime + 0.05);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.06);
    });
  }

  // Slice cut sound
  public playSlice() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Cash register ka-ching + chime for correct order
  public playKaching() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Chime notes: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const startTime = this.ctx!.currentTime + idx * 0.07;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // Yay celebratory chords
  public playYay() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const chords = [523.25, 659.25, 783.99, 1046.5];
    chords.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      gain.gain.setValueAtTime(0.2, this.ctx!.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start();
      osc.stop(this.ctx!.currentTime + 0.6);
    });
  }

  // Friendly soft boing/womp on mistake (never jarring or scary)
  public playBoing() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Whistle / alarm when time completes
  public playWhistle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(1174.66, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  // Cheerful Upbeat BGM Generator (Ukulele / Marimba melodic progression)
  public startBGM(rushHour = false) {
    this.isRushHour = rushHour;
    if (this.isBgmPlaying) {
      if (this.bgmIntervalId) {
        window.clearInterval(this.bgmIntervalId);
      }
    }
    this.isBgmPlaying = true;
    this.initContext();

    // Notes sequence (C major friendly cheerful melody: C, E, G, A, G, E, D, C)
    const melody = [
      261.63, 329.63, 392.0, 440.0,
      392.0, 329.63, 293.66, 261.63,
      329.63, 392.0, 523.25, 440.0,
      392.0, 349.23, 329.63, 293.66
    ];

    const bass = [130.81, 130.81, 164.81, 196.0, 174.61, 174.61, 196.0, 130.81];

    const intervalMs = this.isRushHour ? 220 : 280;

    this.bgmIntervalId = window.setInterval(() => {
      if (this.isMuted || !this.ctx || !this.bgmGain) return;

      const now = this.ctx.currentTime;
      const noteFreq = melody[this.bgmStep % melody.length];
      const bassFreq = bass[Math.floor(this.bgmStep / 2) % bass.length];

      // Melody note (Marimba style: fast attack, quick decay)
      const mOsc = this.ctx.createOscillator();
      const mGain = this.ctx.createGain();
      mOsc.type = 'triangle';
      mOsc.frequency.setValueAtTime(noteFreq, now);

      mGain.gain.setValueAtTime(0.08, now);
      mGain.gain.exponentialRampToValueAtTime(0.001, now + (intervalMs / 1000) * 0.9);

      mOsc.connect(mGain);
      mGain.connect(this.bgmGain);
      mOsc.start(now);
      mOsc.stop(now + (intervalMs / 1000));

      // Bass note on every 2nd step
      if (this.bgmStep % 2 === 0) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bassFreq, now);

        bGain.gain.setValueAtTime(0.06, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + (intervalMs / 1000) * 1.5);

        bOsc.connect(bGain);
        bGain.connect(this.bgmGain);
        bOsc.start(now);
        bOsc.stop(now + (intervalMs / 1000) * 1.5);
      }

      this.bgmStep = (this.bgmStep + 1) % 32;
    }, intervalMs);
  }

  public setRushHour(rush: boolean) {
    if (this.isRushHour !== rush) {
      this.isRushHour = rush;
      if (this.isBgmPlaying) {
        this.startBGM(rush);
      }
    }
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId) {
      window.clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }
}

export const sound = new SoundEffectsService();
