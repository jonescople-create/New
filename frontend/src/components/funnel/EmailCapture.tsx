import { useState } from 'react';
import { captureEmail, trackEvent, type FunnelSource, type FunnelInterest } from '../../utils/funnelTracker';

interface Props {
  source:     FunnelSource;
  interest?:  FunnelInterest;
  onComplete: (email: string) => void;
  onSkip?:    () => void;
  /** Compact inline mode vs full overlay */
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
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = () => {
    if (!valid) { setErr('Please enter a valid email.'); return; }
    setBusy(true);
    captureEmail(email.trim(), source, interest);
    trackEvent('emailCaptured');
    setTimeout(() => { setBusy(false); onComplete(email.trim()); }, 500);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="text-center">
        <p className="text-4xl mb-2">📬</p>
        <h3 className="font-heading text-xl font-black text-charcoal">
          {headline ?? 'Get 5 Free Tropical Recipes'}
        </h3>
        <p className="text-charcoal-light text-sm mt-1">
          {subline ?? 'Delivered instantly to your inbox — no spam, unsubscribe anytime.'}
        </p>
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
        />
        {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
      </div>

      <button
        onClick={submit}
        disabled={!valid || busy}
        className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? '✓ Sending...' : '🎁 Send My Free Recipes'}
      </button>

      {onSkip && (
        <button onClick={onSkip} className="text-xs text-charcoal-light hover:text-charcoal text-center transition-colors">
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
          <button onClick={props.onSkip} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-2xl leading-none">×</button>
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

// Default export is the overlay
export default EmailCaptureOverlay;
