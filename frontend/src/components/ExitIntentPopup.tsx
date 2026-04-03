import { useState, useEffect } from 'react';
import { navigate } from '../App';
import { captureEmailLead } from '../utils/db';

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    try { if (sessionStorage.getItem('ifg_exit_shown') === '1') return; } catch {}

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        setVisible(true);
        try { sessionStorage.setItem('ifg_exit_shown', '1'); } catch {}
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    // Only trigger after 15s on page
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 15000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!visible) return null;

  const handleClaim = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    // Store email in localStorage for lead tracking
    captureEmailLead(email, '', 'exit_intent', 'discount_20').catch(() => {});
    try {
      const leads = JSON.parse(localStorage.getItem('ifg_leads') || '[]');
      leads.push({ email, source: 'exit_intent', date: new Date().toISOString() });
      localStorage.setItem('ifg_leads', JSON.stringify(leads));
    } catch {}
    setClaimed(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && setVisible(false)}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Hero banner */}
        <div className="relative py-8 px-8 text-white text-center"
          style={{ background: 'linear-gradient(135deg,#071A07,#0A2010)' }}>
          <button onClick={() => setVisible(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl leading-none">×</button>
          <div className="text-5xl mb-3">🌴</div>
          <h2 className="font-heading text-3xl font-black mb-1">Wait — Don't Leave!</h2>
          <p className="text-white/80">Grab your exclusive first-time discount</p>
        </div>

        <div className="p-8">
          {!claimed ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 font-bold px-4 py-2 rounded-full mb-4 text-sm">
                  🎁 20% OFF your first ebook — code: <code className="bg-green-100 px-2 py-0.5 rounded font-mono">IFG20</code>
                </div>
                <p className="text-charcoal-light text-sm">
                  Enter your email and we'll send your discount + a <strong>FREE Caribbean Fruit Guide PDF</strong>
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleClaim()}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none text-sm"
                />
                <button onClick={handleClaim}
                  className="bg-gradient-to-r from-leaf to-caribbean-green text-white font-bold px-5 py-3 rounded-xl hover:scale-105 transition-transform text-sm whitespace-nowrap">
                  Claim 20% Off
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs text-charcoal-light mb-4">
                <div className="bg-gray-50 rounded-xl p-2">
                  <div className="text-lg mb-1">📥</div>Free PDF Included
                </div>
                <div className="bg-gray-50 rounded-xl p-2">
                  <div className="text-lg mb-1">🔒</div>No spam, ever
                </div>
                <div className="bg-gray-50 rounded-xl p-2">
                  <div className="text-lg mb-1">⚡</div>Instant delivery
                </div>
              </div>

              <button onClick={() => setVisible(false)}
                className="w-full text-xs text-charcoal-light hover:text-charcoal text-center py-2 transition-colors">
                No thanks, I'll pay full price
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-bold text-2xl text-charcoal mb-2">You're in!</h3>
              <p className="text-charcoal-light mb-2">Check your email for your free PDF + discount code.</p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-green-800">Your 20% discount code: <strong className="font-mono text-lg">IFG20</strong></p>
              </div>
              <button onClick={() => { setVisible(false); navigate('/store/ebooks'); }}
                className="bg-gradient-to-r from-leaf to-caribbean-green text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">
                Shop Now with 20% Off →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
