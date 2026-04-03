import { useState } from 'react';
import { validateDiscountCode } from '../utils/db';
import { navigate } from '../App';
import { NutritionBundleCover } from './NutritionBundleCover';

interface Props {
  currentProductId: string;
  currentPrice: number;
}

export function OrderBump({ currentProductId, currentPrice }: Props) {
  const [added, setAdded] = useState(false);

  // Only show bundle bump if they're NOT already buying the bundle
  if (currentProductId === 'bundle-nutrition-series') return null;

  // Only show if the bundle would save them money
  const bundlePrice = 29.99;
  const savings = Math.max(0, currentPrice + 15 - bundlePrice);
  if (savings < 5) return null;

  if (added) {
    return (
      <div className="border-2 border-green-400 rounded-2xl p-4 bg-green-50 mb-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div className="flex-1">
            <p className="font-bold text-green-800 text-sm">Complete Bundle added!</p>
            <p className="text-xs text-green-700">You're getting all 4 books for just $29.99</p>
          </div>
          <button onClick={() => navigate('/checkout/bundle-nutrition-series')}
            className="bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-xl">
            Checkout →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-amber-300 rounded-2xl p-5 bg-amber-50 mb-5">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <NutritionBundleCover size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded-full">UPGRADE OFFER</span>
          </div>
          <p className="font-bold text-charcoal text-sm leading-snug mb-1">
            Add ALL 4 Nutrition Series books for just $29.99
          </p>
          <p className="text-xs text-charcoal-light mb-3">
            Instead of buying 4 separately (${(currentPrice * 4).toFixed(0)}+), get the complete bundle and save over $12.
          </p>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" onChange={e => {
                if (e.target.checked) {
                  setAdded(true);
                  setTimeout(() => navigate('/checkout/bundle-nutrition-series'), 400);
                }
              }}
                className="w-5 h-5 accent-amber-500 cursor-pointer"/>
              <span className="text-sm font-semibold text-charcoal">
                Yes! Add the Complete Bundle — <span className="text-leaf">$29.99</span>{' '}
                <span className="text-charcoal-light line-through text-xs">${(currentPrice * 4).toFixed(0)}</span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}


// ── Discount Code Component ──────────────────────────────────────────────────
interface DiscountCodeProps {
  price: number;
  onDiscount: (pct: number) => void;
}

export function DiscountCode({ price, onDiscount }: DiscountCodeProps) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState('');
  const [error, setError] = useState('');
  const [pct, setPct] = useState(0);
  const [open, setOpen] = useState(false);

  const apply = async () => {
    const upper = code.trim().toUpperCase();
    const result = await validateDiscountCode(upper);
    if (result.valid) {
      setPct(result.pct);
      setApplied(upper);
      setError('');
      onDiscount(result.pct);
    } else {
      setError(result.message || 'Invalid code. Try IFG20 for 20% off.');
    }
  };

  if (applied) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
        <span className="text-green-500">✓</span>
        <span className="text-sm font-bold text-green-800">Code <code>{applied}</code> applied — {pct}% off!</span>
        <span className="ml-auto text-sm font-bold text-green-700">-${(price * pct / 100).toFixed(2)}</span>
      </div>
    );
  }

  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} className="text-xs text-leaf hover:underline">
          🏷️ Have a discount code?
        </button>
      ) : (
        <div className="flex gap-2">
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && apply()}
            placeholder="Enter code e.g. IFG20"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-leaf uppercase"/>
          <button onClick={apply}
            className="bg-leaf text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-leaf-dark transition-colors">
            Apply
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
