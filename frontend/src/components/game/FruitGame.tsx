import { useState, useCallback, useEffect, useRef } from 'react';
import { navigate }           from '../../App';
import { GameCanvas, type GameEvent } from './GameCanvas';
import { RewardModal }        from './RewardModal';
import { DailyRewardModal }   from './DailyRewardModal';
import { Leaderboard }        from './Leaderboard';
import { ProgressBar }        from './ProgressBar';
import { ShareScoreModal }    from './ShareScoreModal';
import { GameSounds }         from './GameSounds';
import { DailyChallengeWidget } from './DailyChallenge';
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
  type DailyCheckResult,
} from '../../data/dailyRewards';
import {
  initFunnel, captureEmail, trackEvent,
  hasCapturedEmail, type FunnelInterest,
  trackBehaviour,
} from '../../utils/funnelTracker';
import {
  ACHIEVEMENTS,
  loadUnlockedAchievements, saveUnlockedAchievements,
  loadGameStats, saveGameStats, checkAchievements,
  type GameStats,
} from '../../data/achievements';

type Screen  = 'start' | 'playing' | 'gameover';
type Overlay = 'none' | 'emailCapture' | 'leadMagnet' | 'offer' | 'daily' | 'share' | 'achievements';

// helpers
function loadUnlocked(): Set<number> {
  try { const r = localStorage.getItem(STORAGE_KEY_REWARDS); return new Set(r ? JSON.parse(r) : []); } catch { return new Set(); }
}
function saveUnlocked(s: Set<number>) { try { localStorage.setItem(STORAGE_KEY_REWARDS, JSON.stringify([...s])); } catch {} }
function saveScore(n: number) { try { localStorage.setItem(STORAGE_KEY_SCORE, String(n)); } catch {} }
function loadScore(): number { try { return parseInt(localStorage.getItem(STORAGE_KEY_SCORE) ?? '0', 10) || 0; } catch { return 0; } }

const STORE_TIPS = [
  { text: 'Did you know? Our Tropical Juice Book has 50 smoothie recipes!', cta: 'See Recipes', path: '/store/tropical-juice-smoothie-recipes' },
  { text: 'Unlock 100+ fruit profiles in the Caribbean Encyclopedia.', cta: 'Explore', path: '/store/caribbean-fruit-guide' },
  { text: 'Fat loss smoothies? We have 30 calorie-counted recipes.', cta: 'Get the Book', path: '/store/fat-loss-smoothies' },
  { text: 'Caribbean healing drinks - 40 traditional remedies inside.', cta: 'Discover', path: '/store/healing-drinks' },
  { text: 'Pre-workout energy? 50 natural fruit-based fuel recipes.', cta: 'Power Up', path: '/store/pre-workout-drinks' },
];

const API = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL || '';

