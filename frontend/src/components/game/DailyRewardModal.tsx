import type { DailyReward } from '../../data/dailyRewards';

interface Props {
  reward: DailyReward;
  streak: number;
  xpEarned: number;
  onClaim: () => void;   // triggers EmailGate if isPremium
  onClose: () => void;
}

export function DailyRewardModal({ reward, streak, xpEarned, onClaim, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.78)' }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center relative"
        style={{ animation: 'fadeInScale 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Day badge */}
        <div
          className="absolute -top-5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black text-white shadow-lg"
          style={{ background: 'linear-gradient(90deg,#1F7A4D,#2A9D5E)' }}
        >
          DAY {streak} STREAK 🔥
        </div>

        <div className="text-7xl mb-3 mt-4" style={{ animation: 'spin 0.6s ease-out' }}>
          {reward.emoji}
        </div>

        <h2 className="font-heading text-2xl font-black text-charcoal mb-1">
          {reward.title}
        </h2>

        <p className="text-charcoal-light text-sm leading-relaxed mb-5">
          {reward.message}
        </p>

        {/* XP reward chip */}
        <div className="inline-flex items-center gap-2 bg-mango/15 text-mango px-4 py-2 rounded-full font-bold text-sm mb-5">
          ⚡ +{xpEarned} XP earned!
        </div>

        {/* Streak dots */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold transition-all"
              style={{
                background: i < streak % 7
                  ? 'linear-gradient(135deg,#1F7A4D,#F9A825)'
                  : 'rgba(0,0,0,0.08)',
                color: i < streak % 7 ? 'white' : '#999',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {reward.isPremium ? (
          <button
            onClick={onClaim}
            className="w-full btn-primary text-base py-3.5 mb-2"
          >
            🎁 Claim Premium Reward
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full btn-primary text-base py-3.5 mb-2"
          >
            🎮 Play & Earn More XP
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full text-xs text-charcoal-light hover:text-charcoal transition-colors py-2"
        >
          Play first →
        </button>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(-20deg) scale(0.8); }
          to   { transform: rotate(0deg) scale(1); }
        }
      `}</style>
    </div>
  );
}
