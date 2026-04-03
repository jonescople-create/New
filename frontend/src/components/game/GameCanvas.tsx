import { useEffect, useRef, useState, useCallback } from 'react';
import { FRUIT_EMOJIS, BAD_EMOJIS } from '../../data/gameRewards';

// ── Types ──────────────────────────────────────────────────────────────────────
interface FallingItem {
  id: number;
  x: number;       // 0–1 relative to canvas width
  y: number;       // pixels
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
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  emoji?: string;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const BASKET_W     = 84;
const BASKET_H     = 38;
const ITEM_SIZE    = 36;
const CANVAS_W     = 480;
const CANVAS_H     = 460;
const BASE_SPAWN_MS = 850;
const MAX_LIVES    = 3;
const COMBO_WINDOW_MS = 1200; // ms to keep combo alive
const FRENZY_DURATION = 5000; // ms

const POWER_EMOJIS: Record<string, string> = {
  shield: '🛡️',
  magnet: '🧲',
  frenzy: '🌪️',
  double: '⭐',
};

const POWER_COLORS: Record<string, string> = {
  shield: '#4FC3F7',
  magnet: '#E040FB',
  frenzy: '#FF6D00',
  double: '#FFD600',
};

let _id = 0;

function makeItem(score: number, forcePowerUp = false): FallingItem {
  // Power-up chance increases with score
  const powerChance = forcePowerUp ? 1 : Math.min(0.12, 0.02 + score / 3000);
  const isPowerUp = Math.random() < powerChance;
  
  if (isPowerUp) {
    const types: Array<'shield' | 'magnet' | 'frenzy' | 'double'> = ['shield', 'magnet', 'frenzy', 'double'];
    const powerType = types[Math.floor(Math.random() * types.length)];
    return {
      id: ++_id,
      x: 0.08 + Math.random() * 0.84,
      y: -ITEM_SIZE,
      speed: 1.8 + Math.random() * 1.0,
      emoji: POWER_EMOJIS[powerType],
      isBad: false,
      isPowerUp: true,
      powerType,
      scale: 1.2,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.08,
    };
  }

  const badChance = Math.min(0.30, 0.06 + score / 1500);
  const isBad = Math.random() < badChance;
  const pool = isBad ? BAD_EMOJIS : FRUIT_EMOJIS;
  return {
    id: ++_id,
    x: 0.06 + Math.random() * 0.88,
    y: -ITEM_SIZE,
    speed: 2.2 + Math.random() * 1.8 + score / 400,
    emoji: pool[Math.floor(Math.random() * pool.length)],
    isBad,
    isPowerUp: false,
    scale: 1,
    rotation: 0,
    rotSpeed: isBad ? (Math.random() - 0.5) * 0.12 : 0,
  };
}

// ── roundRect polyfill ─────────────────────────────────────────────────────────
function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  onScoreChange: (s: number) => void;
  onGameOver:    (s: number) => void;
}

