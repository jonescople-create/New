import { setupPageSEO } from '../utils/seo';
import { useEffect, useState } from 'react';;
import { navigate } from "../App";
import { fruits } from "../data/fruits";
import { Breadcrumb } from "../components/Breadcrumb";

interface HealthTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  tips: string[];
  relatedFruits: string[];
}

const healthTopics: HealthTopic[] = [
  {
    id: "1",
    title: "Boost Your Immune System Naturally",
    category: "Nutrition",
    description: "Strengthen your body's defenses with vitamin C-rich Caribbean fruits.",
    tips: [
      "Eat guava daily — it has 4x more vitamin C than oranges",
      "Add soursop to your morning routine for antioxidant protection",
      "Combine fruits with zinc-rich foods for enhanced immunity",
      "Stay hydrated with fresh fruit juices instead of processed drinks"
    ],
    relatedFruits: ["10", "3", "8"] // Guava, Soursop, Papaya
  },
  {
    id: "2",
    title: "Natural Digestive Health",
    category: "Nutrition",
    description: "Use tropical fruits to support healthy digestion and gut health.",
    tips: [
      "Papaya contains papain enzyme that breaks down protein",
      "Eat ripe banana for prebiotic fiber that feeds good bacteria",
      "Start your day with warm water and lime before breakfast",
      "Tamarind is a traditional remedy for constipation"
    ],
    relatedFruits: ["8", "13", "12"] // Papaya, Banana, Tamarind
  },
  {
    id: "3",
    title: "Heart-Healthy Tropical Eating",
    category: "Nutrition",
    description: "Protect your cardiovascular system with potassium-rich fruits.",
    tips: [
      "Coconut water is nature's electrolyte drink for heart health",
      "Banana's potassium helps regulate blood pressure",
      "Mango's fiber helps lower cholesterol levels",
      "Reduce salt intake and replace with fruit-based seasonings"
    ],
    relatedFruits: ["11", "13", "5"] // Coconut, Banana, Mango
  },
  {
    id: "4",
    title: "Traditional Caribbean Remedies",
    category: "Natural Remedies",
    description: "Time-tested natural healing practices from Caribbean tradition (educational only).",
    tips: [
      "Guava leaf tea is traditionally used for digestive issues",
      "Soursop leaves are used in traditional fever remedies",
      "Tamarind drink is a traditional remedy for sore throat",
      "Coconut oil is used traditionally for skin and hair care"
    ],
    relatedFruits: ["10", "3", "12", "11"]
  },
  {
    id: "5",
    title: "Energy & Vitality",
    category: "Lifestyle",
    description: "Natural ways to boost your energy throughout the day.",
    tips: [
      "Start your day with a tropical fruit smoothie",
      "Banana is perfect for quick energy before exercise",
      "Avoid processed sugars — use natural fruit sweetness",
      "Stay hydrated with coconut water during hot days"
    ],
    relatedFruits: ["13", "5", "11"]
  },
  {
    id: "6",
    title: "Skin Health & Beauty",
    category: "Lifestyle",
    description: "Tropical fruits that promote healthy, glowing skin.",
    tips: [
      "Papaya's vitamin A promotes skin cell renewal",
      "Mango's antioxidants protect against sun damage",
      "Coconut oil is a natural moisturizer and cleanser",
      "Passion fruit's vitamin C supports collagen production"
    ],
    relatedFruits: ["8", "5", "11", "6"]
  }
];

export function HealthWellnessPage() {
  useEffect(() => {
    setupPageSEO({
      path: '/health-wellness',
      title: 'Caribbean Fruit Health & Wellness Guide | IslandFruitGuide',
      description: 'Evidence-based health and wellness information about Caribbean tropical fruits. Discover which fruits support immunity, digestion, energy, and weight management.',
    });
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Nutrition", "Natural Remedies", "Lifestyle"];

  const filteredTopics = healthTopics.filter(topic => {
    const matchCategory = selectedCategory === "All" || topic.category === selectedCategory;
    const matchSearch = searchQuery === "" || 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getFruitById = (id: string) => fruits.find(f => f.id === id);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Health & Wellness" }]} />
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🌿</span>
            <h1 className="font-heading text-3xl lg:text-5xl font-bold">
              Health & Wellness Guide
            </h1>
          </div>
          <p className="text-white/80 mt-3 text-lg max-w-2xl">
            Food-based wellness guidance using Caribbean tropical fruits. Educational content for healthier living — not medical advice.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-amber-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>
              <strong>Disclaimer:</strong> This content is for educational purposes only. It is not medical advice. 
              Consult a healthcare professional for medical conditions.
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search health topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
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

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTopics.map(topic => {
            const relatedFruitsData = topic.relatedFruits.map(getFruitById).filter(Boolean);
            return (
              <div
                key={topic.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <span className="text-xs bg-leaf/10 text-leaf px-2 py-1 rounded-full font-medium">
                    {topic.category}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-charcoal mt-3">
                    {topic.title}
                  </h3>
                  <p className="text-charcoal-light mt-2">{topic.description}</p>

                  {/* Tips */}
                  <ul className="mt-4 space-y-2">
                    {topic.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-charcoal-light">
                        <span className="w-5 h-5 bg-leaf/20 text-leaf rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>

                  {/* Related Fruits */}
                  {relatedFruitsData.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-charcoal-light mb-2">Related Fruits:</p>
                      <div className="flex flex-wrap gap-2">
                        {relatedFruitsData.map(fruit => fruit && (
                          <button
                            key={fruit.id}
                            onClick={() => navigate(`/fruits/${fruit.slug}`)}
                            className="flex items-center gap-1.5 bg-gray-50 hover:bg-leaf/5 px-2 py-1 rounded-lg transition-colors text-xs"
                          >
                            {fruit.image_url ? (
                              <img src={fruit.image_url} alt={fruit.name} className="w-5 h-5 rounded object-cover" />
                            ) : (
                              <span>{fruit.emoji}</span>
                            )}
                            <span className="text-charcoal">{fruit.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-lg text-charcoal-light">No topics found matching your search.</p>
          </div>
        )}

        {/* Wellness Tips */}
        <div className="mt-12 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-green-100">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">🌴 Daily Wellness Habits</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🌅", title: "Morning Fruit", desc: "Start your day with fresh tropical fruit" },
              { icon: "💧", title: "Stay Hydrated", desc: "Drink coconut water and fruit juices" },
              { icon: "🥗", title: "Eat Colorful", desc: "Include a variety of colorful fruits daily" },
              { icon: "🌙", title: "Evening Rest", desc: "Wind down with calming passion fruit" },
            ].map(habit => (
              <div key={habit.title} className="bg-white rounded-xl p-4 border border-gray-100">
                <span className="text-3xl block mb-2">{habit.icon}</span>
                <h3 className="font-heading font-semibold text-charcoal">{habit.title}</h3>
                <p className="text-sm text-charcoal-light mt-1">{habit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
