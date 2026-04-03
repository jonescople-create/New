import { setupPageSEO } from '../utils/seo';
import { useState, useEffect } from "react";
import { fruits as localFruits } from "../data/fruits";
import { recipes as localRecipes } from "../data/recipes";
import { navigate } from "../App";
import { Breadcrumb } from "../components/Breadcrumb";


interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Fruit {
  id: string;
  name: string;
  slug: string;
  description: string;
  health_benefits: string[];
  storage: string;
  how_to_eat: string;
  seasonality: string;
  origin: string;
  scientific_name: string;
  nutrition: string;
}

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
}

export function SmartAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hi! I'm Fruitsy 🍎, your Caribbean fruit assistant! I can help you with:\n\n• Browse our NEW tropical ebooks (4 collections!)\n• Find fruits and their health benefits\n• Suggest recipes and meal ideas\n• Shop for growing supplies & tools\n• Nutrition and storage tips\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);


  useEffect(() => {
    setupPageSEO({
      path: '/assistant',
      title: 'Fruitsy — Caribbean Fruit AI Assistant | IslandFruitGuide',
      description: 'Chat with Fruitsy, the IslandFruitGuide AI assistant. Ask about Caribbean fruits, recipes, health benefits, seasonal availability, and get personalised tropical fruit guidance.',
    });
  }, []);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setFruits(localFruits as any[]);
    setRecipes(localRecipes as any[]);
  };

  const quickPrompts = [
    "Show me the NEW ebooks",
    "What's in the store?",
    "What fruits are in season now?",
    "Health benefits of soursop",
    "Best fruits for smoothies",
    "I have mango, what can I make?",
    "Growing supplies and tools",
    "Recipe collections",
    "Interactive fruit tools"
  ];

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();

    // NEW: Ebook queries
    if (q.includes('ebook') || q.includes('recipe book') || q.includes('download') || q.includes('pdf') || q.includes('collection')) {
      return `📚 **NEW! Tropical Fruit Ebook Collection:**\n\nWe have 4 amazing recipe ebooks with 115+ recipes:\n\n• **Tropical Gym Energy Recipes** - $14.99 (30 recipes)\n  Power workouts with Caribbean superfruits\n\n• **Caribbean Smoothies for Fat Loss** - $12.99 (28 recipes)\n  Metabolism-boosting tropical drinks\n\n• **Tropical Superfruit Healing Drinks** - $15.99 (32 recipes)\n  Natural remedies from island fruits\n\n• **Island Pre-Workout Natural Drinks** - $13.99 (25 recipes)\n  Fuel training with tropical power\n\nAll include nutritional info, prep tips, and instant PDF download!\n\n[👉 Browse Ebooks](/store/ebooks)`;
    }

    // NEW: Store/Shop queries
    if (q.includes('store') || q.includes('shop') || q.includes('buy') || q.includes('purchase') || q.includes('product')) {
      return `🏪 **IslandFruitGuide Store:**\n\nExplore our complete tropical fruit collection:\n\n📚 **Ebooks & Guides** - Recipe collections and nutrition guides\n🌱 **Growing Supplies** - Seeds, soil, tools for your fruit garden\n🔪 **Kitchen Tools** - Professional fruit prep equipment\n🌱 **Fruit Seeds** - Grow your own tropical fruits\n📊 **Wall Charts** - Educational posters & reference charts\n🎁 **Bundles** - Coming soon!\n\n[👉 Visit Store](/store)\n[👉 Browse Ebooks](/store/ebooks)\n[👉 Growing Supplies](/store/fruit-growing)`;
    }

    // NEW: Growing/supplies queries
    if (q.includes('grow') || q.includes('seed') || q.includes('plant') || q.includes('supplie') || q.includes('tool')) {
      return `🌱 **Growing Tropical Fruits:**\n\nStart your own fruit garden!\n\n• **Seeds** - Mango, dragon fruit, papaya, passion fruit\n• **Supplies** - Premium soil, grow lights, grafting tools\n• **Kitchen Tools** - Mango splitters, pineapple corers, blenders\n\nAll curated products with Amazon affiliate links.\n\n[👉 Growing Supplies](/store/fruit-growing)\n[👉 Kitchen Tools](/store/kitchen-tools)\n[👉 Fruit Seeds](/store/fruit-seeds)`;
    }

    // Season query
    if (q.includes("season") || q.includes("ripe") || q.includes("available")) {
      const month = new Date().toLocaleString('default', { month: 'long' });
      const seasonalFruits = fruits.filter(f => 
        f.seasonality?.toLowerCase().includes(month.toLowerCase().substring(0, 3)) || 
        f.seasonality?.includes("Year-round")
      );
      const fruitNames = seasonalFruits.slice(0, 5).map(f => f.name).join(", ");
      return `🌦️ **Fruits in Season (${month}):**\n\n${fruitNames || 'Mango, Papaya, Guava'}, and more!\n\nTip: Year-round fruits like coconut, papaya, and banana are always available.\n\n[👉 View full seasonal guide](/seasonal-fruits)`;
    }

    // Recipe/cooking query
    if (q.includes("make") || q.includes("recipe") || q.includes("cook") || q.includes("what can i")) {
      const foundRecipes = recipes.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description?.toLowerCase().includes(q)
      );
      
      if (foundRecipes.length > 0) {
        const recipeNames = foundRecipes.slice(0, 3).map(r => `• ${r.title}`).join("\n");
        return `🍽️ **Here are some recipes you might like:**\n\n${recipeNames}\n\nWe have ${recipes.length}+ recipes!\n\n[👉 Browse all recipes](/recipes)\n[👉 Or get our Ebook collections](/store/ebooks)`;
      }
      
      // Check for ingredient mentions
      const matchedFruits = fruits.filter(f => 
        q.includes(f.name.toLowerCase()) || q.includes(f.slug)
      );
      
      if (matchedFruits.length > 0) {
        const fruit = matchedFruits[0];
        return `With **${fruit.name}**, you can make:\n\n• Fresh ${fruit.name.toLowerCase()} juice or smoothie\n• ${fruit.name} chutney or jam\n• Add to fruit salads\n• Use in desserts and ice cream\n\n💡 Check out our ebook collections for 115+ tropical recipes!\n\n[👉 See ${fruit.name} recipes](/fruits/${fruit.slug})\n[👉 Browse Ebooks](/store/ebooks)`;
      }
      return `I'd be happy to suggest recipes! Could you tell me what fruits or ingredients you have available?\n\nOr browse our NEW ebook collections with 115+ tropical fruit recipes!\n\n[👉 Recipe Ebooks](/store/ebooks)`;
    }

    // Health benefits query
    if (q.includes("health") || q.includes("benefit") || q.includes("good for") || q.includes("nutrition")) {
      const matchedFruits = fruits.filter(f => 
        q.includes(f.name.toLowerCase()) || q.includes(f.slug)
      );
      
      if (matchedFruits.length > 0) {
        const fruit = matchedFruits[0];
        const benefits = fruit.health_benefits?.slice(0, 3).map(b => `✓ ${b}`).join("\n") || "Packed with vitamins and minerals";
        return `💚 **Health Benefits of ${fruit.name}:**\n\n${benefits}\n\n**Nutrition:** ${fruit.nutrition?.substring(0, 150) || 'Rich in vitamins and antioxidants'}...\n\n[👉 Full ${fruit.name} guide](/fruits/${fruit.slug})`;
      }
      return `Caribbean fruits are packed with nutrients! Some highlights:\n\n• **Guava**: 4x more Vitamin C than oranges\n• **Soursop**: Powerful antioxidants\n• **Coconut**: Healthy MCTs for energy\n• **Papaya**: Digestive enzymes\n\n[👉 Explore health guides](/health-wellness)\n[👉 Healing Drinks Ebook](/store/ebooks)`;
    }

    // Storage query
    if (q.includes("store") && !q.includes("shop") || q.includes("keep") || q.includes("fresh") || q.includes("preserve")) {
      const matchedFruits = fruits.filter(f => 
        q.includes(f.name.toLowerCase()) || q.includes(f.slug)
      );
      
      if (matchedFruits.length > 0) {
        const fruit = matchedFruits[0];
        return `📦 **How to Store ${fruit.name}:**\n\n${fruit.storage || 'Store at room temperature until ripe, then refrigerate.'}\n\n**Pro tip:** Most tropical fruits should be ripened at room temperature, then refrigerated once ripe.\n\n[👉 Full ${fruit.name} guide](/fruits/${fruit.slug})`;
      }
      return `General tropical fruit storage tips:\n\n• Ripen at room temperature\n• Refrigerate once ripe\n• Most last 3-7 days when refrigerated\n• Freeze puréed fruit for smoothies\n\nWhich fruit do you want specific storage tips for?`;
    }

    // Money/income query
    if (q.includes("money") || q.includes("income") || q.includes("sell") || q.includes("business") || q.includes("earn")) {
      return `💰 **Ways to Earn with Tropical Fruits:**\n\n• Start a juice/smoothie business\n• Sell homemade jams and preserves\n• Fruit farming and direct sales\n• Create content about Caribbean food\n• Offer fruit-based catering\n\n[👉 Full Income Guide](/income-guide)`;
    }

    // Comparison / match-up / quiz / tools
    if (q.includes("compare") || q.includes("match") || q.includes("match-up") || q.includes("versus") || q.includes("vs") || q.includes("quiz") || q.includes("tool")) {
      return `🥊 **Try our interactive tools:**\n\n• **Fruit Recommender** - Find your perfect tropical fruit\n• **Recipe Builder** - Create custom recipes\n• **Medicinal Advisor** - Natural healing remedies\n• **Fruit Comparison** - Side-by-side analysis\n• **Caribbean Superfruit IQ Quiz**\n\n[👉 All Tools](/tools)\n[👉 Fruit Match-Up](/fruit-match-up)\n[👉 Compare Fruits](/compare)`;
    }

    // How to eat query
    if (q.includes("how to eat") || q.includes("how do you eat") || q.includes("prepare")) {
      const matchedFruits = fruits.filter(f => 
        q.includes(f.name.toLowerCase()) || q.includes(f.slug)
      );
      
      if (matchedFruits.length > 0) {
        const fruit = matchedFruits[0];
        return `🍴 **How to Eat ${fruit.name}:**\n\n${fruit.how_to_eat || 'Wash, peel, and enjoy fresh!'}\n\n[👉 Full ${fruit.name} guide](/fruits/${fruit.slug})`;
      }
      return `I can tell you how to prepare any tropical fruit! Just ask me about a specific fruit like "How to eat soursop?" or "How to prepare breadfruit?"`;
    }

    // Smoothie query
    if (q.includes("smoothie") || q.includes("juice") || q.includes("drink") || q.includes("blend")) {
      return `🥤 **Best Fruits for Smoothies:**\n\n• **Mango**: Sweet, creamy base\n• **Papaya**: Tropical flavor + digestive enzymes\n• **Soursop**: Unique sweet-sour taste\n• **Banana**: Natural sweetness + thickness\n• **Passion Fruit**: Tangy flavor punch\n\n**Pro tip:** Freeze fruits in advance for thick, cold smoothies without ice!\n\n📚 **NEW!** Check out our smoothie ebook collections:\n• Caribbean Smoothies for Fat Loss ($12.99)\n• Pre-Workout Natural Drinks ($13.99)\n\n[👉 Browse Ebooks](/store/ebooks)\n[👉 See smoothie recipes](/recipes)`;
    }

    // General fruit query
    const matchedFruits = fruits.filter(f => 
      q.includes(f.name.toLowerCase()) || q.includes(f.slug)
    );
    
    if (matchedFruits.length > 0) {
      const fruit = matchedFruits[0];
      return `🍎 **${fruit.name}** (${fruit.scientific_name || 'Tropical fruit'})\n\n${fruit.description?.substring(0, 200) || 'A delicious Caribbean tropical fruit'}...\n\n**Season:** ${fruit.seasonality || 'Year-round'}\n**Origin:** ${fruit.origin || 'Caribbean'}\n\n[👉 Full ${fruit.name} guide](/fruits/${fruit.slug})`;
    }

    // Default response
    return `Thanks for your question! I'm here to help with Caribbean tropical fruits. You can ask me about:\n\n• 📚 **NEW Ebooks** (4 recipe collections!)\n• 🏪 Store & Products\n• 🍎 Specific fruits (e.g., "Tell me about soursop")\n• 🍽️ Recipes (e.g., "What can I make with mango?")\n• 💚 Health benefits (e.g., "Benefits of guava")\n• 📦 Storage tips\n• 🌱 Growing supplies\n\nWhat would you like to know? 🌴\n\n[👉 Browse Ebooks](/store/ebooks)\n[👉 Visit Store](/store)`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Fruitsy Assistant" }]} />
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🤖</span>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold">
              Fruitsy — Your Fruit Assistant
            </h1>
          </div>
          <p className="text-white/80 mt-2 text-lg max-w-2xl">
            Ask me anything about Caribbean fruits, recipes, nutrition, and more!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Quick Prompts */}
        <div className="mb-6">
          <p className="text-sm text-charcoal-light mb-3">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-leaf hover:bg-leaf/5 transition-colors text-charcoal-light hover:text-leaf"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === "user"
                      ? "bg-leaf text-white rounded-br-md"
                      : "bg-gray-100 text-charcoal rounded-bl-md"
                  }`}
                >
                  {message.type === "assistant" && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-charcoal-light">
                      <span>🤖</span>
                      <span className="font-semibold">Fruitsy</span>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content.split(/(\[👉[^\]]+\]\([^)]+\))/g).map((part, i) => {
                      const linkMatch = part.match(/\[👉([^\]]+)\]\(([^)]+)\)/);
                      if (linkMatch) {
                        return (
                          <button
                            key={i}
                            onClick={() => navigate(linkMatch[2])}
                            className="text-leaf underline hover:no-underline font-medium"
                          >
                            👉 {linkMatch[1]}
                          </button>
                        );
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>🤖</span>
                    <span className="text-sm text-charcoal-light">Fruitsy is typing...</span>
                    <span className="animate-pulse">💭</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Fruitsy anything..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            { icon: "🍎", title: "Fruit Info", desc: "Learn about any tropical fruit" },
            { icon: "🍽️", title: "Recipe Ideas", desc: "Get meal suggestions" },
            { icon: "💚", title: "Health Tips", desc: "Nutrition & wellness advice" },
          ].map(feature => (
            <div key={feature.title} className="bg-white rounded-xl p-4 border border-gray-100 text-center">
              <span className="text-3xl block mb-2">{feature.icon}</span>
              <h3 className="font-heading font-semibold text-charcoal">{feature.title}</h3>
              <p className="text-sm text-charcoal-light">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
