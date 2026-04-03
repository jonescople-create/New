import { useEffect, useRef, useState, useCallback } from 'react';
import { FRUIT_EMOJIS, BAD_EMOJIS } from '../../data/gameRewards';
import { GameSounds } from './GameSounds';

// ── Types ──────────────────────────────────────────────────────────────────────
interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  emoji: string;
  isBad: boolean;
  isPowerUp: boolean;
  powerType?: 'shield' | 'magnet' | 'frenzy' | 'double';
  scale: number;
  rotation: number;
  rotSpeed: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string; size: number; emoji?: string;
}

interface FloatingText {
  x: number; y: number; text: string; color: string;
  life: number; maxLife: number; size: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const BASE_W        = 480;
const BASE_H        = 460;
const BASKET_W_R    = 84 / BASE_W;   // basket ratios
const BASKET_H_R    = 38 / BASE_H;
const ITEM_R        = 36 / BASE_W;
const BASE_SPAWN_MS = 850;
const MAX_LIVES     = 3;
const COMBO_WINDOW  = 1200;
const FRENZY_DUR    = 5000;

const POWER_EMOJIS: Record<string, string> = { shield: '🛡️', magnet: '🧲', frenzy: '🌪️', double: '⭐' };
const POWER_COLORS: Record<string, string> = { shield: '#4FC3F7', magnet: '#E040FB', frenzy: '#FF6D00', double: '#FFD600' };

let _id = 0;

function makeItem(score: number): FallingItem {
  const powerChance = Math.min(0.12, 0.02 + score / 3000);
  if (Math.random() < powerChance) {
    const types: Array<'shield' | 'magnet' | 'frenzy' | 'double'> = ['shield', 'magnet', 'frenzy', 'double'];
    const pt = types[Math.floor(Math.random() * types.length)];
    return { id: ++_id, x: 0.08 + Math.random() * 0.84, y: -0.08, speed: 0.003 + Math.random() * 0.002,
      emoji: POWER_EMOJIS[pt], isBad: false, isPowerUp: true, powerType: pt, scale: 1.2, rotation: 0, rotSpeed: (Math.random() - 0.5) * 0.08 };
  }
  const badChance = Math.min(0.30, 0.06 + score / 1500);
  const isBad = Math.random() < badChance;
  const pool = isBad ? BAD_EMOJIS : FRUIT_EMOJIS;
  return { id: ++_id, x: 0.06 + Math.random() * 0.88, y: -0.08,
    speed: 0.004 + Math.random() * 0.003 + score / 120000,
    emoji: pool[Math.floor(Math.random() * pool.length)],
    isBad, isPowerUp: false, scale: 1, rotation: 0, rotSpeed: isBad ? (Math.random() - 0.5) * 0.12 : 0 };
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

// ── Events emitted to parent ──────────────────────────────────────────────────
export interface GameEvent {
  type: 'catch' | 'miss' | 'hit' | 'powerUp' | 'combo' | 'levelUp' | 'shieldBlock' | 'frenzy' | 'gameOver';
  value?: number;
  powerType?: string;
}

interface Props {
  onScoreChange: (s: number) => void;
  onGameOver:    (s: number) => void;
  onEvent?:      (e: GameEvent) => void;
  isFullscreen?: boolean;
}

export function GameCanvas({ onScoreChange, onGameOver, onEvent, isFullscreen }: Props) {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const scoreRef     = useRef(0);
  const livesRef     = useRef(MAX_LIVES);
  const itemsRef     = useRef<FallingItem[]>([]);
  const basketXRef   = useRef(0.5);
  const runningRef   = useRef(true);
  const pausedRef    = useRef(false);
  const lastSpawnRef = useRef(0);
  const rafRef       = useRef(0);
  const cbScore      = useRef(onScoreChange);
  const cbOver       = useRef(onGameOver);
  const cbEvent      = useRef(onEvent);
  cbScore.current    = onScoreChange;
  cbOver.current     = onGameOver;
  cbEvent.current    = onEvent;

  const comboRef       = useRef(0);
  const lastCatchRef   = useRef(0);
  const particlesRef   = useRef<Particle[]>([]);
  const textsRef       = useRef<FloatingText[]>([]);
  const shakeRef       = useRef(0);
  const flashRef       = useRef({ alpha: 0, color: '' });
  const shieldRef      = useRef(false);
  const shieldEndRef   = useRef(0);
  const magnetRef      = useRef(false);
  const magnetEndRef   = useRef(0);
  const doubleRef      = useRef(false);
  const doubleEndRef   = useRef(0);
  const frenzyRef      = useRef(false);
  const frenzyEndRef   = useRef(0);
  const frenzySpawnRef = useRef(0);
  const levelRef       = useRef(1);
  const levelMsgRef    = useRef('');
  const levelMsgEndRef = useRef(0);

  const [dispScore, setDispScore] = useState(0);
  const [dispLives, setDispLives] = useState(MAX_LIVES);
  const [paused, setPaused]       = useState(false);
  const [, setDead]               = useState(false);
  const [combo, setCombo]         = useState(0);
  const [activePowers, setActivePowers] = useState<string[]>([]);

  // Dynamic canvas sizing for fullscreen
  const [canvasSize, setCanvasSize] = useState({ w: BASE_W, h: BASE_H });

  useEffect(() => {
    function resize() {
      if (isFullscreen && wrapRef.current) {
        const vw = window.innerWidth;
        const vh = window.innerHeight - 80; // leave room for HUD
        const aspect = BASE_W / BASE_H;
        let w = vw - 32;
        let h = w / aspect;
        if (h > vh) { h = vh; w = h * aspect; }
        setCanvasSize({ w: Math.round(w), h: Math.round(h) });
      } else {
        setCanvasSize({ w: BASE_W, h: BASE_H });
      }
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [isFullscreen]);

  // emit helper
  const emit = useCallback((type: GameEvent['type'], value?: number, powerType?: string) => {
    cbEvent.current?.({ type, value, powerType });
  }, []);

  // particles
  const spawnParticles = useCallback((x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      particlesRef.current.push({ x, y, vx: Math.cos(a) * (2 + Math.random() * 3), vy: Math.sin(a) * (2 + Math.random() * 3) - 2,
        life: 1, maxLife: 0.6 + Math.random() * 0.4, color, size: 3 + Math.random() * 4 });
    }
  }, []);
  const spawnEmoji = useCallback((x: number, y: number, emoji: string) => {
    particlesRef.current.push({ x, y, vx: (Math.random() - 0.5) * 2, vy: -3 - Math.random() * 2,
      life: 1, maxLife: 1.2, color: '', size: 24, emoji });
  }, []);
  const spawnText = useCallback((x: number, y: number, text: string, color: string, size = 16) => {
    textsRef.current.push({ x, y, text, color, life: 1, maxLife: 1.0, size });
  }, []);

  // ── Input ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const onKey = (e: KeyboardEvent) => {
      if (!runningRef.current) return;
      if (e.key === 'ArrowLeft')  basketXRef.current = Math.max(0.05, basketXRef.current - 0.06);
      if (e.key === 'ArrowRight') basketXRef.current = Math.min(0.95, basketXRef.current + 0.06);
    };
    const onMove = (e: MouseEvent) => { if (!runningRef.current) return; const r = c.getBoundingClientRect(); basketXRef.current = Math.max(0.05, Math.min(0.95, (e.clientX - r.left) / r.width)); };
    const onTouch = (e: TouchEvent) => { e.preventDefault(); if (!runningRef.current) return; const r = c.getBoundingClientRect(); basketXRef.current = Math.max(0.05, Math.min(0.95, (e.touches[0].clientX - r.left) / r.width)); };
    window.addEventListener('keydown', onKey);
    c.addEventListener('mousemove', onMove);
    c.addEventListener('touchmove', onTouch, { passive: false });
    return () => { window.removeEventListener('keydown', onKey); c.removeEventListener('mousemove', onMove); c.removeEventListener('touchmove', onTouch); };
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    function comboMult() { const c = comboRef.current; return c >= 20 ? 5 : c >= 10 ? 3 : c >= 5 ? 2 : 1; }
    function comboCol()  { const c = comboRef.current; return c >= 20 ? '#FF6D00' : c >= 10 ? '#E040FB' : c >= 5 ? '#FFD600' : '#4CAF50'; }

    function draw(ts: number) {
      const w = canvas.width;
      const h = canvas.height;
      const bw = BASKET_W_R * w;
      const bh = BASKET_H_R * h;
      const itemSz = ITEM_R * w;

      let sx = 0, sy = 0;
      if (shakeRef.current > 0) {
        sx = (Math.random() - 0.5) * shakeRef.current * 6;
        sy = (Math.random() - 0.5) * shakeRef.current * 6;
        shakeRef.current *= 0.9;
        if (shakeRef.current < 0.05) shakeRef.current = 0;
      }
      ctx.save(); ctx.translate(sx, sy);

      // BG
      ctx.clearRect(-10, -10, w + 20, h + 20);
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#071A07'); bg.addColorStop(1, '#030D03');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      if (frenzyRef.current) { ctx.fillStyle = `rgba(255,109,0,${Math.sin(ts / 150) * 0.08 + 0.05})`; ctx.fillRect(0, 0, w, h); }

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 60) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }

      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

      // Items
      for (const item of itemsRef.current) {
        ctx.save();
        ctx.translate(item.x * w, item.y * h);
        ctx.rotate(item.rotation);
        ctx.scale(item.scale, item.scale);
        if (item.isPowerUp) {
          const p = 1 + Math.sin(ts / 200) * 0.15; ctx.scale(p, p);
          const pc = POWER_COLORS[item.powerType || 'double'];
          ctx.shadowColor = pc; ctx.shadowBlur = 20;
          ctx.beginPath(); ctx.arc(0, 0, itemSz / 2.2, 0, Math.PI * 2); ctx.fillStyle = `${pc}33`; ctx.fill();
        } else if (item.isBad) { ctx.shadowColor = 'rgba(220,30,30,0.7)'; ctx.shadowBlur = 14; ctx.globalAlpha = 0.9; }
        else { ctx.shadowColor = 'rgba(249,168,37,0.4)'; ctx.shadowBlur = 8; }
        ctx.font = `${itemSz}px serif`; ctx.fillText(item.emoji, 0, 0);
        ctx.restore();
      }

      // Particles
      for (const p of particlesRef.current) {
        ctx.save(); ctx.globalAlpha = p.life;
        if (p.emoji) { ctx.font = `${p.size}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(p.emoji, p.x, p.y); }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill(); }
        ctx.restore();
      }
      // Floating texts
      for (const ft of textsRef.current) {
        ctx.save(); ctx.globalAlpha = ft.life;
        ctx.font = `bold ${ft.size}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = ft.color; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y); ctx.restore();
      }

      // Basket
      const bx = basketXRef.current * w - bw / 2;
      const by = h - bh - 14;

      if (shieldRef.current) {
        ctx.save(); ctx.beginPath(); ctx.arc(basketXRef.current * w, by + bh / 2, bw / 1.4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(79,195,247,${0.4 + Math.sin(ts / 200) * 0.2})`; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = 'rgba(79,195,247,0.08)'; ctx.fill(); ctx.restore();
      }
      if (magnetRef.current) {
        ctx.save(); const pr = (60 / BASE_W) * w + Math.sin(ts / 150) * 10;
        ctx.beginPath(); ctx.arc(basketXRef.current * w, by + bh / 2, pr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(224,64,251,${0.2 + Math.sin(ts / 100) * 0.1})`; ctx.lineWidth = 2; ctx.setLineDash([8, 4]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      }

      ctx.shadowColor = shieldRef.current ? 'rgba(79,195,247,0.7)' : 'rgba(31,122,77,0.7)'; ctx.shadowBlur = 18;
      rrect(ctx, bx, by, bw, bh, 10);
      ctx.fillStyle = shieldRef.current ? '#2196F3' : (frenzyRef.current ? '#FF6D00' : '#1F7A4D'); ctx.fill();
      ctx.shadowBlur = 0;
      rrect(ctx, bx + 2, by + 2, bw - 4, 7, 5);
      ctx.fillStyle = shieldRef.current ? '#64B5F6' : (frenzyRef.current ? '#FFA726' : '#2A9D5E'); ctx.fill();
      ctx.font = `${20 * (w / BASE_W)}px serif`; ctx.shadowColor = 'transparent'; ctx.globalAlpha = 1;
      ctx.fillText('🧺', basketXRef.current * w, by + bh / 2 + 2);

      // Combo on canvas
      if (comboRef.current >= 3) {
        ctx.save(); ctx.font = `bold ${14 * (w / BASE_W)}px sans-serif`; ctx.textAlign = 'center';
        ctx.fillStyle = comboCol(); ctx.shadowColor = comboCol(); ctx.shadowBlur = 8;
        ctx.fillText(`${comboRef.current}x COMBO`, w / 2, 24 * (h / BASE_H));
        const m = comboMult();
        if (m > 1) { ctx.font = `bold ${11 * (w / BASE_W)}px sans-serif`; ctx.fillStyle = '#FFD600'; ctx.fillText(`${m}x MULTIPLIER`, w / 2, 40 * (h / BASE_H)); }
        ctx.restore();
      }

      // Level msg
      if (ts < levelMsgEndRef.current) {
        const a = Math.min(1, (levelMsgEndRef.current - ts) / 1500);
        ctx.save(); ctx.globalAlpha = a; ctx.font = `bold ${28 * (w / BASE_W)}px sans-serif`; ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD600'; ctx.shadowColor = '#FFD600'; ctx.shadowBlur = 20;
        ctx.fillText(levelMsgRef.current, w / 2, h / 2 - 20); ctx.restore();
      }

      // Flash
      if (flashRef.current.alpha > 0) {
        ctx.fillStyle = flashRef.current.color.replace(')', `,${flashRef.current.alpha})`).replace('rgb', 'rgba');
        ctx.fillRect(0, 0, w, h);
        flashRef.current.alpha *= 0.88; if (flashRef.current.alpha < 0.02) flashRef.current.alpha = 0;
      }

      ctx.restore();
    }

    function tick(ts: number) {
      if (pausedRef.current) { draw(ts); rafRef.current = requestAnimationFrame(tick); return; }

      if (runningRef.current) {
        const w = canvas.width;
        const h = canvas.height;
        const bw = BASKET_W_R * w;
        const itemSz = ITEM_R * w;

        // Power expiry
        if (shieldRef.current && ts > shieldEndRef.current) { shieldRef.current = false; upPow(); }
        if (magnetRef.current && ts > magnetEndRef.current) { magnetRef.current = false; upPow(); }
        if (doubleRef.current && ts > doubleEndRef.current) { doubleRef.current = false; upPow(); }
        if (frenzyRef.current && ts > frenzyEndRef.current) { frenzyRef.current = false; upPow(); }

        // Combo timeout
        if (comboRef.current > 0 && ts - lastCatchRef.current > COMBO_WINDOW) { comboRef.current = 0; setCombo(0); }

        // Level
        const nl = Math.floor(scoreRef.current / 150) + 1;
        if (nl > levelRef.current) {
          levelRef.current = nl; levelMsgRef.current = `LEVEL ${nl}!`; levelMsgEndRef.current = ts + 2000;
          shakeRef.current = 0.5; flashRef.current = { alpha: 0.3, color: 'rgb(76,175,80)' };
          GameSounds.levelUp(); emit('levelUp', nl);
        }

        // Spawn
        const spawnMs = Math.max(400, BASE_SPAWN_MS - levelRef.current * 40);
        if (ts - lastSpawnRef.current > spawnMs) { itemsRef.current.push(makeItem(scoreRef.current)); lastSpawnRef.current = ts; }
        if (frenzyRef.current && ts - frenzySpawnRef.current > 200) { itemsRef.current.push(makeItem(scoreRef.current)); frenzySpawnRef.current = ts; }

        // Magnet
        if (magnetRef.current) { for (const it of itemsRef.current) { if (!it.isBad && !it.isPowerUp) { it.x += (basketXRef.current - it.x) * 0.04; } } }

        // Update items
        const bxPx = basketXRef.current * w;
        const byPx = h - BASKET_H_R * h - 14;
        const surv: FallingItem[] = [];

        for (const it of itemsRef.current) {
          it.y += it.speed;
          it.rotation += it.rotSpeed;
          const inX = Math.abs(it.x * w - bxPx) < bw / 2 + itemSz / 2.5;
          const inY = it.y * h >= byPx - itemSz / 2 && it.y * h <= byPx + BASKET_H_R * h;

          if (inX && inY) {
            if (it.isPowerUp) {
              activatePow(it.powerType!, ts);
              spawnParticles(it.x * w, it.y * h, POWER_COLORS[it.powerType || 'double'], 12);
              spawnText(it.x * w, it.y * h - 20, it.powerType!.toUpperCase() + '!', POWER_COLORS[it.powerType || 'double'], 18);
              shakeRef.current = 0.6;
              GameSounds.powerUp();
              if (it.powerType === 'frenzy') { GameSounds.frenzy(); emit('frenzy'); }
              emit('powerUp', 0, it.powerType);
            } else if (it.isBad) {
              if (shieldRef.current) {
                shieldRef.current = false; upPow();
                spawnParticles(it.x * w, it.y * h, '#4FC3F7', 10);
                spawnText(it.x * w, it.y * h - 20, 'BLOCKED!', '#4FC3F7', 16);
                flashRef.current = { alpha: 0.2, color: 'rgb(79,195,247)' };
                GameSounds.shieldBlock(); emit('shieldBlock');
              } else {
                livesRef.current = Math.max(0, livesRef.current - 1); setDispLives(livesRef.current);
                comboRef.current = 0; setCombo(0);
                shakeRef.current = 1; flashRef.current = { alpha: 0.4, color: 'rgb(220,30,30)' };
                spawnParticles(it.x * w, it.y * h, '#EF5350', 6);
                spawnText(it.x * w, it.y * h - 20, '-1 LIFE', '#EF5350', 16);
                GameSounds.hit(); emit('hit');
              }
            } else {
              const mult = comboMult();
              const pts = (doubleRef.current ? 20 : 10) * mult;
              scoreRef.current += pts; comboRef.current++; lastCatchRef.current = ts;
              setDispScore(scoreRef.current); setCombo(comboRef.current); cbScore.current(scoreRef.current);
              const col = mult >= 3 ? '#FF6D00' : mult >= 2 ? '#FFD600' : '#4CAF50';
              spawnParticles(it.x * w, it.y * h, col, 4 + mult * 2);
              spawnText(it.x * w, it.y * h - 20, `+${pts}`, col, mult > 1 ? 14 + mult * 2 : 12);
              if (comboRef.current === 5) { spawnEmoji(w / 2, h / 2, '🔥'); GameSounds.combo(5); emit('combo', 5); }
              else if (comboRef.current === 10) { spawnEmoji(w / 2, h / 2, '💥'); GameSounds.combo(10); emit('combo', 10); }
              else if (comboRef.current === 20) { spawnEmoji(w / 2, h / 2, '🏆'); GameSounds.combo(20); emit('combo', 20); }
              else { GameSounds.catch(); }
              emit('catch', pts);
            }
          } else if (it.y * h > h + itemSz) {
            if (!it.isBad && !it.isPowerUp) {
              livesRef.current = Math.max(0, livesRef.current - 1); setDispLives(livesRef.current);
              comboRef.current = 0; setCombo(0);
              flashRef.current = { alpha: 0.15, color: 'rgb(200,50,50)' };
              GameSounds.miss(); emit('miss');
            }
          } else { surv.push(it); }
        }
        itemsRef.current = surv;

        // Particles
        particlesRef.current = particlesRef.current.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 1 / (60 * p.maxLife); return p.life > 0; });
        textsRef.current = textsRef.current.filter(ft => { ft.y -= 1.2; ft.life -= 1 / (60 * ft.maxLife); return ft.life > 0; });

        if (livesRef.current <= 0) {
          runningRef.current = false; setDead(true);
          GameSounds.gameOver(); emit('gameOver', scoreRef.current);
          cbOver.current(scoreRef.current);
        }
      }
      draw(ts);
      rafRef.current = requestAnimationFrame(tick);
    }

