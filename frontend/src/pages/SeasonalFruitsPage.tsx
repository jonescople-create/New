import { useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';
import { fruits } from "../data/fruits";
import { FruitCard } from "../components/FruitCard";
import { Breadcrumb } from "../components/Breadcrumb";
import { navigate } from "../App";

export function SeasonalFruitsPage() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = months[new Date().getMonth()];

  const getFruitsForMonth = (month: string) => {
    const abbr = month.substring(0, 3);
    return fruits.filter(f =>
      f.seasonality.toLowerCase().includes(abbr.toLowerCase()) ||
      f.seasonality.includes("Year-round")
    );
  };

  const currentFruits = getFruitsForMonth(currentMonth);

  useEffect(() => {
    setupPageSEO({
      path: '/seasonal-fruits',
      title: 'Caribbean Fruit Season Calendar — What\'s in Season Now | IslandFruitGuide',
      description: 'Month-by-month guide to Caribbean tropical fruit seasons. Discover which fruits are at peak ripeness right now in Jamaica, Trinidad, Barbados and across the Caribbean.',
    });
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Seasonal Fruits" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">
            Seasonal Fruit Guide 🌦️
          </h1>
          <p className="text-white/80 mt-3 text-lg max-w-2xl">
            Know what's ripe and in season throughout the year. Plan your tropical fruit adventures with our comprehensive seasonal calendar.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Current Month highlight */}
        <div className="bg-gradient-to-br from-mango/10 to-coral/10 rounded-2xl p-8 border border-mango/20 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📅</span>
            <div>
              <h2 className="font-heading text-2xl font-bold text-charcoal">
                {currentMonth} — What's In Season Now
              </h2>
              <p className="text-charcoal-light">{currentFruits.length} fruits available this month</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {currentFruits.map(fruit => (
              <FruitCard key={fruit.id} fruit={fruit} size="sm" />
            ))}
          </div>
        </div>

        {/* Monthly calendar */}
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">Monthly Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {months.map(month => {
            const monthFruits = getFruitsForMonth(month);
            const isCurrent = month === currentMonth;
            return (
              <div
                key={month}
                className={`rounded-2xl p-5 border ${isCurrent ? "border-leaf bg-leaf/5" : "border-gray-100 bg-white"}`}
              >
                <h3 className={`font-heading font-bold text-lg mb-3 ${isCurrent ? "text-leaf" : "text-charcoal"}`}>
                  {isCurrent && "🟢 "}{month}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {monthFruits.map(f => (
                    <button
                      key={f.id}
                      onClick={() => navigate(`/fruits/${f.slug}`)}
                      className="text-xs bg-gray-100 hover:bg-leaf/10 text-charcoal-light hover:text-leaf px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      {f.image_url ? (
                        <img src={f.image_url} alt={`Fresh ${f.name} tropical fruit – IslandFruitGuide`} className="w-4 h-4 rounded object-cover" />
                      ) : (
                        <span>{f.emoji}</span>
                      )}
                      {f.name}
                    </button>
                  ))}
                  {monthFruits.length === 0 && (
                    <span className="text-xs text-charcoal-light">Limited availability</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== CONTEXTUAL LINKS TO OTHER TOOLS ===== */}
        <div className="grid sm:grid-cols-3 gap-6 mt-12">
          <button onClick={() => navigate("/compare")} className="fruit-card-hover bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 text-left group cursor-pointer">
            <span className="text-3xl block mb-3">⚖️</span>
            <h3 className="font-heading font-bold text-charcoal group-hover:text-purple-700 transition-colors">Compare Seasonal Fruits</h3>
            <p className="text-sm text-charcoal-light mt-2">Compare nutritional value and health benefits of in-season fruits side by side.</p>
          </button>
          <button onClick={() => navigate("/blog/how-to-store-tropical-fruits")} className="fruit-card-hover bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 text-left group cursor-pointer">
            <span className="text-3xl block mb-3">📦</span>
            <h3 className="font-heading font-bold text-charcoal group-hover:text-amber-700 transition-colors">Storage Guide</h3>
            <p className="text-sm text-charcoal-light mt-2">Learn how to store each seasonal fruit to keep them fresh and reduce waste.</p>
          </button>
          <button onClick={() => navigate("/recipes")} className="fruit-card-hover bg-gradient-to-br from-leaf/5 to-emerald-50 rounded-2xl p-6 border border-leaf/10 text-left group cursor-pointer">
            <span className="text-3xl block mb-3">🍽️</span>
            <h3 className="font-heading font-bold text-charcoal group-hover:text-leaf transition-colors">Seasonal Recipes</h3>
            <p className="text-sm text-charcoal-light mt-2">Discover delicious Caribbean recipes that use this month's freshest tropical fruits.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
