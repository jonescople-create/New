import { navigate } from "../App";

const LOGO_URL = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/brand-assets/logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <button onClick={() => navigate("/")} className="flex items-center gap-3 mb-4 group">
              <img
                src={LOGO_URL}
                alt="IslandFruitGuide Logo"
                width={144}
                height={72}
                decoding="async"
                className="h-[72px] w-auto object-contain -my-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'inline';
                }}
              />
              <span className="text-3xl hidden">🌴</span>
              <span className="font-heading text-xl font-bold">
                Island<span className="text-mango">Fruit</span>Guide
              </span>
            </button>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your complete Caribbean and tropical fruit encyclopedia. Discover fruits, recipes, health benefits, and life tools.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-heading font-semibold text-mango mb-4">Explore</h3>
            <ul className="space-y-2">
              {[
                { label: "All Fruits", path: "/fruits" },
                { label: "Recipes", path: "/recipes" },
                { label: "📝 Blog", path: "/blog" },
                { label: "🎯 Quiz", path: "/quiz" },
                { label: "⚖️ Compare Fruits", path: "/compare" },
                { label: "🏆 Fruit Match-Up", path: "/fruit-match-up" },
                { label: "❤️ My Wishlist", path: "/wishlist" },
                { label: "Seasonal Fruits", path: "/seasonal-fruits" },
                { label: "📚 Store & Ebooks", path: "/store" },
              ].map(link => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Life Tools */}
          <div>
            <h3 className="font-heading font-semibold text-mango mb-4">Life Tools</h3>
            <ul className="space-y-2">
              {[
                { label: "🍽️ Food AI", path: "/food-ai" },
                { label: "💰 Income Guide", path: "/income-guide" },
                { label: "🌿 Health & Wellness", path: "/health-wellness" },
                { label: "🤖 Fruitsy Assistant", path: "/assistant" },
                { label: "🍃 Medicinal Leaves", path: "/medicinal-leaves" },
              ].map(link => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-semibold text-mango mb-4">Company</h3>
            <ul className="space-y-2">
              {[
                { label: "About Us", path: "/about" },
                { label: "Contact", path: "/contact" },
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Terms of Service", path: "/terms" },
                { label: "Sitemap", path: "/sitemap-viewer" },
              ].map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Fruits */}
          <div>
            <h3 className="font-heading font-semibold text-mango mb-4">Popular Fruits</h3>
            <ul className="space-y-2">
              {[
                { label: "🥭 Mango", slug: "mango" },
                { label: "🟢 Soursop", slug: "soursop" },
                { label: "🍌 Banana", slug: "banana" },
                { label: "🥥 Coconut", slug: "coconut" },
                { label: "🩷 Guava", slug: "guava" },
              ].map(f => (
                <li key={f.slug}>
                  <button
                    onClick={() => navigate(`/fruits/${f.slug}`)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {f.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} IslandFruitGuide. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span>Built with 🌴 in the Caribbean</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
