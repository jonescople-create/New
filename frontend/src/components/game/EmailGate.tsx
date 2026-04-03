import { useState } from 'react';
import { saveEmail } from '../../data/dailyRewards';

interface Props {
  trigger: 'score' | 'premium';
  onComplete: (email: string) => void;
  onSkip?: () => void;
  rewardTitle?: string;
  rewardEmoji?: string;
}

export function EmailGate({ trigger, onComplete, onSkip, rewardTitle, rewardEmoji }: Props) {
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = () => {
    if (!isValid) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    saveEmail(email.trim());
    setTimeout(() => {
      setLoading(false);
      onComplete(email.trim());
    }, 600);
  };

  const headline = trigger === 'premium'
    ? `Claim Your Premium Reward ${rewardEmoji ?? '🎁'}`
    : '🌴 You\'re on Fire! Claim Your Reward';

  const sub = trigger === 'premium'
    ? `${rewardTitle ?? 'Premium reward'} — enter your email to unlock it instantly.`
    : 'You hit 200 points! Enter your email to unlock your reward and get exclusive Caribbean recipe tips.';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.82)' }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative"
        style={{ animation: 'fadeInUp 0.3s ease-out' }}
      >
        {/* Skip (non-premium only) */}
        {onSkip && trigger !== 'premium' && (
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-2xl leading-none"
            aria-label="Skip"
          >
            ×
          </button>
        )}

        {/* Icon */}
        <div className="text-6xl mb-4" style={{ animation: 'bounce 1s infinite' }}>
          {trigger === 'premium' ? (rewardEmoji ?? '🎁') : '📬'}
        </div>

        {/* Headline */}
        <h2 className="font-heading text-2xl font-black text-charcoal mb-2">
          {headline}
        </h2>
        <p className="text-charcoal-light text-sm mb-6 leading-relaxed">
          {sub}
        </p>

        {/* Perks list */}
        <div className="bg-leaf/5 rounded-xl p-4 mb-6 text-left space-y-2">
          {[
            '📥 Instant reward delivery to your inbox',
            '🌴 Weekly Caribbean recipe tips',
            '💰 Exclusive subscriber-only ebook discounts',
            '🎮 Daily reward streak notifications',
          ].map(p => (
            <p key={p} className="text-xs text-charcoal-light">{p}</p>
          ))}
        </div>

        {/* Email input */}
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-leaf focus:outline-none text-charcoal text-sm mb-2"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="w-full btn-primary text-base py-3.5 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '✓ Saving...' : '🎁 Unlock My Reward'}
        </button>

        <p className="text-xs text-gray-400">
          No spam. Unsubscribe anytime. 🔒
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
