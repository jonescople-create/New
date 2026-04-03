import { useEffect, useState } from "react";
import { navigate } from "../App";
import { trackPageView } from '../utils/db';
import { EmailCapture } from "../components/EmailCapture";
import { TestimonialsRow } from "../components/Testimonials";
import { fruits, getFruitsByCategory, getTrendingFruits, getSeasonalFruits, searchFruits, getFruitById } from "../data/fruits";
import { recipes } from "../data/recipes";
import { blogPosts } from "../data/blogPosts";
import { FruitCard } from "../components/FruitCard";
import { RecipeCard } from "../components/RecipeCard";
import { getRecentState } from "../utils/personalization";
import { OptimizedImage } from "../components/OptimizedImage";
import { setupPageSEO } from "../utils/seo";

const HERO_BANNER = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/brand-assets/banner-hero.webp";
const MANGO_IMG = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruit-images/fruit-mango.jpg";

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof fruits>([]);
  const [showResults, setShowResults] = useState(false);
  const [recentFruits, setRecentFruits] = useState<typeof fruits>([]);
  const [recentRecipes, setRecentRecipes] = useState<typeof recipes>([]);

  useEffect(() => {
    // Setup SEO for homepage
    trackPageView('/', 'home');
    setupPageSEO({
      path: '/',
      title: 'IslandFruitGuide - Your Complete Caribbean & Tropical Fruit Encyclopedia',
      description: 'Discover 62+ Caribbean and tropical fruits with complete guides, authentic recipes, health benefits, growing tips, and cultural history. From ackee to soursop - your ultimate tropical fruit resource.',
      image: HERO_BANNER,
      type: 'website'
    });
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.length > 1) {
      setSearchResults(searchFruits(q));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const categories = [
    { key: "popular", label: "Popular Fruits", icon: "⭐", desc: "Most loved Caribbean fruits", color: "from-mango/30 to-amber-100" },
    { key: "seasonal", label: "Seasonal Fruits", icon: "🌦️", desc: "What's ripe right now", color: "from-leaf/20 to-emerald-100" },
    { key: "rare", label: "Rare Tropical Fruits", icon: "💎", desc: "Hard-to-find island gems", color: "from-purple-200/50 to-purple-100" },
    { key: "medicinal", label: "Medicinal Fruits", icon: "💚", desc: "Natural healing power", color: "from-coral/20 to-red-100" },
  ];

  const trending = getTrendingFruits();
  const seasonal = getSeasonalFruits().slice(0, 4);

  useEffect(() => {
    const { fruits: fruitIds, recipes: recipeIds } = getRecentState();
    setRecentFruits(fruitIds.map(id => getFruitById(id)).filter(Boolean) as typeof fruits);
    setRecentRecipes(recipeIds
      .map(id => recipes.find(recipe => recipe.id === id))
      .filter(Boolean) as typeof recipes
    );
  }, []);

  return (
    <div className="animate-fade-in">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[650px]">
        {/* Background image */}
        <div className="absolute inset-0">
          <OptimizedImage
            src={HERO_BANNER}
            alt="Tropical fruits background – IslandFruitGuide"
            width={1920}
            height={1080}
            priority
            className="w-full h-full object-cover"
            hideOnError
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/60 to-charcoal/30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-mango/90 backdrop-blur-sm px-4 py-2 rounded-full text-charcoal text-sm font-semibold mb-6 shadow-lg">
                🌴 Your Caribbean Fruit Encyclopedia
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                Discover Tropical Fruits, Recipes &{" "}
                <span className="text-mango">Health Benefits</span>
              </h1>
              <p className="text-lg text-white/90 mt-6 max-w-xl leading-relaxed drop-shadow-sm">
                Your complete Caribbean fruit guide — from ackee to soursop. Explore seasonal guides, traditional recipes, and nutrition facts for over {fruits.length} tropical fruits.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <button onClick={() => navigate("/fruits")} className="bg-leaf text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-leaf-dark transition-all inline-flex items-center gap-2 shadow-lg text-base">
                  🍎 Explore Fruits
                </button>
                <button onClick={() => navigate("/recipes")} className="btn-secondary text-base shadow-lg">
                  🍽️ Browse Recipes
                </button>
              </div>
            </div>

            {/* Right — fruit image showcase */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-white/15 backdrop-blur-md rounded-full border-2 border-white/20"></div>
                <div className="absolute inset-4 bg-white/10 rounded-full flex items-center justify-center overflow-hidden shadow-2xl">
                  <OptimizedImage
                    src={MANGO_IMG}
                    alt="Fresh mango tropical fruit – IslandFruitGuide"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover rounded-full animate-pulse-slow"
                    fallbackEmoji="🥭"
                    sizes="320px"
                  />
                </div>
                {/* Floating fruit bubbles with real images */}
                <div className="absolute -top-4 -left-4 bg-white/30 backdrop-blur-sm rounded-2xl p-1 shadow-xl w-16 h-16 overflow-hidden border border-white/20">
                  <OptimizedImage
                    src="https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruit-images/fruit-ackee.jpg"
                    alt="Fresh ackee tropical fruit – IslandFruitGuide"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-xl"
                    hideOnError
                    sizes="64px"
                  />
                </div>
                <div className="absolute -bottom-2 -left-8 bg-white/30 backdrop-blur-sm rounded-2xl p-1 shadow-xl w-16 h-16 overflow-hidden border border-white/20">
                  <OptimizedImage
                    src="https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruit-images/fruit-coconut.jpg"
                    alt="Fresh coconut tropical fruit – IslandFruitGuide"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-xl"
                    hideOnError
                    sizes="64px"
                  />
                </div>
                <div className="absolute -top-2 -right-6 bg-white/30 backdrop-blur-sm rounded-2xl p-1 shadow-xl w-16 h-16 overflow-hidden border border-white/20">
                  <OptimizedImage
                    src="https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruit-images/fruit-passion-fruit.png"
                    alt="Fresh passion fruit tropical fruit – IslandFruitGuide"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-xl"
                    hideOnError
                    sizes="64px"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white/30 backdrop-blur-sm rounded-2xl p-1 shadow-xl w-16 h-16 overflow-hidden border border-white/20">
                  <OptimizedImage
                    src="https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/fruit-images/fruit-papaya.jpg"
                    alt="Fresh papaya tropical fruit – IslandFruitGuide"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-xl"
                    hideOnError
                    sizes="64px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-12 max-w-2xl mx-auto relative">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search fruits, recipes, health benefits..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                onFocus={() => searchQuery.length > 1 && setShowResults(true)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white shadow-xl text-charcoal placeholder-gray-400 text-base focus:outline-none focus:ring-4 focus:ring-mango/30"
              />
            </div>
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {searchResults.slice(0, 5).map(fruit => (
                  <button
                    key={fruit.id}
                    onClick={() => { navigate(`/fruits/${fruit.slug}`); setShowResults(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-leaf/5 transition-colors text-left"
                  >
                    {fruit.image_url ? (
                      <OptimizedImage
                        src={fruit.image_url}
                        alt={`Fresh ${fruit.name} tropical fruit – IslandFruitGuide`}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-cover"
                        fallbackEmoji={fruit.emoji}
                        sizes="40px"
                      />
                    ) : (
                      <span className="text-2xl w-10 h-10 flex items-center justify-center">{fruit.emoji}</span>
                    )}
                    <div>
                      <div className="font-medium text-charcoal">{fruit.name}</div>
                      <div className="text-xs text-charcoal-light">{fruit.scientific_name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal">
            Explore by Category
          </h2>
          <p className="text-charcoal-light mt-3 text-lg">Browse our curated collections of tropical fruits</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => {
            const catFruits = getFruitsByCategory(cat.key);
            const previewFruit = catFruits.find(f => f.image_url);
            return (
              <button
                key={cat.key}
                onClick={() => navigate("/fruits")}
                className="fruit-card-hover bg-white rounded-2xl p-6 border border-gray-100 text-left group cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl mb-4 overflow-hidden`}>
                  {previewFruit ? (
                    <OptimizedImage
                      src={previewFruit.image_url}
                      alt={`${cat.label} – IslandFruitGuide`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-xl"
                      fallbackEmoji={cat.icon}
                      sizes="64px"
                    />
                  ) : (
                    cat.icon
                  )}
                </div>
                <h3 className="font-heading font-semibold text-lg text-charcoal group-hover:text-leaf transition-colors">
                  {cat.label}
                </h3>
                <p className="text-sm text-charcoal-light mt-1">{cat.desc}</p>
                <p className="text-xs text-leaf font-medium mt-3">{catFruits.length} fruits →</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== FEATURED / TRENDING FRUITS ===== */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal">
                🔥 Trending Fruits
              </h2>
              <p className="text-charcoal-light mt-2">Most viewed tropical fruits on our platform</p>
            </div>
            <button onClick={() => navigate("/fruits")} className="hidden sm:inline-flex btn-primary text-sm">
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {trending.map(fruit => (
              <FruitCard key={fruit.id} fruit={fruit} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEASONAL FRUITS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal">
              🌦️ Today's Seasonal Fruits
            </h2>
            <p className="text-charcoal-light mt-2">What's ripe and available this season</p>
          </div>
          <button onClick={() => navigate("/seasonal-fruits")} className="hidden sm:inline-flex btn-primary text-sm">
            Seasonal Guide
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {seasonal.map(fruit => (
            <FruitCard key={fruit.id} fruit={fruit} />
          ))}
        </div>
      </section>

      {/* ===== RECIPE DISCOVERY ===== */}
      <section className="bg-gradient-to-br from-leaf/5 to-mango/5 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal">
                🍽️ Recipe Discovery
              </h2>
              <p className="text-charcoal-light mt-2">Traditional Caribbean recipes using tropical fruits</p>
            </div>
            <button onClick={() => navigate("/recipes")} className="hidden sm:inline-flex btn-primary text-sm">
              All Recipes
            </button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 scroll-container">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} horizontal />
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG & ARTICLES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal">
              📝 Latest Articles
            </h2>
            <p className="text-charcoal-light mt-2">Expert guides on Caribbean fruit nutrition, recipes, and health benefits</p>
          </div>
          <button onClick={() => navigate("/blog")} className="hidden sm:inline-flex btn-primary text-sm">
            All Articles
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {blogPosts.slice(0, 4).map(post => (
            <button
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="fruit-card-hover bg-white rounded-2xl border border-gray-100 text-left group cursor-pointer overflow-hidden"
            >
              <div className="w-full h-36 bg-gradient-to-br from-leaf/10 to-mango/10 overflow-hidden">
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" width={400} height={225} />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-leaf/10 text-leaf px-2 py-0.5 rounded-full font-medium">{post.category}</span>
                  <span className="text-xs text-charcoal-light">{post.readTime}</span>
                </div>
                <h3 className="font-heading font-semibold text-sm text-charcoal group-hover:text-leaf transition-colors leading-snug line-clamp-2">
                  {post.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
        <div className="text-center mt-6 sm:hidden">
          <button onClick={() => navigate("/blog")} className="btn-primary text-sm">View All Articles →</button>
        </div>
      </section>

      {/* ===== INTERACTIVE TOOLS ===== */}
      <section className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal">
              🛠️ Interactive Tools
            </h2>
            <p className="text-charcoal-light mt-3 text-lg">Explore, compare, and discover your perfect Caribbean fruits</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <button onClick={() => navigate("/quiz")} className="fruit-card-hover bg-white rounded-2xl p-6 text-left group cursor-pointer border border-gray-100">
              <span className="text-4xl block mb-3">🧠</span>
              <h3 className="font-heading font-bold text-lg text-charcoal group-hover:text-leaf transition-colors">Caribbean Fruit Quiz</h3>
              <p className="text-sm text-charcoal-light mt-2">Test your tropical fruit knowledge and unlock exclusive discount codes!</p>
              <span className="inline-flex items-center gap-1 text-leaf text-sm font-medium mt-3">Take the Quiz →</span>
            </button>
            <button onClick={() => navigate("/compare")} className="fruit-card-hover bg-white rounded-2xl p-6 text-left group cursor-pointer border border-gray-100">
              <span className="text-4xl block mb-3">⚖️</span>
              <h3 className="font-heading font-bold text-lg text-charcoal group-hover:text-leaf transition-colors">Fruit Comparison Tool</h3>
              <p className="text-sm text-charcoal-light mt-2">Compare nutrition, taste profiles, and health benefits of any two fruits side by side.</p>
              <span className="inline-flex items-center gap-1 text-leaf text-sm font-medium mt-3">Compare Now →</span>
            </button>
            <button onClick={() => navigate("/fruit-match-up")} className="fruit-card-hover bg-white rounded-2xl p-6 text-left group cursor-pointer border border-gray-100">
              <span className="text-4xl block mb-3">🏆</span>
              <h3 className="font-heading font-bold text-lg text-charcoal group-hover:text-leaf transition-colors">Fruit Match-Up</h3>
              <p className="text-sm text-charcoal-light mt-2">Soursop vs Sweetsop? Papaya vs Banana? Find your perfect Caribbean superfruit.</p>
              <span className="inline-flex items-center gap-1 text-leaf text-sm font-medium mt-3">Find Your Match →</span>
            </button>
            <button onClick={() => navigate("/assistant")} className="fruit-card-hover bg-white rounded-2xl p-6 text-left group cursor-pointer border border-gray-100">
              <span className="text-4xl block mb-3">🤖</span>
              <h3 className="font-heading font-bold text-lg text-charcoal group-hover:text-leaf transition-colors">Ask Fruitsy AI</h3>
              <p className="text-sm text-charcoal-light mt-2">Have a question about Caribbean fruits? Ask our AI assistant for instant answers.</p>
              <span className="inline-flex items-center gap-1 text-leaf text-sm font-medium mt-3">Chat Now →</span>
            </button>
            <button onClick={() => navigate("/fruit-game")} className="fruit-card-hover bg-white rounded-2xl p-6 text-left group cursor-pointer border border-gray-100">
              <span className="text-4xl block mb-3">🎮</span>
              <h3 className="font-heading font-bold text-lg text-charcoal group-hover:text-leaf transition-colors">Fruit Catcher Game</h3>
              <p className="text-sm text-charcoal-light mt-2">Catch Caribbean fruits, earn XP, and unlock exclusive ebook deals. How high can you score?</p>
              <span className="inline-flex items-center gap-1 text-leaf text-sm font-medium mt-3">Play &amp; Unlock Recipes →</span>
            </button>
            <button onClick={() => navigate("/ai-recipe")} className="fruit-card-hover bg-white rounded-2xl p-6 text-left group cursor-pointer border border-gray-100">
              <span className="text-4xl block mb-3">🤖</span>
              <h3 className="font-heading font-bold text-lg text-charcoal group-hover:text-leaf transition-colors">AI Recipe Generator</h3>
              <p className="text-sm text-charcoal-light mt-2">Type any Caribbean fruits you have — get a personalised recipe, health tips, and ebook recommendation instantly.</p>
              <span className="inline-flex items-center gap-1 text-leaf text-sm font-medium mt-3">Generate Free Recipe →</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== EBOOK / STORE PROMO ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="bg-gradient-to-r from-charcoal to-charcoal/90 rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 bg-mango/20 text-mango px-3 py-1 rounded-full text-sm font-semibold mb-4">📚 Premium Ebooks</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white leading-tight">
                The Complete Caribbean Fruit Guide Collection
              </h2>
              <p className="text-gray-300 mt-4 leading-relaxed">
                Get our premium ebooks with {fruits.length}+ fruit profiles, {recipes.length}+ traditional recipes, 7-day meal plans, health research, and expert storage guides. Instant PDF download.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={() => navigate("/store")} className="bg-mango text-charcoal px-6 py-3 rounded-xl font-semibold hover:bg-amber-500 transition-colors">
                  📚 Browse Ebooks
                </button>
                <button onClick={() => navigate("/ebook/superfruits-guide")} className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20">
                  📖 Free Preview
                </button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center gap-4">
              <div className="bg-leaf/30 rounded-2xl p-6 text-center text-white transform -rotate-3">
                <span className="text-5xl block mb-2">🌴</span>
                <p className="font-heading font-bold text-sm">Caribbean Fruit Guide</p>
                <p className="text-mango font-bold text-lg mt-1">$12.99</p>
              </div>
              <div className="bg-emerald-800/50 rounded-2xl p-6 text-center text-white transform rotate-2">
                <span className="text-5xl block mb-2">🍈</span>
                <p className="font-heading font-bold text-sm">The Soursop Guide</p>
                <p className="text-mango font-bold text-lg mt-1">$8.99</p>
              </div>
              <div className="bg-amber-800/40 rounded-2xl p-6 text-center text-white transform -rotate-2">
                <span className="text-5xl block mb-2">🥭</span>
                <p className="font-heading font-bold text-sm">Superfruits Guide</p>
                <p className="text-mango font-bold text-lg mt-1">$14.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PERSONALIZED RECENTS ===== */}
      {(recentFruits.length > 0 || recentRecipes.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-heading text-2xl lg:text-3xl font-bold text-charcoal">
                  ✨ Continue Exploring
                </h2>
                <p className="text-charcoal-light mt-2">
                  Pick up right where you left off with your recently viewed fruits and recipes.
                </p>
              </div>
              <button
                onClick={() => navigate("/fruits")}
                className="btn-primary text-sm"
              >
                Browse More
              </button>
            </div>

            {recentFruits.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">Recent Fruits</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentFruits.slice(0, 4).map(fruit => (
                    <FruitCard key={fruit.id} fruit={fruit} size="sm" />
                  ))}
                </div>
              </div>
            )}

            {recentRecipes.length > 0 && (
              <div>
                <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">Recent Recipes</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scroll-container">
                  {recentRecipes.slice(0, 4).map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} horizontal />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== EDUCATIONAL SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal">
            Learn About Tropical Fruits
          </h2>
          <p className="text-charcoal-light mt-3 text-lg">Expert guides and educational content</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              icon: "💚",
              title: "Health Benefits",
              desc: "Discover the incredible nutritional profiles and healing properties of Caribbean fruits. From soursop's cancer-fighting compounds to guava's vitamin C content.",
              color: "from-emerald-50 to-green-50",
              link: "/blog/soursop-health-benefits-fact-vs-fiction",
            },
            {
              icon: "🍴",
              title: "How to Eat Tropical Fruits",
              desc: "Learn the proper way to prepare, cut, and enjoy each tropical fruit. Expert tips on ripeness, flavor pairings, and traditional serving methods.",
              color: "from-amber-50 to-orange-50",
              link: "/blog/7-day-tropical-superfruit-meal-plan",
            },
            {
              icon: "📦",
              title: "Storage & Preparation",
              desc: "Keep your tropical fruits fresh longer with our comprehensive storage guides. Learn ripening tricks, freezing methods, and preservation techniques.",
              color: "from-blue-50 to-indigo-50",
              link: "/blog/how-to-store-tropical-fruits",
            },
          ].map(block => (
            <button
              key={block.title}
              onClick={() => navigate(block.link)}
              className={`fruit-card-hover bg-gradient-to-br ${block.color} rounded-2xl p-8 text-left group cursor-pointer border border-gray-100`}
            >
              <span className="text-4xl mb-4 block">{block.icon}</span>
              <h3 className="font-heading font-bold text-xl text-charcoal group-hover:text-leaf transition-colors">
                {block.title}
              </h3>
              <p className="text-charcoal-light mt-3 text-sm leading-relaxed">{block.desc}</p>
              <span className="inline-flex items-center gap-1 text-leaf text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                Read Guide →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { val: `${fruits.length}+`, label: "Tropical Fruits" },
              { val: `${recipes.length}+`, label: "Caribbean Recipes" },
              { val: "50+", label: "Health Benefits" },
              { val: "365", label: "Days of Freshness" },
            ].map(stat => (
              <div key={stat.label}>
                <div className="font-heading text-3xl lg:text-4xl font-bold text-mango">{stat.val}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-charcoal text-center mb-2">What Our Readers Say</h2>
          <p className="text-charcoal-light text-center text-sm mb-8">Caribbean fruit lovers from around the world ⭐⭐⭐⭐⭐</p>
          <TestimonialsRow max={3} />
        </div>
      </section>

      {/* Homepage Email Capture */}
      <section className="py-12 bg-white">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-5">
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-1">🌴 Free Caribbean Fruit Bible</h2>
            <p className="text-charcoal-light text-sm">25 tropical fruits · Nutrition facts · 10 recipes — free PDF instantly</p>
          </div>
          <EmailCapture variant="inline" />
        </div>
      </section>
    </div>
  );
}
