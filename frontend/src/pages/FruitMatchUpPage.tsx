import { useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';
import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { getFruitBySlug } from '../data/fruits';

interface MatchUp {
  id: string;
  title: string;
  subtitle: string;
  fruit1: {
    name: string;
    slug: string;
    emoji: string;
    nickname: string;
    taste: string;
    texture: string;
    topBenefit: string;
    bestEatenAs: string;
    beautyPerk: string;
    beautyPerkTitle: string;
  };
  fruit2: {
    name: string;
    slug: string;
    emoji: string;
    nickname: string;
    taste: string;
    texture: string;
    topBenefit: string;
    bestEatenAs: string;
    beautyPerk: string;
    beautyPerkTitle: string;
  };
}

const matchUps: MatchUp[] = [
  {
    id: "custard-cousins",
    title: "The Custard Cousins",
    subtitle: "Soursop vs. Sweetsop",
    fruit1: {
      name: "Soursop",
      slug: "soursop",
      emoji: "🍈",
      nickname: "Graviola",
      taste: "Tangy, sweet, and slightly acidic. Notes of pineapple, strawberry, and citrus.",
      texture: "Fibrous, creamy, and juicy.",
      topBenefit: "High in antioxidants; traditionally used for inflammation, joint pain, and immune support.",
      bestEatenAs: "Juices, smoothies, ice cream, or raw (avoid the seeds!).",
      beautyPerkTitle: "Skin Calming",
      beautyPerk: "Antioxidant extracts are fantastic for soothing irritated skin and reducing redness."
    },
    fruit2: {
      name: "Sweetsop",
      slug: "sweetsop",
      emoji: "🍏",
      nickname: "Sugar Apple",
      taste: "Intensely sweet and sugary. Notes of vanilla custard and pear.",
      texture: "Grainy, creamy, and melts in your mouth.",
      topBenefit: "Rich in Vitamin B6 and iron; great for boosting energy and supporting heart health.",
      bestEatenAs: "Eaten raw straight from the shell (spit out the seeds!).",
      beautyPerkTitle: "Collagen Boost",
      beautyPerk: "High Vitamin C helps maintain skin elasticity and a youthful glow."
    }
  },
  {
    id: "daily-essentials",
    title: "The Daily Essentials",
    subtitle: "Papaya vs. Banana",
    fruit1: {
      name: "Caribbean Papaya",
      slug: "papaya",
      emoji: "🥭",
      nickname: "Pawpaw",
      taste: "Sweet, melon-like, and slightly musky.",
      texture: "Butter-soft and fleshy.",
      topBenefit: "Contains \"Papain\" enzyme, which works wonders for breaking down proteins and aiding digestion.",
      bestEatenAs: "Fresh chunks with a squeeze of lime, or mixed into a spicy Som Tum salad.",
      beautyPerkTitle: "Natural Exfoliant",
      beautyPerk: "Papaya enzymes dissolve dead skin cells, making it a star ingredient in brightening face masks."
    },
    fruit2: {
      name: "Tropical Banana",
      slug: "banana",
      emoji: "🍌",
      nickname: "Banana",
      taste: "Sweet, dense, and naturally caramel-like when ripe.",
      texture: "Starchy and smooth.",
      topBenefit: "Packed with Potassium and Magnesium to prevent muscle cramps and provide sustained energy.",
      bestEatenAs: "Smoothies, baked into breads, or straight out of the peel.",
      beautyPerkTitle: "Moisture Lock",
      beautyPerk: "Rich in silica and moisture, perfect for hydrating dry skin and repairing brittle hair."
    }
  }
];

const FruitMatchUpPage: React.FC = () => {
  const [activeMatchUp, setActiveMatchUp] = useState<string>("custard-cousins");

  const currentMatchUp = matchUps.find(m => m.id === activeMatchUp) || matchUps[0];

  const fruit1Data = getFruitBySlug(currentMatchUp.fruit1.slug);
  const fruit2Data = getFruitBySlug(currentMatchUp.fruit2.slug);

  useEffect(() => {
    setupPageSEO({
      path: '/compare',
      title: 'Fruit Match-Up — Head-to-Head Caribbean Fruit Comparisons | IslandFruitGuide',
      description: 'Head-to-head Caribbean fruit match-ups. Compare mango vs papaya, soursop vs guava, and more in our interactive fruit battle. Discover which tropical fruit wins for your needs.',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-leaf-green/5">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-leaf-green to-leaf-green/90 text-white py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: 'Fruit Match-Up', path: '/fruit-match-up' }]} />
          <div className="text-center mt-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              🥊 The Island Fruit Match-Up
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2">
              Find Your Perfect Superfruit
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Not sure which Caribbean superfruit is right for you? Use our quick comparison guide 
              to find the perfect match for your taste buds, health goals, and skincare routine.
            </p>
          </div>
        </div>
      </div>

      {/* Match-Up Selector */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {matchUps.map(matchUp => (
            <button
              key={matchUp.id}
              onClick={() => setActiveMatchUp(matchUp.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeMatchUp === matchUp.id
                  ? 'bg-leaf-green text-white shadow-lg scale-105'
                  : 'bg-white text-charcoal border-2 border-gray-200 hover:border-leaf-green hover:text-leaf-green'
              }`}
            >
              <span className="text-lg mr-2">{matchUp.id === 'custard-cousins' ? '🍈🍏' : '🥭🍌'}</span>
              {matchUp.title}
            </button>
          ))}
        </div>

        {/* Match-Up Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal">
            {currentMatchUp.title}
          </h2>
          <p className="text-lg text-gray-600">{currentMatchUp.subtitle}</p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-hidden rounded-2xl shadow-xl border border-gray-100 bg-white mb-12">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-leaf-green/10 to-mango/10">
                <th className="py-4 px-6 text-left text-charcoal font-bold w-1/5">Feature</th>
                <th className="py-4 px-6 text-center w-2/5">
                  <div className="flex flex-col items-center">
                    {fruit1Data?.image_url && (
                      <img 
                        src={fruit1Data.image_url} 
                        alt={currentMatchUp.fruit1.name}
                        className="w-20 h-20 object-cover rounded-full border-4 border-leaf-green mb-2"
                      />
                    )}
                    <span className="text-2xl">{currentMatchUp.fruit1.emoji}</span>
                    <span className="font-bold text-lg text-charcoal">{currentMatchUp.fruit1.name}</span>
                    <span className="text-sm text-gray-500">({currentMatchUp.fruit1.nickname})</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-center w-2/5">
                  <div className="flex flex-col items-center">
                    {fruit2Data?.image_url && (
                      <img 
                        src={fruit2Data.image_url} 
                        alt={currentMatchUp.fruit2.name}
                        className="w-20 h-20 object-cover rounded-full border-4 border-mango mb-2"
                      />
                    )}
                    <span className="text-2xl">{currentMatchUp.fruit2.emoji}</span>
                    <span className="font-bold text-lg text-charcoal">{currentMatchUp.fruit2.name}</span>
                    <span className="text-sm text-gray-500">({currentMatchUp.fruit2.nickname})</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 font-semibold text-charcoal bg-gray-50">🍽️ Taste Profile</td>
                <td className="py-4 px-6 text-gray-700 bg-leaf-green/5">{currentMatchUp.fruit1.taste}</td>
                <td className="py-4 px-6 text-gray-700 bg-mango/5">{currentMatchUp.fruit2.taste}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 font-semibold text-charcoal bg-gray-50">🥄 Texture</td>
                <td className="py-4 px-6 text-gray-700 bg-leaf-green/5">{currentMatchUp.fruit1.texture}</td>
                <td className="py-4 px-6 text-gray-700 bg-mango/5">{currentMatchUp.fruit2.texture}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 font-semibold text-charcoal bg-gray-50">💪 Top Health Benefit</td>
                <td className="py-4 px-6 text-gray-700 bg-leaf-green/5">{currentMatchUp.fruit1.topBenefit}</td>
                <td className="py-4 px-6 text-gray-700 bg-mango/5">{currentMatchUp.fruit2.topBenefit}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 font-semibold text-charcoal bg-gray-50">🍴 Best Eaten As</td>
                <td className="py-4 px-6 text-gray-700 bg-leaf-green/5">{currentMatchUp.fruit1.bestEatenAs}</td>
                <td className="py-4 px-6 text-gray-700 bg-mango/5">{currentMatchUp.fruit2.bestEatenAs}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-6 font-semibold text-charcoal bg-gray-50">✨ Health & Beauty Perk</td>
                <td className="py-4 px-6 bg-leaf-green/5">
                  <span className="font-semibold text-leaf-green">{currentMatchUp.fruit1.beautyPerkTitle}:</span>
                  <span className="text-gray-700 ml-1">{currentMatchUp.fruit1.beautyPerk}</span>
                </td>
                <td className="py-4 px-6 bg-mango/5">
                  <span className="font-semibold text-mango">{currentMatchUp.fruit2.beautyPerkTitle}:</span>
                  <span className="text-gray-700 ml-1">{currentMatchUp.fruit2.beautyPerk}</span>
                </td>
              </tr>
              <tr>
                <td className="py-6 px-6 font-semibold text-charcoal bg-gray-50">🛒 Shop The Fruit</td>
                <td className="py-6 px-6 bg-leaf-green/5">
                  <div className="flex flex-col gap-2">
                    <a 
                      href={`/fruits/${currentMatchUp.fruit1.slug}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-leaf-green text-white rounded-lg hover:bg-leaf-green/90 transition-colors font-semibold"
                    >
                      View {currentMatchUp.fruit1.name} →
                    </a>
                    <a 
                      href="/store"
                      className="inline-flex items-center justify-center px-4 py-2 bg-mango text-charcoal rounded-lg hover:bg-mango/90 transition-colors font-semibold"
                    >
                      Shop Ebooks
                    </a>
                  </div>
                </td>
                <td className="py-6 px-6 bg-mango/5">
                  <div className="flex flex-col gap-2">
                    <a 
                      href={`/fruits/${currentMatchUp.fruit2.slug}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-mango text-charcoal rounded-lg hover:bg-mango/90 transition-colors font-semibold"
                    >
                      View {currentMatchUp.fruit2.name} →
                    </a>
                    <a 
                      href="/store"
                      className="inline-flex items-center justify-center px-4 py-2 bg-mango text-charcoal rounded-lg hover:bg-mango/90 transition-colors font-semibold"
                    >
                      Shop Ebooks
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Stacked */}
        <div className="lg:hidden space-y-6 mb-12">
          {/* Fruit 1 Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-leaf-green">
            <div className="bg-gradient-to-r from-leaf-green to-leaf-green/80 p-4 text-white text-center">
              {fruit1Data?.image_url && (
                <img 
                  src={fruit1Data.image_url} 
                  alt={currentMatchUp.fruit1.name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-white mx-auto mb-2"
                />
              )}
              <span className="text-3xl block mb-1">{currentMatchUp.fruit1.emoji}</span>
              <h3 className="text-xl font-bold">{currentMatchUp.fruit1.name}</h3>
              <p className="text-white/80">({currentMatchUp.fruit1.nickname})</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold text-charcoal flex items-center gap-2">
                  <span>🍽️</span> Taste Profile
                </h4>
                <p className="text-gray-600 mt-1">{currentMatchUp.fruit1.taste}</p>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal flex items-center gap-2">
                  <span>🥄</span> Texture
                </h4>
                <p className="text-gray-600 mt-1">{currentMatchUp.fruit1.texture}</p>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal flex items-center gap-2">
                  <span>💪</span> Top Health Benefit
                </h4>
                <p className="text-gray-600 mt-1">{currentMatchUp.fruit1.topBenefit}</p>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal flex items-center gap-2">
                  <span>🍴</span> Best Eaten As
                </h4>
                <p className="text-gray-600 mt-1">{currentMatchUp.fruit1.bestEatenAs}</p>
              </div>
              <div className="bg-leaf-green/10 p-3 rounded-lg">
                <h4 className="font-semibold text-leaf-green flex items-center gap-2">
                  <span>✨</span> {currentMatchUp.fruit1.beautyPerkTitle}
                </h4>
                <p className="text-gray-600 mt-1">{currentMatchUp.fruit1.beautyPerk}</p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <a 
                  href={`/fruits/${currentMatchUp.fruit1.slug}`}
                  className="flex items-center justify-center px-4 py-3 bg-leaf-green text-white rounded-lg hover:bg-leaf-green/90 transition-colors font-semibold"
                >
                  View {currentMatchUp.fruit1.name} Guide →
                </a>
                <a 
                  href="/store"
                  className="flex items-center justify-center px-4 py-2 bg-papaya text-white rounded-lg hover:bg-papaya/90 transition-colors font-semibold text-sm"
                >
                  Shop Ebooks
                </a>
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-leaf-green to-mango text-white font-bold text-xl px-6 py-3 rounded-full shadow-lg">
              VS
            </div>
          </div>

          {/* Fruit 2 Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-mango">
            <div className="bg-gradient-to-r from-mango to-mango/80 p-4 text-charcoal text-center">
              {fruit2Data?.image_url && (
                <img 
                  src={fruit2Data.image_url} 
                  alt={currentMatchUp.fruit2.name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-white mx-auto mb-2"
                />
              )}
              <span className="text-3xl block mb-1">{currentMatchUp.fruit2.emoji}</span>
              <h3 className="text-xl font-bold">{currentMatchUp.fruit2.name}</h3>
              <p className="text-charcoal/70">({currentMatchUp.fruit2.nickname})</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold text-charcoal flex items-center gap-2">
                  <span>🍽️</span> Taste Profile
                </h4>
                <p className="text-gray-600 mt-1">{currentMatchUp.fruit2.taste}</p>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal flex items-center gap-2">
                  <span>🥄</span> Texture
                </h4>
                <p className="text-gray-600 mt-1">{currentMatchUp.fruit2.texture}</p>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal flex items-center gap-2">
                  <span>💪</span> Top Health Benefit
                </h4>
                <p className="text-gray-600 mt-1">{currentMatchUp.fruit2.topBenefit}</p>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal flex items-center gap-2">
                  <span>🍴</span> Best Eaten As
                </h4>
                <p className="text-gray-600 mt-1">{currentMatchUp.fruit2.bestEatenAs}</p>
              </div>
              <div className="bg-mango/10 p-3 rounded-lg">
                <h4 className="font-semibold text-mango flex items-center gap-2">
                  <span>✨</span> {currentMatchUp.fruit2.beautyPerkTitle}
                </h4>
                <p className="text-gray-600 mt-1">{currentMatchUp.fruit2.beautyPerk}</p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <a 
                  href={`/fruits/${currentMatchUp.fruit2.slug}`}
                  className="flex items-center justify-center px-4 py-3 bg-mango text-charcoal rounded-lg hover:bg-mango/90 transition-colors font-semibold"
                >
                  View {currentMatchUp.fruit2.name} Guide →
                </a>
                <a 
                  href="/health-wellness"
                  className="flex items-center justify-center px-4 py-2 bg-papaya text-white rounded-lg hover:bg-papaya/90 transition-colors font-semibold text-sm"
                >
                  Health & Beauty Products
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Comparison Summary */}
        <div className="bg-gradient-to-r from-leaf-green/10 to-mango/10 rounded-2xl p-6 md:p-8 mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-charcoal mb-4 text-center">
            🎯 Quick Decision Guide
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-md">
              <h4 className="font-bold text-leaf-green mb-3 text-lg">
                Choose {currentMatchUp.fruit1.name} if you want:
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-leaf-green">✓</span>
                  {currentMatchUp.id === 'custard-cousins' 
                    ? 'A tangy-sweet flavor with tropical complexity'
                    : 'Digestive support with enzyme power'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-leaf-green">✓</span>
                  {currentMatchUp.id === 'custard-cousins' 
                    ? 'Anti-inflammatory and immune support'
                    : 'Natural skin brightening benefits'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-leaf-green">✓</span>
                  {currentMatchUp.id === 'custard-cousins' 
                    ? 'Versatile use in juices, smoothies, and desserts'
                    : 'Low-calorie, enzyme-rich nutrition'}
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-md">
              <h4 className="font-bold text-mango mb-3 text-lg">
                Choose {currentMatchUp.fruit2.name} if you want:
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-mango">✓</span>
                  {currentMatchUp.id === 'custard-cousins' 
                    ? 'Maximum sweetness with custard-like creaminess'
                    : 'Quick energy and muscle recovery'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mango">✓</span>
                  {currentMatchUp.id === 'custard-cousins' 
                    ? 'Energy boost and collagen support'
                    : 'Potassium for heart and muscle health'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mango">✓</span>
                  {currentMatchUp.id === 'custard-cousins' 
                    ? 'Simple enjoyment straight from the shell'
                    : 'Ultimate convenience as a grab-and-go snack'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-charcoal mb-3">
            Ready to Explore More Caribbean Superfruits?
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Discover our complete collection of tropical fruits, each with detailed guides on health benefits, 
            recipes, and preparation methods.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/fruits"
              className="inline-flex items-center px-6 py-3 bg-leaf-green text-white font-semibold rounded-xl hover:bg-leaf-green/90 transition-colors shadow-lg"
            >
              🍎 Browse All Fruits
            </a>
            <a 
              href="/health-wellness"
              className="inline-flex items-center px-6 py-3 bg-papaya text-white font-semibold rounded-xl hover:bg-papaya/90 transition-colors shadow-lg"
            >
              ✨ Health & Beauty
            </a>
            <a 
              href="/store"
              className="inline-flex items-center px-6 py-3 bg-mango text-charcoal font-semibold rounded-xl hover:bg-mango/90 transition-colors shadow-lg"
            >
              📚 Get Our Ebooks
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FruitMatchUpPage;
