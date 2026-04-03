import { useState } from 'react';
import { navigate } from '../App';
import { CountdownTimer } from './CountdownTimer';

export function SalesBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem('ifg_banner_dismissed') === '1'; } catch { return false; }
  });

  if (dismissed) return null;

  return (
    <div className="relative z-40 text-white text-center py-2 px-4"
      style={{ background: 'linear-gradient(90deg,#1F7A4D,#2D9E66,#F9A825,#FF7043,#1F7A4D)', backgroundSize: '300% 100%', animation: 'gradientShift 8s ease infinite' }}>
      <style>{`@keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`}</style>
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 flex-wrap">
        <span className="text-sm font-bold">🌴 SUMMER SALE — Up to 40% OFF all ebooks!</span>
        <CountdownTimer hours={72} label="" compact className="text-white text-sm"/>
        <button onClick={() => navigate('/store/ebooks')}
          className="bg-white text-leaf font-bold text-xs px-3 py-1 rounded-full hover:bg-yellow-50 transition-colors">
          Shop Now →
        </button>
        <button onClick={() => { setDismissed(true); try { sessionStorage.setItem('ifg_banner_dismissed','1'); } catch {} }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-lg leading-none">
          ×
        </button>
      </div>
    </div>
  );
}
