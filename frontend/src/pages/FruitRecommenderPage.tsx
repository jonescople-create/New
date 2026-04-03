import { useState, useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';
import { navigate } from '../App';
import { fruits, type Fruit } from '../data/fruits';
import { OptimizedImage } from '../components/OptimizedImage';
import { Breadcrumb } from '../components/Breadcrumb';

interface ScoredFruit { fruit: Fruit; score: number; reason: string; }

// ── Local recommendation engine (no API needed) ──────────────────────────────
const TASTE_MAP: Record<string, string[]> = {
  sweet:  ['5','8','13','7','20','16','22','24','14','15','26'],
  tart:   ['6','12','15','17','3','25','4','21'],
  mild:   ['11','2','19','9','26','21','14'],
  exotic: ['23','4','18','1','25','7','16','21','6'],
};
const CLIMATE_MAP: Record<string, string[]> = {
  tropical:    ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26'],
  subtropical: ['5','8','13','19','11','10','22','6','3','18','23'],
  temperate:   ['5','8','13','19','22','11','6','3','10'],
  any:         [],
};
const USE_CASE_MAP: Record<string, string[]> = {
  eating:  ['5','8','7','20','16','13','22','4','24','14','21','9'],
  cooking: ['2','23','1','19','8','5','11','12','22','17','26'],
  juices:  ['3','10','6','12','5','8','22','13','15','4','24'],
  health:  ['3','10','8','6','19','13','5','12','2','22'],
};
const REASONS: Record<string, Record<string, string>> = {
  '1':  { sweet:'Buttery, creamy flavour when cooked properly.', exotic:'Unique preparation makes it a true culinary adventure.', cooking:'Jamaica\'s national dish — ackee & saltfish.', health:'Healthy fats and zinc for immunity.' },
  '2':  { mild:'Starchy and neutral — the Caribbean\'s favourite carb.', cooking:'Boil, fry, or roast it like potato.', health:'High-fibre, potassium-rich energy food.' },
  '3':  { tart:'Creamy-tart flavour combining pineapple and citrus.', juices:'#1 Caribbean juice for immune support.', health:'Loaded with vitamin C and antioxidant compounds.' },
  '4':  { tart:'Tiny sweet-tart burst of Caribbean nostalgia.', exotic:'Crack the shell and suck the pulp — pure island joy.', juices:'Small but packed with vitamin C.' },
  '5':  { sweet:'Exceptionally sweet with tropical depth.', eating:'Best enjoyed fresh, sliced or in a smoothie.', juices:'The gold standard for tropical juice.', health:'Vitamin C and digestive enzymes in every bite.' },
  '6':  { tart:'Sweet-tart complexity in tiny aromatic seeds.', exotic:'Unmistakable tropical flavour unlike anything else.', juices:'Iconic tangy tropical juice.', health:'Antioxidant-rich; supports gut health.' },
  '7':  { sweet:'Mild honey sweetness — cooling and creamy.', mild:'Creamy, custard-like texture perfect for fresh eating.', eating:'Chill before eating — scoop with a spoon.' },
  '8':  { sweet:'Naturally sweet with papain digestive enzymes.', mild:'Very gentle on the stomach — great for all ages.', cooking:'Tenderises meat and enriches salsas.', health:'Papain enzyme is a digestion powerhouse.' },
  '9':  { sweet:'Brown-sugar caramel sweetness in a small package.', mild:'Subtly sweet — easy to love.', eating:'Peel and eat whole, no pit to remove.' },
  '10': { tart:'4× more vitamin C than oranges — tart and fragrant.', juices:'A Caribbean classic juice.', health:'Outstanding immune and digestive support.' },
  '11': { mild:'Neutral, creamy, endlessly versatile.', cooking:'Coconut milk enriches any dish instantly.', juices:'Nature\'s electrolyte sports drink.', health:'MCTs + electrolytes in one fruit.' },
  '12': { tart:'Intensely sour with deep caramel notes.', cooking:'Key souring agent in Caribbean stews and jerk.', juices:'Makes a cooling tamarind agua fresca.', health:'Rich in antioxidants and B vitamins.' },
  '13': { sweet:'Familiar sweetness everyone loves.', mild:'Gentle and universally loved.', cooking:'Adds sweetness to pancakes and porridge.', juices:'Creamy base for any smoothie.', health:'Quick potassium + B6 energy boost.' },
  '14': { mild:'Rose-water gentle sweetness — very refreshing.', eating:'Eat chilled for the best flavour.', juices:'Light, hydrating juice.' },
  '15': { tart:'Tangy mango-plum flavour — Caribbean street food staple.', eating:'Eat raw with salt and pepper, island style.', juices:'Sour juice loved across Jamaica.' },
  '16': { sweet:'Rich custard sweetness — like nature\'s ice cream.', mild:'Smooth and perfectly custardy.', juices:'Blends into indulgent island milkshakes.' },
  '17': { tart:'Pleasantly tart and tropical — great with seasoning.', cooking:'Adds tartness to stews and pepper sauce.' },
  '18': { exotic:'Striking pink appearance with mild honey sweetness.', eating:'Scoop the flesh — beautiful in fruit bowls.', juices:'Turns smoothies vibrant pink.', health:'Rich in antioxidants and prebiotic fibre.' },
  '19': { mild:'Buttery, rich and silky smooth.', cooking:'Caribbean guacamole, smoothies, pasta sauce.', juices:'Adds creamy richness to green smoothies.', health:'Heart-healthy monounsaturated fats + folate.' },
  '20': { sweet:'Honey-sweet with a luscious custard texture.', eating:'Scoop the flesh — discard the seeds.', juices:'Blend into a thick, indulgent shake.' },
  '21': { exotic:'Sea grapes — tiny Caribbean jewels from the vine.', eating:'Pick directly from the vine and eat fresh.', health:'Unique omega-3 fatty acid content.' },
  '22': { sweet:'Tropical sweetness with bromelain enzyme.', cooking:'Classic upside-down cake, salsa, grilled dishes.', juices:'Classic Caribbean tropical juice.', health:'Bromelain fights inflammation naturally.' },
  '23': { exotic:'Meaty, substantial — the most unique fruit on this list.', cooking:'Unripe jackfruit is the best meat substitute in Caribbean cooking.', juices:'Blend ripe jackfruit into a thick shake.' },
  '24': { sweet:'Floral, perfume-sweet — intensely tropical.', exotic:'Lychee\'s floral aroma is truly special.', eating:'Peel and eat fresh — avoid the seed.', juices:'Elevates tropical cocktails and punches.' },
  '25': { tart:'Earthy, fig-like — an acquired taste worth experiencing.', exotic:'Stinking toe is one of the Caribbean\'s most unusual fruits.', health:'Protein, calcium, and vitamin B12 — rare for a fruit.' },
  '26': { mild:'Mild, nutty, starchy — like a tropical chestnut.', cooking:'Use like breadfruit in savoury dishes.', health:'Higher in protein than almost any other fruit.' },
};

function getTopReason(id: string, taste: string, useCase: string): string {
  const r = REASONS[id];
  if (!r) return 'A beloved Caribbean tropical fruit with exceptional flavour and nutrition.';
  return r[taste] || r[useCase] || Object.values(r)[0] || 'A beloved Caribbean tropical fruit.';
}

function recommend(taste: string, climate: string, useCase: string): ScoredFruit[] {
  return fruits
    .map(f => {
      let score = 0;
      if (taste && TASTE_MAP[taste]?.includes(f.id)) score += 40;
      if (!climate || climate === 'any') score += 20;
      else if (CLIMATE_MAP[climate]?.includes(f.id)) score += 30;
      if (useCase && USE_CASE_MAP[useCase]?.includes(f.id)) score += 30;
      return { fruit: f, score, reason: getTopReason(f.id, taste, useCase) };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export function FruitRecommenderPage() {
  const [step, setStep] = useState(1);
  const [results, setResults] = useState<ScoredFruit[]>([]);
  const [taste, setTaste] = useState('');
  const [climate, setClimate] = useState('');

  useEffect(() => {
    setupPageSEO({
      title: 'Fruit Recommendation Engine | Find Your Perfect Tropical Fruit',
      description: 'Get personalized tropical fruit recommendations based on taste, climate, and use. Discover your ideal Caribbean fruits.',
      path: '/tools/fruit-recommender',
    });
  }, []);

  const handleUseCaseSelect = (uc: string) => {
    setResults(recommend(taste, climate, uc));
    setStep(4);
  };

  const reset = () => { setStep(1); setTaste(''); setClimate(''); setResults([]); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={[{ label: 'Tools', href: '/tools' }, { label: 'Fruit Recommender' }]} />
          <div className="text-center mt-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">🎯 Fruit Recommendation Engine</h1>
            <p className="text-lg text-white/90">Answer 3 quick questions to discover tropical fruits perfect for you</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Question {step} of 3</span>
              <span className="text-sm font-medium text-gray-600">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-charcoal">What taste profile do you prefer?</h2>
            <div className="space-y-3">
              {[
                { value: 'sweet',  label: '🍯 Sweet & Sugary', desc: 'Like mango, papaya, sugar apple' },
                { value: 'tart',   label: '🍋 Tart & Tangy',   desc: 'Like tamarind, passion fruit, soursop' },
                { value: 'mild',   label: '🥥 Mild & Creamy',  desc: 'Like coconut, breadfruit, avocado' },
                { value: 'exotic', label: '🌟 Bold & Exotic',  desc: 'Like jackfruit, guinep, dragon fruit' },
              ].map(opt => (
                <button key={opt.value} onClick={() => { setTaste(opt.value); setStep(2); }}
                  className="w-full text-left p-4 rounded-xl border-2 transition-all border-gray-200 hover:border-orange-400 hover:bg-orange-50 bg-white">
                  <div className="font-bold text-lg mb-1 text-charcoal">{opt.label}</div>
                  <div className="text-sm text-charcoal-light">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-charcoal">What's your climate like?</h2>
            <div className="space-y-3">
              {[
                { value: 'tropical',    label: '🌴 Tropical',      desc: 'Hot & humid year-round (Caribbean, Hawaii)' },
                { value: 'subtropical', label: '☀️ Subtropical',   desc: 'Warm with mild winters (Florida, Southern CA)' },
                { value: 'temperate',   label: '🌤️ Temperate',    desc: 'Four seasons, cold winters' },
                { value: 'any',         label: '🌍 Just Browsing', desc: "I'm interested regardless of availability" },
              ].map(opt => (
                <button key={opt.value} onClick={() => { setClimate(opt.value); setStep(3); }}
                  className="w-full text-left p-4 rounded-xl border-2 transition-all border-gray-200 hover:border-orange-400 hover:bg-orange-50 bg-white">
                  <div className="font-bold text-lg mb-1 text-charcoal">{opt.label}</div>
                  <div className="text-sm text-charcoal-light">{opt.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-6 text-charcoal-light hover:text-charcoal text-sm">← Back</button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-charcoal">How will you use these fruits?</h2>
            <div className="space-y-3">
              {[
                { value: 'eating',  label: '🍴 Fresh Eating',       desc: 'Just want to enjoy them raw' },
                { value: 'cooking', label: '🍳 Cooking & Recipes',  desc: 'For meals, desserts, or savory dishes' },
                { value: 'juices',  label: '🍹 Juices & Smoothies', desc: 'For drinks and beverages' },
                { value: 'health',  label: '💊 Health & Wellness',  desc: 'For nutritional or medicinal benefits' },
              ].map(opt => (
                <button key={opt.value} onClick={() => handleUseCaseSelect(opt.value)}
                  className="w-full text-left p-4 rounded-xl border-2 transition-all border-gray-200 hover:border-orange-400 hover:bg-orange-50 bg-white">
                  <div className="font-bold text-lg mb-1 text-charcoal">{opt.label}</div>
                  <div className="text-sm text-charcoal-light">{opt.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="mt-6 text-charcoal-light hover:text-charcoal text-sm">← Back</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h2 className="text-3xl font-bold mb-2 text-charcoal">🎉 Your Perfect Fruit Matches!</h2>
              <p className="text-charcoal-light">Based on your preferences — here are the top tropical fruits for you:</p>
            </div>
            <div className="space-y-5">
              {results.map(({ fruit, score, reason }: ScoredFruit, i: number) => (
                <div key={fruit.slug} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0 ${i === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500' : i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' : 'bg-gradient-to-br from-orange-300 to-orange-400'}`}>
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        {fruit.image_url
                          ? <OptimizedImage src={fruit.image_url} alt={fruit.name} className="w-10 h-10 rounded-lg object-cover" />
                          : <span className="text-2xl">{fruit.emoji}</span>}
                        <h3 className="text-xl font-bold text-charcoal">{fruit.name}</h3>
                      </div>
                      <p className="text-xs text-charcoal-light italic mb-3">{fruit.scientific_name}</p>
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-charcoal-light">Match Score:</span>
                          <span className="font-bold text-orange-600">{Math.min(score, 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(score, 100)}%` }} />
                        </div>
                      </div>
                      <p className="text-charcoal text-sm mb-4">{reason}</p>
                      <button onClick={() => navigate(`/fruits/${fruit.slug}`)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2 px-5 rounded-lg hover:scale-105 transition-transform text-sm">
                        Learn More About {fruit.name} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button onClick={reset} className="flex-1 bg-gray-100 text-charcoal font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition">🔄 Try Again</button>
              <button onClick={() => navigate('/fruits')} className="flex-1 bg-gradient-to-r from-caribbean-green to-leaf text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform">🍎 Browse All Fruits</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
