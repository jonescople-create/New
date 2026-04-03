import { useState, useCallback, useEffect, useRef } from 'react';
import { navigate }           from '../../App';
import { GameCanvas }         from './GameCanvas';
import { RewardModal }        from './RewardModal';
import { DailyRewardModal }   from './DailyRewardModal';
import { Leaderboard }        from './Leaderboard';
import { ProgressBar }        from './ProgressBar';
import { EmailCaptureOverlay } from '../funnel/EmailCapture';
import { LeadMagnet }         from '../funnel/LeadMagnet';
import { OfferModal }         from '../funnel/OfferModal';
import {
  GAME_REWARDS, STORAGE_KEY_SCORE, STORAGE_KEY_REWARDS, type GameReward,
} from '../../data/gameRewards';
import {
  checkAndAdvanceDailyReward,
  loadHighScore, saveHighScore,
  loadXP, addXP,
  hasEmail,
  type DailyCheckResult,
} from '../../data/dailyRewards';
import {
  initFunnel, captureEmail, trackEvent, trackProductView,
  hasCapturedEmail, inferInterest, type FunnelInterest,
  trackBehaviour,
} from '../../utils/funnelTracker';

type Screen   = 'start' | 'playing' | 'gameover';
type Overlay  = 'none' | 'emailCapture' | 'leadMagnet' | 'offer' | 'daily';

// ── localStorage helpers ──────────────────────────────────────────────────────
function loadUnlocked(): Set<number> {
  try { const r = localStorage.getItem(STORAGE_KEY_REWARDS); return new Set(r ? JSON.parse(r) : []); }
  catch { return new Set(); }
}
function saveUnlocked(s: Set<number>) {
  try { localStorage.setItem(STORAGE_KEY_REWARDS, JSON.stringify([...s])); } catch { /* */ }
}
function saveScore(n: number) {
  try { localStorage.setItem(STORAGE_KEY_SCORE, String(n)); } catch { /* */ }
}
function loadScore(): number {
  try { return parseInt(localStorage.getItem(STORAGE_KEY_SCORE) ?? '0', 10) || 0; } catch { return 0; }
}

// Tips to show between games that drive to store
const STORE_TIPS = [
  { text: 'Did you know? Our Tropical Juice Book has 50 smoothie recipes!', cta: 'See Recipes', path: '/store/tropical-juice-smoothie-recipes' },
  { text: 'Unlock 100+ fruit profiles in the Caribbean Encyclopedia.', cta: 'Explore', path: '/store/caribbean-fruit-guide' },
  { text: 'Fat loss smoothies? We have 30 calorie-counted recipes.', cta: 'Get the Book', path: '/store/fat-loss-smoothie-recipes' },
  { text: 'Caribbean healing drinks - 40 traditional remedies inside.', cta: 'Discover', path: '/store/healing-drinks-recipes' },
  { text: 'Pre-workout energy? 50 natural fruit-based fuel recipes.', cta: 'Power Up', path: '/store/pre-workout-energy-recipes' },
];

