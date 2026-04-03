import { navigate } from '../../App';
import { products } from '../../data/products';
import { trackEvent } from '../../utils/funnelTracker';

interface Props {
  purchasedSlug: string;
  onClose: () => void;
}

// Map purchased product → upsell product
function getUpsell(slug: string): string {
  const map: Record<string, string> = {
    'mango-recipe-pack':              'tropical-juice-smoothie-recipes',
    'papaya-recipe-pack':             'fat-loss-smoothies',
    'soursop-drinks-pack':            'healing-drinks',
    'guava-dessert-pack':             'tropical-fruit-desserts',
    'fruit-season-calendar':          'caribbean-fruit-guide',
    'tropical-juice-smoothie-recipes':'gym-energy-recipes',
    'tropical-fruit-desserts':        'tropical-juice-smoothie-recipes',
    'caribbean-fruit-guide':          'medicinal-leaves-guide',
    'medicinal-leaves-guide':         'healing-drinks',
    'gym-energy-recipes':             'pre-workout-drinks',
    'fat-loss-smoothies':             'healing-drinks',
    'healing-drinks':                 'medicinal-leaves-guide',
    'pre-workout-drinks':             'gym-energy-recipes',
  };
  return map[slug] ?? 'tropical-juice-smoothie-recipes';
}

const UPSELL_SAVINGS = '40%';
const BUNDLE_PRICE   = '29.99';
const BUNDLE_WAS     = '49.99';

export function UpsellModal({ purchasedSlug, onClose }: Props) {
  const upsellSlug = getUpsell(purchasedSlug);
  const upsell     = products.find(p => p.slug === upsellSlug);
  const purchased  = products.find(p => p.slug === purchasedSlug);

  if (!upsell) { onClose(); return null; }

  const handleUpsell = () => {
    trackEvent('upsellShown');
    onClose();
    navigate(`/store/${upsellSlug}`);
  };

  const handleBundle = () => {
    trackEvent('upsellShown');
    onClose();
    navigate('/store');
  };

  trackEvent('upsellShown');

  const discountPrice = (upsell.price * 0.75).toFixed(2);
  const saving        = (upsell.price * 0.25).toFixed(2);

  return (
    <div
      className="fixed inset-0 z-[72] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
        style={{ animation: 'upsellSlide 0.38s cubic-bezier(0.34,1.56,0.64,1)' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-2xl leading-none">×</button>

        {/* Purchase confirmation */}
        <div className="flex items-center gap-3 bg-leaf/8 border border-leaf/20 rounded-2xl p-4 mb-5">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold text-charcoal text-sm">Purchase confirmed!</p>
            <p className="text-xs text-charcoal-light">{purchased?.title ?? 'Your ebook'} is on its way to your inbox.</p>
          </div>
        </div>

        {/* Upsell headline */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-black px-3 py-1 rounded-full mb-3">
            ⚡ ONE-TIME OFFER — 25% OFF
          </div>
          <h3 className="font-heading text-xl font-black text-charcoal mb-1">
            Complete Your Collection
          </h3>
          <p className="text-xs text-charcoal-light">
            Customers who bought <strong>{purchased?.title}</strong> also loved:
          </p>
        </div>

        {/* Upsell product */}
        <div className="flex gap-4 p-4 border border-gray-100 rounded-2xl mb-5 hover:border-leaf/30 transition-colors">
          {upsell.cover_image && (
            <img
              src={upsell.cover_image}
              alt={upsell.title}
              className="w-16 flex-shrink-0 rounded-lg shadow object-cover"
              style={{ aspectRatio: '2/3' }}
            />
          )}
          <div className="flex-1">
            <p className="font-bold text-charcoal text-sm leading-snug mb-1">{upsell.title}</p>
            <p className="text-xs text-charcoal-light mb-2 line-clamp-2">{upsell.short_description}</p>
            <div className="flex items-baseline gap-2">
              <span className="font-black text-charcoal text-xl">${discountPrice}</span>
              <span className="text-gray-400 line-through text-sm">${upsell.price.toFixed(2)}</span>
              <span className="text-leaf text-xs font-bold">Save ${saving}</span>
            </div>
          </div>
        </div>

        {/* OR: bundle offer */}
        <div className="bg-gradient-to-r from-leaf/8 to-mango/8 rounded-2xl p-4 mb-5 border border-leaf/15">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-charcoal text-sm">🏆 Or get the full bundle</p>
            <span className="bg-mango text-charcoal text-[9px] font-black px-2 py-0.5 rounded-full">SAVE {UPSELL_SAVINGS}</span>
          </div>
          <p className="text-xs text-charcoal-light mb-3">
            All 13 IslandFruitGuide ebooks · 600+ recipes · One payment · Lifetime access
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-black text-charcoal text-lg">${BUNDLE_PRICE}</span>
            <span className="text-gray-400 line-through text-xs">${BUNDLE_WAS}</span>
          </div>
        </div>

        <button onClick={handleUpsell} className="w-full btn-primary py-3.5 mb-2">
          Add {upsell.title} — ${discountPrice}
        </button>
        <button onClick={handleBundle} className="w-full btn-secondary py-3 mb-2 text-sm">
          🏆 Get the Full Bundle — ${BUNDLE_PRICE}
        </button>
        <button onClick={onClose} className="w-full text-xs text-charcoal-light hover:text-charcoal text-center transition-colors py-1.5">
          No thanks, I'm happy with my purchase
        </button>
      </div>

      <style>{`@keyframes upsellSlide{from{opacity:0;transform:scale(0.88) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}
