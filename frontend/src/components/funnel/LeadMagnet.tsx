import { navigate } from '../../App';
import { trackEvent } from '../../utils/funnelTracker';

interface Props {
  email: string;
  onClose: () => void;
  onViewStore?: () => void;
}

const FREE_RECIPES = [
  {
    emoji: '🥭',
    name: 'Mango Power Blast',
    tag: 'Pre-Workout',
    tagColor: '#39FF14',
    tagBg: 'rgba(57,255,20,0.12)',
    desc: 'Banana · Mango · Coconut Water · Ginger',
    tip: 'Consume 30 min before training for best results.',
  },
  {
    emoji: '🍍',
    name: 'Pineapple Ginger Ignite',
    tag: 'Anti-Inflammatory',
    tagColor: '#FF6D00',
    tagBg: 'rgba(255,109,0,0.12)',
    desc: 'Pineapple Core · Ginger · Lime · Cayenne',
    tip: 'Bromelain in the core reduces post-workout soreness.',
  },
  {
    emoji: '🥥',
    name: 'Coconut Electrolyte Drink',
    tag: 'Hydration',
    tagColor: '#00BCD4',
    tagBg: 'rgba(0,188,212,0.12)',
    desc: 'Coconut Water · Lime · Orange · Sea Salt · Honey',
    tip: 'Contains 3× more potassium than a leading sports drink.',
  },
  {
    emoji: '🍌',
    name: 'Banana Recovery Bowl',
    tag: 'Post-Workout',
    tagColor: '#F9A825',
    tagBg: 'rgba(249,168,37,0.12)',
    desc: 'Papaya · Banana · Yogurt · Honey · Pumpkin Seeds',
    tip: 'Papain enzyme in papaya speeds muscle protein repair.',
  },
  {
    emoji: '🌴',
    name: 'Soursop Slim Shake',
    tag: 'Fat Loss',
    tagColor: '#FF4081',
    tagBg: 'rgba(255,64,129,0.12)',
    desc: 'Soursop · Coconut Water · Spinach · Ginger · Lime',
    tip: 'Only 155 calories. Thylakoids in spinach suppress appetite for 3–4h.',
  },
];

export function LeadMagnet({ email, onClose, onViewStore }: Props) {
  const handleStore = () => {
    trackEvent('offerShown');
    onClose();
    if (onViewStore) onViewStore();
    else navigate('/store');
  };

  trackEvent('leadMagnetDelivered');

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.82)' }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto relative"
        style={{ animation: 'funnelPop 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-8 pt-8 pb-4 border-b border-gray-100 z-10">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-2xl leading-none">×</button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-leaf/10 flex items-center justify-center text-xl flex-shrink-0">🎁</div>
            <div>
              <p className="font-heading text-lg font-black text-charcoal">Your 5 Free Recipes Are Ready!</p>
              <p className="text-xs text-charcoal-light">
                Sent to <span className="font-semibold text-leaf">{email}</span> · Also previewed below
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-leaf/8 text-leaf text-xs font-bold px-3 py-1 rounded-full">
            ✓ Check your inbox — delivery is instant
          </div>
        </div>

        {/* Recipes */}
        <div className="px-8 py-5 space-y-4">
          {FREE_RECIPES.map((r, i) => (
            <div key={r.name} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-leaf/30 transition-colors">
              <div className="text-3xl flex-shrink-0 w-10 text-center">{r.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-charcoal text-sm">{r.name}</span>
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-full"
                    style={{ color: r.tagColor, backgroundColor: r.tagBg }}
                  >
                    {r.tag}
                  </span>
                </div>
                <p className="text-xs text-charcoal-light mb-1.5">{r.desc}</p>
                <p className="text-[10px] text-leaf italic">{r.tip}</p>
              </div>
              <div className="flex-shrink-0 text-charcoal-light/30 font-black text-lg self-center">
                {i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Upsell footer */}
        <div className="sticky bottom-0 bg-white rounded-b-3xl px-8 pb-8 pt-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-leaf/8 to-mango/8 rounded-2xl p-4 mb-4 border border-leaf/15">
            <p className="text-xs text-charcoal-light mb-1">
              <span className="font-bold text-charcoal">Want 50+ more?</span> These 5 recipes are a taste of our full ebook collection — 13 books, 300+ recipes, available in the store.
            </p>
          </div>
          <button onClick={handleStore} className="w-full btn-primary py-3.5 text-base mb-2">
            🛍️ Browse the Full Store
          </button>
          <button onClick={onClose} className="w-full text-xs text-charcoal-light hover:text-charcoal text-center transition-colors py-1.5">
            I'll browse later →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes funnelPop {
          from { opacity:0; transform:scale(0.9) translateY(16px); }
          to   { opacity:1; transform:scale(1)   translateY(0);    }
        }
      `}</style>
    </div>
  );
}
