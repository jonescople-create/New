import { useEffect } from 'react';
import { navigate } from '../App';
import { fruits, type Fruit } from '../data/fruits';
import { recipes } from '../data/recipes';
import { FruitCard } from '../components/FruitCard';
import { RecipeCard } from '../components/RecipeCard';
import { Breadcrumb } from '../components/Breadcrumb';
import { setupPageSEO, addStructuredData } from '../utils/seo';
import { QuickAnswerBlock } from '../components/QuickAnswerBlock';

interface Props { slug: string; }

interface GuideSection {
  heading: string;
  body: string;
}

interface Guide {
  title: string;
  icon: string;
  subtitle: string;
  answer: string;
  intro: string;
  fruitIds: string[];
  recipeSlugKeywords: string[];
  sections: GuideSection[];
  tips: string[];
  relatedGuides: string[];
  seoDescription: string;
}

const GUIDES: Record<string, Guide> = {
  'tropical-fruits-beginners': {
    title: "Tropical Fruits: A Beginner's Guide",
    icon: '🌴',
    subtitle: 'Everything you need to know to start exploring Caribbean fruits',
    answer: "The best tropical fruits for beginners are mango, papaya, and banana — familiar flavours with easy preparation and widespread availability. Start with these three, then progress to guava, pineapple, and soursop as your palate for tropical fruits develops.",
    intro: "Welcome to the world of tropical fruits! The Caribbean is home to some of the most flavourful, nutritious, and exciting fruits on earth. This guide walks you through the best fruits to try first, how to pick ripe ones, and how to prepare them.",
    fruitIds: ['5', '8', '13', '22', '10', '11', '3', '6', '19', '2'],
    recipeSlugKeywords: ['papaya', 'mango', 'soursop', 'coconut'],
    sections: [
      {
        heading: '🥭 Start With These 5 Fruits',
        body: 'If you\'re new to tropical fruits, start with mango (sweet, familiar), papaya (mild, digestive), banana (easy, nutritious), pineapple (tangy, versatile), and coconut (refreshing, creamy). These five have broad appeal and are available year-round in most countries.',
      },
      {
        heading: '🌿 How to Know When a Tropical Fruit is Ripe',
        body: 'Most tropical fruits signal ripeness through aroma and gentle give. Mango: sweet fragrance + slight yield to pressure. Papaya: yellow-orange skin + gives when pressed. Soursop: dark green + slight softness. Guava: fragrant + cream-yellow skin. Avocado: gives to gentle pressure all over.',
      },
      {
        heading: '🔪 Basic Preparation Guide',
        body: 'Mango: slice around the flat seed, cube the flesh, scoop out. Papaya: halve, scoop seeds, peel and slice. Soursop: halve, scoop pulp, remove seeds before eating. Guava: wash and eat whole — skin and seeds are edible. Coconut: crack along the equator with a heavy knife.',
      },
      {
        heading: '💊 Nutritional Benefits at a Glance',
        body: 'Tropical fruits are nutritional powerhouses. Guava delivers 4× more vitamin C than oranges. Papaya contains the digestive enzyme papain. Avocado packs more potassium than bananas. Soursop is rich in antioxidant compounds. Mango provides over 100% of your daily vitamin C in one cup.',
      },
    ],
    tips: [
      'Buy tropical fruits from Caribbean or Asian grocery stores for better quality and prices',
      'Ripen mangoes and papayas on your counter — never in the fridge until ripe',
      'Frozen tropical fruit pulp is a great affordable alternative when fresh isn\'t available',
      'Try fruits with a little salt, pepper, and lime — the Caribbean way — before adding sugar',
      'Start with a fruit smoothie if you\'re unsure about raw flavours',
    ],
    relatedGuides: ['fruits-for-smoothies', 'fruits-for-energy'],
    seoDescription: "Complete beginner's guide to Caribbean tropical fruits — which to try first, how to pick ripe ones, how to prepare them, and their health benefits.",
  },

  'fruits-for-smoothies': {
    title: 'Best Tropical Fruits for Smoothies',
    icon: '🍹',
    subtitle: 'The ultimate guide to Caribbean smoothie fruits',
    answer: "The best tropical fruits for smoothies are mango, banana, soursop, papaya, and passion fruit. Mango and banana create the perfect creamy base while soursop, papaya, and passion fruit add intense tropical flavour and nutrition.",
    intro: "Caribbean smoothies are in a league of their own. The region's fruits have natural creaminess, intense flavour, and powerful nutrition that elevate any blended drink. Here are the best tropical fruits for smoothies and how to use them.",
    fruitIds: ['5', '13', '3', '8', '6', '11', '22', '10', '18', '24'],
    recipeSlugKeywords: ['smoothie', 'juice', 'papaya'],
    sections: [
      {
        heading: '🥭 The Best Smoothie Base Fruits',
        body: 'Frozen mango and banana are the gold standard smoothie bases — they create a thick, creamy texture without yogurt or ice cream. Add frozen banana for creaminess, frozen mango for sweetness, or papaya for a lighter, digestive-friendly base.',
      },
      {
        heading: '🌟 Flavour Booster Fruits',
        body: 'Add these in smaller quantities for intense flavour: passion fruit (2-3 tablespoons of pulp), soursop (1/4 cup of pulp), tamarind (1 tablespoon of paste), and guava (1/2 cup). These have powerful flavours that can easily dominate — start small and add to taste.',
      },
      {
        heading: '💚 Liquid Options',
        body: 'Coconut water is the ultimate smoothie liquid for tropical flavour and electrolytes. Coconut milk adds creaminess. Fresh lime juice brightens any blend. For a lighter smoothie, use cold water or light coconut water. Avoid juice — it adds sugar without fibre.',
      },
      {
        heading: '🔥 Power Boosters',
        body: 'Add fresh ginger for anti-inflammatory benefits. A small piece of turmeric for antioxidants. Moringa powder for iron and protein. Pineapple for bromelain enzyme. Soursop leaves tea as the liquid base for a medicinal twist.',
      },
    ],
    tips: [
      'Freeze ripe bananas and mangoes when they\'re perfectly ripe — they make incredible smoothie bases for weeks',
      'Blend hard fruits (pineapple, jackfruit) before adding soft ones for a smoother texture',
      'Soursop pulp from a can or frozen pack is a pantry essential — it\'s hard to find fresh outside the Caribbean',
      'Add avocado for protein and healthy fats without changing the flavour',
      'A squeeze of lime and pinch of sea salt finishes any tropical smoothie perfectly',
    ],
    relatedGuides: ['tropical-fruits-beginners', 'fruits-for-energy'],
    seoDescription: "Complete guide to the best tropical fruits for smoothies — base fruits, flavour boosters, liquid options, and expert tips for Caribbean-style blended drinks.",
  },

  'fruits-for-energy': {
    title: 'Best Tropical Fruits for Energy',
    icon: '⚡',
    subtitle: 'Natural energy-boosting Caribbean fruits',
    answer: "The best tropical fruits for natural energy are banana, mango, pineapple, and jackfruit. These provide fast-releasing natural sugars, potassium for muscle function, and B vitamins for energy metabolism — without the crash of processed energy drinks.",
    intro: "Forget energy drinks. The Caribbean's tropical fruits provide clean, sustained energy through natural sugars, B vitamins, potassium, and iron. Here are the best fruits for energy and when to eat them for maximum benefit.",
    fruitIds: ['13', '5', '22', '23', '10', '6', '8', '11', '20', '2'],
    recipeSlugKeywords: ['banana', 'pineapple', 'mango'],
    sections: [
      {
        heading: '⚡ Quick Energy Fruits (Pre-Workout)',
        body: 'Banana is the world\'s favourite pre-workout fruit — it delivers fast glucose, potassium for muscle function, and vitamin B6 for energy metabolism. Mango provides 45g of natural sugars per cup for quick fuel. Pineapple adds bromelain which helps reduce workout inflammation.',
      },
      {
        heading: '🌿 Sustained Energy Fruits (Long Workdays)',
        body: 'Avocado provides healthy fats that give hours of sustained energy. Guava\'s high fibre content slows sugar release for steady energy. Jackfruit\'s complex carbohydrates provide lasting fuel. Breadfruit is a starchy staple the Caribbean relies on for long-lasting energy.',
      },
      {
        heading: '💊 B Vitamins for Energy Metabolism',
        body: 'Many tropical fruits are rich in B vitamins that convert food to usable energy. Banana leads with vitamin B6. Mango provides B1, B2, and B6. Soursop and jackfruit are also excellent sources. These vitamins are essential for the cellular processes that produce ATP (energy).',
      },
      {
        heading: '🫀 Iron-Rich Fruits for Fighting Fatigue',
        body: 'Fatigue is often caused by iron deficiency. Soursop contains notable iron. Tamarind is one of the richest fruit sources of iron. Guava provides iron plus the vitamin C to absorb it. Eating these together maximises iron uptake.',
      },
    ],
    tips: [
      'Eat a banana 30-45 minutes before exercise for optimal energy and muscle support',
      'Combine iron-rich tamarind or soursop with vitamin C fruits to maximise iron absorption',
      'Mango and banana smoothies make the perfect pre-workout meal that\'s easy to digest',
      'Coconut water after exercise replaces electrolytes better than most sports drinks',
      'Avoid eating high-sugar fruits on an empty stomach — pair with protein or fat for sustained energy',
    ],
    relatedGuides: ['fruits-for-smoothies', 'tropical-fruits-beginners'],
    seoDescription: "Guide to the best tropical fruits for natural energy — pre-workout fruits, sustained energy sources, B vitamin content, and iron-rich Caribbean fruits.",
  },

  'fruits-for-immunity': {
    title: 'Best Tropical Fruits for Immunity',
    icon: '🛡️',
    subtitle: 'Caribbean fruits that supercharge your immune system',
    answer: "The most powerful immune-boosting tropical fruits are guava, soursop, papaya, and acerola cherry. Guava contains 4× more vitamin C than oranges, soursop is loaded with antioxidants, and papaya provides over 200% of your daily vitamin C in a single fruit.",
    intro: "The Caribbean has some of the world's most potent immune-boosting fruits. Rich in vitamin C, antioxidants, and anti-inflammatory compounds, these tropical fruits have been used in traditional Caribbean medicine for generations.",
    fruitIds: ['10', '3', '8', '6', '22', '5', '4', '20', '16', '12'],
    recipeSlugKeywords: ['soursop', 'guava', 'papaya'],
    sections: [
      {
        heading: '🍊 Vitamin C Champions',
        body: 'Vitamin C is the cornerstone of immune health — it activates white blood cells and acts as a powerful antioxidant. Guava leads with 228mg per 100g (4× more than oranges). Papaya provides over 200% of daily vitamin C per fruit. Pineapple, soursop, and june plum are also excellent sources.',
      },
      {
        heading: '🦠 Antiviral and Antimicrobial Fruits',
        body: 'Several Caribbean fruits have traditional use as antiviral and antimicrobial agents. Soursop leaves and fruit contain acetogenins studied for immune modulation. Guava leaf preparations are traditional throat remedies. Tamarind has documented antimicrobial properties. Papaya seeds have traditional antiparasitic use.',
      },
      {
        heading: '🔥 Anti-Inflammatory Fruits',
        body: 'Chronic inflammation suppresses immune function. Pineapple\'s bromelain enzyme actively reduces inflammation. Soursop contains anti-inflammatory alkaloids. Papaya\'s papain enzyme is potently anti-inflammatory. Avocado\'s omega-9 fatty acids reduce inflammatory markers.',
      },
      {
        heading: '🌿 Gut Health and Immunity Connection',
        body: '70% of the immune system lives in the gut. High-fibre fruits feed beneficial gut bacteria that train the immune system. Guava leads with 9g of fibre per cup. Passion fruit, avocado, and soursop are also excellent prebiotic sources.',
      },
    ],
    tips: [
      'Eat guava fresh with the skin — most of the vitamin C is concentrated just under the skin',
      'Soursop juice is most nutritious when made from fresh pulp — canned versions still have benefits',
      'Combine iron-rich fruits with vitamin C fruits in the same meal to maximise absorption',
      'Tropical fruits are best eaten fresh and ripe — heat and overcooking destroys vitamin C',
      'Variety matters — eat 5+ different tropical fruits weekly for the widest immune protection',
    ],
    relatedGuides: ['tropical-fruits-beginners', 'fruits-for-energy'],
    seoDescription: "Best Caribbean tropical fruits for immune system support — vitamin C powerhouses, antiviral fruits, anti-inflammatory properties, and gut health connection.",
  },

  'fruits-for-digestion': {
    title: 'Best Tropical Fruits for Digestion',
    icon: '🫃',
    subtitle: 'Caribbean fruits that transform gut health',
    answer: "The best tropical fruits for digestion are papaya, pineapple, and guava. Papaya contains papain — a powerful protein-digesting enzyme. Pineapple has bromelain with similar enzyme action. Guava's high fibre content feeds the gut microbiome. All three have centuries of traditional use as digestive aids.",
    intro: "Caribbean traditional medicine has long used tropical fruits to support digestion. Modern nutrition science confirms that several of these fruits contain unique enzymes, fibre, and compounds that can genuinely transform digestive health.",
    fruitIds: ['8', '22', '10', '3', '12', '5', '6', '13', '19', '11'],
    recipeSlugKeywords: ['papaya', 'pineapple', 'guava'],
    sections: [
      {
        heading: '🧪 Digestive Enzyme Fruits',
        body: 'Three Caribbean fruits contain powerfully effective digestive enzymes: Papaya contains papain — it breaks down proteins and is so effective it\'s used in meat tenderisers. Pineapple contains bromelain with similar protein-digesting action. These enzymes can significantly ease bloating, gas, and indigestion when eaten with or after meals.',
      },
      {
        heading: '🌾 High-Fibre Fruits for Gut Microbiome',
        body: 'Guava leads all tropical fruits in fibre with 9g per cup — it feeds beneficial gut bacteria and promotes regularity. Passion fruit, avocado, and soursop are also excellent fibre sources. A diverse gut microbiome — fed by fruit fibre — is the foundation of digestive and immune health.',
      },
      {
        heading: '🦠 Probiotic + Prebiotic Pairing',
        body: 'Tropical fruit fibre acts as prebiotic food for probiotic bacteria. Eating high-fibre tropical fruits like guava and avocado alongside probiotic foods (yogurt, kefir) creates a powerful synbiotic effect — feeding and multiplying the beneficial bacteria in your gut.',
      },
      {
        heading: '💧 Hydrating Fruits for Digestive Flow',
        body: 'Proper hydration is essential for digestion. High-water-content tropical fruits help maintain digestive flow: watermelon (90% water), papaya (88%), star apple (83%), and soursop (81%) all support hydration that keeps the digestive system moving efficiently.',
      },
    ],
    tips: [
      'Eat papaya after a heavy protein meal — papain actively breaks down meat proteins',
      'Fresh pineapple (not canned) has active bromelain; heat in canning destroys the enzyme',
      'Guava is best eaten with the skin and seeds intact — maximum fibre and nutrition',
      'Tamarind is a traditional laxative in Caribbean medicine — use sparingly',
      'Eat tropical fruits 30 minutes before meals or 2 hours after for optimal enzyme activity',
    ],
    relatedGuides: ['fruits-for-immunity', 'tropical-fruits-beginners'],
    seoDescription: "Best Caribbean tropical fruits for digestion — digestive enzyme fruits, high-fibre sources, gut microbiome support, and expert preparation tips.",
  },
};

