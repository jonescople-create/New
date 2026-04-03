import { useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';
import { navigate } from '../App';

export function ToolsHubPage() {
  useEffect(() => {
    setupPageSEO({
      title: 'Tropical Fruit Intelligence Tools | Interactive Guides & Recommendations',
      description: 'Free interactive tools for tropical fruit lovers: get personalized fruit recommendations, build custom recipes, find medicinal leaves, and more. Expert guidance powered by Caribbean fruit knowledge.',
      path: '/tools'
    });
  }, []);

  const tools = [
    {
      id: 'fruit-recommender',
      title: 'Fruit Recommendation Engine',
      icon: '🎯',
      description: 'Answer a few questions and get personalized tropical fruit recommendations based on your taste preferences, climate, and intended use.',
      benefits: ['Personalized suggestions', 'Climate-matched fruits', 'Use case specific'],
      color: 'from-orange-400 to-red-500',
      path: '/tools/fruit-recommender'
    },
    {
      id: 'fruit-finder',
      title: 'Fruit Finder',
      icon: '🔍',
      description: 'Find your perfect Caribbean fruit in 3 simple steps — choose your taste, health goal, and local availability to get instantly matched.',
      benefits: ['Taste-based matching', 'Health goal filter', 'Availability aware'],
      color: 'from-amber-400 to-orange-500',
      path: '/tools/fruit-finder'
    },
    {
      id: 'recipe-builder',
      title: 'Recipe Builder',
      icon: '🍹',
      description: 'Select your available fruits and discover delicious recipes you can make right now. Perfect for using up ripe tropical fruits.',
      benefits: ['Instant recipe matches', 'No ingredient waste', 'Step-by-step guides'],
      color: 'from-caribbean-green to-leaf',
      path: '/tools/recipe-builder'
    },
    {
      id: 'medicinal-advisor',
      title: 'Medicinal Leaf Advisor',
      icon: '🌿',
      description: 'Find Caribbean medicinal leaves for your health needs. Traditional remedies backed by generations of island wisdom.',
      benefits: ['Health-focused', 'Traditional knowledge', 'Usage instructions'],
      color: 'from-green-500 to-emerald-600',
      path: '/tools/medicinal-advisor'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-caribbean-green via-leaf to-green-600 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-white font-medium text-sm">🚀 NEW: AI-Powered Tools</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Tropical Fruit Intelligence Engine
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Powerful, free tools to help you discover, cook with, and benefit from Caribbean tropical fruits. 
            Get personalized recommendations, build custom recipes, and unlock the healing power of medicinal leaves.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>100% Free Tools</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Expert Knowledge</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Tool Header with Gradient */}
              <div className={`bg-gradient-to-br ${tool.color} p-6 text-white`}>
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{tool.title}</h3>
              </div>

              {/* Tool Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {tool.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-2 mb-6">
                  {tool.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-caribbean-green font-bold">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => navigate(tool.path)}
                  className={`w-full bg-gradient-to-r ${tool.color} text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform duration-200 shadow-md`}
                >
                  Launch Tool →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How Our Tools Help You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">1. Answer Questions</h3>
              <p className="text-gray-600">
                Tell us about your preferences, needs, or what fruits you have on hand.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-3">2. Get Smart Matches</h3>
              <p className="text-gray-600">
                Our engine analyzes hundreds of data points to find perfect recommendations.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-3">3. Take Action</h3>
              <p className="text-gray-600">
                Get detailed guides, recipes, or purchase expert resources to go deeper.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA to Store */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want Even More Expert Knowledge?
          </h2>
          <p className="text-white/90 text-lg mb-6">
            Check out our premium ebooks, recipe collections, and printable guides in the store.
          </p>
          <button
            onClick={() => navigate('/store')}
            className="bg-white text-orange-600 font-bold py-3 px-8 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            🛒 Browse Store Products
          </button>
        </div>
      </div>

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Tropical Fruit Intelligence Tools",
          "description": "Free interactive tools for tropical fruit lovers: fruit recommendations, recipe builder, and medicinal leaf advisor.",
          "url": "https://islandfruitguide.com/tools",
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": tools.map((tool, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "SoftwareApplication",
                "name": tool.title,
                "description": tool.description,
                "applicationCategory": "UtilityApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              }
            }))
          }
        })}
      </script>
    </div>
  );
}
