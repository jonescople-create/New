import { setupPageSEO } from '../utils/seo';
import { useState, useEffect } from "react";
import { navigate } from "../App";
import { fruits, type Fruit } from "../data/fruits";
import { getRecipesForFruit } from "../data/recipes";
import { Breadcrumb } from "../components/Breadcrumb";

interface Props {
  preloadA?: string;
  preloadB?: string;
}

export function ComparePage({ preloadA, preloadB }: Props = {}) {
  const [fruitA, setFruitA] = useState<Fruit | null>(null);
  const [fruitB, setFruitB] = useState<Fruit | null>(null);
  const [dropdownA, setDropdownA] = useState(false);
  const [dropdownB, setDropdownB] = useState(false);
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");

  // Preload from URL slugs (e.g. /compare/mango-vs-papaya)

  useEffect(() => {
    setupPageSEO({
      path: '/compare',
      title: 'Compare Caribbean Tropical Fruits Side-by-Side | IslandFruitGuide',
      description: 'Compare the nutrition, taste, health benefits, and uses of Caribbean tropical fruits side-by-side. Find out which fruit is best for your health goals.',
    });
  }, []);
  useEffect(() => {
    if (preloadA) {
      const f = fruits.find(fr => fr.slug === preloadA);
      if (f) setFruitA(f);
    }
    if (preloadB) {
      const f = fruits.find(fr => fr.slug === preloadB);
      if (f) setFruitB(f);
    }
  }, [preloadA, preloadB]);

  const filteredA = fruits.filter(f => f.name.toLowerCase().includes(searchA.toLowerCase()) && f.id !== fruitB?.id);
  const filteredB = fruits.filter(f => f.name.toLowerCase().includes(searchB.toLowerCase()) && f.id !== fruitA?.id);

  const quickPairs = [
    { a: "soursop", b: "custard-apple", label: "Soursop vs Custard Apple" },
    { a: "papaya", b: "banana", label: "Papaya vs Banana" },
    { a: "mango", b: "papaya", label: "Mango vs Papaya" },
    { a: "guava", b: "passion-fruit", label: "Guava vs Passion Fruit" },
    { a: "coconut", b: "avocado", label: "Coconut vs Avocado" },
  ];

  const selectQuickPair = (aSlug: string, bSlug: string) => {
    setFruitA(fruits.find(f => f.slug === aSlug) || null);
    setFruitB(fruits.find(f => f.slug === bSlug) || null);
    navigate(`/compare/${aSlug}-vs-${bSlug}`);
  };

  const renderSelector = (
    selected: Fruit | null,
    setSelected: (f: Fruit) => void,
    showDropdown: boolean,
    setShowDropdown: (b: boolean) => void,
    search: string,
    setSearch: (s: string) => void,
    filtered: Fruit[],
    label: string
  ) => (
    <div className="relative">
      <label className="block text-sm font-medium text-charcoal mb-2">{label}</label>
      {selected ? (
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
          {selected.image_url ? (
            <img src={selected.image_url} alt={selected.name} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <span className="text-3xl w-12 h-12 flex items-center justify-center">{selected.emoji}</span>
          )}
          <div className="flex-1">
            <div className="font-semibold text-charcoal">{selected.name}</div>
            <div className="text-xs text-charcoal-light italic">{selected.scientific_name}</div>
          </div>
          <button
            onClick={() => { setSelected(null as unknown as Fruit); setShowDropdown(false); setSearch(""); }}
            className="text-charcoal-light hover:text-red-500 text-lg"
          >✕</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for a fruit..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none"
          />
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 max-h-64 overflow-y-auto z-50">
              {filtered.map(f => (
                <button
                  key={f.id}
                  onClick={() => { setSelected(f); setShowDropdown(false); setSearch(""); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-leaf/5 transition-colors text-left"
                >
                  {f.image_url ? (
                    <img src={f.image_url} alt={f.name} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <span className="text-xl w-8 h-8 flex items-center justify-center">{f.emoji}</span>
                  )}
                  <div>
                    <div className="font-medium text-charcoal text-sm">{f.name}</div>
                    <div className="text-xs text-charcoal-light">{f.scientific_name}</div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-charcoal-light text-sm">No fruits found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderRow = (label: string, icon: string, valA: string, valB: string) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-charcoal whitespace-nowrap">
        <span className="mr-2">{icon}</span>{label}
      </td>
      <td className="px-4 py-3 text-sm text-charcoal-light">{valA}</td>
      <td className="px-4 py-3 text-sm text-charcoal-light">{valB}</td>
    </tr>
  );

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Compare Fruits" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">
            Fruit Comparison Tool 🔄
          </h1>
          <p className="text-white/80 mt-3 text-lg max-w-2xl">
            Compare two tropical fruits side-by-side — nutrition, taste, health benefits, seasonality, and more.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Quick Compare Pairs */}
        <div className="mb-8">
          <p className="text-sm text-charcoal-light mb-3">Quick comparisons:</p>
          <div className="flex flex-wrap gap-2">
            {quickPairs.map(pair => (
              <button
                key={pair.label}
                onClick={() => selectQuickPair(pair.a, pair.b)}
                className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-leaf hover:bg-leaf/5 transition-colors text-charcoal-light hover:text-leaf"
              >
                {pair.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selectors */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {renderSelector(fruitA, setFruitA, dropdownA, setDropdownA, searchA, setSearchA, filteredA, "Fruit 1")}
          {renderSelector(fruitB, setFruitB, dropdownB, setDropdownB, searchB, setSearchB, filteredB, "Fruit 2")}
        </div>

        {/* Comparison Table */}
        {fruitA && fruitB && (
          <div className="animate-fade-in">
            {/* Header with images */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div></div>
              <button onClick={() => navigate(`/fruits/${fruitA.slug}`)} className="flex flex-col items-center gap-2 group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-leaf/30 group-hover:border-leaf transition-colors">
                  {fruitA.image_url ? (
                    <img src={fruitA.image_url} alt={fruitA.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: `${fruitA.color}22` }}>{fruitA.emoji}</div>
                  )}
                </div>
                <span className="font-heading font-bold text-charcoal group-hover:text-leaf transition-colors">{fruitA.name}</span>
              </button>
              <button onClick={() => navigate(`/fruits/${fruitB.slug}`)} className="flex flex-col items-center gap-2 group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-mango/30 group-hover:border-mango transition-colors">
                  {fruitB.image_url ? (
                    <img src={fruitB.image_url} alt={fruitB.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: `${fruitB.color}22` }}>{fruitB.emoji}</div>
                  )}
                </div>
                <span className="font-heading font-bold text-charcoal group-hover:text-mango transition-colors">{fruitB.name}</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-charcoal-light uppercase tracking-wider">Attribute</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-leaf uppercase tracking-wider">{fruitA.name}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-mango uppercase tracking-wider">{fruitB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {renderRow("Scientific Name", "🔬", fruitA.scientific_name, fruitB.scientific_name)}
                  {renderRow("Origin", "🌍", fruitA.origin, fruitB.origin)}
                  {renderRow("Season", "📅", fruitA.seasonality, fruitB.seasonality)}
                  {renderRow("Nutrition", "📊", fruitA.nutrition, fruitB.nutrition)}
                  {renderRow("Categories", "🏷️", fruitA.category.join(", "), fruitB.category.join(", "))}
                  {renderRow("Recipes", "🍽️",
                    `${getRecipesForFruit(fruitA.id).length} recipe${getRecipesForFruit(fruitA.id).length !== 1 ? "s" : ""}`,
                    `${getRecipesForFruit(fruitB.id).length} recipe${getRecipesForFruit(fruitB.id).length !== 1 ? "s" : ""}`
                  )}
                  {renderRow("Views", "👁️", fruitA.views.toLocaleString(), fruitB.views.toLocaleString())}
                </tbody>
              </table>
            </div>

            {/* Health Benefits Comparison */}
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-green-100">
                <h3 className="font-heading font-bold text-lg text-charcoal mb-4">💚 {fruitA.name} Benefits</h3>
                <ul className="space-y-2">
                  {fruitA.health_benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-charcoal-light">
                      <span className="w-5 h-5 bg-leaf text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <h3 className="font-heading font-bold text-lg text-charcoal mb-4">💚 {fruitB.name} Benefits</h3>
                <ul className="space-y-2">
                  {fruitB.health_benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-charcoal-light">
                      <span className="w-5 h-5 bg-mango text-charcoal rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* How to Eat */}
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-heading font-bold text-charcoal mb-3">🍴 How to Eat {fruitA.name}</h3>
                <p className="text-sm text-charcoal-light leading-relaxed">{fruitA.how_to_eat}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-heading font-bold text-charcoal mb-3">🍴 How to Eat {fruitB.name}</h3>
                <p className="text-sm text-charcoal-light leading-relaxed">{fruitB.how_to_eat}</p>
              </div>
            </div>

            {/* Storage */}
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-heading font-bold text-charcoal mb-3">📦 Storage — {fruitA.name}</h3>
                <p className="text-sm text-charcoal-light leading-relaxed">{fruitA.storage}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-heading font-bold text-charcoal mb-3">📦 Storage — {fruitB.name}</h3>
                <p className="text-sm text-charcoal-light leading-relaxed">{fruitB.storage}</p>
              </div>
            </div>

            {/* Links */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <button onClick={() => navigate(`/fruits/${fruitA.slug}`)} className="btn-primary text-sm">
                View {fruitA.name} Guide →
              </button>
              <button onClick={() => navigate(`/fruits/${fruitB.slug}`)} className="btn-secondary text-sm">
                View {fruitB.name} Guide →
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!fruitA || !fruitB) && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <span className="text-6xl block mb-4">🔄</span>
            <h2 className="font-heading text-xl font-bold text-charcoal mb-2">Select Two Fruits to Compare</h2>
            <p className="text-charcoal-light max-w-md mx-auto">
              Choose two fruits from the dropdowns above, or click a quick comparison pair to see a detailed side-by-side analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
