import { useState, useEffect } from 'react';

const LOCATIONS = ['Jamaica', 'London', 'Toronto', 'New York', 'Trinidad', 'Barbados', 'Miami', 'Birmingham', 'Brooklyn'];
const BOOKS = ['Caribbean Fruit Encyclopedia', 'Healing Drinks Guide', 'Gym Energy Recipes', 'Fat Loss Smoothies', 'Soursop Drinks Pack', 'Mango Recipe Pack'];

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

interface Props {
  className?: string;
}

export function LiveActivityPill({ className = '' }: Props) {
  const [activity, setActivity] = useState({ name: '', location: '', book: '' });
  const [visible, setVisible] = useState(false);

  const names = ['Marcia', 'Andre', 'Sharon', 'Keisha', 'Damian', 'Nicole', 'Trevor', 'Denise', 'Paul', 'Yanique', 'Michael', 'Latoya'];

  useEffect(() => {
    const show = () => {
      setActivity({
        name: randomFrom(names),
        location: randomFrom(LOCATIONS),
        book: randomFrom(BOOKS),
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
    };

    // First show after 8s, then every 20–35s
    const first = setTimeout(show, 8000);
    const interval = setInterval(show, 25000 + Math.random() * 10000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed bottom-24 left-4 z-40 animate-fade-in ${className}`}
      style={{animation:'slideInLeft 0.4s ease, fadeOut 0.4s ease 4s forwards'}}>
      <style>{`
        @keyframes slideInLeft{from{transform:translateX(-110%)}to{transform:translateX(0)}}
        @keyframes fadeOut{from{opacity:1}to{opacity:0}}
      `}</style>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 max-w-xs flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-leaf to-mango flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {activity.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-charcoal">{activity.name} from {activity.location}</p>
          <p className="text-xs text-charcoal-light leading-snug">just downloaded <span className="font-medium">{activity.book}</span></p>
          <p className="text-xs text-charcoal-light opacity-60 mt-0.5">moments ago</p>
        </div>
        <span className="text-lg">🌴</span>
      </div>
    </div>
  );
}

export function DownloadCounter({ count, label, className = '' }: { count: string; label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm text-charcoal-light ${className}`}>
      <span className="text-leaf font-bold">{count}</span>
      <span>{label}</span>
    </div>
  );
}

export function StoreStats() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-5 border-y border-gray-100">
      {[
        { icon: '📥', stat: '2,340+', label: 'Downloads' },
        { icon: '⭐', stat: '4.9/5', label: 'Average Rating' },
        { icon: '🌍', stat: '47', label: 'Countries' },
        { icon: '💯', stat: '30-Day', label: 'Money Back' },
      ].map(({ icon, stat, label }) => (
        <div key={label} className="flex items-center gap-2 text-sm">
          <span className="text-xl">{icon}</span>
          <div>
            <span className="font-bold text-charcoal">{stat}</span>
            <span className="text-charcoal-light ml-1">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
