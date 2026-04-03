import { setupPageSEO } from '../utils/seo';
import { useEffect, useState } from 'react';;
import { navigate } from "../App";
import { fruits, searchFruits } from "../data/fruits";
import { recipes } from "../data/recipes";
import { Breadcrumb } from "../components/Breadcrumb";

export function FoodAIPage() {
  useEffect(() => {
    setupPageSEO({
      path: '/food-ai',
      title: 'Caribbean Food AI — Get Meal Suggestions from Ingredients | IslandFruitGuide',
      description: 'Tell us what Caribbean fruits and ingredients you have — our Food AI suggests authentic Caribbean recipes you can make right now.',
    });
  }, []);

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<{
    matchedFruits: typeof fruits;
    suggestedRecipes: typeof recipes;
    nutritionTips: string[];
    mealIdeas: string[];
  } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const quickIngredients = [
    "Mango", "Coconut", "Breadfruit", "Ackee", "Soursop", 
    "Papaya", "Banana", "Guava", "Passion Fruit", "Tamarind"
  ];

  const addIngredient = (ing: string) => {
    if (!ingredients.includes(ing)) {
      setIngredients([...ingredients, ing]);
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addIngredient(inputValue.trim());
      setInputValue("");
    }
  };

  const analyzeIngredients = () => {
    if (ingredients.length === 0) return;
    
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const matchedFruits = ingredients.flatMap(ing => searchFruits(ing)).filter((f, i, arr) => arr.findIndex(x => x.id === f.id) === i);
      
      const suggestedRecipes = recipes.filter(r => 
        r.related_fruit_ids.some(id => matchedFruits.some(f => f.id === id)) ||
        r.ingredients.some(i => ingredients.some(ing => i.toLowerCase().includes(ing.toLowerCase())))
      );

      const nutritionTips = [
        `Your ingredients are rich in Vitamin C, supporting immune health.`,
        `High fiber content helps with digestion and gut health.`,
        `Natural sugars provide quick energy without the crash.`,
        `Antioxidants in these fruits fight cellular damage.`,
      ];

      const mealIdeas = [
        `Tropical smoothie bowl with ${ingredients.slice(0, 2).join(" and ")}`,
        `Fresh fruit salad with lime and mint`,
        `Caribbean-style fruit chutney`,
        `Refreshing tropical juice blend`,
      ];

      setResults({ matchedFruits, suggestedRecipes, nutritionTips, mealIdeas });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Food AI" }]} />
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🍽️</span>
            <h1 className="font-heading text-3xl lg:text-5xl font-bold">
              Food & Nutrition AI
            </h1>
          </div>
          <p className="text-white/80 mt-3 text-lg max-w-2xl">
            Tell us what ingredients you have, and we'll suggest meals, nutrition info, and recipes tailored to Caribbean tropical foods.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            {/* Quick Add */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
              <h2 className="font-heading text-xl font-bold text-charcoal mb-4">
                🥭 Quick Add Ingredients
              </h2>
              <div className="flex flex-wrap gap-2">
                {quickIngredients.map(ing => (
                  <button
                    key={ing}
                    onClick={() => addIngredient(ing)}
                    disabled={ingredients.includes(ing)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      ingredients.includes(ing)
                        ? "bg-leaf/20 text-leaf cursor-not-allowed"
                        : "bg-gray-100 text-charcoal hover:bg-leaf hover:text-white"
                    }`}
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
              <h2 className="font-heading text-xl font-bold text-charcoal mb-4">
                ✍️ Add Custom Ingredient
              </h2>
              <form onSubmit={handleInputSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type an ingredient..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none"
                />
                <button type="submit" className="btn-primary">
                  Add
                </button>
              </form>
            </div>

            {/* Selected Ingredients */}
            {ingredients.length > 0 && (
              <div className="bg-gradient-to-br from-mango/10 to-coral/10 rounded-2xl p-6 border border-mango/20 mb-6">
                <h2 className="font-heading text-xl font-bold text-charcoal mb-4">
                  🧺 Your Ingredients ({ingredients.length})
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {ingredients.map(ing => (
                    <span
                      key={ing}
                      className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-sm font-medium text-charcoal border border-gray-200"
                    >
                      {ing}
                      <button
                        onClick={() => removeIngredient(ing)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={analyzeIngredients}
                  disabled={analyzing}
                  className="btn-primary w-full justify-center"
                >
                  {analyzing ? (
                    <>
                      <span className="animate-spin">⏳</span> Analyzing...
                    </>
                  ) : (
                    <>🤖 Get AI Suggestions</>
                  )}
                </button>
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="space-y-6 animate-fade-in">
                {/* Matched Fruits */}
                {results.matchedFruits.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="font-heading text-xl font-bold text-charcoal mb-4">
                      🍎 Matched Fruits in Our Database
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {results.matchedFruits.map(fruit => (
                        <button
                          key={fruit.id}
                          onClick={() => navigate(`/fruits/${fruit.slug}`)}
                          className="flex items-center gap-3 p-3 rounded-xl bg-leaf/5 hover:bg-leaf/10 transition-colors text-left"
                        >
                          {fruit.image_url ? (
                            <img src={fruit.image_url} alt={fruit.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <span className="text-3xl">{fruit.emoji}</span>
                          )}
                          <div>
                            <div className="font-medium text-charcoal text-sm">{fruit.name}</div>
                            <div className="text-xs text-leaf">View Guide →</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meal Ideas */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                  <h2 className="font-heading text-xl font-bold text-charcoal mb-4">
                    💡 Meal Ideas
                  </h2>
                  <ul className="space-y-2">
                    {results.mealIdeas.map((idea, i) => (
                      <li key={i} className="flex items-center gap-3 text-charcoal-light">
                        <span className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                        {idea}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nutrition Tips */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-green-100">
                  <h2 className="font-heading text-xl font-bold text-charcoal mb-4">
                    💚 Nutrition Insights
                  </h2>
                  <ul className="space-y-2">
                    {results.nutritionTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-charcoal-light text-sm">
                        <span className="w-5 h-5 bg-leaf text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Recipes */}
                {results.suggestedRecipes.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="font-heading text-xl font-bold text-charcoal mb-4">
                      🍽️ Suggested Recipes
                    </h2>
                    <div className="space-y-3">
                      {results.suggestedRecipes.slice(0, 4).map(recipe => (
                        <button
                          key={recipe.id}
                          onClick={() => navigate(`/recipes/${recipe.slug}`)}
                          className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-mango/5 transition-colors text-left"
                        >
                          {recipe.image_url ? (
                            <img src={recipe.image_url} alt={recipe.title} className="w-16 h-16 rounded-lg object-cover" />
                          ) : (
                            <span className="w-16 h-16 rounded-lg bg-mango/20 flex items-center justify-center text-2xl">🍽️</span>
                          )}
                          <div>
                            <div className="font-medium text-charcoal">{recipe.title}</div>
                            <div className="text-xs text-charcoal-light mt-1">⏱️ {recipe.prep_time} • {recipe.difficulty}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* How it works */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-heading font-bold text-lg text-charcoal mb-4">How It Works</h3>
                <ol className="space-y-3 text-sm text-charcoal-light">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-leaf text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    Add ingredients you have available
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-leaf text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    Click "Get AI Suggestions"
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-leaf text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    Get personalized meal ideas and recipes
                  </li>
                </ol>
              </div>

              {/* Explore More */}
              <div className="bg-gradient-to-br from-leaf to-leaf-light rounded-2xl p-6 text-white">
                <h3 className="font-heading font-bold text-lg mb-2">🌴 Explore Fruits</h3>
                <p className="text-white/80 text-sm mb-4">Browse our complete tropical fruit database for more inspiration.</p>
                <button onClick={() => navigate("/fruits")} className="w-full bg-white text-leaf font-semibold px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  View All Fruits
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
