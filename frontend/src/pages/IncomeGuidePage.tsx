import { setupPageSEO } from '../utils/seo';
import { useEffect, useState } from 'react';;
import { Breadcrumb } from "../components/Breadcrumb";

interface IncomeIdea {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  startupCost: string;
  earningPotential: string;
  description: string;
  steps: string[];
  countries: string[];
}

const incomeIdeas: IncomeIdea[] = [
  {
    id: "1",
    title: "Fruit Farming & Sales",
    category: "Farming",
    difficulty: "Medium",
    startupCost: "$100-500",
    earningPotential: "$500-2000/month",
    description: "Grow and sell tropical fruits at local markets, to restaurants, or through direct delivery.",
    steps: [
      "Start with easy-to-grow fruits like papaya, banana, or passion fruit",
      "Secure a small plot of land or use container gardening",
      "Learn organic growing techniques for premium pricing",
      "Connect with local markets and restaurants",
      "Consider value-added products like dried fruits or jams"
    ],
    countries: ["Jamaica", "Trinidad", "Barbados", "Caribbean"]
  },
  {
    id: "2",
    title: "Food Preparation Business",
    category: "Cooking",
    difficulty: "Easy",
    startupCost: "$50-200",
    earningPotential: "$300-1500/month",
    description: "Prepare traditional Caribbean dishes and snacks for local sales or catering.",
    steps: [
      "Master 3-5 signature dishes featuring local fruits",
      "Get food handling certification if required",
      "Start with weekend market sales or pre-orders",
      "Build a social media presence with food photos",
      "Expand to catering for events and parties"
    ],
    countries: ["Jamaica", "Trinidad", "Barbados", "Caribbean"]
  },
  {
    id: "3",
    title: "Online Freelancing",
    category: "Digital",
    difficulty: "Medium",
    startupCost: "$0-50",
    earningPotential: "$200-2000/month",
    description: "Offer digital services like writing, design, or virtual assistance to international clients.",
    steps: [
      "Identify your marketable skills (writing, design, admin, etc.)",
      "Create profiles on Fiverr, Upwork, or Freelancer",
      "Start with competitive pricing to build reviews",
      "Specialize in a niche for higher rates",
      "Scale by learning new high-demand skills"
    ],
    countries: ["Caribbean"]
  },
  {
    id: "4",
    title: "Fruit-Based Beverage Business",
    category: "Cooking",
    difficulty: "Easy",
    startupCost: "$100-300",
    earningPotential: "$400-1200/month",
    description: "Create and sell fresh tropical fruit juices, smoothies, and drinks.",
    steps: [
      "Perfect 5-10 signature drink recipes",
      "Source fruits directly from farmers for better margins",
      "Start with a cart or small roadside stand",
      "Offer delivery for offices and events",
      "Consider bottling for retail distribution"
    ],
    countries: ["Jamaica", "Trinidad", "Caribbean"]
  },
  {
    id: "5",
    title: "Content Creation",
    category: "Creative",
    difficulty: "Medium",
    startupCost: "$0-100",
    earningPotential: "$100-5000/month",
    description: "Create videos, blogs, or social content about Caribbean food, culture, or lifestyle.",
    steps: [
      "Choose your platform: YouTube, TikTok, Instagram, or blog",
      "Focus on a specific niche (recipes, travel, culture)",
      "Post consistently — at least 3x per week",
      "Engage with your audience and build community",
      "Monetize through ads, sponsorships, and products"
    ],
    countries: ["Caribbean"]
  },
  {
    id: "6",
    title: "Eco-Tourism Guide",
    category: "Services",
    difficulty: "Medium",
    startupCost: "$50-200",
    earningPotential: "$300-2000/month",
    description: "Lead tours showcasing local fruits, farms, and natural attractions.",
    steps: [
      "Build deep knowledge of local fruits and nature",
      "Partner with hotels and tourism agencies",
      "Create unique tour experiences (farm tours, fruit tastings)",
      "Get certified as a tour guide if required",
      "Build an online presence for direct bookings"
    ],
    countries: ["Jamaica", "Barbados", "Caribbean"]
  },
  {
    id: "7",
    title: "Fruit Preservation & Processing",
    category: "Cooking",
    difficulty: "Medium",
    startupCost: "$200-500",
    earningPotential: "$500-1500/month",
    description: "Create jams, jellies, dried fruits, and preserved products for sale.",
    steps: [
      "Learn safe preservation techniques",
      "Start with popular items like guava cheese or tamarind balls",
      "Invest in proper packaging and labeling",
      "Sell at markets, shops, and online",
      "Scale to wholesale and export"
    ],
    countries: ["Jamaica", "Trinidad", "Caribbean"]
  },
  {
    id: "8",
    title: "Mobile Repair Services",
    category: "Services",
    difficulty: "Medium",
    startupCost: "$100-300",
    earningPotential: "$400-1500/month",
    description: "Repair phones, electronics, or small appliances for your community.",
    steps: [
      "Learn repair skills through online courses",
      "Start with common repairs (screen replacement, battery)",
      "Invest in basic tools and parts inventory",
      "Offer mobile service — go to customers",
      "Build reputation through quality work and referrals"
    ],
    countries: ["Caribbean"]
  }
];

