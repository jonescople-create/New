import { useState, useEffect, useCallback } from 'react';

const API = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL || '';

interface DailyChallenge {
  target_score: number;
  reward_code: string;
  reward_description: string;
  expires_at: string;
  theme: string;
  theme_description: string;
  date: string;
}

interface Props {
  currentScore: number;
  isPlaying: boolean;
  onChallengeComplete: (reward: { code: string; pct: number; description: string }) => void;
}

export function DailyChallengeWidget({ currentScore, isPlaying, onChallengeComplete }: Props) {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    fetch(`${API}/api/game/daily-challenge`)
      .then(r => r.json())
      .then(setChallenge)
      .catch(() => {});
  }, []);

  // Check if already completed today
  useEffect(() => {
    if (!challenge) return;
    const stored = localStorage.getItem('ifg_challenge_completed');
    if (stored === challenge.date) setCompleted(true);
  }, [challenge]);

  // Timer
  useEffect(() => {
    if (!challenge) return;
    const tick = () => {
      const now = new Date().getTime();
      const exp = new Date(challenge.expires_at).getTime();
      const diff = exp - now;
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${h}h ${m}m`);
    };
    tick();
    const iv = setInterval(tick, 60000);
    return () => clearInterval(iv);
  }, [challenge]);

  // Auto-check completion during gameplay
  const checkCompletion = useCallback(async () => {
    if (!challenge || completed) return;
    if (currentScore >= challenge.target_score) {
      setCompleted(true);
      localStorage.setItem('ifg_challenge_completed', challenge.date);
      
      try {
        const playerName = localStorage.getItem('ifg_player_name') || 'Anonymous';
        await fetch(`${API}/api/game/daily-challenge/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score: currentScore, player_name: playerName }),
        });
      } catch { /* ok */ }
      
      onChallengeComplete({
        code: 'CHALLENGE25',
        pct: 25,
        description: '25% off any ebook — Daily Challenge reward!',
      });
    }
  }, [challenge, completed, currentScore, onChallengeComplete]);

  useEffect(() => {
    if (isPlaying && currentScore > 0) checkCompletion();
  }, [currentScore, isPlaying, checkCompletion]);

  if (!challenge) return null;

  const progress = Math.min(100, (currentScore / challenge.target_score) * 100);

  // Compact in-game widget
  if (isPlaying) {
    return (
      <div className="w-full max-w-lg px-1" data-testid="daily-challenge-ingame">
        <div className="bg-white/8 rounded-xl px-3 py-2 border border-white/10 flex items-center gap-3">
          <span className="text-sm">{completed ? '🏆' : '🎯'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{challenge.theme}</span>
              <span className="text-[10px] text-mango font-bold">{currentScore}/{challenge.target_score}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: completed ? '#4CAF50' : progress > 70 ? '#FFD600' : '#F9A825',
                }}
              />
            </div>
          </div>
          {completed && <span className="text-[10px] text-green-400 font-bold">DONE!</span>}
        </div>
      </div>
    );
  }

  // Full widget for start/gameover screen
  return (
    <div
      className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-2xl p-4 w-full max-w-sm border border-orange-400/20"
      data-testid="daily-challenge-widget"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{completed ? '🏆' : '🎯'}</span>
          <div>
            <p className="text-white font-bold text-sm">{challenge.theme}</p>
            <p className="text-white/50 text-[10px]">{challenge.theme_description}</p>
          </div>
        </div>
        <span className="text-white/40 text-[10px]">⏱ {timeLeft}</span>
      </div>

      {completed ? (
        <div className="bg-green-500/15 rounded-xl p-3 border border-green-400/20 text-center">
          <p className="text-green-400 font-bold text-sm mb-1">Challenge Complete!</p>
          <p className="text-white/60 text-xs">You earned code <span className="text-mango font-bold">CHALLENGE25</span> — 25% off any ebook!</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-white/60 text-xs">Target: <span className="text-mango font-bold">{challenge.target_score} pts</span></span>
            <span className="text-white/40 text-[10px]">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #F9A825, #FF6D00)' }}
            />
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Reward</p>
            <p className="text-white text-xs font-semibold">{challenge.reward_description}</p>
          </div>
        </>
      )}
    </div>
  );
}
