import { useEffect, useState } from "react";
import { navigate } from "../App";
import { getFruitBySlug, getRelatedFruits, fruits } from "../data/fruits";
import { blogPosts } from "../data/blogPosts";
import { FruitRecommendations } from "../components/FruitRecommendations";
import { Breadcrumb } from "../components/Breadcrumb";
import { recordFruitView } from "../utils/personalization";
import { isFruitFavorited, toggleFruitFavorite } from "../utils/favorites";
import { trackBehaviour } from "../utils/funnelTracker";
import { OptimizedImage } from "../components/OptimizedImage";
import { setupPageSEO } from "../utils/seo";
import { EmailCapture } from "../components/EmailCapture";
import { trackPageView, incrementFruitViews } from '../utils/db';
import { setCanonicalURL, generateFruitArticleSchema, generateFoodSchema, generateFruitFAQSchema, injectSchema } from "../utils/seoSchema";
import { generateFruitInternalLinks } from "../utils/internalLinking";
import { QuickAnswerBlock } from "../components/QuickAnswerBlock";

interface Props {
  slug: string;
}

// Quick Answer content for top 5 fruits (Priority 2 - Phase 7C)
const getQuickAnswerContent = (_fruitName: string, fruitSlug: string) => {
  const quickAnswers: Record<string, { title: string; answer: string; faqs: Array<{question: string; answer: string}> }> = {
    'mango': {
      title: "What is mango good for?",
      answer: "Mango is excellent for boosting immunity, improving digestion, and supporting eye health. It's packed with vitamin C (over 100% daily value per cup), vitamin A for vision, and digestive enzymes like amylase that help break down food. Mangoes also contain powerful antioxidants that may reduce inflammation and support heart health.",
      faqs: [
        {
          question: "Can you eat mango skin?",
          answer: "While technically edible, mango skin is tough, bitter, and can cause allergic reactions in some people due to urushiol (the same compound in poison ivy). It's best to peel mangoes before eating. The flesh is where all the sweet flavor and nutrition are concentrated."
        },
        {
          question: "How do you know when a mango is ripe?",
          answer: "A ripe mango yields slightly to gentle pressure, has a sweet fruity aroma at the stem end, and may have some yellow or red color (though color alone isn't reliable). The fruit should feel heavy for its size. Avoid mangoes with large dark spots or wrinkled skin."
        },
        {
          question: "What does mango taste like?",
          answer: "Ripe mango tastes tropical, sweet, and juicy with peachy, citrusy, and slightly piney notes. The texture is smooth and creamy, almost buttery. Caribbean varieties like Julie mango are exceptionally sweet and aromatic with minimal fiber."
        }
      ]
    },
    'papaya': {
      title: "What are the health benefits of papaya?",
      answer: "Papaya is a digestive powerhouse thanks to the enzyme papain, which helps break down proteins and ease bloating. It's loaded with vitamin C (over 200% daily value), vitamin A for skin and eye health, and antioxidants like lycopene that fight inflammation. Regular consumption may aid digestion, support immunity, and promote healthy skin.",
      faqs: [
        {
          question: "Can you eat papaya seeds?",
          answer: "Yes, papaya seeds are edible and have a peppery, slightly bitter taste. They contain beneficial compounds with antibacterial and anti-parasitic properties. However, they should be consumed in small amounts (1-2 teaspoons) due to their strong flavor and potency. Most people discard them and eat only the sweet orange flesh."
        },
        {
          question: "How do you tell if a papaya is ripe?",
          answer: "A ripe papaya has yellow-orange skin (at least 50% yellow), yields slightly to gentle pressure, and has a sweet fruity aroma. The flesh inside should be deep orange or coral. Green papayas are unripe and used for cooking in savory dishes like green papaya salad."
        },
        {
          question: "Why does papaya smell bad to some people?",
          answer: "Some people find ripe papaya has a musky, sweaty, or unpleasant smell due to naturally occurring compounds. This varies by papaya variety and ripeness. If the smell is extremely foul or fermented, the fruit may be overripe or spoiled. Fresh, properly ripe papaya should smell sweet and tropical."
        }
      ]
    },
    'guava': {
      title: "What is guava good for?",
      answer: "Guava is a nutritional powerhouse for immunity and digestive health. It contains 4x more vitamin C than oranges, supporting immune function and collagen production. The high fiber content (9g per cup) aids digestion and promotes gut health. Guava is also rich in antioxidants like lycopene and quercetin, which may help lower blood sugar and support heart health.",
      faqs: [
        {
          question: "Can you eat guava seeds?",
          answer: "Yes, guava seeds are completely safe and nutritious to eat. They're small and crunchy, adding texture to the fruit. The seeds are rich in fiber and healthy fats. Most people eat the whole fruit including seeds, though some prefer to strain them out when making juice or paste."
        },
        {
          question: "What does guava taste like?",
          answer: "Guava has a unique tropical flavor that's sweet, fragrant, and slightly floral, often described as a cross between strawberry and pear with a hint of pine. The texture is grainy and soft when ripe. Pink guava varieties tend to be sweeter and more aromatic than white ones."
        },
        {
          question: "How do you eat guava?",
          answer: "Simply wash, cut in half, and eat with a spoon, seeds and all. You can also slice it like an apple, sprinkle with salt and pepper (Caribbean style), blend into smoothies, or make into guava cheese (paste), jams, and desserts. Both the skin and flesh are edible."
        }
      ]
    },
    'ackee': {
      title: "What is ackee and is it safe to eat?",
      answer: "Ackee is Jamaica's national fruit with a buttery, creamy texture and mild nutty flavor. When properly prepared, ackee is completely safe and delicious. However, unripe ackee contains hypoglycin A, a toxin that can cause serious illness. Only eat ackee that has naturally opened on the tree, revealing yellow arils (the edible part). Discard all seeds, pink tissue, and pods. Canned ackee from reputable brands is pre-prepared and safe.",
      faqs: [
        {
          question: "Can you eat raw ackee?",
          answer: "No, ackee should never be eaten raw. It must be boiled for at least 10 minutes to reduce any trace toxins and achieve the proper creamy texture. Raw or improperly prepared ackee can cause 'Jamaican vomiting sickness.' Always boil ackee before using it in dishes like ackee and saltfish."
        },
        {
          question: "What does ackee taste like?",
          answer: "Ackee has a mild, buttery, slightly nutty flavor similar to scrambled eggs or avocado. The texture is soft, creamy, and custard-like when cooked. It's not sweet despite being a fruit—it's used in savory dishes like Jamaica's national breakfast, ackee and saltfish."
        },
        {
          question: "Where can I buy ackee?",
          answer: "Outside of the Caribbean, ackee is most commonly found canned in Caribbean grocery stores, international markets, or online. Grace brand canned ackee is widely available and safe. Fresh ackee is rare outside Jamaica and should only be eaten if you know how to identify properly ripened fruit."
        }
      ]
    },
    'soursop': {
      title: "What is soursop good for?",
      answer: "Soursop is prized for its potential immune-boosting and antioxidant properties. It's rich in vitamin C, fiber, and unique compounds called acetogenins that have been studied for their potential anti-cancer properties (though more research is needed). Soursop is traditionally used in Caribbean folk medicine to promote sleep, reduce inflammation, and support digestive health. The fruit is also naturally antimicrobial.",
      faqs: [
        {
          question: "Does soursop cure cancer?",
          answer: "No, there is no scientific evidence that soursop cures cancer. While laboratory studies show that certain compounds in soursop leaves may have anti-cancer properties, these have not been proven effective or safe in humans. Soursop should never replace conventional cancer treatment. Enjoy it as a nutritious fruit, not a medicine."
        },
        {
          question: "Can you eat soursop seeds?",
          answer: "No, soursop seeds should never be eaten. They contain neurotoxic compounds that can be harmful to the nervous system with long-term consumption. Always discard all seeds and eat only the white creamy pulp. Properly prepared soursop juice and smoothies strain out all seeds."
        },
        {
          question: "What does soursop taste like?",
          answer: "Soursop has a unique sweet-tart tropical flavor combining notes of pineapple, strawberry, and citrus with a creamy banana-like texture. It's tangy yet naturally sweet, making it perfect for smoothies, juices, and ice cream. The texture is soft, fibrous, and custard-like."
        }
      ]
    }
  };

  return quickAnswers[fruitSlug] || null;
};

