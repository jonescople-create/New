import { useEffect } from 'react';
import { navigate } from '../App';
import { fruits, type Fruit } from '../data/fruits';
import { FruitCard } from '../components/FruitCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { setupPageSEO, addStructuredData } from '../utils/seo';
import { QuickAnswerBlock } from '../components/QuickAnswerBlock';

interface Props { slug: string; }

interface NutritionCategory {
  title: string;
  icon: string;
  answer: string;
  description: string;
  fruitIds: string[];
  rankingLabel: string;
  benefits: string[];
  relatedSlugs: string[];
}

const NUTRITION_CATEGORIES: Record<string, NutritionCategory> = {
  'vitamin-c-fruits': {
    title: 'High Vitamin C Tropical Fruits',
    icon: '🍊',
    answer: 'The highest vitamin C tropical fruits are guava (4× more than oranges), soursop, papaya, and pineapple. These fruits provide far more vitamin C per serving than most citrus fruits, making them powerful immune boosters native to the Caribbean.',
    description: 'Discover which tropical fruits deliver the most vitamin C for immune support, skin health, and antioxidant protection.',
    fruitIds: ['10', '3', '8', '22', '5', '6', '4', '13', '15', '20'],
    rankingLabel: 'Vitamin C Content',
    benefits: [
      'Supports a strong immune system — vitamin C activates white blood cells',
      'Collagen production for healthy skin, joints, and wound healing',
      'Powerful antioxidant that neutralises free radicals',
      'Enhances iron absorption from plant-based foods',
      'May reduce duration and severity of colds',
    ],
    relatedSlugs: ['high-fiber-fruits', 'antioxidant-fruits'],
  },
  'high-fiber-fruits': {
    title: 'High Fiber Tropical Fruits',
    icon: '🥝',
    answer: 'Guava leads all tropical fruits in fibre content with about 9g per cup, followed by passion fruit, avocado, and soursop. High-fibre tropical fruits support digestion, gut health, and help maintain steady blood sugar levels.',
    description: 'Find the most fibre-rich Caribbean fruits to support digestion, gut microbiome health, and sustained energy.',
    fruitIds: ['10', '6', '19', '3', '8', '22', '5', '13', '2', '12'],
    rankingLabel: 'Dietary Fibre Content',
    benefits: [
      'Supports healthy digestion and regular bowel movements',
      'Feeds beneficial gut bacteria — prebiotics in action',
      'Helps maintain steady blood sugar by slowing sugar absorption',
      'Increases satiety — helps with healthy weight management',
      'Reduces cholesterol absorption in the digestive tract',
    ],
    relatedSlugs: ['vitamin-c-fruits', 'antioxidant-fruits'],
  },
  'antioxidant-fruits': {
    title: 'Antioxidant-Rich Tropical Fruits',
    icon: '🫐',
    answer: 'Soursop, guava, and acerola are among the most antioxidant-rich tropical fruits. These Caribbean fruits contain powerful compounds including lycopene, beta-carotene, and vitamin C that protect cells from damage and reduce inflammation.',
    description: 'Explore Caribbean tropical fruits packed with antioxidants that protect against inflammation, aging, and chronic disease.',
    fruitIds: ['3', '10', '6', '8', '5', '18', '7', '22', '19', '12'],
    rankingLabel: 'Antioxidant Capacity',
    benefits: [
      'Neutralises free radicals that damage cells and accelerate ageing',
      'Reduces systemic inflammation linked to chronic disease',
      'Supports cardiovascular health by protecting blood vessels',
      'May reduce risk of certain cancers according to emerging research',
      'Supports brain health and may slow cognitive decline',
    ],
    relatedSlugs: ['vitamin-c-fruits', 'high-fiber-fruits'],
  },
  'potassium-fruits': {
    title: 'High Potassium Tropical Fruits',
    icon: '💛',
    answer: 'Avocado, banana, and coconut water are the highest potassium tropical fruits. Potassium is essential for heart health, blood pressure regulation, and muscle function — making these fruits particularly valuable for cardiovascular wellness.',
    description: 'Discover potassium-packed Caribbean fruits that support heart health, blood pressure, and muscle function.',
    fruitIds: ['19', '13', '11', '3', '8', '5', '22', '2', '20', '16'],
    rankingLabel: 'Potassium Content',
    benefits: [
      'Regulates blood pressure by counteracting sodium effects',
      'Supports proper heart rhythm and cardiovascular function',
      'Essential for muscle contraction and preventing cramps',
      'Helps maintain proper fluid and electrolyte balance',
      'Supports kidney health and reduces risk of kidney stones',
    ],
    relatedSlugs: ['antioxidant-fruits', 'high-fiber-fruits'],
  },
  'low-sugar-fruits': {
    title: 'Low Sugar Tropical Fruits',
    icon: '🌿',
    answer: 'Avocado, soursop, guava, and star fruit are among the lowest sugar tropical fruits. These are ideal for people managing blood sugar or following low-glycaemic diets while still enjoying the flavours of the Caribbean.',
    description: 'Find Caribbean tropical fruits with lower sugar content — perfect for blood sugar management and weight-conscious eating.',
    fruitIds: ['19', '3', '10', '7', '18', '6', '21', '11', '9', '1'],
    rankingLabel: 'Sugar Content (Lower = Better)',
    benefits: [
      'Minimal blood sugar spikes compared to high-sugar fruits',
      'Supports weight management with lower calorie density',
      'Suitable for people with diabetes or insulin resistance',
      'Rich in nutrients without excess sugar',
      'Avocado especially supports blood sugar balance with healthy fats',
    ],
    relatedSlugs: ['high-fiber-fruits', 'antioxidant-fruits'],
  },
};