export function GuidePage({ slug }: Props) {
  const guide = GUIDES[slug];

  useEffect(() => {
    if (!guide) return;
    setupPageSEO({
      title: `${guide.title} | IslandFruitGuide`,
      description: guide.seoDescription,
      path: `/guides/${slug}`,
      breadcrumbs: [
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guides" },
        { name: guide.title, url: `/guides/${slug}` }
      ]
    });

    // AEO: Article schema for guide content
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": guide.title,
      "description": guide.seoDescription,
      "author": { "@type": "Organization", "name": "IslandFruitGuide", "url": "https://www.islandfruitguide.com" },
      "publisher": { "@type": "Organization", "name": "IslandFruitGuide" },
      "datePublished": "2025-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "url": `https://www.islandfruitguide.com/guides/${slug}`,
      "mainEntityOfPage": `https://www.islandfruitguide.com/guides/${slug}`
    });

    // AEO: Speakable
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", ".quick-answer-block", ".guide-intro"]
      },
      "url": `https://www.islandfruitguide.com/guides/${slug}`
    });
  }, [guide, slug]);

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">📚</span>
        <h2 className="text-3xl font-bold text-charcoal mb-4">Guide Not Found</h2>
        <p className="text-charcoal-light mb-8">Explore our available tropical fruit guides below.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {Object.entries(GUIDES).map(([s, g]) => (
            <button key={s} onClick={() => navigate(`/guides/${s}`)}
              className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-leaf hover:bg-leaf/5 transition-colors text-left">
              <span className="text-3xl">{g.icon}</span>
              <span className="font-medium text-charcoal text-sm">{g.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const guideFruits = guide.fruitIds
    .map(id => fruits.find(f => f.id === id))
    .filter(Boolean) as Fruit[];

  const guideRecipes = recipes.filter(r =>
    guide.recipeSlugKeywords.some(kw => r.slug.includes(kw) || r.title.toLowerCase().includes(kw))
  ).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-mango to-coral text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Guides', href: '/guides' },
            { label: guide.title },
          ]} dark />
          <div className="mt-4 flex items-start gap-5">
            <span className="text-6xl hidden sm:block">{guide.icon}</span>
            <div>
              <h1 className="font-heading text-3xl lg:text-5xl font-bold">{guide.title}</h1>
              <p className="text-white/80 mt-3 text-lg max-w-2xl">{guide.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick Answer (AEO) */}
        <QuickAnswerBlock
          question={`${guide.icon} Quick Answer`}
          answer={guide.answer}
        />

        {/* Intro */}
        <p className="text-charcoal leading-relaxed mb-10 text-base max-w-3xl">{guide.intro}</p>

        {/* Content Sections */}
        <div className="space-y-8 mb-12">
          {guide.sections.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-heading text-xl font-bold text-charcoal mb-3">{s.heading}</h2>
              <p className="text-charcoal leading-relaxed text-sm">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-br from-mango/10 to-coral/10 rounded-2xl border border-mango/20 p-6 mb-12">
          <h2 className="font-heading text-xl font-bold text-charcoal mb-4">💡 Expert Tips</h2>
          <ul className="space-y-3">
            {guide.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-charcoal text-sm">
                <span className="text-mango font-bold flex-shrink-0">→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured Fruits */}
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-5">🍃 Featured Fruits in This Guide</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
          {guideFruits.map(f => <FruitCard key={f.id} fruit={f} size="sm" />)}
        </div>

        {/* Recipes */}
        {guideRecipes.length > 0 && (
          <>
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-5">🍳 Related Recipes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {guideRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
            </div>
          </>
        )}

        {/* Related Guides */}
        <div className="border-t border-gray-100 pt-8">
          <h2 className="font-heading text-xl font-bold text-charcoal mb-4">📚 Related Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guide.relatedGuides.map(relSlug => {
              const rel = GUIDES[relSlug];
              if (!rel) return null;
              return (
                <button key={relSlug} onClick={() => navigate(`/guides/${relSlug}`)}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-leaf/30 transition-all text-left">
                  <span className="text-4xl">{rel.icon}</span>
                  <div>
                    <div className="font-bold text-charcoal">{rel.title}</div>
                    <div className="text-xs text-charcoal-light mt-1">{rel.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
