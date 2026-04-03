import { useState, useEffect } from 'react';
import { navigate } from '../App';
import { fruits, type Fruit } from '../data/fruits';
import { OptimizedImage } from '../components/OptimizedImage';
import { Breadcrumb } from '../components/Breadcrumb';
import { setupPageSEO } from '../utils/seo';

// ── Scoring config ────────────────────────────────────────────────────────────
const TASTE_SCORES: Record<string, Record<string, number>> = {
  sweet:   { '5':5,'8':5,'13':5,'7':4,'20':5,'16':5,'22':4,'24':5,'14':4,'9':4,'26':3 },
  tart:    { '6':5,'12':5,'15':5,'17':4,'3':4,'25':4,'4':5,'21':4,'10':3 },
  mild:    { '11':5,'2':5,'19':5,'9':4,'26':4,'21':3,'14':4 },
  exotic:  { '23':5,'4':5,'18':4,'1':5,'25':5,'7':4,'16':4,'21':4,'6':4 },
  neutral: {},
};
const GOAL_SCORES: Record<string, Record<string, number>> = {
  immunity:    { '10':5,'3':4,'8':5,'6':4,'22':4,'5':3,'4':4,'20':4 },
  digestion:   { '8':5,'22':5,'10':4,'3':3,'12':3,'5':3,'6':3,'13':3 },
  energy:      { '13':5,'5':4,'22':4,'23':4,'10':3,'11':3,'20':4,'2':4 },
  'weight-loss':{ '19':4,'3':3,'10':4,'7':4,'18':4,'6':4,'21':3 },
  heart:       { '19':5,'13':5,'11':4,'3':4,'8':4,'5':4,'22':3 },
  skin:        { '8':5,'10':5,'5':4,'19':4,'6':4,'18':3,'22':4 },
  none:        {},
};
const AVAIL_SCORES: Record<string, Record<string, number>> = {
  local:    { '5':5,'8':5,'13':5,'22':5,'11':4,'10':4,'19':4,'6':4,'3':3,'12':3 },
  imported: { '5':4,'8':4,'13':4,'22':4,'11':4,'10':4,'19':4,'6':4,'3':4,'18':3,'24':3,'23':3 },
  any:      {},
};

