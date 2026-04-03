import { useState } from 'react';
import { trackEvent, type FunnelSource, type FunnelInterest } from '../../utils/funnelTracker';

const API = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL || '';

interface Props {
  source:     FunnelSource;
  interest?:  FunnelInterest;
  onComplete: (email: string) => void;
  onSkip?:    () => void;
  variant?: 'overlay' | 'inline';
  headline?: string;
  subline?:  string;
}

const FREE_RECIPES = [
  { emoji: '🥭', name: 'Mango Power Blast',         desc: 'Pre-workout smoothie' },
  { emoji: '🍍', name: 'Pineapple Ginger Ignite',   desc: 'Detox & anti-inflammation' },
  { emoji: '🥥', name: 'Coconut Electrolyte Drink', desc: 'Natural sports drink' },
  { emoji: '🍌', name: 'Banana Recovery Bowl',      desc: 'Post-workout fuel' },
  { emoji: '🌴', name: 'Soursop Slim Shake',         desc: 'Fat loss & energy' },
];

function EmailCaptureForm({ source, interest = 'general', onComplete, onSkip, headline, subline }: Props) {
  const [email,   setEmail]   = useState('');
  const [busy,    setBusy]    = useState(false);
  const [err,     setErr]     = useState('');
  const [success, setSuccess] = useState<{ code: string; message: string } | null>(null);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = async () => {
    if (!valid) { setErr('Please enter a valid email.'); return; }
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`${API}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source, interest }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess({ code: data.discount_code || 'IFG20', message: data.message || '' });
        trackEvent('emailCaptured');
        // Also save locally
        try { localStorage.setItem('ifg_game_email', email.trim().toLowerCase()); } catch {}
        try { localStorage.setItem('ifg_discount_code', data.discount_code || 'IFG20'); } catch {}
        // Delay to show success, then proceed
        setTimeout(() => onComplete(email.trim()), 2500);
      } else {
        setErr(data.detail || 'Something went wrong. Please try again.');
      }
    } catch {
      // Fallback — save locally even if backend fails
      try { localStorage.setItem('ifg_game_email', email.trim().toLowerCase()); } catch {}
      try { localStorage.setItem('ifg_discount_code', 'IFG20'); } catch {}
      trackEvent('emailCaptured');
      setSuccess({ code: 'IFG20', message: 'Welcome! Use code IFG20 for 20% off your first ebook.' });
      setTimeout(() => onComplete(email.trim()), 2500);
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center" data-testid="email-success">
        <div className="text-5xl" style={{ animation: 'successPop 0.5s ease-out' }}>🎉</div>
        <h3 className="font-heading text-xl font-black text-charcoal">You're In!</h3>
        
        {/* Discount code card */}
        <div className="bg-gradient-to-br from-leaf/10 to-mango/10 rounded-2xl p-5 w-full border-2 border-dashed border-mango/40" data-testid="discount-card">
          <p className="text-xs text-charcoal-light uppercase tracking-wider mb-2">Your Exclusive Discount Code</p>
          <div className="bg-charcoal rounded-xl px-6 py-3 inline-block mb-3">
            <span className="font-heading font-black text-3xl text-mango tracking-widest" data-testid="discount-code">{success.code}</span>
          </div>
          <p className="text-sm font-bold text-charcoal">20% OFF your first ebook</p>
          <p className="text-xs text-charcoal-light mt-1">+ FREE Caribbean Fruit Guide PDF sent to your inbox</p>
        </div>

        <p className="text-xs text-charcoal-light">{success.message}</p>
        <p className="text-[10px] text-gray-400">Redirecting you back...</p>
        <style>{`@keyframes successPop{from{transform:scale(0)}to{transform:scale(1)}}`}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" data-testid="email-capture-form">
      <div className="text-center">
        <p className="text-4xl mb-2">📬</p>
        <h3 className="font-heading text-xl font-black text-charcoal">
          {headline ?? 'Get 5 Free Tropical Recipes'}
        </h3>
        <p className="text-charcoal-light text-sm mt-1">
          {subline ?? 'Delivered instantly to your inbox — no spam, unsubscribe anytime.'}
        </p>
      </div>

      {/* IFG20 promotion banner */}
      <div className="bg-gradient-to-r from-mango/15 to-leaf/15 rounded-xl p-3 border border-mango/20 text-center">
        <p className="text-xs text-charcoal-light mb-1">Subscribe now and get</p>
        <p className="font-heading font-black text-lg text-charcoal">
          🎁 20% OFF <span className="text-mango">your first ebook</span>
        </p>
        <p className="text-[10px] text-charcoal-light mt-0.5">code: <span className="font-bold text-mango">IFG20</span></p>
      </div>

      {/* Recipe preview */}
      <div className="bg-leaf/5 rounded-xl p-3 space-y-1.5">
        {FREE_RECIPES.map(r => (
          <div key={r.name} className="flex items-center gap-2 text-xs">
            <span className="text-base w-6 flex-shrink-0">{r.emoji}</span>
            <span className="font-semibold text-charcoal">{r.name}</span>
            <span className="text-charcoal-light ml-auto">{r.desc}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setErr(''); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="your@email.com"
          autoFocus
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-leaf focus:outline-none text-charcoal text-sm"
          data-testid="email-input"
        />
        {err && <p className="text-red-500 text-xs mt-1" data-testid="email-error">{err}</p>}
      </div>

      <button
        onClick={submit}
        disabled={!valid || busy}
        className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="email-submit-btn"
      >
        {busy ? '✓ Sending...' : '🎁 Send My Free Recipes + 20% OFF Code'}
      </button>

      {onSkip && (
        <button onClick={onSkip} className="text-xs text-charcoal-light hover:text-charcoal text-center transition-colors" data-testid="email-skip-btn">
          No thanks, skip →
        </button>
      )}

      <p className="text-[10px] text-gray-400 text-center">🔒 We respect your privacy.</p>
    </div>
  );
}

/** Overlay variant — full-screen modal */
export function EmailCaptureOverlay(props: Props) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.78)' }}
      onClick={props.onSkip}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
        style={{ animation: 'funnelFadeUp 0.3s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        {props.onSkip && (
          <button onClick={props.onSkip} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-2xl leading-none" data-testid="email-close-btn">x</button>
        )}
        <EmailCaptureForm {...props} />
      </div>
      <style>{`@keyframes funnelFadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/** Inline variant — embeds inside a section */
export function EmailCaptureInline(props: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <EmailCaptureForm {...props} />
    </div>
  );
}

export default EmailCaptureOverlay;
