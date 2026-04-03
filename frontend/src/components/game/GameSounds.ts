// ── Web Audio synthesizer for game sounds ──────────────────────────────────
// No external audio files needed — generates all sounds procedurally.

let _ctx: AudioContext | null = null;
let _muted = false;

function ctx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.12) {
  if (_muted) return;
  try {
    const c = ctx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch { /* audio not available */ }
}

function noise(duration: number, vol = 0.06) {
  if (_muted) return;
  try {
    const c = ctx();
    const bufSize = c.sampleRate * duration;
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const gain = c.createGain();
    gain.gain.setValueAtTime(vol, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    src.connect(gain).connect(c.destination);
    src.start();
    src.stop(c.currentTime + duration);
  } catch { /* */ }
}

// ── Public API ─────────────────────────────────────────────────────────────────

export const GameSounds = {
  /** Fruit caught — cheerful blip */
  catch() {
    tone(660, 0.08, 'sine', 0.1);
    setTimeout(() => tone(880, 0.06, 'sine', 0.08), 40);
  },

  /** Combo hit (3+) — ascending arpeggio */
  combo(level: number) {
    const base = 520 + level * 40;
    tone(base, 0.06, 'triangle', 0.1);
    setTimeout(() => tone(base + 200, 0.06, 'triangle', 0.1), 50);
    setTimeout(() => tone(base + 400, 0.08, 'triangle', 0.12), 100);
  },

  /** Power-up collected — sparkly sweep */
  powerUp() {
    tone(400, 0.15, 'sine', 0.1);
    setTimeout(() => tone(600, 0.12, 'sine', 0.1), 60);
    setTimeout(() => tone(900, 0.12, 'sine', 0.12), 120);
    setTimeout(() => tone(1200, 0.15, 'triangle', 0.08), 180);
  },

  /** Bad item caught — thud + buzz */
  hit() {
    tone(120, 0.2, 'sawtooth', 0.12);
    noise(0.1, 0.08);
  },

  /** Shield blocks hit — metallic clang */
  shieldBlock() {
    tone(800, 0.1, 'square', 0.06);
    setTimeout(() => tone(1200, 0.08, 'sine', 0.08), 30);
  },

  /** Missed fruit (fell off screen) — soft descending tone */
  miss() {
    tone(300, 0.12, 'sine', 0.06);
    setTimeout(() => tone(200, 0.15, 'sine', 0.04), 80);
  },

  /** Level up — triumphant fanfare */
  levelUp() {
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
    notes.forEach((f, i) => {
      setTimeout(() => tone(f, 0.15, 'triangle', 0.1), i * 80);
    });
  },

  /** Frenzy activated — whoosh */
  frenzy() {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => tone(300 + i * 100, 0.06, 'sawtooth', 0.04), i * 25);
    }
  },

  /** Game over — descending sad tone */
  gameOver() {
    const notes = [440, 392, 349, 262]; // A4 G4 F4 C4
    notes.forEach((f, i) => {
      setTimeout(() => tone(f, 0.25, 'sine', 0.08), i * 150);
    });
  },

  /** Achievement unlocked — magical chime */
  achievement() {
    const notes = [660, 880, 1100, 1320, 1100, 1320];
    notes.forEach((f, i) => {
      setTimeout(() => tone(f, 0.12, 'sine', 0.07), i * 60);
    });
  },

  /** Button click — soft tick */
  click() {
    tone(800, 0.03, 'sine', 0.05);
  },

  /** Mute / unmute */
  get muted() { return _muted; },
  setMuted(m: boolean) { _muted = m; },
  toggle() { _muted = !_muted; return _muted; },

  /** Warm up audio context on first user interaction */
  warmUp() {
    try { ctx(); } catch { /* */ }
  },
};
