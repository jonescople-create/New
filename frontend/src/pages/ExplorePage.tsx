import { useState, useEffect } from 'react';
import { navigate } from '../App';
import { fruits } from '../data/fruits';
import { OptimizedImage } from '../components/OptimizedImage';
import { Breadcrumb } from '../components/Breadcrumb';
import { setupPageSEO } from '../utils/seo';

type Filter = 'all' | 'sweet' | 'tart' | 'high-vitamin-c' | 'high-fiber' | 'smoothie-friendly' | 'rare' | 'medicinal' | 'popular';

interface FilterConfig {
  label: string;
  icon: string;
  test: (id: string) => boolean;
}

const SWEET_IDS    = new Set(['5','8','13','7','20','16','22','24','14','15','9','26']);
const TART_IDS     = new Set(['6','12','15','17','3','25','4','21']);
const VIT_C_IDS    = new Set(['10','3','8','22','5','6','4','13','15','20']);
const FIBER_IDS    = new Set(['10','6','19','3','8','22','5','13','2','12']);
const SMOOTHIE_IDS = new Set(['5','13','3','8','6','11','22','10','18','24','19']);

const FILTERS: Record<Filter, FilterConfig> = {
  all:              { label: 'All Fruits',       icon: '🌴', test: () => true },
  sweet:            { label: 'Sweet',            icon: '🍯', test: id => SWEET_IDS.has(id) },
  tart:             { label: 'Tart & Tangy',     icon: '🍋', test: id => TART_IDS.has(id) },
  'high-vitamin-c': { label: 'High Vitamin C',   icon: '🍊', test: id => VIT_C_IDS.has(id) },
  'high-fiber':     { label: 'High Fiber',       icon: '🥝', test: id => FIBER_IDS.has(id) },
  'smoothie-friendly': { label: 'Smoothie-Friendly', icon: '🍹', test: id => SMOOTHIE_IDS.has(id) },
  rare:             { label: 'Rare & Exotic',    icon: '✨', test: () => false /* overridden */ },
  medicinal:        { label: 'Medicinal',        icon: '🌿', test: () => false },
  popular:          { label: 'Most Popular',     icon: '🔥', test: () => false },
};

export function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setupPageSEO({
      title: 'Explore Tropical Fruits | Caribbean Fruit Directory | IslandFruitGuide',
      description: 'Browse and discover all Caribbean tropical fruits. Filter by taste, nutrition, and use. Your complete visual tropical fruit explorer.',
      path: '/explore',
    });
  }, []);

  const filteredFruits = fruits.filter(f => {
    // Text search
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    // Filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'rare') return f.category.includes('rare');
    if (activeFilter === 'medicinal') return f.category.includes('medicinal');
    if (activeFilter === 'popular') return f.category.includes('popular');
    return (FILTERS[activeFilter as Filter]?.test(f.id)) ?? true;
  });

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-caribbean-green to-leaf text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Explore Tropical Fruits' }]} dark />
          <div className="mt-4">
            <h1 className="font-heading text-3xl lg:text-5xl font-bold">🌴 Tropical Fruit Explorer</h1>
            <p className="text-white/80 mt-3 text-lg max-w-2xl">
              Browse all {fruits.length} Caribbean tropical fruits. Filter by taste, nutrition, and use.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${fruits.length} tropical fruits…`}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none bg-white shadow-sm"
          />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(Object.keys(FILTERS) as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-leaf text-white shadow-md'
                  : 'bg-white border border-gray-200 text-charcoal hover:border-leaf hover:text-leaf'
              }`}
            >
              <span>{FILTERS[f].icon}</span>
              <span>{FILTERS[f].label}</span>
              {f !== 'all' && (
                <span className={`text-xs ml-1 ${activeFilter === f ? 'text-white/70' : 'text-charcoal-light'}`}>
                  ({fruits.filter(fr => {
                    if (f === 'rare') return fr.category.includes('rare');
                    if (f === 'medicinal') return fr.category.includes('medicinal');
                    if (f === 'popular') return fr.category.includes('popular');
                    return FILTERS[f]?.test(fr.id);
                  }).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-charcoal-light text-sm mb-6">
          Showing <strong className="text-charcoal">{filteredFruits.length}</strong> fruit{filteredFruits.length !== 1 ? 's' : ''}
          {activeFilter !== 'all' && ` · ${FILTERS[activeFilter as Filter]?.label ?? ''}`}
          {search && ` · matching "${search}"`}
        </p>

        {/* Fruit grid */}
        {filteredFruits.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFruits.map(fruit => (
              <button
                key={fruit.id}
                onClick={() => navigate(`/fruits/${fruit.slug}`)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-leaf/30 transition-all hover:-translate-y-0.5 text-left"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden bg-gray-50">
                  {fruit.image_url ? (
                    <OptimizedImage
                      src={fruit.image_url}
                      alt={fruit.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {fruit.emoji}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-bold text-charcoal text-sm truncate group-hover:text-leaf transition-colors">
                    {fruit.name}
                  </h3>
                  <p className="text-xs text-charcoal-light italic truncate mt-0.5">
                    {fruit.scientific_name}
                  </p>
                  {/* Category badges */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {fruit.category.includes('popular') && (
                      <span className="text-xs bg-leaf/10 text-leaf px-1.5 py-0.5 rounded-full">🔥 Popular</span>
                    )}
                    {fruit.category.includes('medicinal') && (
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">🌿</span>
                    )}
                    {fruit.category.includes('rare') && (
                      <span className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full">✨ Rare</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-charcoal mb-2">No fruits found</h3>
            <p className="text-charcoal-light mb-6">Try adjusting your search or filter.</p>
            <button onClick={() => { setSearch(''); setActiveFilter('all'); }}
              className="bg-leaf text-white font-bold py-2.5 px-6 rounded-xl hover:bg-leaf/90 transition-colors">
              Show All Fruits
            </button>
          </div>
        )}

        {/* SEO Footer Links */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <h2 className="font-heading text-xl font-bold text-charcoal mb-5">📚 Nutrition Guides</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { slug: 'vitamin-c-fruits',  icon: '🍊', label: 'Vitamin C Fruits' },
              { slug: 'high-fiber-fruits', icon: '🥝', label: 'High Fiber Fruits' },
              { slug: 'antioxidant-fruits',icon: '🫐', label: 'Antioxidant Fruits' },
              { slug: 'potassium-fruits',  icon: '💛', label: 'Potassium Fruits' },
              { slug: 'low-sugar-fruits',  icon: '🌿', label: 'Low Sugar Fruits' },
            ].map(n => (
              <button key={n.slug} onClick={() => navigate(`/nutrition/${n.slug}`)}
                className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 hover:border-leaf hover:bg-leaf/5 transition-colors text-left text-sm">
                <span className="text-xl">{n.icon}</span>
                <span className="font-medium text-charcoal">{n.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