const FRUIT_EBOOK_PROMOS: Record<string, {id:string; slug:string; title:string; price:string}> = {
  'mango':   { id:'pack-001', slug:'mango-recipe-pack',               title:'🥭 Mango Recipe Collection',          price:'$5' },
  'papaya':  { id:'pack-002', slug:'papaya-recipe-pack',              title:'🍈 Papaya Recipe Pack',               price:'$5' },
  'soursop': { id:'pack-003', slug:'soursop-drinks-pack',             title:'🍹 Soursop Drinks & Smoothies',       price:'$5' },
  'guava':   { id:'pack-004', slug:'guava-dessert-pack',              title:'🍈 Guava Dessert Collection',         price:'$5' },
  'coconut': { id:'ebook-001',slug:'tropical-juice-smoothie-recipes', title:'🥤 Tropical Juice & Smoothie Book',  price:'$12'},
  'banana':  { id:'ebook-gym-energy-recipes', slug:'gym-energy-recipes', title:'💪 Tropical Gym Energy Recipes', price:'$9.99'},
  'pineapple':{ id:'ebook-001',slug:'tropical-juice-smoothie-recipes',title:'🥤 Tropical Juice & Smoothie Book',  price:'$12'},
};

export function FruitDetailPage({ slug }: Props) {
  const fruit = getFruitBySlug(slug);
  const [fav, setFav] = useState(false);
  const [internalLinks, setInternalLinks] = useState<any>(null);

  useEffect(() => {
    if (fruit) {
      recordFruitView(fruit.id);
      setFav(isFruitFavorited(fruit.id));
      
      // SEO: Set canonical URL (Phase 7A)
      setCanonicalURL(`https://www.islandfruitguide.com/fruits/${fruit.slug}`);
      
      // SEO: Inject comprehensive schemas (Phase 7A)
      injectSchema(generateFruitArticleSchema(fruit, `https://www.islandfruitguide.com/fruits/${fruit.slug}`));
      injectSchema(generateFoodSchema(fruit));
      injectSchema(generateFruitFAQSchema(fruit));

      // AEO: Speakable schema — signals to AI assistants which content to read aloud
      injectSchema({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `${fruit.name} — Tropical Fruit Guide`,
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".quick-answer-block", ".fruit-description", ".health-benefits-list", ".how-to-eat"]
        },
        "url": `https://www.islandfruitguide.com/fruits/${fruit.slug}`
      });

      // AEO: HowTo schema for preparation instructions
      if (fruit.how_to_eat) {
        injectSchema({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": `How to eat ${fruit.name}`,
          "description": fruit.how_to_eat,
          "supply": [{ "@type": "HowToSupply", "name": fruit.name }],
          "step": [{ "@type": "HowToStep", "text": fruit.how_to_eat }],
          "url": `https://www.islandfruitguide.com/fruits/${fruit.slug}`
        });
      }

      // SEO: Get intelligent internal links (Phase 7A)
      const links = generateFruitInternalLinks(fruit.id);
      setInternalLinks(links);
      
      // Setup SEO for this fruit page
      setupPageSEO({
        path: `/fruits/${fruit.slug}`,
        title: `${fruit.name} - Tropical Fruit | IslandFruitGuide`,
        description: `Discover ${fruit.name}: ${fruit.description?.substring(0, 150) || ''}... Complete guide with nutritional facts, health benefits, recipes, and growing tips.`,
        image: fruit.image_url,
        type: 'article',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Fruits', url: '/fruits' },
          { name: fruit.name, url: `/fruits/${fruit.slug}` }
        ]
      });
    }
  }, [fruit]);

  const handleFav = () => {
    if (!fruit) return;
    setFav(toggleFruitFavorite(fruit.id));
  };

  if (!fruit) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl block mb-4">🤔</span>
        <h2 className="font-heading text-2xl font-bold mb-4">Fruit Not Found</h2>
        <p className="text-charcoal-light mb-6">We couldn't find that fruit in our database.</p>
        <button onClick={() => navigate("/fruits")} className="btn-primary">← Back to Fruits</button>
      </div>
    );
  }

  const related = getRelatedFruits(fruit);
  const hasImage = fruit.image_url && fruit.image_url.length > 0;

  const leafData = fruit.leaf_medicine;

  const faqEntities: Array<{["@type"]: string; name: string; acceptedAnswer: {["@type"]: string; text: string}}> = [
    {
      "@type": "Question",
      "name": `What is ${fruit.name}?`,
      "acceptedAnswer": { "@type": "Answer", "text": fruit.description }
    },
    {
      "@type": "Question",
      "name": `What are the health benefits of ${fruit.name}?`,
      "acceptedAnswer": { "@type": "Answer", "text": fruit.health_benefits.join(". ") }
    },
    {
      "@type": "Question",
      "name": `How to eat ${fruit.name}?`,
      "acceptedAnswer": { "@type": "Answer", "text": fruit.how_to_eat }
    }
  ];

  if (leafData?.has_leaf_use) {
    faqEntities.push({
      "@type": "Question",
      "name": `What are the traditional medicinal uses of ${fruit.name} leaves?`,
      "acceptedAnswer": { "@type": "Answer", "text": leafData.traditional_uses.join(". ") + ". " + leafData.disclaimer }
    });
    faqEntities.push({
      "@type": "Question",
      "name": `How to prepare ${fruit.name} leaf tea?`,
      "acceptedAnswer": { "@type": "Answer", "text": leafData.preparation + " Safety: " + leafData.safety_warnings.join(". ") }
    });
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqEntities
  };

  const leafSchema = leafData?.has_leaf_use ? {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `${leafData.leaf_name} — Traditional Medicinal Uses`,
    "about": {
      "@type": "Drug",
      "name": leafData.leaf_name,
      "activeIngredient": `${fruit.name} (${fruit.scientific_name}) leaf extract`,
      "description": leafData.traditional_uses.join(". ")
    },
    "lastReviewed": "2025-06-14",
    "medicalAudience": { "@type": "MedicalAudience", "audienceType": "Patient" },
    "specialty": { "@type": "MedicalSpecialty", "name": "Herbal Medicine" },
    "disclaimer": leafData.disclaimer,
    "isPartOf": {
      "@type": "WebPage",
      "@id": `https://islandfruitguide.com/fruits/${fruit.slug}`
    }
  } : null;

  return (
    <div className="animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {leafSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(leafSchema) }} />
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Fruits", path: "/fruits" }, { label: fruit.name }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Fruit header */}
            <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">
              <div
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={!hasImage ? { background: `linear-gradient(135deg, ${fruit.color}22, ${fruit.color}55)` } : {}}
              >
                {hasImage ? (
                  <OptimizedImage
                    src={fruit.image_url}
                    alt={`Fresh ${fruit.name} tropical fruit – IslandFruitGuide`}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover rounded-2xl"
                    fallbackEmoji={fruit.emoji}
                    sizes="160px"
                  />
                ) : (
                  <span className="text-7xl sm:text-8xl">{fruit.emoji}</span>
                )}
              </div>
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {fruit.category.map(cat => (
                    <span key={cat} className={`category-badge ${
                      cat === "popular" ? "bg-mango/20 text-amber-800" :
                      cat === "seasonal" ? "bg-leaf/15 text-leaf-dark" :
                      cat === "rare" ? "bg-purple-100 text-purple-800" :
                      "bg-coral/15 text-red-800"
                    }`}>{cat}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal">{fruit.name}</h1>
                  <button
                    onClick={handleFav}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border ${fav ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-gray-200 text-gray-300 hover:text-red-400 hover:border-red-200"}`}
                    aria-label={fav ? "Remove from wishlist" : "Save to wishlist"}
                  >
                    {fav ? "❤️" : "🤍"}
                  </button>
                </div>
                <p className="text-charcoal-light italic mt-1">{fruit.scientific_name}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-charcoal-light">
                  <span>🌍 {fruit.origin}</span>
                  <span>📅 {fruit.seasonality}</span>
                </div>
              </div>
            </div>

            {/* Large hero image for fruits with images */}
            {hasImage && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <OptimizedImage
                  src={fruit.image_url}
                  alt={`Fresh ${fruit.name} tropical fruit – IslandFruitGuide`}
                  width={1200}
                  height={600}
                  className="w-full h-64 sm:h-80 object-cover"
                  hideOnError
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}

            {/* Quick Answer Block for top 5 fruits (Priority 2 - AEO optimization) */}
            {(() => {
              const quickAnswer = getQuickAnswerContent(fruit.name, fruit.slug);
              return quickAnswer ? (
                <QuickAnswerBlock
                  title={quickAnswer.title}
                  answer={quickAnswer.answer}
                  faqs={quickAnswer.faqs}
                />
              ) : null;
            })()}

            {/* Description — AEO optimized */}
            <section className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-3">
                What is {fruit.name}?
              </h2>
              <p className="text-charcoal-light leading-relaxed text-base">{fruit.description}</p>
            </section>

            {/* Health Benefits */}
            <section className="mb-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-green-100">
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-4">
                💚 Health Benefits of {fruit.name}
              </h2>
              <ul className="space-y-3">
                {fruit.health_benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-leaf text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-charcoal-light">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* How to Eat */}
            <section className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-3">
                🍴 How to Eat {fruit.name}
              </h2>
              <p className="text-charcoal-light leading-relaxed">{fruit.how_to_eat}</p>
            </section>

            {/* Storage */}
            <section className="mb-8 bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-3">
                📦 Storage & Preparation
              </h2>
              <p className="text-charcoal-light leading-relaxed">{fruit.storage}</p>
            </section>

            {/* Nutrition */}
            <section className="mb-8">
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-3">
                📊 Nutrition Facts
              </h2>
              <p className="text-charcoal-light leading-relaxed">{fruit.nutrition}</p>
            </section>

            {/* Dynamic Recommendations Component handles recipes now */}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-heading font-bold text-lg text-charcoal mb-4">Quick Facts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-light">Season</span>
                    <span className="font-medium text-charcoal">{fruit.seasonality}</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-light">Origin</span>
                    <span className="font-medium text-charcoal text-right max-w-[60%]">{fruit.origin}</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-light">Categories</span>
                    <span className="font-medium text-charcoal">{fruit.category.join(", ")}</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-light">Views</span>
                    <span className="font-medium text-charcoal">{fruit.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Related Fruits */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-heading font-bold text-lg text-charcoal mb-4">Related Fruits</h3>
                  <div className="space-y-3">
                    {related.map(rf => (
                      <button
                        key={rf.id}
                        onClick={() => navigate(`/fruits/${rf.slug}`)}
                        className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-leaf/5 transition-colors text-left"
                      >
                        {rf.image_url ? (
                          <OptimizedImage
                            src={rf.image_url}
                            alt={`Fresh ${rf.name} tropical fruit – IslandFruitGuide`}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-lg object-cover"
                            fallbackEmoji={rf.emoji}
                            sizes="40px"
                          />
                        ) : (
                          <span className="text-2xl w-10 h-10 flex items-center justify-center">{rf.emoji}</span>
                        )}
                        <div>
                          <div className="font-medium text-sm text-charcoal">{rf.name}</div>
                          <div className="text-xs text-charcoal-light">{rf.scientific_name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Blog Articles */}
              {(() => {
                const relatedPosts = blogPosts.filter(p => p.relatedFruitSlugs.includes(fruit.slug));
                if (relatedPosts.length === 0) return null;
                return (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-heading font-bold text-lg text-charcoal mb-4">📝 Articles About {fruit.name}</h3>
                    <div className="space-y-3">
                      {relatedPosts.map(post => (
                        <button
                          key={post.id}
                          onClick={() => navigate(`/blog/${post.slug}`)}
                          className="block w-full text-left p-3 rounded-xl hover:bg-leaf/5 transition-colors group"
                        >
                          <h4 className="text-sm font-medium text-charcoal group-hover:text-leaf transition-colors leading-snug">{post.title}</h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs bg-leaf/10 text-leaf px-2 py-0.5 rounded-full">{post.category}</span>
                            <span className="text-xs text-charcoal-light">{post.readTime}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Compare This Fruit */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="font-heading font-bold text-lg text-charcoal mb-2">⚖️ Compare {fruit.name}</h3>
                <p className="text-charcoal-light text-sm mb-4">See how {fruit.name} stacks up against other tropical fruits — nutrition, taste, and uses side by side.</p>
                <div className="space-y-2">
                  {related.slice(0, 2).map(rel => (
                    <button key={rel.id} onClick={() => navigate(`/compare/${fruit.slug}-vs-${rel.slug}`)}
                      className="w-full bg-white text-purple-700 font-semibold px-4 py-2.5 rounded-xl hover:bg-purple-50 transition-colors text-sm border border-purple-200 text-left flex items-center gap-2">
                      <span>{fruit.emoji}</span>
                      <span>{fruit.name} vs {rel.name}</span>
                      <span className="ml-auto">→</span>
                    </button>
                  ))}
                  <button onClick={() => navigate("/compare")} className="w-full bg-purple-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-purple-700 transition-colors text-sm">
                    Compare with Any Fruit →
                  </button>
                </div>
              </div>

              {/* Fruit Match-Up */}
              <div className="bg-gradient-to-br from-mango/10 to-coral/10 rounded-2xl p-6 border border-mango/20">
                <h3 className="font-heading font-bold text-lg text-charcoal mb-2">🏆 Fruit Match-Up</h3>
                <p className="text-charcoal-light text-sm mb-4">Soursop vs Sweetsop? Papaya vs Banana? Discover which Caribbean superfruit is your perfect match.</p>
                <button onClick={() => navigate("/fruit-match-up")} className="w-full bg-mango text-charcoal font-semibold px-4 py-2.5 rounded-xl hover:bg-amber-500 transition-colors text-sm">
                  Find Your Match →
                </button>
              </div>

              {/* Quiz CTA */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <h3 className="font-heading font-bold text-lg text-charcoal mb-2">🧠 Test Your Fruit IQ</h3>
                <p className="text-charcoal-light text-sm mb-4">Think you know Caribbean fruits? Take our 5-question quiz and unlock a special reward!</p>
                <button onClick={() => navigate("/quiz")} className="w-full bg-coral text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-red-500 transition-colors text-sm">
                  Take the Quiz →
                </button>
              </div>

              {/* Ebook CTA */}
              <div className="bg-gradient-to-br from-leaf/10 to-emerald-50 rounded-2xl p-6 border border-leaf/20">
                <h3 className="font-heading font-bold text-lg text-charcoal mb-2">📚 Caribbean Fruit Guide</h3>
                <p className="text-charcoal-light text-sm mb-4">Get our premium ebooks with 50+ fruit profiles, 100+ recipes, meal plans, and expert health research.</p>
                <div className="mb-4">
                  <EmailCapture variant="inline" />
                </div>
                <button onClick={() => navigate("/store/ebooks")} className="w-full bg-gradient-to-r from-leaf to-caribbean-green text-white font-bold px-4 py-2.5 rounded-xl hover:scale-105 transition-transform text-sm shadow-md mb-2">
                  🛒 Shop All Ebooks — Up to 58% Off
                </button>
                {/* Fruit-specific ebook promo */}
                {FRUIT_EBOOK_PROMOS[fruit.slug] && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                    <p className="text-xs text-amber-700 font-bold mb-1.5">✨ Perfect for {fruit.name} lovers:</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-charcoal">{FRUIT_EBOOK_PROMOS[fruit.slug].title}</span>
                      <button onClick={() => navigate(`/checkout/${FRUIT_EBOOK_PROMOS[fruit.slug].id}`)}
                        className="bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-500 transition-colors ml-2 whitespace-nowrap">
                        Buy {FRUIT_EBOOK_PROMOS[fruit.slug].price}
                      </button>
                    </div>
                  </div>
                )}
                <button onClick={() => navigate("/checkout/bundle-nutrition-series")} className="w-full border border-yellow-400 text-yellow-700 font-semibold px-4 py-2 rounded-xl hover:bg-yellow-50 transition-colors text-sm">
                  Browse Ebooks →
                </button>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-leaf to-leaf-light rounded-2xl p-6 text-white">
                <h3 className="font-heading font-bold text-lg mb-2">🌴 Explore More Fruits</h3>
                <p className="text-white/80 text-sm mb-4">Discover our complete collection of tropical fruits.</p>
                <button onClick={() => navigate("/fruits")} className="w-full bg-white text-leaf font-semibold px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Browse All Fruits
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== DYNAMIC RECOMMENDATIONS ===== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <FruitRecommendations fruitName={fruit.name} fruitSlug={fruit.slug} />
        </div>

        {/* ===== RECOMMENDED / YOU MAY ALSO LIKE ===== */}
        {(() => {
          const recommended = fruits
            .filter(f => f.id !== fruit.id && !fruit.related_fruit_ids.includes(f.id))
            .filter(f => f.category.some(c => fruit.category.includes(c)))
            .slice(0, 4);
          if (recommended.length === 0) return null;
          return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="border-t border-gray-100 pt-10">
                <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
                  🧡 You May Also Like
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {recommended.map(rf => (
                    <button
                      key={rf.id}
                      onClick={() => navigate(`/fruits/${rf.slug}`)}
                      className="fruit-card-hover bg-white rounded-2xl p-4 border border-gray-100 text-left group cursor-pointer"
                    >
                      <div className="w-full aspect-square rounded-xl mb-3 overflow-hidden">
                        {rf.image_url ? (
                          <OptimizedImage
                            src={rf.image_url}
                            alt={`Fresh ${rf.name} tropical fruit – IslandFruitGuide`}
                            width={320}
                            height={320}
                            className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                            fallbackEmoji={rf.emoji}
                            sizes="(max-width: 768px) 45vw, 320px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${rf.color}22, ${rf.color}44)` }}>{rf.emoji}</div>
                        )}
                      </div>
                      <h3 className="font-heading font-semibold text-charcoal group-hover:text-leaf transition-colors">{rf.name}</h3>
                      <p className="text-xs text-charcoal-light italic">{rf.scientific_name}</p>
                      <span className="inline-flex items-center gap-1 text-leaf text-sm font-medium mt-2">View Guide →</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ===== SEO: INTERNAL LINKING SECTION (Phase 7A) ===== */}
        {internalLinks && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="border-t border-gray-100 pt-10">
              <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
                🔗 Related Content
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Related Fruits */}
                {internalLinks.relatedFruits.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="font-semibold text-lg text-charcoal mb-4">🥭 Similar Fruits</h3>
                    <ul className="space-y-3">
                      {internalLinks.relatedFruits.map((link: any, idx: number) => (
                        <li key={idx}>
                          <a 
                            href={link.url} 
                            className="text-primary hover:underline text-sm"
                            onClick={(e) => { e.preventDefault(); navigate(link.url); }}
                          >
                            {link.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Related Recipes */}
                {internalLinks.relatedRecipes.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="font-semibold text-lg text-charcoal mb-4">🍹 Recipes with {fruit.name}</h3>
                    <ul className="space-y-3">
                      {internalLinks.relatedRecipes.map((link: any, idx: number) => (
                        <li key={idx}>
                          <a 
                            href={link.url} 
                            className="text-primary hover:underline text-sm"
                            onClick={(e) => { e.preventDefault(); navigate(link.url); }}
                          >
                            {link.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Guide Links */}
                {internalLinks.guides.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="font-semibold text-lg text-charcoal mb-4">📚 Tropical Fruit Guides</h3>
                    <ul className="space-y-3">
                      {internalLinks.guides.map((link: any, idx: number) => (
                        <li key={idx}>
                          <a 
                            href={link.url} 
                            className="text-primary hover:underline text-sm"
                            onClick={(e) => { e.preventDefault(); navigate(link.url); }}
                          >
                            {link.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
