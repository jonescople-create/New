import { loadHighScore } from '../../data/dailyRewards';
import { GAME_REWARDS } from '../../data/gameRewards';

interface Props {
  currentScore: number;
  unlockedCount: number;
  streak: number;
}

export function Leaderboard({ currentScore, unlockedCount, streak }: Props) {
  const highScore = loadHighScore();
  const isNewRecord = currentScore > 0 && currentScore >= highScore;

  return (
    <div className="w-full max-w-lg bg-white/8 rounded-2xl p-4 border border-white/10">
      <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-3 text-center">
        📊 Your Stats
      </p>

      <div className="grid grid-cols-4 gap-2">
        {/* Current score */}
        <div className="text-center">
          <p className="text-white/50 text-[9px] uppercase tracking-wider mb-1">Score</p>
          <p className="font-heading font-black text-mango text-lg leading-none">
            {currentScore}
          </p>
        </div>

        {/* High score */}
        <div className="text-center">
          <p className="text-white/50 text-[9px] uppercase tracking-wider mb-1">Best</p>
          <p className={`font-heading font-black text-lg leading-none ${isNewRecord ? 'text-yellow-300' : 'text-white'}`}>
            {highScore}
          </p>
          {isNewRecord && (
            <p className="text-yellow-400 text-[8px] font-bold mt-0.5">NEW!</p>
          )}
        </div>

        {/* Rewards */}
        <div className="text-center">
          <p className="text-white/50 text-[9px] uppercase tracking-wider mb-1">Rewards</p>
          <p className="font-heading font-black text-leaf-light text-lg leading-none">
            {unlockedCount}/{GAME_REWARDS.length}
          </p>
        </div>

        {/* Daily streak */}
        <div className="text-center">
          <p className="text-white/50 text-[9px] uppercase tracking-wider mb-1">Streak</p>
          <p className="font-heading font-black text-orange-400 text-lg leading-none">
            {streak}🔥
          </p>
        </div>
      </div>
    </div>
  );
}