function score(taste: string, goal: string, avail: string): Array<{ fruit: Fruit; total: number }> {
  return fruits
    .map(f => ({
      fruit: f,
      total: (TASTE_SCORES[taste]?.[f.id] ?? (taste === 'neutral' ? 3 : 0))
           + (GOAL_SCORES[goal]?.[f.id]  ?? (goal === 'none' ? 2 : 0))
           + (AVAIL_SCORES[avail]?.[f.id] ?? (avail === 'any' ? 2 : 0)),
    }))
    .filter(s => s.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
}

const TASTE_OPTIONS = [
  { value: 'sweet',   label: '🍯 Sweet',        desc: 'Mango, papaya, banana vibes' },
  { value: 'tart',    label: '🍋 Tart & Tangy', desc: 'Tamarind, passion fruit, guinep' },
  { value: 'mild',    label: '🥥 Mild & Creamy', desc: 'Coconut, breadfruit, avocado' },
  { value: 'exotic',  label: '🌟 Exotic & Bold', desc: 'Jackfruit, ackee, sea grape' },
  { value: 'neutral', label: '😊 No Preference', desc: 'Show me everything!' },
];
const GOAL_OPTIONS = [
  { value: 'immunity',    label: '🛡️ Immunity',      desc: 'Boost immune defense' },
  { value: 'digestion',   label: '🫃 Digestion',      desc: 'Gut health & enzymes' },
  { value: 'energy',      label: '⚡ Energy',          desc: 'Natural fuel & B vitamins' },
  { value: 'weight-loss', label: '⚖️ Weight Control', desc: 'Lower calorie, high nutrient' },
  { value: 'heart',       label: '❤️ Heart Health',   desc: 'Potassium & healthy fats' },
  { value: 'skin',        label: '✨ Skin Health',     desc: 'Vitamin C & antioxidants' },
  { value: 'none',        label: '😊 No Preference',  desc: 'Just show me great fruits!' },
];
const AVAIL_OPTIONS = [
  { value: 'local',    label: '🏪 Local Grocery',   desc: 'Widely available in most stores' },
  { value: 'imported', label: '🌴 Caribbean Market', desc: 'Specialty or Caribbean stores' },
  { value: 'any',      label: '🌍 Anywhere',         desc: 'All tropical fruits' },
];

export function FruitFinderPage() {
  const [taste, setTaste]   = useState('');
  const [goal, setGoal]     = useState('');
  const [avail, setAvail]   = useState('');
  const [results, setResults] = useState<Array<{ fruit: Fruit; total: number }>>([]);
  const [done, setDone]     = useState(false);

  useEffect(() => {
    setupPageSEO({
      title: 'Fruit Finder Tool | Find Your Perfect Caribbean Fruit | IslandFruitGuide',
      description: 'Use our interactive Fruit Finder to discover the perfect Caribbean tropical fruit based on your taste preferences, health goals, and availability.',
      path: '/tools/fruit-finder',
    });
  }, []);

  const find = () => {
    setResults(score(taste || 'neutral', goal || 'none', avail || 'any'));
    setDone(true);
  };

  const reset = () => { setTaste(''); setGoal(''); setAvail(''); setResults([]); setDone(false); };

  const canFind = taste && goal && avail;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-mango to-coral py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb items={[{ label: 'Tools', href: '/tools' }, { label: 'Fruit Finder' }]} dark />
          <div className="text-center mt-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">🔍 Fruit Finder</h1>
            <p className="text-lg text-white/90">Tell us your taste, goals, and availability — we'll find your perfect tropical fruit</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {!done ? (
          <div className="space-y-8">
            {/* Step 1: Taste */}
            <div className="bg-white rounded-2xl shadow-lg p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-mango text-white flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="text-xl font-bold text-charcoal">What flavour do you enjoy?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TASTE_OPTIONS.map(o => (
                  <button key={o.value} onClick={() => setTaste(o.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${taste === o.value ? 'border-mango bg-mango/10 shadow-md' : 'border-gray-200 hover:border-mango/50 hover:bg-amber-50'}`}>
                    <div className="font-bold text-charcoal">{o.label}</div>
                    <div className="text-xs text-charcoal-light mt-1">{o.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Health Goal */}
            <div className={`bg-white rounded-2xl shadow-lg p-7 transition-opacity ${taste ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-leaf text-white flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="text-xl font-bold text-charcoal">What's your health goal?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {GOAL_OPTIONS.map(o => (
                  <button key={o.value} onClick={() => setGoal(o.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${goal === o.value ? 'border-leaf bg-leaf/10 shadow-md' : 'border-gray-200 hover:border-leaf/50 hover:bg-green-50'}`}>
                    <div className="font-bold text-charcoal">{o.label}</div>
                    <div className="text-xs text-charcoal-light mt-1">{o.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Availability */}
            <div className={`bg-white rounded-2xl shadow-lg p-7 transition-opacity ${goal ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-caribbean-green text-white flex items-center justify-center font-bold text-sm">3</div>
                <h2 className="text-xl font-bold text-charcoal">Where can you find fruits?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {AVAIL_OPTIONS.map(o => (
                  <button key={o.value} onClick={() => setAvail(o.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${avail === o.value ? 'border-caribbean-green bg-caribbean-green/10 shadow-md' : 'border-gray-200 hover:border-caribbean-green/50 hover:bg-teal-50'}`}>
                    <div className="font-bold text-charcoal">{o.label}</div>
                    <div className="text-xs text-charcoal-light mt-1">{o.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Find Button */}
            <div className="text-center">
              <button onClick={find} disabled={!canFind}
                className="bg-gradient-to-r from-mango to-coral text-white font-bold py-4 px-10 rounded-2xl text-lg hover:scale-105 transition-transform shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                🔍 Find My Fruits
              </button>
              {!canFind && (
                <p className="text-charcoal-light text-sm mt-3">Complete all 3 steps above to find your fruits</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Results header */}
            <div className="bg-white rounded-2xl shadow-xl p-7 mb-7">
              <h2 className="text-3xl font-bold text-charcoal mb-2">🎯 Your Perfect Tropical Fruits</h2>
              <p className="text-charcoal-light">
                Based on your preferences — <strong>{TASTE_OPTIONS.find(o=>o.value===taste)?.label}</strong> taste,{' '}
                <strong>{GOAL_OPTIONS.find(o=>o.value===goal)?.label}</strong> goal, and{' '}
                <strong>{AVAIL_OPTIONS.find(o=>o.value===avail)?.label}</strong> availability
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
              {results.map(({ fruit }: { fruit: Fruit; total: number }, i: number) => (
                <button key={fruit.id} onClick={() => navigate(`/fruits/${fruit.slug}`)}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-leaf/30 transition-all hover:-translate-y-1 text-left relative">
                  {i < 3 && (
                    <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-white text-xs font-bold flex items-center justify-center shadow">
                      #{i+1}
                    </div>
                  )}
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    {fruit.image_url
                      ? <OptimizedImage src={fruit.image_url} alt={fruit.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      : <div className="w-full h-full flex items-center justify-center text-5xl">{fruit.emoji}</div>}
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-charcoal text-sm group-hover:text-leaf transition-colors">{fruit.name}</h3>
                    <p className="text-xs text-charcoal-light italic mt-0.5 truncate">{fruit.scientific_name}</p>
                    <div className="mt-2">
                      <span className="text-xs bg-leaf/10 text-leaf px-2 py-0.5 rounded-full">
                        {fruit.seasonality.split('–')[0].trim()}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={reset} className="flex-1 bg-gray-100 text-charcoal font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition">🔄 Start Over</button>
              <button onClick={() => navigate('/explore')} className="flex-1 bg-gradient-to-r from-caribbean-green to-leaf text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform">🌴 Explore All Fruits</button>
              <button onClick={() => navigate('/tools/fruit-recommender')} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform">🎯 Try Recommender</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