const RANKINGS: Record<string, Array<{ id: string; value: string; note: string }>> = {
  'vitamin-c-fruits': [
    { id: '10', value: '228mg / 100g', note: '4× more than oranges' },
    { id: '3',  value: '20mg / 100g',  note: 'Rich in immune-boosting compounds' },
    { id: '8',  value: '61mg / 100g',  note: 'Over 200% DV per fruit' },
    { id: '22', value: '47mg / 100g',  note: 'Plus bromelain enzyme' },
    { id: '5',  value: '36mg / 100g',  note: 'Easily absorbed vitamin C' },
  ],
  'high-fiber-fruits': [
    { id: '10', value: '9g / cup',    note: 'Highest fibre of any common fruit' },
    { id: '6',  value: '6.4g / 100g', note: 'Insoluble + soluble fibre' },
    { id: '19', value: '6.7g / 100g', note: 'Prebiotic fibre for gut health' },
    { id: '3',  value: '3.3g / 100g', note: 'Excellent digestive support' },
    { id: '8',  value: '1.8g / 100g', note: 'Plus papain digestive enzyme' },
  ],
  'antioxidant-fruits': [
    { id: '3',  value: 'Very High ORAC', note: 'Acetogenins + vitamin C' },
    { id: '10', value: 'High ORAC',      note: 'Lycopene + quercetin' },
    { id: '18', value: 'High ORAC',      note: 'Betalains — rare antioxidants' },
    { id: '6',  value: 'High ORAC',      note: 'Beta-carotene + vitamin C' },
    { id: '8',  value: 'High ORAC',      note: 'Lycopene + beta-carotene' },
  ],
  'potassium-fruits': [
    { id: '19', value: '975mg / cup',  note: 'More potassium than bananas' },
    { id: '13', value: '422mg / medium',note: 'The classic potassium fruit' },
    { id: '11', value: '600mg / cup water', note: 'Natural electrolyte' },
    { id: '3',  value: '626mg / cup',  note: 'Often overlooked potassium source' },
    { id: '8',  value: '781mg / fruit',note: 'High potassium per serving' },
  ],
  'low-sugar-fruits': [
    { id: '19', value: '0.7g / 100g',  note: 'Virtually zero sugar' },
    { id: '7',  value: '8g / 100g',    note: 'Low glycaemic index' },
    { id: '18', value: '7g / 100g',    note: 'Low-calorie + antioxidants' },
    { id: '10', value: '9g / 100g',    note: 'Sugar offset by fibre' },
    { id: '3',  value: '13g / 100g',   note: 'Low GI despite sweetness' },
  ],
};