    function activatePow(t: string, now: number) {
      const dur = t === 'frenzy' ? FRENZY_DUR : 6000;
      if (t === 'shield') { shieldRef.current = true; shieldEndRef.current = now + dur; }
      if (t === 'magnet') { magnetRef.current = true; magnetEndRef.current = now + dur; }
      if (t === 'double') { doubleRef.current = true; doubleEndRef.current = now + dur; }
      if (t === 'frenzy') { frenzyRef.current = true; frenzyEndRef.current = now + dur; frenzySpawnRef.current = now; }
      upPow();
    }
    function upPow() {
      const p: string[] = [];
      if (shieldRef.current) p.push('shield'); if (magnetRef.current) p.push('magnet');
      if (doubleRef.current) p.push('double'); if (frenzyRef.current) p.push('frenzy');
      setActivePowers([...p]);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spawnParticles, spawnEmoji, spawnText, emit]);

  // Resize canvas when canvasSize changes
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    c.width = canvasSize.w;
    c.height = canvasSize.h;
  }, [canvasSize]);

  const togglePause = () => { const np = !pausedRef.current; pausedRef.current = np; setPaused(np); };

  function getComboMultiplier() { return combo >= 20 ? 5 : combo >= 10 ? 3 : combo >= 5 ? 2 : 1; }
  function getComboColor() { return combo >= 20 ? '#FF6D00' : combo >= 10 ? '#E040FB' : combo >= 5 ? '#FFD600' : '#4CAF50'; }

  return (
    <div ref={wrapRef} className="flex flex-col items-center gap-3 w-full select-none" data-testid="game-canvas-container">
      {/* HUD */}
      <div className="flex items-center justify-between w-full px-1" style={{ maxWidth: canvasSize.w }}>
        <div className="flex gap-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} style={{ opacity: i < dispLives ? 1 : 0.18, transition: 'opacity 0.3s' }} className={isFullscreen ? 'text-3xl' : 'text-2xl'}>
              {i < dispLives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          {activePowers.map(p => (
            <span key={p} className={isFullscreen ? 'text-2xl' : 'text-lg'}
              style={{ filter: `drop-shadow(0 0 6px ${POWER_COLORS[p]})`, animation: 'pulse 1s ease-in-out infinite' }}
              title={p}>{POWER_EMOJIS[p]}</span>
          ))}
        </div>
        <div className={`font-heading font-black text-white tracking-tight ${isFullscreen ? 'text-3xl' : 'text-2xl'}`} data-testid="game-score">
          {dispScore} <span className={`text-mango font-semibold ${isFullscreen ? 'text-base' : 'text-sm'}`}>pts</span>
        </div>
        <button onClick={togglePause} data-testid="game-pause-btn"
          className="text-sm font-semibold text-white/60 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>

      {combo >= 3 && (
        <div className={`flex items-center gap-2 px-4 py-1 rounded-full font-black ${isFullscreen ? 'text-base' : 'text-sm'}`}
          style={{ background: `${getComboColor()}22`, color: getComboColor(), border: `1px solid ${getComboColor()}44`, animation: 'pulse 0.5s ease-in-out infinite' }}
          data-testid="combo-indicator">
          🔥 {combo}x COMBO {getComboMultiplier() > 1 ? `• ${getComboMultiplier()}x POINTS` : ''}
        </div>
      )}

      <div className="relative" style={{ width: canvasSize.w, maxWidth: '100%' }}>
        <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h}
          className="rounded-2xl shadow-2xl cursor-none touch-none w-full" style={{ display: 'block' }} data-testid="game-canvas" />
        {paused && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl gap-4" style={{ background: 'rgba(0,0,0,0.62)' }} data-testid="pause-overlay">
            <div className="text-5xl">⏸</div>
            <p className="font-heading text-white text-xl font-bold">Paused</p>
            <button onClick={togglePause} className="btn-primary px-8" data-testid="resume-btn">▶ Resume</button>
          </div>
        )}
      </div>

      <div className={`flex items-center gap-4 text-white/30 ${isFullscreen ? 'text-xs' : 'text-[10px]'}`}>
        <span>🖱 Mouse</span><span>👆 Touch</span><span>← → Keys</span>
        <span className="text-white/50">|</span>
        <span>🛡️ Shield</span><span>🧲 Magnet</span><span>⭐ 2x</span><span>🌪️ Frenzy</span>
      </div>

      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}`}</style>
    </div>
  );
}
