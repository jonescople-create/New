import { useState } from 'react';
import { navigate } from '../App';
import { captureEmailLead } from '../utils/db';

interface Props {
  variant?: 'popup' | 'inline' | 'banner';
  onClose?: () => void;
}

export function EmailCapture({ variant = 'popup', onClose }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    // Save to Supabase + localStorage backup
    captureEmailLead(email, name, variant, 'free_fruit_guide').catch(() => {});
    try {
      const leads = JSON.parse(localStorage.getItem('ifg_leads') || '[]');
      leads.push({ email, name, source: variant, date: new Date().toISOString() });
      localStorage.setItem('ifg_leads', JSON.stringify(leads));
      localStorage.setItem('ifg_subscriber', '1');
    } catch {}
    setDone(true);
  };

  if (variant === 'inline') {
    return (
      <div className="bg-gradient-to-br from-leaf/5 to-mango/5 border border-leaf/20 rounded-2xl p-6">
        {!done ? (
          <>
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">📥</span>
              <div>
                <h3 className="font-bold text-charcoal text-lg leading-snug">Get the FREE Caribbean Fruit Bible</h3>
                <p className="text-sm text-charcoal-light mt-1">25 fruits · Nutrition facts · 10 starter recipes — <strong>free, instantly</strong></p>
              </div>
            </div>
            {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
            <div className="flex gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20"/>
              <button onClick={handleSubmit}
                className="bg-leaf text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-leaf-dark transition-colors whitespace-nowrap">
                Send Free PDF
              </button>
            </div>
            <p className="text-xs text-charcoal-light mt-2 text-center">🔒 No spam. Unsubscribe anytime.</p>
          </>
        ) : (
          <div className="text-center py-2">
            <span className="text-3xl block mb-2">🎉</span>
            <p className="font-bold text-charcoal">Check your inbox!</p>
            <p className="text-sm text-charcoal-light">Your free Caribbean Fruit Bible PDF is on its way.</p>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-leaf to-leaf-dark text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg">📥 Free Caribbean Fruit Bible PDF</p>
          <p className="text-sm text-white/80">25 fruits, nutrition facts & recipes — join 2,300+ subscribers</p>
        </div>
        {!done ? (
          <div className="flex gap-2 w-full sm:w-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="your@email.com"
              className="flex-1 sm:w-52 px-3 py-2.5 rounded-xl text-charcoal text-sm outline-none"/>
            <button onClick={handleSubmit}
              className="bg-mango text-charcoal font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-amber-400 transition-colors whitespace-nowrap">
              Get Free PDF
            </button>
          </div>
        ) : (
          <div className="bg-white/20 rounded-xl px-4 py-2 text-sm font-bold">✅ Check your inbox!</div>
        )}
      </div>
    );
  }

  // Popup variant
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
        <div className="relative text-white text-center py-10 px-8"
          style={{background:'linear-gradient(135deg,#071A07 0%,#0F3020 50%,#071A07 100%)'}}>
          {onClose && <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl">×</button>}
          <div className="text-6xl mb-3">🌴</div>
          <h2 className="font-heading text-2xl font-black mb-1">Free Caribbean Fruit Bible</h2>
          <p className="text-white/75 text-sm">The complete guide to 25 tropical fruits — free</p>
          <div className="mt-4 flex justify-center gap-3 text-xs">
            {['25 Fruits','Nutrition Facts','10 Recipes'].map(t => (
              <span key={t} className="bg-white/15 px-3 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
        <div className="p-7">
          {!done ? (
            <>
              <p className="text-charcoal-light text-sm text-center mb-5">
                Join <strong>2,300+ subscribers</strong> — get the PDF instantly and a <strong className="text-leaf">20% off coupon</strong> for your first ebook.
              </p>
              {error && <p className="text-red-600 text-xs mb-3 text-center">{error}</p>}
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your first name (optional)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-leaf mb-3"/>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-leaf mb-4"/>
              <button onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-leaf to-caribbean-green text-white font-bold py-3.5 rounded-xl hover:scale-105 transition-transform shadow-lg">
                Send Me the Free PDF →
              </button>
              <p className="text-xs text-charcoal-light text-center mt-3">🔒 No spam, ever. Unsubscribe in one click.</p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-bold text-2xl text-charcoal mb-2">You're in{name ? `, ${name}` : ''}!</h3>
              <p className="text-charcoal-light text-sm mb-4">Your free PDF + 20% discount code is on its way to <strong>{email}</strong></p>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-5">
                <p className="text-sm text-green-800 font-medium">Your discount code: <span className="font-mono font-bold text-lg">IFG20</span></p>
              </div>
              <button onClick={() => { onClose?.(); navigate('/store/ebooks'); }}
                className="w-full bg-gradient-to-r from-leaf to-caribbean-green text-white font-bold py-3 rounded-xl hover:scale-105 transition-transform">
                Shop Ebooks with 20% Off →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
