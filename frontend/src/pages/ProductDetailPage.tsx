import { useState, useEffect } from 'react';
import { navigate } from '../App';
import { TestimonialsRow } from '../components/Testimonials';
import { products, type Product } from '../data/products';
import { setupPageSEO } from '../utils/seo';
import { trackProductView, trackPurchaseIntent } from '../utils/funnelTracker';

// Cover components
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

// PayPal loaded via native SDK — no broken library dependency

interface Props {
  slug: string;
}

// Cover resolver — used when cover_image is empty
function ResolveCover({ slug }: { slug: string }) {
  const props = { size: 'lg' as const };
  if (slug === 'tropical-juice-smoothie-recipes') return <TropicalJuiceCover {...props} />;
  if (slug === 'caribbean-fruit-guide')           return <CaribbeanEncyclopediaCover {...props} />;
  if (slug === 'medicinal-leaves-guide')          return <MedicinalLeavesCover {...props} />;
  if (slug === 'tropical-fruit-desserts')         return <TropicalDessertsCover {...props} />;
  if (slug === 'mango-recipe-pack')               return <MangoRecipeCover {...props} />;
  if (slug === 'fruit-season-calendar')           return <FruitCalendarCover {...props} />;
  if (slug === 'papaya-recipe-pack')              return <PapayaRecipeCover {...props} />;
  if (slug === 'soursop-drinks-pack')             return <SoursopDrinksCover {...props} />;
  if (slug === 'guava-dessert-pack')              return <GuavaDessertCover {...props} />;
  if (slug === 'gym-energy' || slug === 'gym-energy-recipes')  return <GymEnergyBookCover {...props} />;
  if (slug === 'fat-loss-smoothies')             return <FatLossSmoothiesBookCover {...props} />;
  if (slug === 'healing-drinks')                 return <HealingDrinksBookCover {...props} />;
  if (slug === 'pre-workout-drinks')             return <PreWorkoutBookCover {...props} />;
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-leaf/20 to-mango/20 rounded-2xl">
      <span className="text-8xl">📚</span>
    </div>
  );
}

