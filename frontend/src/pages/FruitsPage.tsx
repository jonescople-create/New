import { setupPageSEO } from '../utils/seo';
import { useEffect, useState } from 'react';;
import { navigate } from "../App";
import { fruits, searchFruits, getFruitsByCategory } from "../data/fruits";
import { FruitCard } from "../components/FruitCard";
import { Breadcrumb } from "../components/Breadcrumb";

export function FruitsPage() {
  useEffect(() => {
    setupPageSEO({
      path: '/fruits',
      title: 'Caribbean & Tropical Fruits A-Z | IslandFruitGuide',
      description: 'Browse all 26 Caribbean and tropical fruits. Detailed guides on health benefits, nutrition, recipes, and seasonal availability for every fruit in the Caribbean.',
    });
  }, []);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { key: "all", label: "All Fruits" },
    { key: "popular", label: "🌟 Popular" },
    { key: "seasonal", label: "🌦️ Seasonal" },
    { key: "rare", label: "💎 Rare" },
    { key: "medicinal", label: "💚 Medicinal" },
  ];

  let displayFruits = activeCategory === "all" ? fruits : getFruitsByCategory(activeCategory);
  if (query.length > 1) {
    displayFruits = searchFruits(query);
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Fruits" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">
            Tropical Fruit Encyclopedia 🌴
          </h1>
          <p className="text-white/80 mt-3 text-lg max-w-2xl">
            Explore our comprehensive guide to Caribbean and tropical fruits. Learn about health benefits, seasonality, and how to enjoy each one.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search fruits..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setQuery(""); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? "bg-leaf text-white shadow-md"
                    : "bg-white border border-gray-200 text-charcoal-light hover:border-leaf hover:text-leaf"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-charcoal-light mb-6">
          Showing {displayFruits.length} fruit{displayFruits.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayFruits.map(fruit => (
            <FruitCard key={fruit.id} fruit={fruit} />
          ))}
        </div>

        {displayFruits.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-lg text-charcoal-light">No fruits found matching your search.</p>
          </div>
        )}

        {/* ===== CONTEXTUAL LINKS ===== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-10 border-t border-gray-100">
          <button onClick={() => navigate("/compare")} className="fruit-card-hover bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-100 text-left group cursor-pointer">
            <span className="text-2xl block mb-2">⚖️</span>
            <h3 className="font-heading font-semibold text-charcoal group-hover:text-purple-700 transition-colors text-sm">Compare Fruits</h3>
            <p className="text-xs text-charcoal-light mt-1">Nutrition side by side</p>
          </button>
          <button onClick={() => navigate("/fruit-match-up")} className="fruit-card-hover bg-gradient-to-br from-mango/10 to-coral/10 rounded-2xl p-5 border border-mango/20 text-left group cursor-pointer">
            <span className="text-2xl block mb-2">🏆</span>
            <h3 className="font-heading font-semibold text-charcoal group-hover:text-amber-700 transition-colors text-sm">Fruit Match-Up</h3>
            <p className="text-xs text-charcoal-light mt-1">Find your superfruit</p>
          </button>
          <button onClick={() => navigate("/quiz")} className="fruit-card-hover bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 text-left group cursor-pointer">
            <span className="text-2xl block mb-2">🧠</span>
            <h3 className="font-heading font-semibold text-charcoal group-hover:text-amber-700 transition-colors text-sm">Fruit IQ Quiz</h3>
            <p className="text-xs text-charcoal-light mt-1">Test your knowledge</p>
          </button>
          <button onClick={() => navigate("/seasonal-fruits")} className="fruit-card-hover bg-gradient-to-br from-leaf/5 to-emerald-50 rounded-2xl p-5 border border-leaf/10 text-left group cursor-pointer">
            <span className="text-2xl block mb-2">📅</span>
            <h3 className="font-heading font-semibold text-charcoal group-hover:text-leaf transition-colors text-sm">Seasonal Guide</h3>
            <p className="text-xs text-charcoal-light mt-1">What's ripe now</p>
          </button>
        </div>
      </div>
    </div>
  );
}
