import { useState, useEffect } from 'react';
import { getMyCode, getReferralUrl, getShareText, getReferralStats } from '../../utils/referralSystem';
import { trackBehaviour } from '../../utils/funnelTracker';

interface Props {
  path?: string;
  compact?: boolean;
}

export function ReferralWidget({ path = '/', compact = false }: Props) {
  const [copied, setCopied]   = useState(false);
  const [stats,  setStats]    = useState(getReferralStats());

  useEffect(() => { setStats(getReferralStats()); }, []);

  const url    = getReferralUrl(path);
  const share  = getShareText(path);

  const handleCopy = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      trackBehaviour('referralShared', getMyCode());
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleTwitter = () => {
    trackBehaviour('referralShared', getMyCode());
    window.open(share.twitter, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsApp = () => {
    trackBehaviour('referralShared', getMyCode());
    window.open(share.whatsapp, '_blank', 'noopener,noreferrer');
  };

  if (compact) {
    return (
      <div className="bg-leaf/5 border border-leaf/15 rounded-xl p-4">
        <p className="text-xs font-bold text-charcoal mb-2">🌴 Share IslandFruitGuide</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={url}
            className="flex-1 text-[10px] px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-charcoal-light truncate"
          />
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 bg-leaf text-white rounded-lg font-bold hover:bg-leaf-dark transition-colors flex-shrink-0"
          >
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-leaf/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🌴</div>
        <div>
          <h3 className="font-heading font-bold text-charcoal text-base">Share IslandFruitGuide</h3>
          <p className="text-xs text-charcoal-light">Earn rewards when friends sign up via your link</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Link Clicks',   value: stats.clicks,  color: 'text-leaf'   },
          { label: 'Friends Joined',value: stats.signups, color: 'text-mango'  },
          { label: 'XP Earned',     value: `${stats.rewards || 0}`, color: 'text-orange-500' },
        ].map(s => (
          <div key={s.label} className="text-center bg-gray-50 rounded-xl py-3">
            <p className={`font-heading font-black text-xl ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-charcoal-light uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Your code */}
      <div className="mb-4">
        <p className="text-xs font-bold text-charcoal mb-2">Your referral link:</p>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 min-w-0">
            <span className="text-xs text-charcoal-light truncate">{url}</span>
          </div>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-all ${
              copied
                ? 'bg-leaf text-white'
                : 'bg-charcoal text-white hover:bg-charcoal/80'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-[10px] text-charcoal-light mt-1.5">
          Your code: <span className="font-black text-charcoal">{stats.code}</span>
        </p>
      </div>

      {/* Share buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={handleTwitter}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-50 text-sky-600 font-bold text-sm hover:bg-sky-100 transition-colors border border-sky-100"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Twitter / X
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-600 font-bold text-sm hover:bg-green-100 transition-colors border border-green-100"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </button>
      </div>

      {/* Reward info */}
      <div className="bg-mango/8 rounded-xl p-3 border border-mango/15">
        <p className="text-[10px] text-charcoal-light leading-relaxed">
          🎁 <strong className="text-charcoal">Earn rewards:</strong> When a friend signs up via your link, you both get bonus XP in the Fruit Catcher game. The more friends you refer, the higher your leaderboard rank.
        </p>
      </div>
    </div>
  );
}