export function ProductDetailPage({ slug }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPaypal, setShowPaypal] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = () => {
    // Guard: slug must exist
    if (!slug) {
      console.error('[ProductDetailPage] Missing slug');
      setLoading(false);
      return;
    }

    const found = products.find(p => p.slug === slug);

    if (!found) {
      console.error('[ProductDetailPage] Product not found for slug:', slug);
      setLoading(false);
      return;
    }

    setProduct(found);
    trackProductView(found.slug);

    const categoryMap: Record<string, string> = {
      ebook: 'ebooks',
      'recipe-pack': 'recipe-packs',
      printable: 'printables',
    };
    const categoryPath = categoryMap[found.category] ?? found.category;

    setupPageSEO({
      title: found.seo_title,
      description: found.seo_description,
      path: `/store/${categoryPath}/${found.slug}`,
    });

    setLoading(false);
  };

  const handleProceedToCheckout = () => {
    if (!email || !agreed) {
      alert('Please enter your email and agree to the terms.');
      return;
    }
    trackPurchaseIntent();
    setShowPaypal(true);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-leaf"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // ── Fail-safe: product not found ───────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-6">🔍</div>
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find a product with that URL.</p>
          <a href="/store" className="btn-primary">
            ← Back to Store
          </a>
        </div>
      </div>
    );
  }

  // ── Order complete ─────────────────────────────────────────────────────────
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-r from-leaf to-leaf-dark text-white py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-heading text-4xl font-bold mb-4">Purchase Complete!</h2>
            <p className="text-xl">Thank you for your purchase. Your download is ready.</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 mb-8">
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-4">📥 Download Your Product</h2>
            <p className="text-gray-700 mb-6">
              A download link has been sent to <strong>{email}</strong>
            </p>
            <a
              href={product.download_url}
              download
              className="inline-block bg-leaf text-white font-bold py-4 px-8 rounded-xl hover:bg-leaf-dark transition-all text-lg shadow-lg"
            >
              ⬇️ Download {product.title}
            </a>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-heading font-bold text-lg mb-2">📧 Check Your Email</h3>
            <p className="text-gray-700 text-sm">
              A confirmation email with your download link has been sent. If you don't see it, check your spam folder.
            </p>
          </div>
          <div className="text-center">
            <a href="/store" className="text-leaf hover:underline font-medium">← Browse More Products</a>
          </div>
        </div>
      </div>
    );
  }

  // ── Main product page ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumbs */}
      <div className="border-b bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <a href="/" className="hover:text-leaf">Home</a>
            <span>/</span>
            <a href="/store" className="hover:text-leaf">Store</a>
            <span>/</span>
            <a href="/store/ebooks" className="hover:text-leaf capitalize">
              {product.category === 'ebook' ? 'Ebooks' : product.category === 'recipe-pack' ? 'Recipe Packs' : 'Printables'}
            </a>
            <span>/</span>
            <span className="text-charcoal font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left — Cover Image */}
          <div>
            <div className="sticky top-8">
              {product.cover_image ? (
                <img
                  src={product.cover_image}
                  alt={product.title}
                  className="w-full rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full rounded-2xl shadow-2xl overflow-hidden aspect-[2/3]">
                  <ResolveCover slug={product.slug} />
                </div>
              )}
            </div>
          </div>

          {/* Right — Details */}
          <div>
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-leaf/10 text-leaf rounded-full text-sm font-semibold uppercase tracking-wide">
                {product.category === 'ebook'       && '📚 Digital Ebook'}
                {product.category === 'recipe-pack' && '🍹 Recipe Collection'}
                {product.category === 'printable'   && '📄 Printable Guide'}
              </span>
            </div>

            <h1 className="font-heading text-4xl font-bold text-charcoal mb-4">
              {product.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              {product.short_description}
            </p>

            {/* Price & Buy */}
            <div className="bg-gradient-to-br from-leaf to-leaf-dark rounded-2xl p-8 mb-8 text-white shadow-xl">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-5xl font-bold">${product.price}</span>
                {'original_price' in product && (product as any).original_price && (
                  <span className="text-xl opacity-70 line-through">${(product as any).original_price}</span>
                )}
                <span className="text-xl opacity-90">USD</span>
              </div>

              {!showPaypal ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Your Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg text-charcoal border-2 border-white/20 focus:border-white focus:outline-none"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="mt-0.5"
                      />
                      <span className="opacity-90">
                        I agree to the terms of service and understand this is a digital product with instant delivery.
                      </span>
                    </label>
                  </div>
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={!email || !agreed}
                    className="w-full bg-white text-leaf font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition-all text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    🛒 Proceed to Checkout
                  </button>
                </>
              ) : (
                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => navigate(`/checkout/${product.id}`)}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg text-white transition-colors shadow-lg"
                    style={{ backgroundColor: '#0070ba' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#003087')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0070ba')}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.65h6.18c2.046 0 3.482.46 4.272 1.368.738.85.946 2.07.635 3.73l-.003.02v.463l.36.205c.306.165.55.358.737.576.318.372.523.845.607 1.404.087.579.053 1.27-.1 2.055-.176.9-.463 1.685-.855 2.332-.36.598-.812 1.085-1.344 1.449-.505.343-1.1.6-1.77.76-.648.155-1.386.233-2.193.233H11.65a.943.943 0 0 0-.932.8l-.024.148-.462 2.93-.02.12a.943.943 0 0 1-.932.8H7.076z" />
                    </svg>
                    Buy Now — ${product.price.toFixed(2)}
                  </button>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-white/80">
                    <span>🔒 Secure PayPal</span>
                    <span>⚡ Instant Download</span>
                    <span>💯 30-Day Guarantee</span>
                  </div>
                </div>
              )}

              {orderError && (
                <div className="mt-4 bg-red-100 text-red-800 p-3 rounded-lg text-sm">
                  {orderError}
                </div>
              )}

              <p className="text-center text-sm mt-4 opacity-90">
                ⚡ Instant access • 🔒 Secure payment • 💯 Money-back guarantee
              </p>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 rounded-xl">
              <div>
                <div className="text-sm text-gray-600 mb-1">Pages</div>
                <div className="font-bold text-charcoal">{product.page_count} pages</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Format</div>
                <div className="font-bold text-charcoal">{product.file_format}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">File Size</div>
                <div className="font-bold text-charcoal">{product.file_size}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Access</div>
                <div className="font-bold text-charcoal">Lifetime</div>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading text-2xl font-bold text-charcoal mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-leaf text-xl flex-shrink-0">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Long Description */}
        {product.long_description && (
          <div className="mt-16 prose prose-lg max-w-none">
            <h2 className="font-heading text-3xl font-bold text-charcoal mb-6">
              About This {product.category === 'ebook' ? 'Ebook' : 'Product'}
            </h2>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {product.long_description}
            </div>
          </div>
        )}

        {/* Table of Contents */}
        {product.table_of_contents && product.table_of_contents.length > 0 && (
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <h2 className="font-heading text-3xl font-bold text-charcoal mb-6">Table of Contents</h2>
            <ul className="space-y-2">
              {product.table_of_contents.map((item, index) => (
                <li
                  key={index}
                  className={`text-gray-700 ${
                    item.startsWith('  ')
                      ? 'pl-6 text-sm'
                      : item.startsWith('Chapter') || item.startsWith('Part')
                      ? 'font-bold mt-4 text-leaf'
                      : 'font-semibold mt-3'
                  }`}
                >
                  {item.trim()}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="font-heading text-3xl font-bold text-charcoal mb-8 text-center">
            What Our Customers Say
          </h2>
          <TestimonialsRow max={3} />
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 text-center border-2 border-amber-200">
          <h2 className="font-heading text-3xl font-bold text-charcoal mb-4">
            Ready to Start Your Tropical Fruit Journey?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Get instant access to {product.title} and start exploring today!
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-leaf text-white font-bold py-4 px-12 rounded-xl hover:bg-leaf-dark transition-all text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Buy Now for ${product.price}
          </button>

          {/* Game entry point */}
          <div className="mt-8 pt-8 border-t border-amber-200">
            <p className="text-sm text-gray-500 mb-3">🎮 Not ready to buy yet?</p>
            <button
              onClick={() => navigate('/fruit-game')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-leaf hover:text-leaf-dark transition-colors underline underline-offset-2"
            >
              Play Fruit Catcher to earn rewards &amp; unlock deals on this ebook →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