export function NutritionPage({ slug }: Props) {
  const category = NUTRITION_CATEGORIES[slug];

  useEffect(() => {
    if (!category) return;
    setupPageSEO({
      title: `${category.title} | IslandFruitGuide Nutrition Guide`,
      description: category.description,
      path: `/nutrition/${slug}`,
      breadcrumbs: [
        { name: "Home", url: "/" },
        { name: "Nutrition Guides", url: "/nutrition" },
        { name: category.title, url: `/nutrition/${slug}` }
      ]
    });

    // AEO: DefinedTerm schema — helps AI systems understand the topic
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": category.title,
      "description": category.answer,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": "Tropical Fruit Nutrition Guides",
        "url": "https://www.islandfruitguide.com/nutrition"
      },
      "url": `https://www.islandfruitguide.com/nutrition/${slug}`
    });

    // AEO: Speakable — voice search + AI assistant signal
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", ".quick-answer", "h2:first-of-type"]
      },
      "url": `https://www.islandfruitguide.com/nutrition/${slug}`
    });
  }, [category, slug]);

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">🔍</span>
        <h2 className="text-3xl font-bold text-charcoal mb-4">Nutrition Guide Not Found</h2>
        <p className="text-charcoal-light mb-8">Try one of our available nutrition guides below.</p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          {Object.entries(NUTRITION_CATEGORIES).map(([s, c]) => (
            <button key={s} onClick={() => navigate(`/nutrition/${s}`)}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:border-leaf hover:bg-leaf/5 transition-colors text-left">
              <span className="text-2xl">{c.icon}</span>
              <span className="font-medium text-charcoal text-sm">{c.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const categoryFruits = category.fruitIds
    .map(id => fruits.find(f => f.id === id))
    .filter(Boolean) as Fruit[];

  const rankings = RANKINGS[slug] || [];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Nutrition Guides', href: '/nutrition' },
            { label: category.title },
          ]} dark />
          <div className="mt-4 flex items-start gap-5">
            <span className="text-6xl hidden sm:block">{category.icon}</span>
            <div>
              <h1 className="font-heading text-3xl lg:text-5xl font-bold">{category.title}</h1>
              <p className="text-white/80 mt-3 text-lg max-w-2xl">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick Answer (AEO) */}
        <QuickAnswerBlock
          question={`Which tropical fruits are highest in ${slug.replace(/-fruits$/, '').replace(/-/g, ' ')}?`}
          answer={category.answer}
        />

        {/* Rankings Table */}
        {rankings.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-10 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-heading text-xl font-bold text-charcoal">📊 {category.rankingLabel} Rankings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-charcoal-light uppercase">Rank</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-charcoal-light uppercase">Fruit</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-charcoal-light uppercase">{category.rankingLabel}</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-charcoal-light uppercase hidden sm:table-cell">Why It Stands Out</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((r, idx) => {
                    const f = fruits.find(fr => fr.id === r.id);
                    if (!f) return null;
                    return (
                      <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/fruits/${f.slug}`)}>
                        <td className="px-5 py-3 text-sm font-bold text-charcoal">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{f.emoji}</span>
                            <span className="font-semibold text-charcoal text-sm">{f.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm font-bold text-leaf">{r.value}</td>
                        <td className="px-5 py-3 text-xs text-charcoal-light hidden sm:table-cell">{r.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Health Benefits */}
        <div className="bg-gradient-to-br from-leaf/5 to-caribbean-green/5 rounded-2xl border border-leaf/20 p-6 mb-10">
          <h2 className="font-heading text-xl font-bold text-charcoal mb-4">💚 Health Benefits</h2>
          <ul className="space-y-3">
            {category.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-charcoal">
                <span className="text-leaf font-bold flex-shrink-0">✓</span>
                <span className="text-sm leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Fruit Grid */}
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-5">
          {category.icon} All {category.title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {categoryFruits.map(f => <FruitCard key={f.id} fruit={f} />)}
        </div>

        {/* Related Guides */}
        <div className="border-t border-gray-100 pt-8">
          <h2 className="font-heading text-xl font-bold text-charcoal mb-4">📚 Related Nutrition Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(NUTRITION_CATEGORIES)
              .filter(([s]) => s !== slug)
              .slice(0, 3)
              .map(([s, c]) => (
                <button key={s} onClick={() => navigate(`/nutrition/${s}`)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-leaf/30 transition-all text-left">
                  <span className="text-3xl">{c.icon}</span>
                  <div>
                    <div className="font-semibold text-charcoal text-sm">{c.title}</div>
                    <div className="text-xs text-charcoal-light mt-0.5">{c.fruitIds.length} fruits</div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
