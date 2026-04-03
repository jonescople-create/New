import { useState, useEffect } from 'react';

interface Props {
  label?: string;
  hours?: number;
  className?: string;
  compact?: boolean;
}

function getOrCreateDeadline(hours: number): Date {
  const key = `ifg_sale_deadline_${hours}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    const d = new Date(stored);
    if (d > new Date()) return d;
  }
  const deadline = new Date(Date.now() + hours * 60 * 60 * 1000);
  localStorage.setItem(key, deadline.toISOString());
  return deadline;
}

export function CountdownTimer({ label = "Sale ends in", hours = 48, className = "", compact = false }: Props) {
  const [deadline] = useState(() => getOrCreateDeadline(hours));
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = deadline.getTime() - Date.now();
      if (diff <= 0) { setExpired(true); return; }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (expired) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 font-mono font-bold ${className}`}>
        ⏱ {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium opacity-90">{label}</span>
      {[{ v: timeLeft.h, l: 'HRS' }, { v: timeLeft.m, l: 'MIN' }, { v: timeLeft.s, l: 'SEC' }].map(({ v, l }) => (
        <div key={l} className="flex flex-col items-center">
          <div className="bg-black/30 backdrop-blur-sm text-white font-mono font-bold text-xl w-12 h-12 flex items-center justify-center rounded-lg shadow-inner">
            {pad(v)}
          </div>
          <span className="text-[9px] font-bold opacity-70 mt-1 tracking-widest">{l}</span>
        </div>
      ))}
    </div>
  );
}
