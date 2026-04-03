import { useState } from 'react';
import { navigate } from '../../App';
import { products } from '../../data/products';
import { trackEvent, getRecommendedSlug, hasCapturedEmail, type FunnelInterest } from '../../utils/funnelTracker';

interface Props {
  interest:   FunnelInterest;
  onClose:    () => void;
  gameScore?: number;
  challengeReward?: { code: string; pct: number; description: string };
}

const OFFER_CONFIG: Record<FunnelInterest, { badge: string; hook: string; emoji: string }> = {
  smoothies:    { badge: '🍹 Smoothie Lover',     hook: 'You clearly love tropical blends. Get 50 full smoothie recipes.',       emoji: '🥭' },
  'fat-loss':   { badge: '🌿 Wellness Seeker',    hook: 'Fat loss with Caribbean fruits — 30 satisfying smoothie recipes.',      emoji: '🍉' },
  healing:      { badge: '💚 Healing Explorer',   hook: 'Discover 40 traditional Caribbean healing tonics and herbal drinks.',   emoji: '🌿' },
  energy:       { badge: '⚡ Energy Athlete',     hook: '50+ natural energy recipes — no synthetic powders needed.',             emoji: '🍌' },
  desserts:     { badge: '🍮 Dessert Fan',        hook: '60 tropical fruit dessert recipes, from mousse to cheesecake.',        emoji: '🍊' },
  recipes:      { badge: '🍹 Recipe Explorer',    hook: 'The perfect Caribbean recipe pack for your favourite fruit.',           emoji: '🥥' },
  encyclopedia: { badge: '📚 Knowledge Seeker',   hook: 'The complete Caribbean fruit guide — 100+ fruits, history & science.', emoji: '📖' },
  general:      { badge: '🌴 Caribbean Fan',      hook: 'Start your Caribbean fruit journey with our #1 bestselling ebook.',    emoji: '🥭' },
};

export function OfferModal({ interest, onClose, gameScore, challengeReward }: Props) {
  const [codeCopied, setCodeCopied] = useState(false);
  
  const cfg  = OFFER_CONFIG[interest];
  const slug = getRecommendedSlug(interest);
  const prod = products.find(p => p.slug === slug);

  if (!prod) { onClose(); return null; }

  // Determine which discount to show
  const hasIFG20 = hasCapturedEmail();
  const discountCode = challengeReward?.code || (hasIFG20 ? 'IFG20' : '');
  const discountPct = challengeReward?.pct || (hasIFG20 ? 20 : 0);
  const discountedPrice = discountPct > 0 ? (prod.price * (1 - discountPct / 100)).toFixed(2) : prod.price.toFixed(2);
  const saving = discountPct > 0 ? (prod.price * discountPct / 100).toFixed(2) : '0.00';

  const handleCta = () => {
    trackEvent('purchaseIntent');
    onClose();
    navigate(`/store/${slug}`);
  };

  const handleStore = () => {
    trackEvent('offerShown');
    onClose();
    navigate('/store');
  };

  const copyCode = () => {
    if (discountCode) {
      navigator.clipboard.writeText(discountCode).catch(() => {});
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  trackEvent('offerShown');

  return (
    <div
      className="fixed inset-0 z-[68] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.82)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
        style={{ animation: 'funnelFadeUp 0.32s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-2xl leading-none" data-testid="offer-close-btn">x</button>

        {/* Interest badge */}
        <div className="inline-flex items-center gap-1.5 bg-mango/15 text-mango text-xs font-black px-3 py-1 rounded-full mb-4">
          {cfg.badge}
        </div>

        {/* Challenge reward banner */}
        {challengeReward && (
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl px-4 py-3 mb-4 border border-orange-200" data-testid="challenge-reward-banner">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-sm font-black text-charcoal">Daily Challenge Reward!</p>
                <p className="text-xs text-charcoal-light">{challengeReward.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Game context */}
        {gameScore !== undefined && gameScore > 0 && !challengeReward && (
          <div className="flex items-center gap-2 bg-leaf/8 rounded-xl px-3 py-2 mb-4 border border-leaf/15">
            <span className="text-leaf text-sm">🎮</span>
            <p className="text-xs text-charcoal-light">
              You scored <span className="font-black text-charcoal">{gameScore} pts</span> — here's your personalised recommendation:
            </p>
          </div>
        )}

        {/* Product */}
        <div className="flex gap-4 mb-5">
          {prod.cover_image && (
            <img src={prod.cover_image} alt={prod.title}
              className="w-20 flex-shrink-0 rounded-xl shadow-md object-cover"
              style={{ aspectRatio: '2/3' }} />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-leaf font-bold uppercase tracking-wider mb-1">Recommended for You</p>
            <h3 className="font-heading font-black text-charcoal text-base leading-tight mb-2">{prod.title}</h3>
            <p className="text-xs text-charcoal-light line-clamp-3">{prod.short_description}</p>
          </div>
        </div>

        <p className="text-sm text-charcoal-light mb-5 leading-relaxed">{cfg.hook}</p>

        {/* Price + Discount code */}
        <div className="bg-leaf/5 rounded-xl p-3 border border-leaf/10 mb-5">
          <div className="flex items-end gap-3">
            <div>
              <p className="text-[10px] text-charcoal-light uppercase tracking-wider">
                {discountPct > 0 ? 'Your Price' : 'Price'}
              </p>
              <p className="font-heading font-black text-3xl text-charcoal">${discountedPrice}</p>
            </div>
            {discountPct > 0 && (
              <div className="pb-1">
                <p className="text-sm text-gray-400 line-through">${prod.price.toFixed(2)}</p>
                <p className="text-xs font-bold text-leaf">You save ${saving}</p>
              </div>
            )}
            {discountPct > 0 && (
              <div className="ml-auto pb-1">
                <span className="bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-full">{discountPct}% OFF</span>
              </div>
            )}
          </div>
          
          {/* Discount code display */}
          {discountCode && (
            <div className="mt-3 pt-3 border-t border-leaf/10">
              <p className="text-[10px] text-charcoal-light uppercase tracking-wider mb-1.5">Your Discount Code</p>
              <div className="flex items-center gap-2">
                <div className="bg-charcoal rounded-lg px-4 py-2 flex-1 text-center">
                  <span className="font-heading font-black text-xl text-mango tracking-widest" data-testid="offer-discount-code">{discountCode}</span>
                </div>
                <button
                  onClick={copyCode}
                  className="bg-mango/15 text-mango font-bold text-xs px-3 py-2 rounded-lg hover:bg-mango/25 transition-colors"
                  data-testid="copy-code-btn"
                >
                  {codeCopied ? '✓' : '📋'}
                </button>
              </div>
              <p className="text-[10px] text-charcoal-light mt-1.5">Apply at checkout for {discountPct}% off</p>
            </div>
          )}
        </div>

        <button onClick={handleCta} className="w-full btn-primary py-3.5 text-base mb-2" data-testid="offer-cta-btn">
          {cfg.emoji} Get {prod.title}
        </button>
        <button onClick={handleStore} className="w-full text-sm text-charcoal-light hover:text-charcoal text-center transition-colors py-2 flex items-center justify-center gap-1">
          🛍️ Browse all ebooks →
        </button>
      </div>

      <style>{`@keyframes funnelFadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
