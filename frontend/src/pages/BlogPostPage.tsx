import { useEffect } from "react";
import { navigate } from "../App";
import { getBlogPostBySlug, blogPosts } from "../data/blogPosts";
import { getFruitBySlug } from "../data/fruits";
import { getRecipesForFruit } from "../data/recipes";
import { Breadcrumb } from "../components/Breadcrumb";
import { setupPageSEO } from "../utils/seo";

interface Props {
  slug: string;
}

export function BlogPostPage({ slug }: Props) {
  const post = getBlogPostBySlug(slug);

  useEffect(() => {
    if (post) {
      // Setup SEO for this blog post
      setupPageSEO({
        path: `/blog/${post.slug}`,
        title: `${post.title} | IslandFruitGuide Blog`,
        description: post.excerpt,
        image: post.image_url,
        type: 'article',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` }
        ]
      });
    }
  }, [post]);

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">🤔</span>
        <h2 className="font-heading text-2xl font-bold mb-4">Article Not Found</h2>
        <button onClick={() => navigate("/blog")} className="btn-primary">← Back to Blog</button>
      </div>
    );
  }

  const relatedFruits = post.relatedFruitSlugs.map(s => getFruitBySlug(s)).filter(Boolean);
  const otherPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

  // Structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image_url,
    "datePublished": post.date,
    "author": { "@type": "Organization", "name": "IslandFruitGuide" },
    "publisher": { "@type": "Organization", "name": "IslandFruitGuide" }
  };

  return (
    <div className="animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Header */}
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Blog", path: "/blog" }, { label: post.title }]} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Image */}
        {post.image_url && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-64 sm:h-80 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs bg-leaf/10 text-leaf px-3 py-1 rounded-full font-medium">{post.category}</span>
          <span className="text-xs text-charcoal-light">{post.readTime}</span>
          <span className="text-xs text-charcoal-light">
            {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal leading-tight">
          {post.title}
        </h1>
        <p className="text-charcoal-light text-lg mt-3">{post.excerpt}</p>

        {/* Related Fruits */}
        {relatedFruits.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {relatedFruits.map(f => f && (
              <button
                key={f.id}
                onClick={() => navigate(`/fruits/${f.slug}`)}
                className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-xl hover:border-leaf hover:bg-leaf/5 transition-all text-sm"
              >
                {f.image_url ? (
                  <img src={f.image_url} alt={f.name} className="w-6 h-6 rounded object-cover" />
                ) : (
                  <span>{f.emoji}</span>
                )}
                <span className="font-medium text-charcoal">{f.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="mt-8 space-y-6">
          {post.content.map((block, i) => {
            // Check for heading blocks
            if (block.startsWith("**") && block.indexOf("**\n") > 0) {
              const parts = block.split("\n\n");
              return (
                <div key={i}>
                  {parts.map((part, j) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <h2 key={j} className="font-heading text-xl font-bold text-charcoal mt-6 mb-3">{part.replace(/\*\*/g, "")}</h2>;
                    }
                    if (part.startsWith("•")) {
                      const items = part.split("\n").filter(Boolean);
                      return (
                        <ul key={j} className="space-y-2 my-3">
                          {items.map((item, k) => (
                            <li key={k} className="flex items-start gap-2 text-charcoal-light text-sm leading-relaxed">
                              <span className="text-leaf flex-shrink-0 mt-0.5">•</span>
                              <span>{item.replace(/^• /, "").split("**").map((p, m) => (
                                m % 2 === 1 ? <strong key={m} className="text-charcoal">{p}</strong> : <span key={m}>{p}</span>
                              ))}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={j} className="text-charcoal-light text-sm leading-relaxed">
                        {part.split("**").map((p, m) => (
                          m % 2 === 1 ? <strong key={m} className="text-charcoal font-semibold">{p}</strong> : <span key={m}>{p}</span>
                        ))}
                      </p>
                    );
                  })}
                </div>
              );
            }
            // Simple paragraph with bold
            return (
              <p key={i} className="text-charcoal-light leading-relaxed">
                {block.split("**").map((part, j) => (
                  j % 2 === 1 ? <strong key={j} className="text-charcoal font-semibold">{part}</strong> : <span key={j}>{part}</span>
                ))}
              </p>
            );
          })}
        </div>

        {/* ===== EBOOK CTA — Bottom of Article ===== */}
        <div className="mt-12 bg-gradient-to-br from-mango/10 to-coral/10 rounded-3xl p-8 border border-mango/20 text-center">
          <span className="text-5xl block mb-4">📚</span>
          <h2 className="font-heading text-2xl font-bold text-charcoal">
            Want More? Download the Full Ebook!
          </h2>
          <p className="text-charcoal-light mt-3 max-w-lg mx-auto">
            This article is an excerpt from our premium guides. Get the complete ebooks with 50+ fruit profiles, 100+ recipes, meal plans, and expert research.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate("/store")} className="btn-primary text-base px-7">
              📚 Browse All Ebooks
            </button>
            <button onClick={() => navigate("/ebook/superfruits-guide")} className="btn-secondary text-base">
              📖 Free Preview
            </button>
          </div>
          <p className="text-xs text-charcoal-light mt-4">
            💯 30-day money-back guarantee • 📥 Instant PDF download
          </p>
        </div>

        {/* ===== RELATED RECIPES (from the blog post's related fruits) ===== */}
        {(() => {
          const relatedFruitObjs = post.relatedFruitSlugs.map(s => getFruitBySlug(s)).filter(Boolean);
          const relatedRecipes = relatedFruitObjs.flatMap(f => f ? getRecipesForFruit(f.id) : []);
          const uniqueRecipes = relatedRecipes.filter((r, i, arr) => arr.findIndex(x => x.id === r.id) === i).slice(0, 3);
          if (uniqueRecipes.length === 0) return null;
          return (
            <div className="mt-10 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h2 className="font-heading text-xl font-bold text-charcoal mb-4">🍽️ Related Recipes</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {uniqueRecipes.map(r => (
                  <button
                    key={r.id}
                    onClick={() => navigate(`/recipes/${r.slug}`)}
                    className="bg-white rounded-xl p-3 text-left group hover:shadow-md transition-all border border-amber-50"
                  >
                    {r.image_url && (
                      <div className="w-full h-24 rounded-lg overflow-hidden mb-2">
                        <img src={r.image_url} alt={`${r.title} recipe`} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <h3 className="text-sm font-medium text-charcoal group-hover:text-leaf transition-colors line-clamp-2">{r.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-charcoal-light">
                      <span>⏱️ {r.prep_time}</span>
                      <span>•</span>
                      <span>{r.difficulty}</span>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => navigate("/recipes")} className="text-leaf text-sm font-medium mt-3 hover:underline inline-block">
                Browse all Caribbean recipes →
              </button>
            </div>
          );
        })()}

        {/* ===== TOOLS & ENGAGEMENT LINKS ===== */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <button onClick={() => navigate("/compare")} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100 text-left hover:shadow-md transition-all group">
            <span className="text-2xl block mb-2">⚖️</span>
            <h3 className="font-heading font-semibold text-sm text-charcoal group-hover:text-purple-700 transition-colors">Fruit Comparison Tool</h3>
            <p className="text-xs text-charcoal-light mt-1">Compare nutrition, taste, and health benefits side by side.</p>
          </button>
          <button onClick={() => navigate("/quiz")} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 text-left hover:shadow-md transition-all group">
            <span className="text-2xl block mb-2">🧠</span>
            <h3 className="font-heading font-semibold text-sm text-charcoal group-hover:text-amber-700 transition-colors">Caribbean Fruit Quiz</h3>
            <p className="text-xs text-charcoal-light mt-1">Test your tropical fruit knowledge — win rewards!</p>
          </button>
          <button onClick={() => navigate("/fruit-match-up")} className="bg-gradient-to-br from-leaf/5 to-emerald-50 rounded-xl p-4 border border-leaf/10 text-left hover:shadow-md transition-all group">
            <span className="text-2xl block mb-2">🏆</span>
            <h3 className="font-heading font-semibold text-sm text-charcoal group-hover:text-leaf transition-colors">Fruit Match-Up</h3>
            <p className="text-xs text-charcoal-light mt-1">Soursop vs Sweetsop? Find your perfect superfruit.</p>
          </button>
        </div>

        {/* More Articles */}
        {otherPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">More Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {otherPosts.map(p => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/blog/${p.slug}`)}
                  className="fruit-card-hover bg-white rounded-2xl border border-gray-100 text-left group cursor-pointer overflow-hidden"
                >
                  <div className="w-full h-32 bg-gradient-to-br from-leaf/10 to-mango/10 overflow-hidden">
                    {p.image_url && (
                      <img src={p.image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs bg-leaf/10 text-leaf px-2 py-0.5 rounded-full font-medium">{p.category}</span>
                    <h3 className="font-heading font-semibold text-sm text-charcoal group-hover:text-leaf transition-colors mt-2 leading-snug line-clamp-2">
                      {p.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-10 text-center">
          <button onClick={() => navigate("/blog")} className="text-leaf font-medium hover:underline">
            ← Back to Blog
          </button>
        </div>
      </div>
    </div>
  );
}
