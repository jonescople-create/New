import { setupPageSEO } from '../utils/seo';
import { useState, useEffect } from "react";
import { navigate } from "../App";
import { getWishlist, addToWishlist, removeFromWishlist } from '../utils/db';
import { getFavorites, toggleFruitFavorite, toggleRecipeFavorite } from "../utils/favorites";
import { getFruitById, type Fruit } from "../data/fruits";
import { recipes, type Recipe } from "../data/recipes";
import { Breadcrumb } from "../components/Breadcrumb";

export function WishlistPage() {
  const [favFruits, setFavFruits] = useState<Fruit[]>([]);
  const [favRecipes, setFavRecipes] = useState<Recipe[]>([]);

  const reload = () => {
    const fav = getFavorites();
    setFavFruits(fav.fruits.map(id => getFruitById(id)).filter(Boolean) as Fruit[]);
    setFavRecipes(fav.recipes.map(id => recipes.find(r => r.id === id)).filter(Boolean) as Recipe[]);
  };


  useEffect(() => {
    setupPageSEO({
      path: '/wishlist',
      title: 'My Fruit Wishlist | IslandFruitGuide',
      description: 'Your saved Caribbean fruits and recipes on IslandFruitGuide. Build your tropical fruit wishlist and never miss a seasonal favourite.',
    });
  }, []);
  useEffect(() => { reload(); }, []);

  const removeFruit = (id: string) => { toggleFruitFavorite(id); reload(); };
  const removeRecipe = (id: string) => { toggleRecipeFavorite(id); reload(); };

  const totalItems = favFruits.length + favRecipes.length;

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-coral to-mango text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "My Wishlist" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">
            My Wishlist ❤️
          </h1>
          <p className="text-white/80 mt-3 text-lg max-w-2xl">
            {totalItems > 0
              ? `You have ${totalItems} saved item${totalItems !== 1 ? "s" : ""}. Come back anytime to continue exploring.`
              : "Your wishlist is empty. Browse fruits and recipes and tap the ❤️ to save them here."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {totalItems === 0 && (
          <div className="text-center py-20">
            <span className="text-7xl block mb-6">💛</span>
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-3">Nothing saved yet</h2>
            <p className="text-charcoal-light mb-8 max-w-md mx-auto">
              Tap the ❤️ icon on any fruit, recipe, or product to add it to your wishlist for easy access later.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => navigate("/fruits")} className="btn-primary">🍎 Explore Fruits</button>
              <button onClick={() => navigate("/recipes")} className="btn-secondary">🍽️ Browse Recipes</button>
            </div>
          </div>
        )}

        {/* Saved Fruits */}
        {favFruits.length > 0 && (
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
              🍎 Saved Fruits ({favFruits.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {favFruits.map(fruit => (
                <div key={fruit.id} className="fruit-card-hover bg-white rounded-2xl border border-gray-100 text-left group relative overflow-hidden">
                  <button
                    onClick={() => removeFruit(fruit.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    ❤️
                  </button>
                  <button onClick={() => navigate(`/fruits/${fruit.slug}`)} className="w-full text-left p-4">
                    <div className="w-full aspect-square rounded-xl mb-3 overflow-hidden">
                      {fruit.image_url ? (
                        <img src={fruit.image_url} alt={fruit.name} loading="lazy" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${fruit.color}22, ${fruit.color}44)` }}>{fruit.emoji}</div>
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-charcoal group-hover:text-leaf transition-colors">{fruit.name}</h3>
                    <p className="text-xs text-charcoal-light italic">{fruit.scientific_name}</p>
                    <span className="inline-flex items-center gap-1 text-leaf text-sm font-medium mt-2">View Guide →</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Saved Recipes */}
        {favRecipes.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
              🍽️ Saved Recipes ({favRecipes.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favRecipes.map(recipe => (
                <div key={recipe.id} className="recipe-card-hover bg-white rounded-2xl border border-gray-100 text-left group relative overflow-hidden">
                  <button
                    onClick={() => removeRecipe(recipe.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    ❤️
                  </button>
                  <button onClick={() => navigate(`/recipes/${recipe.slug}`)} className="w-full text-left">
                    <div className="w-full h-48 bg-gradient-to-br from-mango/20 via-coral/10 to-leaf/20 overflow-hidden">
                      {recipe.image_url ? (
                        <img src={recipe.image_url} alt={recipe.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-semibold text-charcoal group-hover:text-leaf transition-colors">{recipe.title}</h3>
                      <p className="text-sm text-charcoal-light mt-1 line-clamp-2">{recipe.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-charcoal-light">
                        <span>⏱️ {recipe.prep_time}</span>
                        <span>•</span>
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
