import { navigate } from '../../App';
import type { GameReward } from '../../data/gameRewards';

interface Props {
  reward: GameReward;
  onClose: () => void;
}

// Product-linked messaging per threshold
const PRODUCT_HINTS: Record<number, { hint: string; storeLabel: string }> = {
  50:  { hint: 'This recipe is from our Mango Recipe Collection ebook. Get all 15 mango recipes.',         storeLabel: 'Get Mango Recipes →' },
  100: { hint: 'This smoothie tip is from our Tropical Juice & Smoothie Book. 50 full recipes inside.',   storeLabel: 'Get the Smoothie Book →' },
  200: { hint: 'Unlock the full Caribbean Fruit Encyclopedia — 100+ fruit profiles, history & recipes.',   storeLabel: 'Explore the Encyclopedia →' },
  300: { hint: 'The full Medicinal Leaves Guide has 39 traditional Caribbean healing plants explained.',    storeLabel: 'See Medicinal Guide →' },
  500: { hint: 'You\'ve unlocked everything here. The full store has 13 ebooks waiting for you.', storeLabel: 'Browse Full Store →' },
};

export function RewardModal({ reward, onClose }: Props) {
  const hint = PRODUCT_HINTS[reward.threshold];

  const handleCta = () => {
    onClose();
    navigate(reward.ctaPath);
  };

  const handleStore = () => {
    onClose();
    navigate('/store');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.78)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 text-2xl leading-none transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        {/* Emoji */}
        <div className="text-7xl mb-3 animate-bounce">{reward.emoji}</div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-mango/15 text-mango px-4 py-1.5 rounded-full text-sm font-bold mb-4">
          🎯 {reward.threshold} Points Unlocked!
        </div>

        <h2 className="font-heading text-2xl font-black text-charcoal mb-2">
          {reward.title}
        </h2>

        <p className="text-charcoal-light text-sm leading-relaxed mb-4">
          {reward.message}
        </p>

        {/* Product hint box */}
        {hint && (
          <div className="bg-leaf/8 border border-leaf/20 rounded-xl p-4 mb-5 text-left">
            <p className="text-xs text-leaf font-bold mb-1">📚 From our store:</p>
            <p className="text-xs text-charcoal-light leading-relaxed">{hint.hint}</p>
          </div>
        )}

        {/* Primary CTA → specific product */}
        <button
          onClick={handleCta}
          className="w-full btn-primary text-base py-3.5 mb-2"
        >
          {reward.cta}
        </button>

        {/* Secondary CTA → always /store */}
        <button
          onClick={handleStore}
          className="w-full bg-mango/10 text-charcoal font-semibold text-sm py-2.5 rounded-xl hover:bg-mango/20 transition-colors mb-2"
        >
          🛍️ Browse Full Store
        </button>

        {/* Keep playing */}
        <button
          onClick={onClose}
          className="w-full text-xs text-charcoal-light hover:text-charcoal transition-colors py-2"
        >
          Keep Playing →
        </button>
      </div>
    </div>
  );
}
