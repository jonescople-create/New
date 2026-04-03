import { useState } from 'react';
import { navigate } from '../App';
import { setupPageSEO } from '../utils/seo';
import { products as allProducts } from '../data/products';

// ── Cover components ──────────────────────────────────────────────────────────
import { TropicalJuiceCover }         from '../components/TropicalJuiceCover';
import { CaribbeanEncyclopediaCover } from '../components/CaribbeanEncyclopediaCover';
import { MedicinalLeavesCover }       from '../components/MedicinalLeavesCover';
import { TropicalDessertsCover }      from '../components/TropicalDessertsCover';
import { MangoRecipeCover }           from '../components/MangoRecipeCover';
import { FruitCalendarCover }         from '../components/FruitCalendarCover';
import { PapayaRecipeCover }          from '../components/PapayaRecipeCover';
import { SoursopDrinksCover }         from '../components/SoursopDrinksCover';
import { GuavaDessertCover }          from '../components/GuavaDessertCover';
import { GymEnergyBookCover }         from '../components/GymEnergyBookCover';
import { FatLossSmoothiesBookCover }  from '../components/FatLossSmoothiesBookCover';
import { HealingDrinksBookCover }     from '../components/HealingDrinksBookCover';
import { PreWorkoutBookCover }        from '../components/PreWorkoutBookCover';

setupPageSEO({
  title: 'Tropical Fruit Ebooks & Recipe Collections | IslandFruitGuide Store',
  description: 'Download Caribbean fruit ebooks, tropical recipe collections, and printable guides. Expert resources on tropical fruits, smoothies, and island cuisine.',
  path: '/store',
});

function ProductCover({ slug, coverImage }: { slug: string; coverImage: string }) {
  if (coverImage) {
    return (
      <img
        src={coverImage}
        alt={slug}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    );
  }
  const props = { size: 'md' as const };
  if (slug === 'tropical-juice-smoothie-recipes') return <TropicalJuiceCover {...props} />;
  if (slug === 'caribbean-fruit-guide')           return <CaribbeanEncyclopediaCover {...props} />;
  if (slug === 'medicinal-leaves-guide')          return <MedicinalLeavesCover {...props} />;
  if (slug === 'tropical-fruit-desserts')         return <TropicalDessertsCover {...props} />;
  if (slug === 'mango-recipe-pack')               return <MangoRecipeCover {...props} />;
  if (slug === 'fruit-season-calendar')           return <FruitCalendarCover {...props} />;
  if (slug === 'papaya-recipe-pack')              return <PapayaRecipeCover {...props} />;
  if (slug === 'soursop-drinks-pack')             return <SoursopDrinksCover {...props} />;
  if (slug === 'guava-dessert-pack')              return <GuavaDessertCover {...props} />;
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-leaf/20 to-mango/20">
      <span className="text-5xl">📚</span>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  if (category === 'ebook')       return <span>📚 Ebook</span>;
  if (category === 'recipe-pack') return <span>🍹 Recipe Pack</span>;
  if (category === 'printable')   return <span>📄 Printable</span>;
  return null;
}