export function GameCanvas({ onScoreChange, onGameOver }: Props) {
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
  cbScore.current    = onScoreChange;
  cbOver.current     = onGameOver;

  // Enhanced game state refs
  const comboRef     = useRef(0);
  const lastCatchRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const textsRef     = useRef<FloatingText[]>([]);
  const shakeRef     = useRef(0);
  const flashRef     = useRef({ alpha: 0, color: '' });
  const shieldRef    = useRef(false);
  const shieldEndRef = useRef(0);
  const magnetRef    = useRef(false);
  const magnetEndRef = useRef(0);
  const doubleRef    = useRef(false);
  const doubleEndRef = useRef(0);
  const frenzyRef    = useRef(false);
  const frenzyEndRef = useRef(0);
  const frenzySpawnRef = useRef(0);
  const levelRef     = useRef(1);
  const levelMsgRef  = useRef('');
  const levelMsgEndRef = useRef(0);
  const totalCaughtRef = useRef(0);

  // Display state
  const [dispScore, setDispScore] = useState(0);
  const [dispLives, setDispLives] = useState(MAX_LIVES);
  const [paused, setPaused]       = useState(false);
  const [dead, setDead]           = useState(false);
  const [combo, setCombo]         = useState(0);
  const [activePowers, setActivePowers] = useState<string[]>([]);

  // ── Particle spawn helpers ──────────────────────────────────────────────────
  const spawnCatchParticles = useCallback((x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * (2 + Math.random() * 3),
        vy: Math.sin(angle) * (2 + Math.random() * 3) - 2,
        life: 1,
        maxLife: 0.6 + Math.random() * 0.4,
        color,
        size: 3 + Math.random() * 4,
      });
    }
  }, []);

  const spawnEmojiParticle = useCallback((x: number, y: number, emoji: string) => {
    particlesRef.current.push({
      x, y,
      vx: (Math.random() - 0.5) * 2,
      vy: -3 - Math.random() * 2,
      life: 1,
      maxLife: 1.2,
      color: '',
      size: 24,
      emoji,
    });
  }, []);

  const spawnFloatingText = useCallback((x: number, y: number, text: string, color: string, size = 16) => {
    textsRef.current.push({ x, y, text, color, life: 1, maxLife: 1.0, size });
  }, []);

  // ── Input handlers ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onKey = (e: KeyboardEvent) => {
      if (!runningRef.current) return;
      const step = 0.06;
      if (e.key === 'ArrowLeft')  basketXRef.current = Math.max(0.05, basketXRef.current - step);
      if (e.key === 'ArrowRight') basketXRef.current = Math.min(0.95, basketXRef.current + step);
    };
    const onMouse = (e: MouseEvent) => {
      if (!runningRef.current) return;
      const r = canvas.getBoundingClientRect();
      basketXRef.current = Math.max(0.05, Math.min(0.95, (e.clientX - r.left) / r.width));
    };
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (!runningRef.current) return;
      const r = canvas.getBoundingClientRect();
      basketXRef.current = Math.max(0.05, Math.min(0.95, (e.touches[0].clientX - r.left) / r.width));
    };
    window.addEventListener('keydown', onKey);
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('touchmove', onTouch, { passive: false });
    return () => {
      window.removeEventListener('keydown', onKey);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('touchmove', onTouch);
    };
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    function getComboMultiplier(): number {
      const c = comboRef.current;
      if (c >= 20) return 5;
      if (c >= 10) return 3;
      if (c >= 5)  return 2;
      return 1;
    }

    function getComboColor(): string {
      const c = comboRef.current;
      if (c >= 20) return '#FF6D00';
      if (c >= 10) return '#E040FB';
      if (c >= 5)  return '#FFD600';
      return '#4CAF50';
    }

    function drawFrame(ts: number) {
      const w = CANVAS_W;
      const h = CANVAS_H;

      // Screen shake offset
      let shakeX = 0, shakeY = 0;
      if (shakeRef.current > 0) {
        shakeX = (Math.random() - 0.5) * shakeRef.current * 6;
        shakeY = (Math.random() - 0.5) * shakeRef.current * 6;
        shakeRef.current *= 0.9;
        if (shakeRef.current < 0.05) shakeRef.current = 0;
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Background
      ctx.clearRect(-10, -10, w + 20, h + 20);
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#071A07');
      bg.addColorStop(1, '#030D03');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Frenzy background effect
      if (frenzyRef.current) {
        const pulse = Math.sin(ts / 150) * 0.08 + 0.05;
        ctx.fillStyle = `rgba(255, 109, 0, ${pulse})`;
        ctx.fillRect(0, 0, w, h);
      }

      // Subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 60) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }

      // Falling items
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      for (const item of itemsRef.current) {
        ctx.save();
        ctx.translate(item.x * w, item.y);
        ctx.rotate(item.rotation);
        ctx.scale(item.scale, item.scale);
        
        if (item.isPowerUp) {
          // Pulsing glow for power-ups
          const pulse = 1 + Math.sin(ts / 200) * 0.15;
          ctx.scale(pulse, pulse);
          const pColor = POWER_COLORS[item.powerType || 'double'];
          ctx.shadowColor = pColor;
          ctx.shadowBlur = 20;
          // Draw circle behind
          ctx.beginPath();
          ctx.arc(0, 0, ITEM_SIZE / 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${pColor}33`;
          ctx.fill();
        } else if (item.isBad) {
          ctx.shadowColor = 'rgba(220,30,30,0.7)';
          ctx.shadowBlur = 14;
          ctx.globalAlpha = 0.9;
        } else {
          ctx.shadowColor = 'rgba(249,168,37,0.4)';
          ctx.shadowBlur = 8;
        }

        ctx.font = `${ITEM_SIZE}px serif`;
        ctx.fillText(item.emoji, 0, 0);
        ctx.restore();
      }

      // Particles
      for (const p of particlesRef.current) {
        ctx.save();
        ctx.globalAlpha = p.life;
        if (p.emoji) {
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
        ctx.restore();
      }

      // Floating texts
      for (const ft of textsRef.current) {
        ctx.save();
        ctx.globalAlpha = ft.life;
        ctx.font = `bold ${ft.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = ft.color;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      // Basket
      const bx = basketXRef.current * w - BASKET_W / 2;
      const by = h - BASKET_H - 14;

      // Shield visual
      if (shieldRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(basketXRef.current * w, by + BASKET_H / 2, BASKET_W / 1.4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(79, 195, 247, ${0.4 + Math.sin(ts / 200) * 0.2})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(79, 195, 247, 0.08)';
        ctx.fill();
        ctx.restore();
      }

      // Magnet visual
      if (magnetRef.current) {
        ctx.save();
        const pulseR = 60 + Math.sin(ts / 150) * 10;
        ctx.beginPath();
        ctx.arc(basketXRef.current * w, by + BASKET_H / 2, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(224, 64, 251, ${0.2 + Math.sin(ts / 100) * 0.1})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Basket glow
      ctx.shadowColor = shieldRef.current ? 'rgba(79,195,247,0.7)' : 'rgba(31,122,77,0.7)';
      ctx.shadowBlur = 18;

      // Basket body
      roundedRect(ctx, bx, by, BASKET_W, BASKET_H, 10);
      ctx.fillStyle = shieldRef.current ? '#2196F3' : (frenzyRef.current ? '#FF6D00' : '#1F7A4D');
      ctx.fill();

      // Rim
      ctx.shadowBlur = 0;
      roundedRect(ctx, bx + 2, by + 2, BASKET_W - 4, 7, 5);
      ctx.fillStyle = shieldRef.current ? '#64B5F6' : (frenzyRef.current ? '#FFA726' : '#2A9D5E');
      ctx.fill();

      // Basket emoji
      ctx.font = '20px serif';
      ctx.shadowColor = 'transparent';
      ctx.globalAlpha = 1;
      ctx.fillText('🧺', basketXRef.current * w, by + BASKET_H / 2 + 2);

      // Combo meter on canvas
      if (comboRef.current >= 3) {
        const comboText = `${comboRef.current}x COMBO`;
        const mult = getComboMultiplier();
        ctx.save();
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = getComboColor();
        ctx.shadowColor = getComboColor();
        ctx.shadowBlur = 8;
        ctx.fillText(comboText, w / 2, 24);
        if (mult > 1) {
          ctx.font = 'bold 11px sans-serif';
          ctx.fillStyle = '#FFD600';
          ctx.fillText(`${mult}x MULTIPLIER`, w / 2, 40);
        }
        ctx.restore();
      }

      // Level announcement
      if (ts < levelMsgEndRef.current) {
        const alpha = Math.min(1, (levelMsgEndRef.current - ts) / 1500);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD600';
        ctx.shadowColor = '#FFD600';
        ctx.shadowBlur = 20;
        ctx.fillText(levelMsgRef.current, w / 2, h / 2 - 20);
        ctx.restore();
      }

      // Flash overlay
      if (flashRef.current.alpha > 0) {
        ctx.fillStyle = flashRef.current.color.replace(')', `,${flashRef.current.alpha})`).replace('rgb', 'rgba');
        ctx.fillRect(0, 0, w, h);
        flashRef.current.alpha *= 0.88;
        if (flashRef.current.alpha < 0.02) flashRef.current.alpha = 0;
      }

      ctx.restore(); // undo screen shake
    }

    function tick(ts: number) {
      if (pausedRef.current) {
        drawFrame(ts);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (runningRef.current) {
        const w = CANVAS_W;
        const h = CANVAS_H;
        const now = ts;

        // Check power-up expirations
        if (shieldRef.current && now > shieldEndRef.current) {
          shieldRef.current = false;
          updatePowerDisplay();
        }
        if (magnetRef.current && now > magnetEndRef.current) {
          magnetRef.current = false;
          updatePowerDisplay();
        }
        if (doubleRef.current && now > doubleEndRef.current) {
          doubleRef.current = false;
          updatePowerDisplay();
        }
        if (frenzyRef.current && now > frenzyEndRef.current) {
          frenzyRef.current = false;
          updatePowerDisplay();
        }

        // Combo timeout
        if (comboRef.current > 0 && now - lastCatchRef.current > COMBO_WINDOW_MS) {
          comboRef.current = 0;
          setCombo(0);
        }

        // Level progression
        const newLevel = Math.floor(scoreRef.current / 150) + 1;
        if (newLevel > levelRef.current) {
          levelRef.current = newLevel;
          levelMsgRef.current = `LEVEL ${newLevel}!`;
          levelMsgEndRef.current = now + 2000;
          shakeRef.current = 0.5;
          flashRef.current = { alpha: 0.3, color: 'rgb(76, 175, 80)' };
        }

        // Spawn rate decreases with level (more items)
        const spawnMs = Math.max(400, BASE_SPAWN_MS - levelRef.current * 40);

        // Regular spawn
        if (now - lastSpawnRef.current > spawnMs) {
          itemsRef.current.push(makeItem(scoreRef.current));
          lastSpawnRef.current = now;
        }

        // Frenzy extra spawns
        if (frenzyRef.current && now - frenzySpawnRef.current > 200) {
          itemsRef.current.push(makeItem(scoreRef.current));
          frenzySpawnRef.current = now;
        }

        // Magnet effect - attract fruits toward basket
        if (magnetRef.current) {
          for (const item of itemsRef.current) {
            if (!item.isBad && !item.isPowerUp) {
              const dx = basketXRef.current - item.x;
              item.x += dx * 0.04;
            }
          }
        }

        // Update items
        const bx = basketXRef.current * w;
        const by = h - BASKET_H - 14;
        const survivors: FallingItem[] = [];

        for (const item of itemsRef.current) {
          item.y += item.speed;
          item.rotation += item.rotSpeed;

          const inX = Math.abs(item.x * w - bx) < BASKET_W / 2 + ITEM_SIZE / 2.5;
          const inY = item.y >= by - ITEM_SIZE / 2 && item.y <= by + BASKET_H;

          if (inX && inY) {
            // Caught!
            if (item.isPowerUp) {
              activatePowerUp(item.powerType!, now);
              spawnCatchParticles(item.x * w, item.y, POWER_COLORS[item.powerType || 'double'], 12);
              spawnFloatingText(item.x * w, item.y - 20, item.powerType!.toUpperCase() + '!', POWER_COLORS[item.powerType || 'double'], 18);
              shakeRef.current = 0.6;
            } else if (item.isBad) {
              if (shieldRef.current) {
                // Shield absorbs hit
                shieldRef.current = false;
                updatePowerDisplay();
                spawnCatchParticles(item.x * w, item.y, '#4FC3F7', 10);
                spawnFloatingText(item.x * w, item.y - 20, 'BLOCKED!', '#4FC3F7', 16);
                flashRef.current = { alpha: 0.2, color: 'rgb(79, 195, 247)' };
              } else {
                livesRef.current = Math.max(0, livesRef.current - 1);
                setDispLives(livesRef.current);
                comboRef.current = 0;
                setCombo(0);
                shakeRef.current = 1;
                flashRef.current = { alpha: 0.4, color: 'rgb(220, 30, 30)' };
                spawnCatchParticles(item.x * w, item.y, '#EF5350', 6);
                spawnFloatingText(item.x * w, item.y - 20, '-1 LIFE', '#EF5350', 16);
              }
            } else {
              // Good catch!
              const mult = getComboMultiplier();
              const basePoints = doubleRef.current ? 20 : 10;
              const points = basePoints * mult;
              scoreRef.current += points;
              comboRef.current++;
              lastCatchRef.current = now;
              totalCaughtRef.current++;
              
              setDispScore(scoreRef.current);
              setCombo(comboRef.current);
              cbScore.current(scoreRef.current);

              // Visual feedback
              const color = mult >= 3 ? '#FF6D00' : (mult >= 2 ? '#FFD600' : '#4CAF50');
              spawnCatchParticles(item.x * w, item.y, color, 4 + mult * 2);
              
              if (mult > 1) {
                spawnFloatingText(item.x * w, item.y - 20, `+${points}`, color, 14 + mult * 2);
              } else {
                spawnFloatingText(item.x * w, item.y - 20, `+${points}`, '#4CAF50', 12);
              }
              
              // Bonus emoji particles on high combo
              if (comboRef.current === 5) spawnEmojiParticle(w / 2, h / 2, '🔥');
              if (comboRef.current === 10) spawnEmojiParticle(w / 2, h / 2, '💥');
              if (comboRef.current === 20) spawnEmojiParticle(w / 2, h / 2, '🏆');
            }
          } else if (item.y > h + ITEM_SIZE) {
            // Missed
            if (!item.isBad && !item.isPowerUp) {
              livesRef.current = Math.max(0, livesRef.current - 1);
              setDispLives(livesRef.current);
              comboRef.current = 0;
              setCombo(0);
              flashRef.current = { alpha: 0.15, color: 'rgb(200, 50, 50)' };
            }
          } else {
            survivors.push(item);
          }
        }

        itemsRef.current = survivors;

        // Update particles
        particlesRef.current = particlesRef.current.filter(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15; // gravity
          p.life -= 1 / (60 * p.maxLife);
          return p.life > 0;
        });

        // Update floating texts
        textsRef.current = textsRef.current.filter(ft => {
          ft.y -= 1.2;
          ft.life -= 1 / (60 * ft.maxLife);
          return ft.life > 0;
        });

        // Game over
        if (livesRef.current <= 0) {
          runningRef.current = false;
          setDead(true);
          cbOver.current(scoreRef.current);
        }
      }

      drawFrame(ts);
      rafRef.current = requestAnimationFrame(tick);
    }

    function activatePowerUp(type: string, now: number) {
      const duration = type === 'frenzy' ? FRENZY_DURATION : 6000;
      switch (type) {
        case 'shield':
          shieldRef.current = true;
          shieldEndRef.current = now + duration;
          break;
        case 'magnet':
          magnetRef.current = true;
          magnetEndRef.current = now + duration;
          break;
        case 'double':
          doubleRef.current = true;
          doubleEndRef.current = now + duration;
          break;
        case 'frenzy':
          frenzyRef.current = true;
          frenzyEndRef.current = now + duration;
          frenzySpawnRef.current = now;
          break;
      }
      updatePowerDisplay();
    }

    function updatePowerDisplay() {
      const powers: string[] = [];
      if (shieldRef.current) powers.push('shield');
      if (magnetRef.current) powers.push('magnet');
      if (doubleRef.current) powers.push('double');
      if (frenzyRef.current) powers.push('frenzy');
      setActivePowers([...powers]);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spawnCatchParticles, spawnEmojiParticle, spawnFloatingText]);

  const togglePause = () => {
    if (dead) return;
    const nowPaused = !pausedRef.current;
    pausedRef.current = nowPaused;
    setPaused(nowPaused);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full select-none" data-testid="game-canvas-container">

      {/* HUD */}
      <div className="flex items-center justify-between w-full max-w-lg px-1">
        <div className="flex gap-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} style={{ opacity: i < dispLives ? 1 : 0.18, transition: 'opacity 0.3s' }} className="text-2xl">
              {i < dispLives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
        
        {/* Active power-ups */}
        <div className="flex gap-1">
          {activePowers.map(p => (
            <span
              key={p}
              className="text-lg"
              style={{ 
                filter: 'drop-shadow(0 0 6px ' + POWER_COLORS[p] + ')',
                animation: 'pulse 1s ease-in-out infinite'
              }}
              title={p}
            >
              {POWER_EMOJIS[p]}
            </span>
          ))}
        </div>

        <div className="font-heading text-2xl font-black text-white tracking-tight" data-testid="game-score">
          {dispScore} <span className="text-sm text-mango font-semibold">pts</span>
        </div>
        <button
          onClick={togglePause}
          data-testid="game-pause-btn"
          className="text-sm font-semibold text-white/60 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>

      {/* Combo indicator */}
      {combo >= 3 && (
        <div 
          className="flex items-center gap-2 px-4 py-1 rounded-full font-black text-sm"
          style={{
            background: `${getComboColor()}22`,
            color: getComboColor(),
            border: `1px solid ${getComboColor()}44`,
            animation: 'pulse 0.5s ease-in-out infinite'
          }}
          data-testid="combo-indicator"
        >
          🔥 {combo}x COMBO {getComboMultiplier() > 1 ? `• ${getComboMultiplier()}x POINTS` : ''}
        </div>
      )}

      {/* Canvas */}
      <div className="relative w-full" style={{ maxWidth: CANVAS_W }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-2xl shadow-2xl cursor-none touch-none w-full"
          style={{ display: 'block' }}
          data-testid="game-canvas"
        />

        {paused && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl gap-4"
            style={{ background: 'rgba(0,0,0,0.62)' }}
            data-testid="pause-overlay"
          >
            <div className="text-5xl">⏸</div>
            <p className="font-heading text-white text-xl font-bold">Paused</p>
            <button onClick={togglePause} className="btn-primary px-8" data-testid="resume-btn">▶ Resume</button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-[10px] text-white/30">
        <span>🖱 Mouse</span>
        <span>👆 Touch</span>
        <span>← → Keys</span>
        <span className="text-white/50">|</span>
        <span>🛡️ Shield</span>
        <span>🧲 Magnet</span>
        <span>⭐ 2x</span>
        <span>🌪️ Frenzy</span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );

  function getComboMultiplier(): number {
    if (combo >= 20) return 5;
    if (combo >= 10) return 3;
    if (combo >= 5)  return 2;
    return 1;
  }

  function getComboColor(): string {
    if (combo >= 20) return '#FF6D00';
    if (combo >= 10) return '#E040FB';
    if (combo >= 5)  return '#FFD600';
    return '#4CAF50';
  }
}
