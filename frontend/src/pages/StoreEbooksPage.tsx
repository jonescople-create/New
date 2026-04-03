import { useState, useEffect } from 'react';
import { setupPageSEO, addStructuredData } from '../utils/seo';
import { navigate } from '../App';
import { trackPageView } from '../utils/db';
import { products } from '../data/products';
import { Breadcrumb } from '../components/Breadcrumb';
import { CountdownTimer } from '../components/CountdownTimer';
import { TestimonialsSection } from '../components/Testimonials';
import { EmailCapture } from '../components/EmailCapture';
import { StoreStats } from '../components/SocialProof';
// Series SVG covers (for books with no hosted cover_image)
import { GymEnergyBookCover }        from '../components/GymEnergyBookCover';
import { FatLossSmoothiesBookCover } from '../components/FatLossSmoothiesBookCover';
import { HealingDrinksBookCover }    from '../components/HealingDrinksBookCover';
import { PreWorkoutBookCover }       from '../components/PreWorkoutBookCover';

// ── Cover resolver ────────────────────────────────────────────────────────────
// Classic books → real hosted image; Series books → premium SVG cover
function BookCover({ slug, coverImage, size = 'sm' }: { slug: string; coverImage: string; size?: 'sm'|'md'|'lg' }) {
  if (coverImage) {
    return (
      <img
        src={coverImage}
        alt={slug}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    );
  }
  if (slug === 'gym-energy' || slug === 'gym-energy-recipes')  return <GymEnergyBookCover size={size} />;
  if (slug === 'fat-loss-smoothies')  return <FatLossSmoothiesBookCover size={size} />;
  if (slug === 'healing-drinks')      return <HealingDrinksBookCover size={size} />;
  if (slug === 'pre-workout-drinks')  return <PreWorkoutBookCover size={size} />;
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-leaf/20 to-mango/20 text-4xl">📚</div>
  );
}

// ── Anchor "was" prices ───────────────────────────────────────────────────────
const ANCHOR: Record<string, number> = {
  'tropical-juice-smoothie-recipes': 24.99,
  'caribbean-fruit-guide':           39.99,
  'medicinal-leaves-guide':          27.99,
  'tropical-fruit-desserts':         22.99,
  'mango-recipe-pack':               12.99,
  'fruit-season-calendar':           7.99,
  'papaya-recipe-pack':              12.99,
  'soursop-drinks-pack':             12.99,
  'guava-dessert-pack':              12.99,
  'gym-energy-recipes':              17.99,
  'fat-loss-smoothies':              16.99,
  'healing-drinks':                  19.99,
  'pre-workout-drinks':              16.99,
};

// ── Download counts ───────────────────────────────────────────────────────────
const DOWNLOADS: Record<string, string> = {
  'tropical-juice-smoothie-recipes': '834 downloads',
  'caribbean-fruit-guide':           '1,240 downloads',
  'medicinal-leaves-guide':          '976 downloads',
  'tropical-fruit-desserts':         '612 downloads',
  'mango-recipe-pack':               '1,580 downloads',
  'fruit-season-calendar':           '2,100 downloads',
  'papaya-recipe-pack':              '743 downloads',
  'soursop-drinks-pack':             '1,120 downloads',
  'guava-dessert-pack':              '680 downloads',
  'gym-energy-recipes':              '524 downloads',
  'fat-loss-smoothies':              '891 downloads',
  'healing-drinks':                  '678 downloads',
  'pre-workout-drinks':              '445 downloads',
};

// ── Series slugs ──────────────────────────────────────────────────────────────
const SERIES_SLUGS = new Set([
  'gym-energy-recipes',
  'fat-loss-smoothies',
  'healing-drinks',
  'pre-workout-drinks',
]);

// ── Hero preview covers ───────────────────────────────────────────────────────
const HERO_COVERS = [
  { slug: 'tropical-juice-smoothie-recipes', url: 'https://static.prod-images.emergentagent.com/jobs/eb877ca3-362e-4aba-8bca-b5ba065c3558/images/09c02ddbfbdb6b291fbfd337cb0bbc8542f5b55dc7b7fdd71b9c9aa0d5bb52bd.png' },
  { slug: 'caribbean-fruit-guide',           url: 'https://static.prod-images.emergentagent.com/jobs/eb877ca3-362e-4aba-8bca-b5ba065c3558/images/07119d53adca3e611b37ddd1cffcca420e0bf0dd5a6a09117d44138778df32d4.png' },
  { slug: 'medicinal-leaves-guide',          url: 'https://static.prod-images.emergentagent.com/jobs/eb877ca3-362e-4aba-8bca-b5ba065c3558/images/995810efc60d2e86bd5c9833b65be0858e51b412598a6c4fd835f05d44ca230c.png' },
];

