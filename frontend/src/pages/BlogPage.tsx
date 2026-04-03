import { setupPageSEO } from '../utils/seo';
import { useEffect, useState } from 'react';;
import { navigate } from "../App";
import { blogPosts, searchBlogPosts, getBlogPostsByCategory } from "../data/blogPosts";
import { Breadcrumb } from "../components/Breadcrumb";

export function BlogPage() {
  useEffect(() => {
    setupPageSEO({
      path: '/blog',
      title: 'Caribbean Fruit Blog — Tips, Guides & Recipes | IslandFruitGuide',
      description: 'Expert articles on Caribbean tropical fruits, health benefits, seasonal guides, and authentic island recipes. Updated weekly by the IslandFruitGuide editorial team.',
    });
  }, []);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

        const categories = ["All", "Health", "Nutrition", "Recipes", "Guides"];

  let displayPosts = activeCategory === "All" ? blogPosts : getBlogPostsByCategory(activeCategory);
  if (query.length > 1) {
    displayPosts = searchBlogPosts(query);
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Blog" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">
            IslandFruitGuide Blog 📝
          </h1>
          <p className="text-white/80 mt-3 text-lg max-w-2xl">
            Expert articles on Caribbean fruit health benefits, recipes, nutrition guides, and natural beauty tips.
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
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setQuery(""); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-leaf text-white shadow-md"
                    : "bg-white border border-gray-200 text-charcoal-light hover:border-leaf hover:text-leaf"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-charcoal-light mb-6">
          {displayPosts.length} article{displayPosts.length !== 1 ? "s" : ""}
        </p>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map(post => (
            <button
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="fruit-card-hover bg-white rounded-2xl border border-gray-100 text-left group cursor-pointer overflow-hidden"
            >
              <div className="w-full h-48 bg-gradient-to-br from-leaf/10 to-mango/10 overflow-hidden">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">📝</div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-leaf/10 text-leaf px-2 py-1 rounded-full font-medium">{post.category}</span>
                  <span className="text-xs text-charcoal-light">{post.readTime}</span>
                </div>
                <h3 className="font-heading font-semibold text-charcoal group-hover:text-leaf transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-charcoal-light mt-2 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-charcoal-light">{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span className="inline-flex items-center gap-1 text-leaf text-sm font-medium group-hover:gap-2 transition-all">
                    Read →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {displayPosts.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-lg text-charcoal-light">No articles found matching your search.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-leaf to-leaf-light rounded-3xl p-8 lg:p-12 text-white text-center">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold">Want the Full Guide?</h2>
          <p className="text-white/80 mt-3 max-w-xl mx-auto">
            These articles are excerpts from our premium ebooks. Get the complete guides with recipes, meal plans, and expert research.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <button onClick={() => navigate("/store")} className="bg-mango text-charcoal px-8 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg">
              📚 Browse Ebooks
            </button>
            <button onClick={() => navigate("/ebook/superfruits-guide")} className="bg-white/20 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/30 transition-all border border-white/30">
              📖 Read Free Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