export function FruitGame() {
  const [screen,         setScreen]        = useState<Screen>('start');
  const [score,          setScore]         = useState(0);
  const [highScore,      setHighScore]     = useState(loadHighScore);
  const [xp,             setXp]            = useState(loadXP);
  const [unlockedSet,    setUnlockedSet]   = useState<Set<number>>(loadUnlocked);
  const [overlay,        setOverlay]       = useState<Overlay>('none');
  const [activeReward,   setActiveReward]  = useState<GameReward | null>(null);
  const [pendingRewards, setPending]       = useState<GameReward[]>([]);
  const [dailyResult,    setDailyResult]   = useState<DailyCheckResult | null>(null);
  const [capturedEmail,  setCapturedEmail] = useState('');
  const [interest,       setInterest]      = useState<FunnelInterest>('general');
  const [gamesPlayed,    setGamesPlayed]   = useState(0);
  const [storeTip]                         = useState(() => STORE_TIPS[Math.floor(Math.random() * STORE_TIPS.length)]);
  const gate200 = useRef(false);
  const pendingOffer = useRef(false);

  // ── Init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    initFunnel('game', 'general');
    trackBehaviour('pageView', '/fruit-game');
    const r = checkAndAdvanceDailyReward();
    setDailyResult(r);
    setXp(loadXP());
    if (r.isNewDay) setOverlay('daily');
  }, []);

  // ── Dequeue reward modals ─────────────────────────────────────────────────
  useEffect(() => {
    if (activeReward === null && pendingRewards.length > 0 && overlay === 'none') {
      setActiveReward(pendingRewards[0]);
      setPending(q => q.slice(1));
    }
  }, [activeReward, pendingRewards, overlay]);

  // ── Score handler ─────────────────────────────────────────────────────────
  const handleScoreChange = useCallback((s: number) => {
    setScore(s);
    saveScore(Math.max(s, loadScore()));
    const newXp = addXP(1);
    setXp(newXp);

    // Email gate at 200 — only if email not yet captured
    if (s >= 200 && !gate200.current && !hasCapturedEmail()) {
      gate200.current = true;
      setInterest('smoothies');
      setOverlay('emailCapture');
    }

    // Score-threshold rewards
    setUnlockedSet(prev => {
      const toShow = GAME_REWARDS.filter(r => s >= r.threshold && !prev.has(r.threshold));
      if (!toShow.length) return prev;
      const next = new Set(prev);
      toShow.forEach(r => next.add(r.threshold));
      saveUnlocked(next);
      trackEvent('rewardUnlocked');
      setPending(q => [...q, ...toShow]);
      return next;
    });
  }, []);

  // ── Game over ─────────────────────────────────────────────────────────────
  const handleGameOver = useCallback((finalScore: number) => {
    const best = saveHighScore(finalScore);
    setHighScore(best);
    saveScore(best);
    setGamesPlayed(g => g + 1);
    trackBehaviour('gameCompleted', String(finalScore));
    if (finalScore >= 300)      setInterest('healing');
    else if (finalScore >= 200) setInterest('smoothies');
    else if (finalScore >= 100) setInterest('energy');
    setScreen('gameover');
  }, []);

  // ── Email captured ────────────────────────────────────────────────────────
  const handleEmailCaptured = (email: string) => {
    setCapturedEmail(email);
    captureEmail(email, 'game', interest);
    setOverlay('leadMagnet');
    pendingOffer.current = true;
  };

  // ── Lead magnet closed ────────────────────────────────────────────────────
  const handleLeadMagnetClose = () => {
    setOverlay(pendingOffer.current ? 'offer' : 'none');
    pendingOffer.current = false;
  };

  // ── Daily reward claim ────────────────────────────────────────────────────
  const handleDailyClaim = () => {
    if (dailyResult?.reward.isPremium && !hasCapturedEmail()) {
      setOverlay('emailCapture');
    } else {
      setOverlay('none');
    }
  };

  // ── Reward closed ─────────────────────────────────────────────────────────
  const closeReward = () => setActiveReward(null);

  // ── Milestone strip ───────────────────────────────────────────────────────
  const Milestones = () => (
    <div className="w-full max-w-sm">
      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2 text-center">
        Unlock milestones
      </p>
      <div className="flex justify-between gap-1">
        {GAME_REWARDS.map(r => {
          const done = unlockedSet.has(r.threshold);
          return (
            <div key={r.threshold} className="flex-1 flex flex-col items-center gap-0.5">
              <span className="text-lg" style={{ opacity: done ? 1 : 0.22, transition: 'all 0.3s' }}>{r.emoji}</span>
              <span className="text-[9px] font-bold"
                style={{ color: done ? '#F9A825' : 'rgba(255,255,255,0.22)' }}>
                {r.threshold}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ background: 'linear-gradient(160deg,#071A07 0%,#0A2010 60%,#031003 100%)' }}
      data-testid="fruit-game-page"
    >
      {/* Nav */}
      <div className="w-full max-w-2xl px-4 pt-6 pb-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} data-testid="game-home-btn"
          className="text-white/50 hover:text-white text-sm flex items-center gap-1 transition-colors">
          ← Home
        </button>
        <h1 className="font-heading text-lg font-black text-white">🌴 Fruit Catcher</h1>
        <button onClick={() => navigate('/store')} data-testid="game-store-btn"
          className="text-mango hover:text-yellow-300 text-sm font-semibold transition-colors">
          Store →
        </button>
      </div>

      <div className="w-full max-w-2xl px-4 pb-12 flex flex-col items-center gap-4">

        {/* ── START ── */}
        {screen === 'start' && (
          <div className="flex flex-col items-center text-center pt-4 gap-5 w-full" data-testid="game-start-screen">
            <div className="text-7xl" style={{ animation: 'bounce 1.2s infinite' }}>🥭</div>
            <div>
              <h2 className="font-heading text-4xl font-black text-white mb-1">Fruit Catcher</h2>
              <p className="text-white/60 text-sm max-w-xs">
                Catch fruits, build combos, collect power-ups &amp; unlock exclusive ebook deals!
              </p>
            </div>
            <div className="w-full max-w-sm"><ProgressBar xp={xp} /></div>
            <Leaderboard currentScore={loadScore()} unlockedCount={unlockedSet.size} streak={dailyResult?.streak ?? 0} />
            
            {/* Power-ups legend */}
            <div className="bg-white/8 rounded-2xl p-4 w-full max-w-sm text-left space-y-1.5 border border-white/10">
              <p className="text-white font-bold text-xs mb-2">How to Play:</p>
              {[
                ['🖱️ / 👆','Move mouse or drag'],
                ['← →','Arrow keys'],
                ['🥭 🍍 🥥','+10 pts (combos = more!)'],
                ['🪲 💀','Avoid pests (-1 life)'],
                ['❤️❤️❤️','3 lives'],
              ].map(([i,t]) => (
                <div key={i} className="flex items-center gap-3 text-xs text-white/70">
                  <span className="w-14 text-center flex-shrink-0 text-white/50">{i}</span><span>{t}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-2 mt-2">
                <p className="text-white font-bold text-xs mb-1.5">Power-Ups:</p>
                {[
                  ['🛡️','Shield — absorb 1 hit'],
                  ['🧲','Magnet — attract fruits'],
                  ['⭐','Double — 2x base points'],
                  ['🌪️','Frenzy — fruit rain!'],
                ].map(([i,t]) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-white/70">
                    <span className="w-14 text-center flex-shrink-0">{i}</span><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Milestones />
            <button onClick={() => { setScore(0); gate200.current = false; setScreen('playing'); }}
              className="btn-primary text-lg px-12 py-4 w-full max-w-xs" data-testid="play-now-btn">
              🎮 Play Now!
            </button>
            {(dailyResult?.streak ?? 0) > 0 && (
              <p className="text-orange-400 text-xs font-bold">
                🔥 {dailyResult!.streak}-day streak! Come back tomorrow to keep it going.
              </p>
            )}
          </div>
        )}

        {/* ── PLAYING ── */}
        {screen === 'playing' && (
          <>
            <div className="w-full max-w-lg"><ProgressBar xp={xp} compact /></div>
            <GameCanvas onScoreChange={handleScoreChange} onGameOver={handleGameOver} />
          </>
        )}

        {/* ── GAME OVER ── */}
        {screen === 'gameover' && (
          <div className="flex flex-col items-center text-center pt-6 gap-5 w-full" data-testid="game-over-screen">
            <div className="text-6xl">{score >= 500 ? '🏆' : score >= 200 ? '🌴' : score >= 100 ? '🎯' : '💀'}</div>
            <h2 className="font-heading text-3xl font-black text-white">
              {score >= 500 ? 'LEGENDARY!' : score >= 200 ? 'Great Run!' : score >= 100 ? 'Nice Try!' : 'Game Over!'}
            </h2>

            {/* Score card */}
            <div className="bg-white/8 rounded-2xl p-5 w-full max-w-sm border border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Final Score</span>
                <span className="font-heading font-black text-3xl text-mango" data-testid="final-score">{score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">High Score</span>
                <span className="font-bold text-white text-lg">
                  {highScore}
                  {score >= highScore && score > 0 && <span className="ml-2 text-yellow-400 text-xs font-black">NEW BEST!</span>}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">XP Earned</span>
                <span className="font-bold text-mango">+{score} XP</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <ProgressBar xp={xp} compact />
              </div>
            </div>

            {/* Store tip - contextual sales push */}
            <div className="bg-gradient-to-r from-mango/15 to-leaf/15 rounded-2xl p-4 w-full max-w-sm border border-mango/20">
              <p className="text-white/80 text-xs leading-relaxed mb-2">{storeTip.text}</p>
              <button
                onClick={() => navigate(storeTip.path)}
                className="text-mango hover:text-yellow-300 text-xs font-bold transition-colors"
                data-testid="store-tip-cta"
              >
                {storeTip.cta} →
              </button>
            </div>

            {/* Rewards */}
            <div className="bg-white/8 rounded-2xl p-4 w-full max-w-sm border border-white/10">
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Rewards</p>
              <div className="flex justify-center gap-3">
                {GAME_REWARDS.map(r => (
                  <div key={r.threshold} className="flex flex-col items-center gap-0.5">
                    <span className="text-xl" style={{ opacity: unlockedSet.has(r.threshold) ? 1 : 0.18 }}>{r.emoji}</span>
                    <span className="text-[9px]" style={{ color: unlockedSet.has(r.threshold) ? '#F9A825' : 'rgba(255,255,255,0.2)' }}>{r.threshold}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next milestone */}
            {(() => { const next = GAME_REWARDS.find(r => !unlockedSet.has(r.threshold));
              return next ? (
                <p className="text-white/50 text-xs">
                  Next reward at <span className="text-mango font-bold">{next.threshold} pts</span> — {next.title}
                </p>
              ) : null;
            })()}

            {/* Action buttons */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button onClick={() => { setScore(0); gate200.current = false; setScreen('playing'); }}
                className="btn-primary text-lg py-3.5" data-testid="play-again-btn">🎮 Play Again</button>
              
              {/* Offer after every 2 games */}
              {gamesPlayed > 0 && gamesPlayed % 2 === 0 && score >= 50 && (
                <button onClick={() => setOverlay('offer')}
                  className="bg-gradient-to-r from-mango to-amber-500 text-charcoal font-bold text-base py-3 rounded-xl hover:from-amber-500 hover:to-mango transition-all"
                  data-testid="deal-btn"
                >
                  🎁 Your Personalised Deal — 20% OFF!
                </button>
              )}
              
              <button onClick={() => navigate('/store')} className="btn-secondary text-base py-3" data-testid="visit-store-btn">
                🛍️ Visit the Store
              </button>
              
              {score >= 100 && (
                <button onClick={() => setOverlay('offer')}
                  className="text-mango hover:text-yellow-300 text-sm font-semibold transition-colors py-1">
                  🎁 See your personalised deal →
                </button>
              )}
              <button onClick={() => setScreen('start')} className="text-white/40 hover:text-white/70 text-xs transition-colors">
                ← Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── OVERLAYS ── */}
      {overlay === 'daily' && dailyResult && (
        <DailyRewardModal
          reward={dailyResult.reward}
          streak={dailyResult.streak}
          xpEarned={dailyResult.reward.xpBonus}
          onClaim={handleDailyClaim}
          onClose={() => setOverlay('none')}
        />
      )}

      {overlay === 'emailCapture' && (
        <EmailCaptureOverlay
          source="game"
          interest={interest}
          onComplete={handleEmailCaptured}
          onSkip={() => setOverlay('none')}
          headline="🌴 Unlock Your Free Recipes!"
          subline="Enter your email to get 5 free Caribbean recipes + exclusive ebook deals."
        />
      )}

      {overlay === 'leadMagnet' && (
        <LeadMagnet
          email={capturedEmail}
          onClose={handleLeadMagnetClose}
          onViewStore={() => { setOverlay('none'); navigate('/store'); }}
        />
      )}

      {overlay === 'offer' && (
        <OfferModal
          interest={interest}
          gameScore={score}
          onClose={() => setOverlay('none')}
        />
      )}

      {activeReward && overlay === 'none' && (
        <RewardModal reward={activeReward} onClose={closeReward} />
      )}

      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
    </div>
  );
}