function StarRating({ score = 4.9, count = 127 }: { score?: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <span className="text-xs font-bold text-amber-600">{score}</span>
      <span className="text-xs text-charcoal-light">({count})</span>
    </div>
  );
}

export function StoreEbooksPage() {
  const [filter, setFilter] = useState<'all'|'ebook'|'recipe-pack'|'printable'>('all');

  useEffect(() => {
    trackPageView('/store/ebooks', 'store');
    setupPageSEO({
      title: 'Caribbean Tropical Fruit Ebooks & Recipe Collections | IslandFruitGuide Store',
      description: 'Download premium Caribbean fruit ebooks, tropical recipe packs and nutrition guides. Expert resources on smoothies, healing drinks, desserts and more. Instant PDF download.',
      path: '/store/ebooks',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Store', url: '/store' },
        { name: 'Ebooks & Recipe Packs', url: '/store/ebooks' },
      ],
    });
    addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Caribbean Tropical Fruit Ebooks & Recipe Collections',
      description: 'Premium Caribbean fruit ebooks, recipe packs and nutritional guides from IslandFruitGuide.',
      url: 'https://www.islandfruitguide.com/store/ebooks',
      publisher: { '@type': 'Organization', name: 'IslandFruitGuide' },
    });
  }, []);

  const allBooks = products.filter(p => ['ebook','recipe-pack','printable'].includes(p.category));
  const classicBooks = allBooks.filter(p => !SERIES_SLUGS.has(p.slug));
  const seriesBooks  = allBooks.filter(p =>  SERIES_SLUGS.has(p.slug));

  const filtered = filter === 'all' ? classicBooks : classicBooks.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-white animate-fade-in">

      {/* ── HERO ── */}
      <div style={{background:'linear-gradient(135deg,#071A07,#0A2010,#030D03)'}} className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}/>
        <div className="max-w-6xl mx-auto relative">
          <Breadcrumb items={[{label:'Store',href:'/store'},{label:'Ebooks & Recipe Packs'}]} dark/>
          <div className="mt-8 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-400/15 border border-yellow-400/30 text-yellow-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
                🔥 SUMMER SALE — Up to 58% OFF
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
                Caribbean Fruit <span className="text-yellow-400">Ebooks</span> &amp; Recipe Collections
              </h1>
              <p className="text-white/75 text-lg mb-6 leading-relaxed">
                Expert guides, authentic Caribbean recipes, and nutritional resources — crafted for the Caribbean diaspora worldwide. <strong className="text-white">Instant PDF download.</strong>
              </p>
              <div className="bg-white/10 rounded-2xl p-4 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                <span className="text-white/80 text-sm font-medium">⏰ Sale prices expire in:</span>
                <CountdownTimer hours={72} className="text-white"/>
              </div>
              <div className="flex flex-wrap gap-4 text-white/65 text-sm">
                {['⚡ Instant Download','🔒 Secure PayPal','💯 30-Day Guarantee','📱 Any Device'].map(t => <span key={t}>{t}</span>)}
              </div>
            </div>
            {/* Hero preview */}
            <div className="hidden lg:flex items-end justify-center gap-4">
              {HERO_COVERS.map((cover, i) => (
                <div key={cover.slug} className="overflow-hidden rounded-xl shadow-2xl flex-shrink-0"
                  style={{width: i===1?130:100, marginBottom: i===1?24:i===0?48:0}}>
                  <img src={cover.url} alt={cover.slug} className="w-full h-auto object-cover"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STORE STATS ── */}
      <div className="max-w-6xl mx-auto px-4">
        <StoreStats/>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* ── TROPICAL NUTRITION SERIES ── */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent"/>
            <span className="text-xs font-black text-yellow-600 tracking-widest uppercase">🌴 New — Tropical Nutrition Series</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent"/>
          </div>
          <h2 className="font-heading text-2xl font-bold text-charcoal text-center mb-1">Tropical Nutrition Series</h2>
          <p className="text-charcoal-light text-center text-sm mb-8">Natural Energy · Fat Loss · Healing · Performance — All Caribbean, All Natural</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {seriesBooks.map(book => {
              const anchor = ANCHOR[book.slug];
              const pct = anchor ? Math.round((1 - book.price/anchor)*100) : 0;
              return (
                <div key={book.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group flex flex-col">
                  {pct > 0 && (
                    <div className="bg-red-500 text-white text-xs font-black text-center py-1 tracking-wide">
                      SAVE {pct}% — LIMITED TIME
                    </div>
                  )}
                  <div className="flex justify-center pt-5 pb-2 bg-gradient-to-b from-gray-50 to-white px-3">
                    <div className="group-hover:scale-105 transition-transform duration-300">
                      <BookCover slug={book.slug} coverImage={book.cover_image} size="md"/>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 font-bold px-2 py-0.5 rounded-full">🏅 Series</span>
                      <StarRating score={4.9} count={Math.floor(50 + book.price*23)}/>
                    </div>
                    <h3 className="font-bold text-charcoal text-sm leading-snug mb-1 flex-1">{book.title}</h3>
                    <p className="text-xs text-charcoal-light mb-3">{DOWNLOADS[book.slug]}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-charcoal">${book.price.toFixed(2)}</span>
                      {anchor && <span className="text-sm text-gray-400 line-through">${anchor.toFixed(2)}</span>}
                    </div>
                    <button
                      onClick={() => navigate(`/store/${book.slug}`)}
                      className="w-full text-xs bg-gradient-to-r from-leaf to-leaf-light text-white font-bold py-2.5 rounded-xl hover:scale-105 transition-transform shadow-md"
                    >
                      Buy Now — ${book.price.toFixed(2)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CLASSIC COLLECTION ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-leaf/30 to-transparent"/>
            <span className="text-xs font-black text-leaf tracking-widest uppercase">📚 Classic Collection</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-leaf/30 to-transparent"/>
          </div>
          <h2 className="font-heading text-2xl font-bold text-charcoal text-center mb-6">
            Guides, Recipe Packs &amp; Calendars
          </h2>

          {/* Filter tabs */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {([['all','All'],['ebook','Ebooks'],['recipe-pack','Recipe Packs'],['printable','Printables']] as const).map(([val,label]) => (
              <button key={val} onClick={() => setFilter(val)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter===val ? 'bg-leaf text-white shadow-md' : 'bg-white border border-gray-200 text-charcoal hover:border-leaf hover:text-leaf'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filtered.map(book => {
              const anchor = ANCHOR[book.slug];
              const pct = anchor ? Math.round((1 - book.price/anchor)*100) : 0;
              return (
                <div key={book.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group flex flex-col">
                  <div className="relative overflow-hidden bg-gray-50">
                    {pct > 0 && (
                      <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">-{pct}%</div>
                    )}
                    <div className="group-hover:scale-105 transition-transform duration-500">
                      <BookCover slug={book.slug} coverImage={book.cover_image} size="sm"/>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] text-charcoal-light uppercase tracking-wide mb-1">
                      {book.category==='ebook'?'📚 Ebook':book.category==='recipe-pack'?'🍹 Recipe Pack':'📄 Printable'}
                    </p>
                    <h3 className="font-bold text-charcoal text-xs leading-snug mb-1 flex-1">{book.title}</h3>
                    <StarRating score={4.8} count={Math.floor(40 + (book.price*37)%100)}/>
                    <p className="text-[10px] text-charcoal-light mt-1 mb-3">{DOWNLOADS[book.slug] ?? ''}</p>
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="font-black text-charcoal text-lg">${book.price.toFixed(2)}</span>
                      {anchor && <span className="text-xs text-gray-400 line-through">${anchor.toFixed(2)}</span>}
                    </div>
                    <button
                      onClick={() => navigate(`/store/${book.slug}`)}
                      className="w-full text-xs bg-leaf text-white font-bold py-2 rounded-xl hover:bg-leaf-dark transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── LEAD MAGNET ── */}
        <div className="mb-16">
          <EmailCapture variant="banner"/>
        </div>

        {/* ── TRUST BLOCK ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            {i:'🔒',l:'Secure Checkout', d:'PayPal buyer protection'},
            {i:'⚡',l:'Instant Download', d:'PDF in seconds'},
            {i:'💯',l:'30-Day Guarantee',d:'Full refund, no questions'},
            {i:'📱',l:'Any Device',       d:'Phone, tablet, desktop'},
          ].map(t => (
            <div key={t.l} className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="text-3xl mb-2">{t.i}</div>
              <div className="font-bold text-charcoal text-sm">{t.l}</div>
              <div className="text-xs text-charcoal-light mt-0.5">{t.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection/>

      {/* ── SECOND EMAIL CAPTURE ── */}
      <div className="max-w-2xl mx-auto px-4 py-14">
        <div className="text-center mb-6">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Still Deciding?</h2>
          <p className="text-charcoal-light">Get our free Caribbean Fruit Bible PDF and a 20% discount — then decide.</p>
        </div>
        <EmailCapture variant="inline"/>
      </div>
    </div>
  );
}