export function IncomeGuidePage() {
  useEffect(() => {
    setupPageSEO({
      path: '/income-guide',
      title: 'Caribbean Fruit Income Guide — Earn from Tropical Fruits | IslandFruitGuide',
      description: 'Practical ways to generate income from Caribbean tropical fruits. From home-based juice businesses to online selling and growing your own for profit.',
    });
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("Caribbean");
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);

  const categories = ["All", "Farming", "Cooking", "Digital", "Creative", "Services"];
  const countries = ["Caribbean", "Jamaica", "Trinidad", "Barbados"];

  const filteredIdeas = incomeIdeas.filter(idea => {
    const matchCategory = selectedCategory === "All" || idea.category === selectedCategory;
    const matchCountry = idea.countries.includes(selectedCountry) || idea.countries.includes("Caribbean");
    return matchCategory && matchCountry;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Income Guide" }]} />
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">💰</span>
            <h1 className="font-heading text-3xl lg:text-5xl font-bold">
              Income & Skills Guide
            </h1>
          </div>
          <p className="text-white/80 mt-3 text-lg max-w-2xl">
            Practical, realistic income ideas for Caribbean people. Small steps to financial independence — no "get rich quick" promises.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-leaf text-white"
                      : "bg-white border border-gray-200 text-charcoal-light hover:border-leaf"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Region</label>
            <div className="flex flex-wrap gap-2">
              {countries.map(country => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCountry === country
                      ? "bg-mango text-charcoal"
                      : "bg-white border border-gray-200 text-charcoal-light hover:border-mango"
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-charcoal-light mb-6">
          Showing {filteredIdeas.length} income idea{filteredIdeas.length !== 1 ? "s" : ""}
        </p>

        {/* Ideas Grid */}
        <div className="grid gap-4">
          {filteredIdeas.map(idea => (
            <div
              key={idea.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedIdea(expandedIdea === idea.id ? null : idea.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-leaf/10 text-leaf px-2 py-1 rounded-full font-medium">
                        {idea.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        idea.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                        idea.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {idea.difficulty}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-charcoal">{idea.title}</h3>
                    <p className="text-charcoal-light mt-1">{idea.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs text-charcoal-light">Startup Cost</div>
                      <div className="font-bold text-charcoal">{idea.startupCost}</div>
                    </div>
                    <div>
                      <div className="text-xs text-charcoal-light">Potential</div>
                      <div className="font-bold text-leaf">{idea.earningPotential}</div>
                    </div>
                    <span className={`text-xl transition-transform ${expandedIdea === idea.id ? "rotate-180" : ""}`}>
                      ⌄
                    </span>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedIdea === idea.id && (
                <div className="px-6 pb-6 border-t border-gray-100 pt-4 animate-fade-in">
                  <h4 className="font-heading font-bold text-charcoal mb-3">📋 Step-by-Step Guide</h4>
                  <ol className="space-y-2">
                    {idea.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-charcoal-light">
                        <span className="w-6 h-6 bg-leaf text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs text-charcoal-light">Available in:</span>
                    {idea.countries.map(c => (
                      <span key={c} className="text-xs bg-gray-100 text-charcoal px-2 py-1 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-gradient-to-br from-mango/10 to-coral/10 rounded-2xl p-8 border border-mango/20">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-4">💡 Success Tips</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🎯", title: "Start Small", desc: "Begin with minimal investment and scale as you learn" },
              { icon: "📱", title: "Go Digital", desc: "Use social media and WhatsApp for marketing" },
              { icon: "🤝", title: "Build Network", desc: "Connect with others in your community for support" },
              { icon: "📚", title: "Keep Learning", desc: "Invest in skills that increase your earning potential" },
              { icon: "💵", title: "Diversify", desc: "Have multiple income streams for stability" },
              { icon: "⏰", title: "Be Patient", desc: "Real income takes time to build — stay consistent" },
            ].map(tip => (
              <div key={tip.title} className="bg-white rounded-xl p-4 border border-gray-100">
                <span className="text-2xl block mb-2">{tip.icon}</span>
                <h3 className="font-heading font-semibold text-charcoal">{tip.title}</h3>
                <p className="text-sm text-charcoal-light mt-1">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