export function FruitGame() {
  const [screen,  setScreen]       = useState<Screen>('start');
  const [score,   setScore]        = useState(0);
  const [highScore, setHighScore]  = useState(loadHighScore);
  const [xp,      setXp]           = useState(loadXP);
  const [unlockedSet, setUnlockedSet] = useState<Set<number>>(loadUnlocked);
  const [overlay, setOverlay]      = useState<Overlay>('none');
  const [activeReward, setActiveReward] = useState<GameReward | null>(null);
  const [pendingRewards, setPending]    = useState<GameReward[]>([]);
  const [dailyResult, setDailyResult]   = useState<DailyCheckResult | null>(null);
  const [capturedEmail, setCapturedEmail] = useState('');
  const [interest, setInterest]    = useState<FunnelInterest>('general');
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [storeTip]                 = useState(() => STORE_TIPS[Math.floor(Math.random() * STORE_TIPS.length)]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [muted, setMuted]          = useState(GameSounds.muted);
  const [gameStats, setGameStats]  = useState<GameStats>(loadGameStats);
  const [achUnlocked, setAchUnlocked] = useState<Set<string>>(loadUnlockedAchievements);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<any[]>([]);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('ifg_player_name') || '');
  const [showNameInput, setShowNameInput] = useState(false);
  const [challengeReward, setChallengeReward] = useState<{ code: string; pct: number; description: string } | null>(null);

  const gate200 = useRef(false);
  const pendingOffer = useRef(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const sessionStats = useRef({ fruitsTotal: 0, powerUps: 0, shields: 0, frenzies: 0, maxCombo: 0, level: 1 });

  // Init
  useEffect(() => {
    initFunnel('game', 'general');
    trackBehaviour('pageView', '/fruit-game');
    const r = checkAndAdvanceDailyReward();
    setDailyResult(r); setXp(loadXP());
    if (r.isNewDay) setOverlay('daily');
    fetchLeaderboard();
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API}/api/game/leaderboard?limit=10`);
      if (res.ok) setGlobalLeaderboard(await res.json());
    } catch { /* offline ok */ }
  };

  // Dequeue rewards
  useEffect(() => {
    if (!activeReward && pendingRewards.length > 0 && overlay === 'none') {
      setActiveReward(pendingRewards[0]);
      setPending(q => q.slice(1));
    }
  }, [activeReward, pendingRewards, overlay]);

  // Game event handler from canvas
  const handleGameEvent = useCallback((e: GameEvent) => {
    if (e.type === 'catch') {
      sessionStats.current.fruitsTotal++;
    }
    if (e.type === 'powerUp') {
      sessionStats.current.powerUps++;
      if (e.powerType === 'frenzy') sessionStats.current.frenzies++;
    }
    if (e.type === 'shieldBlock') sessionStats.current.shields++;
    if (e.type === 'combo' && e.value && e.value > sessionStats.current.maxCombo) {
      sessionStats.current.maxCombo = e.value;
    }
    if (e.type === 'levelUp' && e.value) sessionStats.current.level = e.value;
  }, []);

  // Score change
  const handleScoreChange = useCallback((s: number) => {
    setScore(s);
    saveScore(Math.max(s, loadScore()));
    setXp(addXP(1));

    if (s >= 200 && !gate200.current && !hasCapturedEmail()) {
      gate200.current = true; setInterest('smoothies'); setOverlay('emailCapture');
    }

    setUnlockedSet(prev => {
      const toShow = GAME_REWARDS.filter(r => s >= r.threshold && !prev.has(r.threshold));
      if (!toShow.length) return prev;
      const next = new Set(prev);
      toShow.forEach(r => next.add(r.threshold));
      saveUnlocked(next); trackEvent('rewardUnlocked');
      setPending(q => [...q, ...toShow]);
      return next;
    });
  }, []);

  // Game over
  const handleGameOver = useCallback((finalScore: number) => {
    const best = saveHighScore(finalScore);
    setHighScore(best); saveScore(best);
    setGamesPlayed(g => g + 1);
    trackBehaviour('gameCompleted', String(finalScore));
    if (finalScore >= 300)      setInterest('healing');
    else if (finalScore >= 200) setInterest('smoothies');
    else if (finalScore >= 100) setInterest('energy');

    // Update persistent stats
    const prev = loadGameStats();
    const updated: GameStats = {
      score: finalScore,
      highScore: Math.max(prev.highScore, finalScore),
      combo: 0,
      maxCombo: Math.max(prev.maxCombo, sessionStats.current.maxCombo),
      fruitsTotal: prev.fruitsTotal + sessionStats.current.fruitsTotal,
      gamesPlayed: prev.gamesPlayed + 1,
      powerUpsCollected: prev.powerUpsCollected + sessionStats.current.powerUps,
      shieldsUsed: prev.shieldsUsed + sessionStats.current.shields,
      frenziesTriggered: prev.frenziesTriggered + sessionStats.current.frenzies,
      level: Math.max(prev.level, sessionStats.current.level),
    };
    saveGameStats(updated);
    setGameStats(updated);

    // Check achievements
    const newAch = checkAchievements(updated, achUnlocked);
    if (newAch.length > 0) {
      const next = new Set(achUnlocked);
      newAch.forEach(id => next.add(id));
      saveUnlockedAchievements(next);
      setAchUnlocked(next);
      setNewAchievements(newAch);
      GameSounds.achievement();
    }

    // Reset session stats
    sessionStats.current = { fruitsTotal: 0, powerUps: 0, shields: 0, frenzies: 0, maxCombo: 0, level: 1 };

    setScreen('gameover');
  }, [achUnlocked]);

  // Submit to global leaderboard
  const submitToLeaderboard = async () => {
    if (!playerName.trim()) { setShowNameInput(true); return; }
    localStorage.setItem('ifg_player_name', playerName);
    try {
      await fetch(`${API}/api/game/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name: playerName, score, level: sessionStats.current.level || gameStats.level, achievements: achUnlocked.size }),
      });
      fetchLeaderboard();
    } catch { /* offline ok */ }
    setShowNameInput(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    GameSounds.warmUp();
    GameSounds.click();
    try {
      if (!document.fullscreenElement && gameContainerRef.current) {
        await gameContainerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch { /* not supported */ }
  };

  const toggleMute = () => { const m = GameSounds.toggle(); setMuted(m); };

  const startGame = () => {
    GameSounds.warmUp(); GameSounds.click();
    setScore(0); gate200.current = false;
    sessionStats.current = { fruitsTotal: 0, powerUps: 0, shields: 0, frenzies: 0, maxCombo: 0, level: 1 };
    setNewAchievements([]);
    setScreen('playing');
  };

  const handleEmailCaptured = (email: string) => { setCapturedEmail(email); captureEmail(email, 'game', interest); setOverlay('leadMagnet'); pendingOffer.current = true; };
  const handleLeadMagnetClose = () => { setOverlay(pendingOffer.current ? 'offer' : 'none'); pendingOffer.current = false; };
  const handleDailyClaim = () => { if (dailyResult?.reward.isPremium && !hasCapturedEmail()) setOverlay('emailCapture'); else setOverlay('none'); };
  const handleChallengeComplete = useCallback((reward: { code: string; pct: number; description: string }) => {
    setChallengeReward(reward);
    GameSounds.achievement();
  }, []);

  const Milestones = () => (
    <div className="w-full max-w-sm">
      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2 text-center">Unlock milestones</p>
      <div className="flex justify-between gap-1">
        {GAME_REWARDS.map(r => {
          const done = unlockedSet.has(r.threshold);
          return (
            <div key={r.threshold} className="flex-1 flex flex-col items-center gap-0.5">
              <span className="text-lg" style={{ opacity: done ? 1 : 0.22 }}>{r.emoji}</span>
              <span className="text-[9px] font-bold" style={{ color: done ? '#F9A825' : 'rgba(255,255,255,0.22)' }}>{r.threshold}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      ref={gameContainerRef}
      className={`flex flex-col items-center ${isFullscreen ? 'fixed inset-0 z-[100]' : 'min-h-screen'}`}
      style={{ background: 'linear-gradient(160deg,#071A07 0%,#0A2010 60%,#031003 100%)' }}
      data-testid="fruit-game-page"
    >
      {/* Nav */}
      <div className={`w-full px-4 pt-3 pb-2 flex items-center justify-between ${isFullscreen ? 'max-w-none' : 'max-w-2xl'}`}>
        {!isFullscreen && (
          <button onClick={() => navigate('/')} data-testid="game-home-btn"
            className="text-white/50 hover:text-white text-sm flex items-center gap-1 transition-colors">← Home</button>
        )}
        <h1 className={`font-heading font-black text-white ${isFullscreen ? 'text-xl' : 'text-lg'}`}>🌴 Fruit Catcher</h1>
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} data-testid="mute-btn"
            className="text-white/40 hover:text-white text-sm transition-colors" title={muted ? 'Unmute' : 'Mute'}>
            {muted ? '🔇' : '🔊'}
          </button>
          <button onClick={toggleFullscreen} data-testid="fullscreen-btn"
            className="text-white/40 hover:text-white text-sm transition-colors" title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {isFullscreen ? '⊡' : '⛶'}
          </button>
          {!isFullscreen && (
            <button onClick={() => navigate('/store')} data-testid="game-store-btn"
              className="text-mango hover:text-yellow-300 text-sm font-semibold transition-colors">Store →</button>
          )}
        </div>
      </div>

      <div className={`w-full px-4 pb-8 flex flex-col items-center gap-4 ${isFullscreen ? 'flex-1 justify-center max-w-none' : 'max-w-2xl'}`}
        style={isFullscreen ? { overflow: 'hidden' } : {}}>

        {/* ── START ── */}
        {screen === 'start' && (
          <div className="flex flex-col items-center text-center pt-4 gap-5 w-full" data-testid="game-start-screen" style={isFullscreen ? { maxHeight: '100%', overflow: 'auto' } : {}}>
            <div className="text-7xl" style={{ animation: 'bounce 1.2s infinite' }}>🥭</div>
            <div>
              <h2 className="font-heading text-4xl font-black text-white mb-1">Fruit Catcher</h2>
              <p className="text-white/60 text-sm max-w-xs">
                Catch fruits, build combos, collect power-ups &amp; unlock exclusive deals!
              </p>
            </div>
            <div className="w-full max-w-sm"><ProgressBar xp={xp} /></div>
            <Leaderboard currentScore={loadScore()} unlockedCount={unlockedSet.size} streak={dailyResult?.streak ?? 0} />

            {/* Daily Challenge */}
            <DailyChallengeWidget currentScore={0} isPlaying={false} onChallengeComplete={handleChallengeComplete} />

            {/* Achievements summary */}
            <button onClick={() => setOverlay('achievements')} data-testid="view-achievements-btn"
              className="bg-white/8 rounded-2xl p-3 w-full max-w-sm border border-white/10 hover:border-mango/30 transition-colors text-left">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Achievements</span>
                <span className="text-mango font-bold text-sm">{achUnlocked.size}/{ACHIEVEMENTS.length}</span>
              </div>
              <div className="flex gap-1 mt-2">
                {ACHIEVEMENTS.slice(0, 8).map(a => (
                  <span key={a.id} className="text-lg" style={{ opacity: achUnlocked.has(a.id) ? 1 : 0.15 }}>{a.emoji}</span>
                ))}
                {ACHIEVEMENTS.length > 8 && <span className="text-white/30 text-xs self-center">+{ACHIEVEMENTS.length - 8}</span>}
              </div>
            </button>

            {/* Global leaderboard */}
            {globalLeaderboard.length > 0 && (
              <div className="bg-white/8 rounded-2xl p-4 w-full max-w-sm border border-white/10">
                <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2 text-center">Global Top Scores</p>
                <div className="space-y-1">
                  {globalLeaderboard.slice(0, 5).map((entry, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-white/60"><span className="text-mango font-bold mr-2">{i + 1}.</span>{entry.player_name}</span>
                      <span className="text-white font-bold">{entry.score} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to play */}
            <div className="bg-white/8 rounded-2xl p-4 w-full max-w-sm text-left space-y-1.5 border border-white/10">
              <p className="text-white font-bold text-xs mb-2">How to Play:</p>
              {[['🖱️ / 👆','Move mouse or drag'],['← →','Arrow keys'],['🥭 🍍 🥥','+10 pts (combos = more!)'],['🪲 💀','Avoid pests (-1 life)'],['❤️❤️❤️','3 lives']].map(([i,t]) => (
                <div key={i} className="flex items-center gap-3 text-xs text-white/70">
                  <span className="w-14 text-center flex-shrink-0 text-white/50">{i}</span><span>{t}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-2 mt-2">
                <p className="text-white font-bold text-xs mb-1.5">Power-Ups:</p>
                {[['🛡️','Shield — absorb 1 hit'],['🧲','Magnet — attract fruits'],['⭐','Double — 2x base points'],['🌪️','Frenzy — fruit rain!']].map(([i,t]) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-white/70">
                    <span className="w-14 text-center flex-shrink-0">{i}</span><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <Milestones />
            <div className="flex gap-3 w-full max-w-xs">
              <button onClick={startGame} className="btn-primary text-lg px-8 py-4 flex-1" data-testid="play-now-btn">🎮 Play Now!</button>
              <button onClick={() => { startGame(); toggleFullscreen(); }}
                className="btn-secondary text-lg px-4 py-4" data-testid="play-fullscreen-btn" title="Play Fullscreen">⛶</button>
            </div>
            {(dailyResult?.streak ?? 0) > 0 && (
              <p className="text-orange-400 text-xs font-bold">🔥 {dailyResult!.streak}-day streak!</p>
            )}
          </div>
        )}

        {/* ── PLAYING ── */}
        {screen === 'playing' && (
          <div className={`flex flex-col items-center gap-3 w-full ${isFullscreen ? 'flex-1 justify-center' : ''}`}>
            {!isFullscreen && <div className="w-full max-w-lg"><ProgressBar xp={xp} compact /></div>}
            <DailyChallengeWidget currentScore={score} isPlaying={true} onChallengeComplete={handleChallengeComplete} />
            <GameCanvas
              onScoreChange={handleScoreChange}
              onGameOver={handleGameOver}
              onEvent={handleGameEvent}
              isFullscreen={isFullscreen}
            />
          </div>
        )}

        {/* ── GAME OVER ── */}
        {screen === 'gameover' && (
          <div className="flex flex-col items-center text-center pt-4 gap-4 w-full" data-testid="game-over-screen"
            style={isFullscreen ? { maxHeight: '100%', overflow: 'auto' } : {}}>
            <div className="text-5xl">{score >= 500 ? '🏆' : score >= 200 ? '🌴' : score >= 100 ? '🎯' : '💀'}</div>
            <h2 className="font-heading text-2xl font-black text-white">
              {score >= 500 ? 'LEGENDARY!' : score >= 200 ? 'Great Run!' : score >= 100 ? 'Nice Try!' : 'Game Over!'}
            </h2>

            {/* Score card */}
            <div className="bg-white/8 rounded-2xl p-4 w-full max-w-sm border border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Final Score</span>
                <span className="font-heading font-black text-2xl text-mango" data-testid="final-score">{score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">High Score</span>
                <span className="font-bold text-white text-lg">
                  {highScore}
                  {score >= highScore && score > 0 && <span className="ml-2 text-yellow-400 text-xs font-black">NEW!</span>}
                </span>
              </div>
              <div className="border-t border-white/10 pt-2"><ProgressBar xp={xp} compact /></div>
            </div>

            {/* New achievements */}
            {newAchievements.length > 0 && (
              <div className="bg-gradient-to-r from-mango/15 to-leaf/15 rounded-2xl p-4 w-full max-w-sm border border-mango/30" data-testid="new-achievements">
                <p className="text-mango text-xs font-bold uppercase tracking-wider mb-2">New Achievements Unlocked!</p>
                {newAchievements.map(id => {
                  const ach = ACHIEVEMENTS.find(a => a.id === id);
                  return ach ? (
                    <div key={id} className="flex items-center gap-3 py-1">
                      <span className="text-2xl">{ach.emoji}</span>
                      <div className="text-left">
                        <p className="text-white font-bold text-sm">{ach.title}</p>
                        <p className="text-white/50 text-xs">{ach.description}</p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* Challenge reward earned */}
            {challengeReward && (
              <div className="bg-gradient-to-r from-orange-500/15 to-yellow-500/15 rounded-2xl p-4 w-full max-w-sm border border-orange-400/30" data-testid="challenge-reward-earned">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <p className="text-white font-black text-sm">Daily Challenge Complete!</p>
                    <p className="text-white/60 text-xs">{challengeReward.description}</p>
                  </div>
                </div>
                <div className="bg-charcoal/50 rounded-xl px-4 py-2 text-center">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Your Reward Code</p>
                  <span className="font-heading font-black text-2xl text-mango tracking-widest">{challengeReward.code}</span>
                </div>
                <button
                  onClick={() => setOverlay('offer')}
                  className="w-full mt-3 bg-gradient-to-r from-orange-500 to-amber-500 text-charcoal font-bold text-sm py-2.5 rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all"
                  data-testid="use-challenge-code-btn"
                >
                  🎁 Use Code — {challengeReward.pct}% OFF
                </button>
              </div>
            )}

            {/* Submit to leaderboard */}
            <div className="bg-white/8 rounded-2xl p-4 w-full max-w-sm border border-white/10">
              {showNameInput ? (
                <div className="flex gap-2">
                  <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)}
                    placeholder="Your name" maxLength={20}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 outline-none focus:border-mango/50"
                    data-testid="player-name-input" autoFocus onKeyDown={e => e.key === 'Enter' && submitToLeaderboard()} />
                  <button onClick={submitToLeaderboard} className="bg-mango text-charcoal font-bold px-4 py-2 rounded-lg text-sm" data-testid="submit-name-btn">Go</button>
                </div>
              ) : (
                <button onClick={submitToLeaderboard} className="w-full text-center text-mango hover:text-yellow-300 font-bold text-sm transition-colors" data-testid="submit-score-btn">
                  📊 Submit to Global Leaderboard {playerName ? `as ${playerName}` : ''}
                </button>
              )}
            </div>

            {/* Store tip */}
            <div className="bg-gradient-to-r from-mango/15 to-leaf/15 rounded-2xl p-3 w-full max-w-sm border border-mango/20">
              <p className="text-white/80 text-xs leading-relaxed mb-1">{storeTip.text}</p>
              <button onClick={() => navigate(storeTip.path)} className="text-mango hover:text-yellow-300 text-xs font-bold transition-colors" data-testid="store-tip-cta">
                {storeTip.cta} →
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <div className="flex gap-2">
                <button onClick={startGame} className="btn-primary text-base py-3 flex-1" data-testid="play-again-btn">🎮 Again</button>
                <button onClick={() => setOverlay('share')} className="btn-secondary text-base py-3 flex-1" data-testid="share-btn">📤 Share</button>
              </div>

              {gamesPlayed > 0 && gamesPlayed % 2 === 0 && score >= 50 && (
                <button onClick={() => setOverlay('offer')}
                  className="bg-gradient-to-r from-mango to-amber-500 text-charcoal font-bold text-sm py-2.5 rounded-xl" data-testid="deal-btn">
                  🎁 Your Deal — 20% OFF!
                </button>
              )}
              <button onClick={() => navigate('/store')} className="btn-secondary text-sm py-2.5" data-testid="visit-store-btn">🛍️ Visit Store</button>
              {score >= 100 && (
                <button onClick={() => setOverlay('offer')} className="text-mango hover:text-yellow-300 text-xs font-semibold transition-colors py-1">🎁 Personalised deal →</button>
              )}
              <button onClick={() => setScreen('start')} className="text-white/40 hover:text-white/70 text-xs transition-colors">← Menu</button>
            </div>
          </div>
        )}
      </div>

      {/* ── OVERLAYS ── */}
      {overlay === 'daily' && dailyResult && (
        <DailyRewardModal reward={dailyResult.reward} streak={dailyResult.streak} xpEarned={dailyResult.reward.xpBonus} onClaim={handleDailyClaim} onClose={() => setOverlay('none')} />
      )}
      {overlay === 'emailCapture' && (
        <EmailCaptureOverlay source="game" interest={interest} onComplete={handleEmailCaptured} onSkip={() => setOverlay('none')}
          headline="🌴 Unlock Your Free Recipes!" subline="Enter your email to get 5 free Caribbean recipes + exclusive ebook deals." />
      )}
      {overlay === 'leadMagnet' && (
        <LeadMagnet email={capturedEmail} onClose={handleLeadMagnetClose} onViewStore={() => { setOverlay('none'); navigate('/store'); }} />
      )}
      {overlay === 'offer' && (
        <OfferModal interest={interest} gameScore={score} onClose={() => setOverlay('none')}
          challengeReward={challengeReward || undefined} />
      )}
      {overlay === 'share' && (
        <ShareScoreModal score={score} highScore={highScore} level={gameStats.level} achievementCount={achUnlocked.size} onClose={() => setOverlay('none')} playerEmail={capturedEmail} playerName={playerName} />
      )}
      {overlay === 'achievements' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.82)' }} onClick={() => setOverlay('none')}>
          <div className="bg-[#0A1F0A] rounded-3xl shadow-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto border border-white/10"
            onClick={e => e.stopPropagation()} data-testid="achievements-modal">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-black text-white">Achievements</h3>
              <span className="text-mango font-bold text-sm">{achUnlocked.size}/{ACHIEVEMENTS.length}</span>
            </div>
            <div className="space-y-3">
              {ACHIEVEMENTS.map(a => {
                const done = achUnlocked.has(a.id);
                return (
                  <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${done ? 'bg-mango/10 border border-mango/20' : 'bg-white/5 border border-white/5 opacity-50'}`}>
                    <span className="text-2xl">{a.emoji}</span>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{a.title}</p>
                      <p className="text-white/50 text-xs">{a.description}</p>
                    </div>
                    {done && <span className="text-mango text-xs font-bold">✓</span>}
                  </div>
                );
              })}
            </div>
            <button onClick={() => setOverlay('none')} className="mt-4 w-full btn-primary py-2.5 text-sm">Close</button>
          </div>
        </div>
      )}

      {activeReward && overlay === 'none' && <RewardModal reward={activeReward} onClose={() => setActiveReward(null)} />}
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
    </div>
  );
}
