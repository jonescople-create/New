import { setupPageSEO } from '../utils/seo';
import { useEffect, useState } from 'react';;
import { navigate } from "../App";
import { RecipeCard } from "../components/RecipeCard";
import { Breadcrumb } from "../components/Breadcrumb";
import { recipes as allRecipes, type Recipe } from "../data/recipes";

export function RecipesPage() {
  useEffect(() => {
    setupPageSEO({
      path: '/recipes',
      title: 'Caribbean Tropical Fruit Recipes | IslandFruitGuide',
      description: 'Discover 22+ authentic Caribbean and tropical fruit recipes. From classic Jamaican soursop juice to exotic dragon fruit smoothies and traditional Caribbean desserts.',
    });
  }, []);

  const [query, setQuery] = useState("");

  const displayRecipes = query.length > 1 
    ? allRecipes.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description?.toLowerCase().includes(query.toLowerCase())
      )
    : allRecipes;

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-coral to-mango text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Recipes" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">
            Caribbean Fruit Recipes 🍽️
          </h1>
          <p className="text-white/80 mt-3 text-lg max-w-2xl">
            22+ traditional and modern recipes featuring Caribbean and tropical fruits. From Jamaica's ackee and saltfish to energizing smoothies and healing drinks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="relative max-w-md mb-8">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none transition-all"
          />
        </div>

        <p className="text-sm text-charcoal-light mb-6">
          {displayRecipes.length} recipe{displayRecipes.length !== 1 ? "s" : ""}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {displayRecipes.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🍽️</span>
            <p className="text-lg text-charcoal-light">No recipes found matching your search.</p>
          </div>
        )}

        {/* ===== CONTEXTUAL LINKS ===== */}
        <div className="grid sm:grid-cols-3 gap-4 mt-12 pt-10 border-t border-gray-100">
          <button onClick={() => navigate("/blog")} className="fruit-card-hover bg-gradient-to-br from-leaf/5 to-emerald-50 rounded-2xl p-5 border border-leaf/10 text-left group cursor-pointer">
            <span className="text-2xl block mb-2">📝</span>
            <h3 className="font-heading font-semibold text-charcoal group-hover:text-leaf transition-colors text-sm">Read Our Blog</h3>
            <p className="text-xs text-charcoal-light mt-1">Expert articles on tropical fruit nutrition, recipes, and health benefits.</p>
          </button>
          <button onClick={() => navigate("/store/ebooks")} className="fruit-card-hover bg-gradient-to-br from-mango/10 to-coral/10 rounded-2xl p-5 border border-mango/20 text-left group cursor-pointer">
            <span className="text-2xl block mb-2">📚</span>
            <h3 className="font-heading font-semibold text-charcoal group-hover:text-amber-700 transition-colors text-sm">Recipe Ebooks</h3>
            <p className="text-xs text-charcoal-light mt-1">Get 115+ recipes in our 4 ebook collections - smoothies, healing drinks, gym energy, and more!</p>
          </button>
          <button onClick={() => navigate("/fruits")} className="fruit-card-hover bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 text-left group cursor-pointer">
            <span className="text-2xl block mb-2">🌴</span>
            <h3 className="font-heading font-semibold text-charcoal group-hover:text-amber-700 transition-colors text-sm">Fruit Encyclopedia</h3>
            <p className="text-xs text-charcoal-light mt-1">Explore 26+ Caribbean fruits with health benefits and guides.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
