// Procedural Web Audio API Sound System for Seed Balance: The Morgen Rush
// No external mp3/wav files required, zero latency and 100% reliable in all browsers.

class SoundManager {
  private ctx: AudioContext | null = null;
  public soundEnabled: boolean = true;
  public musicEnabled: boolean = true;
  private bgmOscillators: (OscillatorNode | GainNode)[] = [];
  private bgmInterval: any = null;
  private bgmPlaying: boolean = false;

  // Authentic Android Haptic Vibration Feedback
  public triggerHaptic(type: 'tap' | 'eat' | 'shield' | 'complete' | 'gameover') {
    if (typeof window === 'undefined' || !navigator.vibrate) return;
    try {
      switch (type) {
        case 'tap':
          navigator.vibrate(10);
          break;
        case 'eat':
          navigator.vibrate(20);
          break;
        case 'shield':
          navigator.vibrate([30, 25, 30]);
          break;
        case 'complete':
          navigator.vibrate([40, 40, 40]);
          break;
        case 'gameover':
          navigator.vibrate([80, 50, 80]);
          break;
      }
    } catch (e) {}
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Crunchy bite sound when eating an ingredient
  public playMunch() {
    this.triggerHaptic('eat');
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Low pop / crunch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.12);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);

    // High crunchy snap
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(800, t);
    snapOsc.frequency.exponentialRampToValueAtTime(400, t + 0.08);

    snapGain.gain.setValueAtTime(0.2, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);

    snapOsc.start(t);
    snapOsc.stop(t + 0.08);
  }

  // Celebratory golden chime fanfare on completing 6-ingredient recipe
  public playRecipeComplete() {
    this.triggerHaptic('complete');
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0, t + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.3, t + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.5);
    });
  }

  // Honey Shield activation sound
  public playShield() {
    this.triggerHaptic('shield');
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(880, t + 0.3);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Whoosh sound when turning
  public playTurn() {
    this.triggerHaptic('tap');
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(240, t + 0.04);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  // Game over sound
  public playGameOver() {
    this.triggerHaptic('gameover');
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(65, t + 0.6);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.6);
  }

  // Button click
  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Cheerful lo-fi breakfast arcade procedural melody
  public startBGM() {
    if (!this.musicEnabled || this.bgmPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.bgmPlaying = true;
    const melody = [
      261.63, 329.63, 392.00, 523.25, // C E G C
      293.66, 349.23, 440.00, 587.33, // D F A D
      329.63, 392.00, 493.88, 659.25, // E G B E
      261.63, 392.00, 523.25, 392.00  // C G C G
    ];
    let noteIndex = 0;

    this.bgmInterval = setInterval(() => {
      if (!this.musicEnabled || !this.bgmPlaying || !this.ctx) return;
      const freq = melody[noteIndex % melody.length];
      noteIndex++;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.5, t); // gentle warm lower octave
      
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    }, 280);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return this.musicEnabled;
  }
}

export const soundManager = new SoundManager();
