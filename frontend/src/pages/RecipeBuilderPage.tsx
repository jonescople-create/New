import { useState, useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';
import { navigate } from '../App';
import { fruits } from '../data/fruits';
import { recipes, type Recipe } from '../data/recipes';
import { OptimizedImage } from '../components/OptimizedImage';
import { Breadcrumb } from '../components/Breadcrumb';

// Map fruit id → list of fruit ids it's commonly paired with
const PAIRING_MAP: Record<string, string[]> = {
  '1': ['2', '11'],
  '2': ['1', '11', '5'],
  '3': [],
  '5': ['8', '6', '22'],
  '6': ['8', '10'],
  '8': ['6', '13', '10'],
  '10': ['6', '8'],
  '11': ['1', '2', '22'],
  '12': [],
  '13': ['8', '5'],
  '15': [],
  '18': ['24'],
  '22': ['11', '5'],
  '24': ['18'],
};

function findRecipesForFruits(selectedIds: string[]): Recipe[] {
  if (selectedIds.length === 0) return [];
  return recipes
    .filter(r => r.related_fruit_ids.some(id => selectedIds.includes(id)))
    .sort((a, b) => {
      const aMatches = a.related_fruit_ids.filter(id => selectedIds.includes(id)).length;
      const bMatches = b.related_fruit_ids.filter(id => selectedIds.includes(id)).length;
      return bMatches - aMatches;
    });
}

function getSuggestedPairings(selectedIds: string[]): string[] {
  const suggestions = new Set<string>();
  for (const id of selectedIds) {
    (PAIRING_MAP[id] || []).forEach(pid => {
      if (!selectedIds.includes(pid)) suggestions.add(pid);
    });
  }
  return [...suggestions].slice(0, 4);
}

export function RecipeBuilderPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [results, setResults] = useState<Recipe[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setupPageSEO({
      title: 'Recipe Builder Tool | Find Recipes for Your Tropical Fruits',
      description: 'Select your available tropical fruits and discover delicious Caribbean recipes you can make right now. No ingredient waste!',
      path: '/tools/recipe-builder',
    });
  }, []);

  const displayedFruits = fruits.filter(f =>
    !search || f.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const findRecipes = () => {
    setResults(findRecipesForFruits(selectedIds));
    setShowResults(true);
  };

  const reset = () => { setSelectedIds([]); setResults([]); setShowResults(false); setSearch(''); };

  const pairings = getSuggestedPairings(selectedIds);
  const selectedFruits = fruits.filter(f => selectedIds.includes(f.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      <div className="bg-gradient-to-r from-caribbean-green to-leaf py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb items={[{ label: 'Tools', href: '/tools' }, { label: 'Recipe Builder' }]} />
          <div className="text-center mt-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">🍹 Recipe Builder</h1>
            <p className="text-lg text-white/90">Select your fruits and discover delicious recipes you can make today</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {!showResults ? (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal">Select Your Available Fruits</h2>
                  <p className="text-charcoal-light mt-1 text-sm">Choose fruits you have on hand — we'll find recipes you can make right now!</p>
                </div>
                {selectedIds.length > 0 && (
                  <span className="inline-flex items-center gap-2 bg-leaf/10 text-leaf font-bold px-4 py-2 rounded-xl text-sm whitespace-nowrap">
                    ✓ {selectedIds.length} selected
                  </span>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search fruits..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none text-sm" />
              </div>

              {/* Selected chips */}
              {selectedFruits.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5 p-3 bg-leaf/5 rounded-xl">
                  {selectedFruits.map(f => (
                    <button key={f.id} onClick={() => toggle(f.id)}
                      className="inline-flex items-center gap-1.5 bg-leaf text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-leaf/80 transition-colors">
                      {f.emoji} {f.name} ✕
                    </button>
                  ))}
                </div>
              )}

              {/* Fruit grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {displayedFruits.map(f => (
                  <button key={f.id} onClick={() => toggle(f.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 font-medium transition-all text-left text-sm ${
                      selectedIds.includes(f.id)
                        ? 'border-leaf bg-leaf text-white shadow-md scale-105'
                        : 'border-gray-200 bg-white text-charcoal hover:border-leaf/60 hover:bg-leaf/5'
                    }`}>
                    {f.image_url
                      ? <OptimizedImage src={f.image_url} alt={f.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      : <span className="text-xl flex-shrink-0">{f.emoji}</span>}
                    <span className="truncate">{f.name}</span>
                    {selectedIds.includes(f.id) && <span className="ml-auto flex-shrink-0">✓</span>}
                  </button>
                ))}
              </div>

              {/* Smart pairings suggestion */}
              {pairings.length > 0 && (
                <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-bold text-amber-900 mb-2">💡 These fruits pair great with your selection:</p>
                  <div className="flex flex-wrap gap-2">
                    {pairings.map(pid => {
                      const pf = fruits.find(f => f.id === pid);
                      if (!pf) return null;
                      return (
                        <button key={pid} onClick={() => toggle(pid)}
                          className="inline-flex items-center gap-1.5 bg-white border border-amber-300 text-amber-900 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors">
                          {pf.emoji} {pf.name} +
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={findRecipes} disabled={selectedIds.length === 0}
                  className="flex-1 bg-gradient-to-r from-caribbean-green to-leaf text-white font-bold py-3.5 px-8 rounded-xl hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                  Find Recipes ({selectedIds.length})
                </button>
                {selectedIds.length > 0 && (
                  <button onClick={reset} className="px-5 py-3.5 bg-gray-100 text-charcoal font-medium rounded-xl hover:bg-gray-200 transition">Clear</button>
                )}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="font-bold text-amber-900 mb-2">💡 Pro Tips</p>
              <ul className="text-sm text-amber-900 space-y-1 list-disc list-inside">
                <li>Select multiple fruits to find recipes combining them</li>
                <li>Don't see your fruit? Try similar ones — recipes use related ingredients</li>
                <li>Our recipe packs in the store have 100+ more Caribbean recipes!</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h2 className="text-3xl font-bold mb-2 text-charcoal">
                {results.length > 0 ? `🎉 Found ${results.length} Recipe${results.length !== 1 ? 's' : ''}!` : '😔 No Exact Matches'}
              </h2>
              <p className="text-charcoal-light">
                {results.length > 0
                  ? <>Delicious recipes using: <strong>{selectedFruits.map(f => f.name).join(', ')}</strong></>
                  : 'Try different fruit combinations or browse all our recipes.'}
              </p>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {results.map(r => {
                  const matchedNames = fruits
                    .filter(f => r.related_fruit_ids.includes(f.id) && selectedIds.includes(f.id))
                    .map(f => f.name);
                  return (
                    <div key={r.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      {r.image_url && (
                        <OptimizedImage src={r.image_url} alt={r.title} className="w-full h-40 object-cover" />
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-charcoal mb-2">{r.title}</h3>
                        <p className="text-sm text-charcoal-light mb-3 line-clamp-2">{r.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {matchedNames.map(name => (
                            <span key={name} className="px-2.5 py-1 bg-leaf/10 text-leaf text-xs font-medium rounded-full">✓ {name}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-charcoal-light mb-4">
                          <span>⏱️ {r.prep_time}</span>
                          <span>🍳 {r.cook_time}</span>
                          <span>👥 {r.servings} servings</span>
                          <span>📊 {r.difficulty}</span>
                        </div>
                        <button onClick={() => navigate(`/recipes/${r.slug}`)}
                          className="w-full bg-gradient-to-r from-caribbean-green to-leaf text-white font-bold py-2.5 px-4 rounded-xl hover:scale-105 transition-transform text-sm">
                          View Full Recipe →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center mb-6">
                <div className="text-5xl mb-3">🤔</div>
                <h3 className="text-xl font-bold text-charcoal mb-2">No Exact Matches</h3>
                <p className="text-charcoal-light mb-4">Try different fruit combinations or explore all our recipes for inspiration!</p>
                <button onClick={() => navigate('/recipes')} className="bg-leaf text-white font-bold py-2.5 px-6 rounded-xl hover:scale-105 transition-transform">Browse All Recipes →</button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={reset} className="flex-1 bg-gray-100 text-charcoal font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition">🔄 Try Different Fruits</button>
              <button onClick={() => navigate('/store')} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform">🛒 Browse Recipe Packs</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
