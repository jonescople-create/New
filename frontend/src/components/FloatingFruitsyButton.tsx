import { useState } from 'react';
import { navigate } from '../App';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export function FloatingFruitsyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: "Hi! I'm Fruitsy 🍎, your Caribbean fruit assistant! I can help you with:\n\n• Finding fruits and recipes\n• Browse our NEW ebooks store\n• Health benefits and nutrition\n• Store and income tips\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "Show me the ebooks",
    "What's in the store?",
    "Health benefits of mango",
    "Recipe ideas",
    "Seasonal fruits"
  ];

  const generateResponse = async (query: string): Promise<string> => {
    const q = query.toLowerCase();

    // Ebook queries
    if (q.includes('ebook') || q.includes('recipe book') || q.includes('download') || q.includes('pdf')) {
      return `📚 **NEW! Our Ebook Collection:**\n\nWe have 4 amazing tropical fruit recipe ebooks:\n\n• Tropical Gym Energy Recipes ($14.99)\n• Caribbean Smoothies for Fat Loss ($12.99)\n• Tropical Superfruit Healing Drinks ($15.99)\n• Island Pre-Workout Natural Drinks ($13.99)\n\nEach with 25-32 recipes! Instant download.\n\n[👉 Browse Ebooks](/store/ebooks)`;
    }

    // Store queries
    if (q.includes('store') || q.includes('shop') || q.includes('buy') || q.includes('purchase') || q.includes('product')) {
      return `🏪 **IslandFruitGuide Store:**\n\nBrowse our complete collection:\n\n📚 **Ebooks** - Recipe collections & guides\n🌱 **Growing Supplies** - Seeds, soil, tools\n🔪 **Kitchen Tools** - Fruit prep equipment\n🌱 **Fruit Seeds** - Grow your own tropicals\n📊 **Wall Charts** - Educational posters\n\n[👉 Visit Store](/store)`;
    }

    // Recipe queries
    if (q.includes('recipe') || q.includes('make') || q.includes('cook')) {
      // Use local recipes data
      return `🍽️ **Recipe Ideas:**\n\nHere are some of our Caribbean favourites:\n\n• Jamaican Ackee and Saltfish\n• Tropical Mango Chutney\n• Soursop Juice (Caribbean Style)\n• Caribbean Coconut Drops\n\nWe have 22+ recipes! [👉 Browse all recipes](/recipes)`;
    }

    // Health queries
    if (q.includes('health') || q.includes('benefit') || q.includes('nutrition')) {
      return `💚 **Health Benefits:**\n\nCaribbean fruits are superfoods!\n\n• **Guava**: 4x more Vitamin C than oranges\n• **Soursop**: Powerful antioxidants\n• **Papaya**: Digestive enzymes\n• **Coconut**: Healthy fats\n\n[👉 Health guide](/health-wellness)`;
    }

    // Season queries
    if (q.includes('season') || q.includes('available')) {
      const month = new Date().toLocaleString('default', { month: 'long' });
      return `🌦️ **Fruits in Season (${month}):**\n\nMango, papaya, guava, and more!\n\nYear-round: Coconut, banana, papaya\n\n[👉 Seasonal guide](/seasonal-fruits)`;
    }

    // Tools queries
    if (q.includes('tool') || q.includes('recommender') || q.includes('builder')) {
      return `🛠️ **Interactive Tools:**\n\n• Fruit Recommender\n• Recipe Builder\n• Medicinal Advisor\n\n[👉 Try tools](/tools)`;
    }

    // Default
    return `Thanks! I can help with:\n\n• 📚 Ebooks & Store\n• 🍎 Fruit information\n• 🍽️ Recipes\n• 💚 Health & nutrition\n• 🌦️ Seasonal fruits\n\nWhat interests you? 🌴`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Generate response
    const response = await generateResponse(userMessage.content);
    
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-caribbean-green to-leaf text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-300 group"
        aria-label="Open Fruitsy Assistant"
      >
        <div className="relative">
          <span className="text-3xl">🤖</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Ask Fruitsy 🍎
        </span>
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-caribbean-green to-leaf text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-bold">Fruitsy</h3>
                <p className="text-xs text-white/80">Your Caribbean fruit assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full hover:border-caribbean-green hover:bg-caribbean-green/5 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    message.type === 'user'
                      ? 'bg-caribbean-green text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  {message.type === 'assistant' && (
                    <div className="flex items-center gap-1 mb-1 text-xs text-gray-500">
                      <span>🤖</span>
                      <span className="font-semibold">Fruitsy</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {message.content.split(/(\[👉[^\]]+\]\([^)]+\))/g).map((part, i) => {
                      const linkMatch = part.match(/\[👉([^\]]+)\]\(([^)]+)\)/);
                      if (linkMatch) {
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              navigate(linkMatch[2]);
                              setIsOpen(false);
                            }}
                            className="text-caribbean-green underline hover:no-underline font-medium block mt-2"
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
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>🤖</span>
                    <span>Fruitsy is typing</span>
                    <span className="animate-pulse">💭</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-caribbean-green focus:ring-2 focus:ring-caribbean-green/20 outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-caribbean-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-caribbean-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-center">
            <button
              onClick={() => {
                navigate('/assistant');
                setIsOpen(false);
              }}
              className="text-xs text-caribbean-green hover:underline"
            >
              Open full Fruitsy assistant →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
