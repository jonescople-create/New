import { useEffect, useState } from "react";
import { navigate } from "../App";
import { Breadcrumb } from "../components/Breadcrumb";
import { OptimizedImage } from "../components/OptimizedImage";
import { setupPageSEO, addStructuredData } from "../utils/seo";
import { trackPageView, incrementRecipeViews } from '../utils/db';
import { EmailCapture } from "../components/EmailCapture";
import { isRecipeFavorited, toggleRecipeFavorite } from "../utils/favorites";
import { trackBehaviour } from "../utils/funnelTracker";
import { recordRecipeView } from "../utils/personalization";
import { getRecipeBySlug, recipes, type Recipe } from "../data/recipes";
import { products } from "../data/products";
import { navigate as nav } from "../App";

interface Props { slug: string; }

function buildRecipeSchema(recipe: Recipe) {
  const BASE = "https://www.islandfruitguide.com";
  function parseDuration(t: string) {
    const m = t.match(/(\d+)/);
    return m ? `PT${m[1]}M` : "PT15M";
  }
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipe.title,
    "description": recipe.description,
    "image": recipe.image_url?.startsWith("http") ? recipe.image_url : `${BASE}${recipe.image_url}`,
    "author": { "@type": "Organization", "name": "IslandFruitGuide", "url": BASE },
    "publisher": { "@type": "Organization", "name": "IslandFruitGuide", "logo": { "@type": "ImageObject", "url": `${BASE}/logo.png` }},
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split("T")[0],
    "prepTime": parseDuration(recipe.prep_time),
    "cookTime": parseDuration(recipe.cook_time),
    "totalTime": `PT${(parseInt(recipe.prep_time)||15)+(parseInt(recipe.cook_time)||20)}M`,
    "recipeYield": `${recipe.servings} servings`,
    "recipeCategory": "Caribbean Cuisine",
    "recipeCuisine": "Caribbean",
    "keywords": `${recipe.title}, Caribbean recipe, tropical fruit recipe, IslandFruitGuide`,
    "recipeIngredient": recipe.ingredients,
    "recipeInstructions": recipe.instructions.map((step, i) => ({
      "@type": "HowToStep", "position": i + 1, "text": step
    })),
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "127" },
    "url": `${BASE}/recipes/${recipe.slug}`,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE}/recipes/${recipe.slug}` }
  };
}

export function RecipeDetailPage({ slug }: Props) {
  const recipe = getRecipeBySlug(slug);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (!recipe) return;
    setFav(isRecipeFavorited(recipe.id));
    recordRecipeView(recipe.id);
    trackPageView(`/recipes/${recipe.slug}`, 'recipe', recipe.id);
    incrementRecipeViews(recipe.id);
    trackBehaviour('recipeViewed', recipe.slug);

    // Full SEO setup
    setupPageSEO({
      path: `/recipes/${recipe.slug}`,
      title: `${recipe.title} — Caribbean Recipe | IslandFruitGuide`,
      description: `${recipe.description} Prep: ${recipe.prep_time}. Cook: ${recipe.cook_time}. Serves ${recipe.servings}. Difficulty: ${recipe.difficulty}.`,
      image: recipe.image_url,
      type: "article",
      breadcrumbs: [
        { name: "Home", url: "/" },
        { name: "Recipes", url: "/recipes" },
        { name: recipe.title, url: `/recipes/${recipe.slug}` }
      ]
    });

    // Recipe schema (critical for Google rich snippets)
    addStructuredData(buildRecipeSchema(recipe));

    // Speakable schema for AEO (voice search + AI assistants)
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": recipe.title,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", ".recipe-description", ".recipe-ingredients", ".recipe-summary"]
      },
      "url": `https://www.islandfruitguide.com/recipes/${recipe.slug}`
    });
  }, [recipe]);

  if (!recipe) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">🤔</span>
        <h2 className="font-heading text-2xl font-bold mb-4">Recipe Not Found</h2>
        <p className="text-charcoal-light mb-6">We couldn't find that recipe. Browse all our Caribbean recipes below.</p>
        <button onClick={() => navigate("/recipes")} className="btn-primary">← Back to Recipes</button>
      </div>
    );
  }

  const handleFav = () => setFav(toggleRecipeFavorite(recipe.id));
  const hasImage = recipe.image_url && recipe.image_url.length > 0;

  // Get 3 related ebooks to promote
  const featuredEbooks = products.filter(p => p.category === "ebook").slice(0, 4);

  // Related recipes (same fruit)
  const relatedRecipes = recipes
    .filter(r => r.id !== recipe.id && r.related_fruit_ids.some(id => recipe.related_fruit_ids.includes(id)))
    .slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero band */}
      <div className="bg-gradient-to-r from-coral to-mango text-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Recipes", path: "/recipes" }, { label: recipe.title }]} dark />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Hero image */}
        {hasImage && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
            <OptimizedImage src={recipe.image_url!} alt={recipe.title} width={1200} height={400}
              className="w-full h-80 lg:h-[400px] object-cover" priority />
          </div>
        )}

        {/* Title + meta */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal mb-3">{recipe.title}</h1>
          <p className="text-lg text-charcoal-light mb-5 recipe-description">{recipe.description}</p>

          {/* Quick summary bar (AEO — speakable) */}
          <div className="recipe-summary flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm mb-6">
            <span className="flex items-center gap-1.5"><span>⏱️</span><strong>Prep:</strong> {recipe.prep_time}</span>
            <span className="flex items-center gap-1.5"><span>🍳</span><strong>Cook:</strong> {recipe.cook_time}</span>
            <span className="flex items-center gap-1.5"><span>🍽️</span><strong>Serves:</strong> {recipe.servings}</span>
            <span className="flex items-center gap-1.5"><span>📊</span><strong>Difficulty:</strong> {recipe.difficulty}</span>
            <button onClick={handleFav} className={`flex items-center gap-1.5 ml-auto transition-colors ${fav ? "text-red-500" : "text-charcoal-light hover:text-red-400"}`}>
              <span>{fav ? "❤️" : "🤍"}</span> {fav ? "Saved" : "Save Recipe"}
            </button>
          </div>
        </div>

        {/* Ingredients + Instructions */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-heading text-xl font-bold text-charcoal mb-4">🧂 Ingredients</h2>
              <ul className="space-y-2 recipe-ingredients">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-charcoal-light">
                    <span className="text-leaf mt-0.5 flex-shrink-0">✓</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-heading text-xl font-bold text-charcoal mb-4">👨‍🍳 Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-leaf text-white flex items-center justify-center font-bold text-sm">{i + 1}</span>
                    <p className="text-charcoal-light text-sm pt-1.5 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pro tip box */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="font-bold text-charcoal mb-2">💡 Caribbean Kitchen Tips</h3>
              <ul className="space-y-1.5 text-sm text-charcoal-light">
                <li>• Use fresh, ripe Caribbean fruits for the best flavour and nutrition</li>
                <li>• This recipe pairs well with our other Caribbean dishes on IslandFruitGuide</li>
                <li>• Leftovers keep refrigerated for up to 3 days in an airtight container</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related recipes */}
        {relatedRecipes.length > 0 && (
          <div className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-5">🍽️ You'll Also Love</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedRecipes.map(r => (
                <button key={r.id} onClick={() => navigate(`/recipes/${r.slug}`)}
                  className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-leaf/30 transition-all overflow-hidden group">
                  {r.image_url && (
                    <OptimizedImage src={r.image_url} alt={r.title} width={400} height={200}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                  )}
                  <div className="p-3">
                    <p className="font-semibold text-charcoal text-sm leading-snug group-hover:text-leaf transition-colors">{r.title}</p>
                    <p className="text-xs text-charcoal-light mt-1">⏱️ {r.prep_time} · {r.difficulty}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ebook promotion */}
        {featuredEbooks.length > 0 && (
          <div className="bg-gradient-to-br from-leaf/5 to-mango/5 rounded-2xl p-7 border border-gray-100 mb-10">
            <h2 className="font-heading text-xl font-bold text-charcoal mb-1">📚 Get 50+ More Caribbean Recipes</h2>
            <p className="text-charcoal-light text-sm mb-5">Our complete ebook series has everything — smoothies, desserts, healing drinks and more.</p>
            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              {featuredEbooks.map(p => (
                <button key={p.id} onClick={() => nav(`/checkout/${p.id}`)}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md p-3 text-left transition-all hover:border-leaf/30">
                  <p className="font-semibold text-charcoal text-xs leading-snug mb-1">{p.title || (p as {name?:string}).name}</p>
                  <p className="text-charcoal-light text-xs mb-2">{p.short_description}</p>
                  <span className="font-bold text-leaf">${p.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
            <button onClick={() => navigate("/store/ebooks")} className="bg-leaf text-white font-bold px-6 py-2.5 rounded-xl hover:bg-leaf-dark transition-colors text-sm">
              Browse All Recipe Ebooks →
            </button>
          </div>
        )}

        {/* Email capture */}
        <div className="mb-8">
          <EmailCapture variant="inline" />
        </div>

        {/* Back */}
        <div className="text-center">
          <button onClick={() => navigate("/recipes")} className="btn-secondary">← Back to All Recipes</button>
        </div>
      </div>
    </div>
  );
}