export function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Deterministic: first 4 ebooks, no is_featured flag needed
  const featuredProducts = allProducts
    .filter(p => p.category === 'ebook')
    .slice(0, 4);

  const filteredProducts =
    selectedCategory === 'all'
      ? allProducts
      : allProducts.filter(p => p.category === selectedCategory);

  const categories = [
    { id: 'all',         name: 'All Products', icon: '🌴' },
    { id: 'ebook',       name: 'Ebooks',       icon: '📚' },
    { id: 'recipe-pack', name: 'Recipe Packs', icon: '🍹' },
    { id: 'printable',   name: 'Printables',   icon: '📄' },
  ];

  const ebookCount = allProducts.filter(p => p.category === 'ebook').length;

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-leaf to-leaf-dark py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            🌴 IslandFruitGuide Store
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Digital products, recipes, and guides for tropical fruit enthusiasts
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Browse by Category */}
        <h2 className="font-heading text-3xl font-bold text-center text-charcoal mb-8">
          Browse by Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <a
            href="/store/ebooks"
            className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300"
          >
            <div className="text-5xl mb-4">📚</div>
            <h3 className="font-heading text-2xl font-bold mb-2 group-hover:text-leaf transition-colors">
              Ebooks &amp; Guides
            </h3>
            <p className="text-gray-600 mb-4">
              Complete recipe collections, nutrition guides, and tropical fruit ebooks
            </p>
            <span className="text-leaf font-medium group-hover:underline">
              Browse {ebookCount} products →
            </span>
          </a>

          {[
            { icon: '🌱', label: 'Growing Supplies', desc: 'Seeds, soil, tools, and everything you need to grow tropical fruits' },
            { icon: '🔪', label: 'Kitchen Tools',    desc: 'Professional tools for preparing and enjoying tropical fruits' },
            { icon: '🌱', label: 'Fruit Seeds',      desc: 'Authentic tropical fruit seeds for your home garden' },
            { icon: '📊', label: 'Wall Charts',      desc: 'Educational posters and reference charts for fruit lovers' },
            { icon: '🎁', label: 'Product Bundles',  desc: 'Save with curated collections and bundle deals' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-mango text-charcoal px-3 py-1 rounded-full text-xs font-bold">
                Coming Soon
              </div>
              <div className="text-5xl mb-4 opacity-40">{icon}</div>
              <h3 className="font-heading text-2xl font-bold mb-2 text-gray-400">{label}</h3>
              <p className="text-gray-400">{desc}</p>
            </div>
          ))}
        </div>

        {/* Featured Products — always 4 ebooks */}
        <h2 className="font-heading text-3xl font-bold text-center text-charcoal mb-8">
          ⭐ Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {featuredProducts.map(product => (
            <a
              key={product.id}
              href={`/store/${product.slug}`}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative aspect-[2/3] bg-gray-100 overflow-hidden">
                <ProductCover slug={product.slug} coverImage={product.cover_image} />
                <div className="absolute top-3 right-3 bg-mango text-charcoal px-2 py-0.5 rounded-full text-xs font-bold shadow">
                  ⭐ Featured
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-leaf uppercase tracking-wide">
                  <CategoryBadge category={product.category} />
                </span>
                <h3 className="font-heading font-bold text-charcoal mt-1 mb-2 text-sm leading-snug group-hover:text-leaf transition-colors line-clamp-2">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-leaf">${product.price}</span>
                  <span className="text-xs text-leaf font-medium group-hover:underline">View →</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* All Products with filter */}
        <h2 className="font-heading text-3xl font-bold text-center text-charcoal mb-6">
          All Products
        </h2>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-leaf text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <a
                key={product.id}
                href={`/store/${product.slug}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative aspect-[2/3] bg-gray-100 overflow-hidden">
                  <ProductCover slug={product.slug} coverImage={product.cover_image} />
                </div>
                <div className="p-6">
                  <span className="text-sm font-semibold text-leaf uppercase tracking-wide">
                    <CategoryBadge category={product.category} />
                  </span>
                  <h3 className="font-heading text-xl font-bold text-charcoal mt-2 mb-3 group-hover:text-leaf transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {product.short_description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-leaf">${product.price}</span>
                      {'original_price' in product && (product as any).original_price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${(product as any).original_price}
                        </span>
                      )}
                    </div>
                    <span className="text-leaf font-medium group-hover:underline text-sm">
                      View Details →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-50 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-heading font-bold text-lg mb-2">Instant Download</h3>
              <p className="text-gray-600 text-sm">Access your purchase immediately after payment</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-heading font-bold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">PayPal secure checkout protection</p>
            </div>
            <div>
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-heading font-bold text-lg mb-2">All Devices</h3>
              <p className="text-gray-600 text-sm">Read on any device — phone, tablet, or computer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game CTA */}
      <div className="bg-gradient-to-br from-leaf/10 to-mango/10 border border-leaf/20 rounded-2xl px-6 py-8 text-center max-w-6xl mx-auto mb-8">
        <div className="text-4xl mb-3">🎮</div>
        <h3 className="font-heading text-xl font-bold text-charcoal mb-2">
          Earn Rewards by Playing!
        </h3>
        <p className="text-charcoal-light text-sm mb-5 max-w-md mx-auto">
          Play Fruit Catcher and unlock exclusive deals on our ebooks at score milestones. Reach 500 points for full store access!
        </p>
        <button
          onClick={() => navigate('/fruit-game')}
          className="btn-secondary inline-block px-8 py-3"
        >
          🌴 Play Fruit Catcher →
        </button>
      </div>

      {/* AI Generator CTA */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl px-6 py-8 text-center">
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="font-heading text-xl font-bold text-charcoal mb-2">
            Not sure which ebook is right for you?
          </h3>
          <p className="text-charcoal-light text-sm mb-5 max-w-md mx-auto">
            Type the fruits you love into our AI Recipe Generator — it'll create a personalised recipe and recommend the perfect ebook for you.
          </p>
          <button
            onClick={() => navigate('/ai-recipe')}
            className="btn-primary inline-block px-8 py-3"
          >
            🌴 Try the Free Recipe Generator →
          </button>
        </div>
      </div>

      {/* Ebooks CTA */}
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="font-heading text-3xl font-bold text-charcoal mb-4">
          Looking for the full ebook collection?
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Browse our complete library of Caribbean fruit ebooks, recipe packs, and digital guides.
        </p>
        <button onClick={() => navigate('/store/ebooks')} className="btn-primary text-lg px-10 py-4">
          Browse All Ebooks →
        </button>
      </div>

    </div>
  );
}
