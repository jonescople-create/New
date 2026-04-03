import { setupPageSEO } from '../utils/seo';
import { useEffect, useState } from 'react';;
import { navigate } from "../App";
import { fruits } from "../data/fruits";
import { Breadcrumb } from "../components/Breadcrumb";
import { ProductBundleBar } from "../components/ProductBundleBar";

type ShopCategory = "all" | "fruits" | "ebooks";

export function BuyFruitsPage() {
  useEffect(() => {
    setupPageSEO({
      path: '/buy-fruits',
      title: 'Where to Buy Caribbean Tropical Fruits | IslandFruitGuide',
      description: 'Find where to buy fresh Caribbean and tropical fruits near you. Trusted suppliers for soursop, mango, guava, papaya, ackee and all Caribbean fruits worldwide.',
    });
  }, []);

  const [activeCategory, setActiveCategory] = useState<ShopCategory>("all");

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-mango to-coral text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Shop" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">Island Shop 🛒</h1>
          <p className="text-white/90 mt-3 text-lg max-w-2xl">
            Your marketplace for Caribbean fruits and digital guides. Fresh from the islands to you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Product Bundle Bar */}
        <ProductBundleBar context="your order" />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-2 rounded-xl">
          {[
            { id: "all" as ShopCategory, label: "All Products", icon: "🏪" },
            { id: "fruits" as ShopCategory, label: "Fresh Fruits", icon: "🍎" },
            { id: "ebooks" as ShopCategory, label: "Digital Guides", icon: "📚" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeCategory === tab.id
                  ? "bg-white text-charcoal shadow-md"
                  : "text-charcoal-light hover:text-charcoal hover:bg-white/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Fresh Fruits Section */}
        {(activeCategory === "all" || activeCategory === "fruits") && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal flex items-center gap-2">
                  <span>🍎</span> Fresh Tropical Fruits
                </h2>
                <p className="text-charcoal-light mt-1">Coming soon — farm-fresh Caribbean fruits delivered to you</p>
              </div>
              <button
                onClick={() => navigate("/fruits")}
                className="text-leaf font-medium hover:text-leaf/80 transition-colors flex items-center gap-1"
              >
                Explore Fruits <span>→</span>
              </button>
            </div>

            {/* Coming Soon Banner */}
            <div className="bg-gradient-to-br from-leaf/10 to-mango/10 rounded-2xl p-6 border border-leaf/20 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🏗️</span>
                <div>
                  <h3 className="font-heading font-bold text-charcoal">Fruit Marketplace Coming Soon!</h3>
                  <p className="text-charcoal-light text-sm">We're building direct partnerships with Caribbean farmers to bring you the freshest tropical fruits.</p>
                </div>
                <button onClick={() => navigate("/contact")} className="ml-auto btn-primary whitespace-nowrap">
                  📬 Get Notified
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {fruits.slice(0, activeCategory === "fruits" ? 12 : 8).map(fruit => {
                const hasImage = fruit.image_url && fruit.image_url.length > 0;
                return (
                  <button
                    key={fruit.id}
                    onClick={() => navigate(`/fruits/${fruit.slug}`)}
                    className="fruit-card-hover bg-white rounded-2xl p-4 border border-gray-100 text-left group cursor-pointer"
                  >
                    <div
                      className="w-full aspect-square rounded-xl mb-3 flex items-center justify-center relative overflow-hidden"
                      style={!hasImage ? { background: `linear-gradient(135deg, ${fruit.color}22, ${fruit.color}44)` } : {}}
                    >
                      {hasImage ? (
                        <img
                          src={fruit.image_url}
                          alt={`Fresh ${fruit.name} tropical fruit – IslandFruitGuide`}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{fruit.emoji}</span>
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-charcoal group-hover:text-leaf transition-colors">
                      {fruit.name}
                    </h3>
                    <p className="text-xs text-charcoal-light mt-1">{fruit.seasonality}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-leaf font-bold text-sm">Coming Soon</span>
                      <span className="text-xs bg-mango/20 text-amber-800 px-2 py-1 rounded-full font-medium">🔔</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Digital Guides Section */}
        {(activeCategory === "all" || activeCategory === "ebooks") && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal flex items-center gap-2">
                  <span>📚</span> Digital Guides & Ebooks
                </h2>
                <p className="text-charcoal-light mt-1">Expert guides on Caribbean fruits, recipes & wellness</p>
              </div>
              <button
                onClick={() => navigate("/store")}
                className="text-mango font-medium hover:text-mango/80 transition-colors flex items-center gap-1"
              >
                View All Ebooks <span>→</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: "ebook-caribbean-fruit-guide",
                  title: "The Caribbean Tropical Fruit Guide",
                  desc: "Complete encyclopedia of 20+ tropical fruits with recipes, health benefits, and storage tips.",
                  price: 12.99,
                  originalPrice: 19.99,
                  icon: "🥭",
                  color: "from-leaf to-leaf/80"
                },
                {
                  id: "ebook-soursop-guide",
                  title: "The Soursop Guide",
                  desc: "Deep dive into soursop health benefits, the cancer research debate, and authentic recipes.",
                  price: 8.99,
                  originalPrice: 14.99,
                  icon: "🍈",
                  color: "from-emerald-600 to-emerald-500"
                },
                {
                  id: "ebook-superfruits-guide",
                  title: "Caribbean Superfruits Guide",
                  desc: "Soursop, Papaya & Banana — 7-day meal plan, recipes, and beauty applications.",
                  price: 14.99,
                  originalPrice: 24.99,
                  icon: "🍌",
                  color: "from-amber-600 to-orange-500"
                },
              ].map(ebook => (
                <button
                  key={ebook.id}
                  onClick={() => navigate(`/checkout/${ebook.id}`)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all group text-left"
                >
                  <div className={`h-40 bg-gradient-to-br ${ebook.color} flex items-center justify-center`}>
                    <span className="text-6xl">{ebook.icon}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-charcoal group-hover:text-leaf transition-colors">
                      {ebook.title}
                    </h3>
                    <p className="text-sm text-charcoal-light mt-2">{ebook.desc}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="font-bold text-leaf text-lg">${ebook.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-400 line-through">${ebook.originalPrice.toFixed(2)}</span>
                      <span className="text-xs bg-coral/20 text-coral px-2 py-0.5 rounded-full font-bold ml-auto">
                        Save {Math.round(((ebook.originalPrice - ebook.price) / ebook.originalPrice) * 100)}%
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Categories Grid */}
        {activeCategory === "all" && (
          <>
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-6 mt-12">All Product Categories</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: "📚", title: "Digital Ebooks", desc: "Caribbean fruit guides and recipe collections", status: "Available", link: "/store", color: "mango" },
                { icon: "🍎", title: "Fresh Fruits", desc: "Farm-fresh tropical fruits shipped directly to you", status: "Coming Soon", link: "/fruits", color: "leaf" },
                { icon: "🥤", title: "Juices & Drinks", desc: "100% natural tropical fruit juices and beverages", status: "Coming Soon", link: "/contact", color: "blue" },
                { icon: "🍬", title: "Dried & Preserved", desc: "Tamarind balls, guava cheese, and more", status: "Coming Soon", link: "/contact", color: "purple" },
                { icon: "🎁", title: "Gift Boxes", desc: "Curated Caribbean fruit gift sets for any occasion", status: "Coming Soon", link: "/contact", color: "pink" },
              ].map(cat => (
                <button
                  key={cat.title}
                  onClick={() => navigate(cat.link)}
                  className={`bg-white rounded-2xl p-6 border border-gray-100 hover:border-${cat.color}/30 hover:shadow-lg transition-all text-left`}
                >
                  <span className="text-3xl block mb-3">{cat.icon}</span>
                  <h3 className="font-heading font-semibold text-charcoal">{cat.title}</h3>
                  <p className="text-sm text-charcoal-light mt-1">{cat.desc}</p>
                  <span className={`inline-block mt-3 text-xs px-3 py-1 rounded-full font-medium ${
                    cat.status === "Available" 
                      ? "bg-leaf/15 text-leaf" 
                      : "bg-mango/15 text-amber-800"
                  }`}>
                    {cat.status}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Fruit Match-Up CTA */}
        <div className="mt-16 bg-gradient-to-r from-leaf to-leaf/90 rounded-3xl p-8 lg:p-12 text-white">
          <div className="lg:flex items-center justify-between gap-8">
            <div className="lg:w-2/3">
              <h2 className="font-heading text-2xl lg:text-3xl font-bold mb-3">
                🥊 Not Sure Which Fruit is Right For You?
              </h2>
              <p className="text-white/90 text-lg mb-4">
                Use our interactive Fruit Match-Up tool to compare Caribbean superfruits side-by-side. 
                Find the perfect match for your taste, health goals, and beauty routine.
              </p>
              <button
                onClick={() => navigate("/fruit-match-up")}
                className="bg-white text-leaf px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors shadow-lg"
              >
                Try Fruit Match-Up →
              </button>
            </div>
            <div className="lg:w-1/3 mt-6 lg:mt-0 flex justify-center">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">🍈</div>
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">VS</div>
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">🍏</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
