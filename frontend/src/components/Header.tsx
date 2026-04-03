import { useState, useRef, useEffect } from "react";
import { navigate, type Route } from "../App";

const LOGO_URL = "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/brand-assets/logo.png";

interface HeaderProps {
  currentRoute: Route;
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
}

export function Header({ currentRoute, themeMode, onToggleTheme }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lifeToolsOpen, setLifeToolsOpen] = useState(false);
  const lifeToolsRef = useRef<HTMLDivElement>(null);

  const isActive = (page: string) => currentRoute.page === page;

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (lifeToolsRef.current && !lifeToolsRef.current.contains(e.target as Node)) {
        setLifeToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [currentRoute.page]);

  const mainNavLinks = [
    { label: "Home", path: "/", page: "home" },
    { label: "Fruits", path: "/fruits", page: "fruits" },
    { label: "Recipes", path: "/recipes", page: "recipes" },
    { label: "Seasonal", path: "/seasonal-fruits", page: "seasonal-fruits" },
  ];

  const lifeToolsLinks = [
    { label: "🍽️ Food AI", path: "/food-ai", page: "food-ai", desc: "Get meal suggestions from ingredients" },
    { label: "💰 Income Guide", path: "/income-guide", page: "income-guide", desc: "Practical income ideas" },
    { label: "🌿 Health & Wellness", path: "/health-wellness", page: "health-wellness", desc: "Food-based wellness tips" },
    { label: "🤖 Fruitsy Assistant", path: "/assistant", page: "assistant", desc: "AI-powered fruit assistant" },
    { label: "🍃 Medicinal Leaves", path: "/medicinal-leaves", page: "medicinal-leaves", desc: "Traditional Caribbean leaf knowledge" },
  ];

  const secondaryNavLinks = [
    { label: "🧠 Tools", path: "/tools", page: "tools-hub" },
    { label: "🌴 Explore", path: "/explore", page: "explore" },
    { label: "📖 Guides", path: "/guides", page: "guides" },
    { label: "📝 Blog", path: "/blog", page: "blog" },
    { label: "🎯 Quiz", path: "/quiz", page: "quiz" },
    { label: "⚖️ Compare", path: "/compare", page: "compare" },
    { label: "❤️ Wishlist", path: "/wishlist", page: "wishlist" },
    { label: "📚 Store", path: "/store", page: "store" },
    { label: "About", path: "/about", page: "about" },
  ];

  const isDark = themeMode === "dark";

  return (
    <header className="sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: isDark ? "rgba(15,20,17,0.97)" : "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: isDark ? "1px solid #223027" : "1px solid #dcfce7" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── LOGO ── */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 shrink-0 group"
            aria-label="Go to home"
          >
            <img
              src={LOGO_URL}
              alt="IslandFruitGuide"
              width={100}
              height={44}
              decoding="async"
              className="h-11 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="font-heading text-lg font-bold leading-none" style={{ color: isDark ? "#4ade80" : "#1F7A4D" }}>
              Island<span style={{ color: "#F9A825" }}>Fruit</span>Guide
            </span>
          </button>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {/* Dark mode toggle */}
            <button
              onClick={onToggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-all mr-1"
              style={{ backgroundColor: isDark ? "#223027" : "#f0fdf4", color: isDark ? "#4ade80" : "#1F7A4D" }}
            >
              <span className="text-base leading-none select-none">{isDark ? "☀️" : "🌙"}</span>
            </button>

            {mainNavLinks.map(link => (
              <button
                key={link.page}
                onClick={() => navigate(link.path)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isActive(link.page) ? (isDark ? "rgba(31,122,77,0.2)" : "rgba(31,122,77,0.1)") : "transparent",
                  color: isActive(link.page) ? "#1F7A4D" : isDark ? "#B7C0BB" : "#555555",
                }}
              >
                {link.label}
              </button>
            ))}

            {/* Life Tools Dropdown */}
            <div className="relative" ref={lifeToolsRef}>
              <button
                onClick={() => setLifeToolsOpen(v => !v)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                style={{
                  backgroundColor: ["food-ai","income-guide","health-wellness","assistant","medicinal-leaves"].includes(currentRoute.page)
                    ? (isDark ? "rgba(31,122,77,0.2)" : "rgba(31,122,77,0.1)") : "transparent",
                  color: isDark ? "#B7C0BB" : "#555555",
                }}
              >
                Life Tools
                <svg className={`w-3.5 h-3.5 transition-transform ${lifeToolsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {lifeToolsOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 rounded-xl shadow-xl overflow-hidden z-50"
                  style={{ backgroundColor: isDark ? "#151C18" : "#fff", border: isDark ? "1px solid #223027" : "1px solid #f0f0f0" }}>
                  {lifeToolsLinks.map(link => (
                    <button
                      key={link.page}
                      onClick={() => { navigate(link.path); setLifeToolsOpen(false); }}
                      className="w-full px-4 py-3 text-left transition-colors"
                      style={{ backgroundColor: isActive(link.page) ? (isDark ? "rgba(31,122,77,0.15)" : "rgba(31,122,77,0.05)") : "transparent" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? "rgba(31,122,77,0.12)" : "rgba(31,122,77,0.05)")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <div className="font-medium text-sm" style={{ color: isDark ? "#e5e7eb" : "#222" }}>{link.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: isDark ? "#6b7280" : "#888" }}>{link.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {secondaryNavLinks.map(link => (
              <button
                key={link.page}
                onClick={() => navigate(link.path)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isActive(link.page) ? (isDark ? "rgba(31,122,77,0.2)" : "rgba(31,122,77,0.1)") : "transparent",
                  color: isActive(link.page) ? "#1F7A4D" : isDark ? "#B7C0BB" : "#555555",
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* ── MOBILE CONTROLS ── */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Dark mode toggle mobile */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
              style={{ backgroundColor: isDark ? "#223027" : "#f0fdf4" }}
            >
              <span className="text-base leading-none select-none">{isDark ? "☀️" : "🌙"}</span>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
              style={{ backgroundColor: isDark ? "#223027" : "#f0fdf4", color: isDark ? "#4ade80" : "#1F7A4D" }}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t"
            style={{ borderColor: isDark ? "#223027" : "#e5f5ec" }}
          >
            {/* Scrollable container — max height prevents overflow on small screens */}
            <div
              className="overflow-y-auto pb-4"
              style={{ maxHeight: "calc(100dvh - 100px)" }}
            >

              {/* ── QUICK SEARCH ── */}
              <div className="px-4 pt-3 pb-2">
                <button
                  onClick={() => { navigate("/fruits"); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-colors"
                  style={{
                    backgroundColor: isDark ? "#1a2a1e" : "#f0fdf4",
                    color: isDark ? "#6b7280" : "#9ca3af",
                    border: isDark ? "1px solid #223027" : "1px solid #d1fae5",
                  }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search fruits, recipes, guides…</span>
                </button>
              </div>

              {/* ── SECTION: DISCOVER ── */}
              <div className="px-4 pt-2 pb-1">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: isDark ? "#4ade80" : "#1F7A4D" }}>
                  Discover
                </p>
              </div>
              <div className="px-2 grid grid-cols-2 gap-1">
                {[
                  { label: "🍎 All Fruits", path: "/fruits", page: "fruits" },
                  { label: "🍽️ Recipes", path: "/recipes", page: "recipes" },
                  { label: "🌴 Explore", path: "/explore", page: "explore", badge: "New" },
                  { label: "🌦️ Seasonal", path: "/seasonal-fruits", page: "seasonal-fruits" },
                  { label: "🍃 Med. Leaves", path: "/medicinal-leaves", page: "medicinal-leaves" },
                  { label: "⚖️ Compare", path: "/compare", page: "compare" },
                ].map(link => (
                  <button
                    key={link.page}
                    onClick={() => navigate(link.path)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left relative"
                    style={{
                      backgroundColor: isActive(link.page)
                        ? (isDark ? "rgba(31,122,77,0.25)" : "rgba(31,122,77,0.12)")
                        : isDark ? "#151c18" : "#f8fdf9",
                      color: isActive(link.page) ? "#1F7A4D" : isDark ? "#c9d4cc" : "#374151",
                      border: isActive(link.page)
                        ? "1px solid rgba(31,122,77,0.4)"
                        : isDark ? "1px solid #223027" : "1px solid #e5f5ec",
                    }}
                  >
                    <span className="truncate">{link.label}</span>
                    {"badge" in link && link.badge && (
                      <span className="absolute top-1 right-1 text-[9px] font-black px-1 py-0.5 rounded-full"
                        style={{ backgroundColor: "#F9A825", color: "#000" }}>
                        {link.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── SECTION: TOOLS ── */}
              <div className="px-4 pt-4 pb-1">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: isDark ? "#4ade80" : "#1F7A4D" }}>
                  Tools & Guides
                </p>
              </div>
              <div className="px-2 grid grid-cols-2 gap-1">
                {[
                  { label: "🧠 All Tools", path: "/tools", page: "tools-hub" },
                  { label: "📖 Guides", path: "/guides", page: "guides", badge: "New" },
                  { label: "🎯 Fruit Finder", path: "/tools/fruit-finder", page: "fruit-finder", badge: "New" },
                  { label: "🎲 Fruit Quiz", path: "/quiz", page: "quiz" },
                  { label: "🤖 Fruitsy AI", path: "/assistant", page: "assistant" },
                  { label: "📝 Blog", path: "/blog", page: "blog" },
                ].map(link => (
                  <button
                    key={link.page}
                    onClick={() => navigate(link.path)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left relative"
                    style={{
                      backgroundColor: isActive(link.page)
                        ? (isDark ? "rgba(31,122,77,0.25)" : "rgba(31,122,77,0.12)")
                        : isDark ? "#151c18" : "#f8fdf9",
                      color: isActive(link.page) ? "#1F7A4D" : isDark ? "#c9d4cc" : "#374151",
                      border: isActive(link.page)
                        ? "1px solid rgba(31,122,77,0.4)"
                        : isDark ? "1px solid #223027" : "1px solid #e5f5ec",
                    }}
                  >
                    <span className="truncate">{link.label}</span>
                    {"badge" in link && link.badge && (
                      <span className="absolute top-1 right-1 text-[9px] font-black px-1 py-0.5 rounded-full"
                        style={{ backgroundColor: "#F9A825", color: "#000" }}>
                        {link.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── SECTION: LIFE TOOLS ── */}
              <div className="px-4 pt-4 pb-1">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: isDark ? "#4ade80" : "#1F7A4D" }}>
                  Life Tools
                </p>
              </div>
              <div className="px-2 flex flex-col gap-0.5">
                {lifeToolsLinks.map(link => (
                  <button
                    key={link.page}
                    onClick={() => navigate(link.path)}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                    style={{
                      backgroundColor: isActive(link.page)
                        ? (isDark ? "rgba(31,122,77,0.25)" : "rgba(31,122,77,0.1)")
                        : "transparent",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate"
                        style={{ color: isActive(link.page) ? "#1F7A4D" : isDark ? "#c9d4cc" : "#374151" }}>
                        {link.label}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: isDark ? "#4b5e52" : "#9ca3af" }}>
                        {link.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* ── STORE CTA (revenue-critical) ── */}
              <div className="px-3 pt-4">
                <button
                  onClick={() => navigate("/store/ebooks")}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all hover:scale-[1.01]"
                  style={{
                    background: "linear-gradient(135deg,#071A07,#0A2010)",
                    border: "1px solid rgba(255,215,0,0.3)",
                  }}
                >
                  <span className="text-2xl flex-shrink-0">📚</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">Caribbean Fruit Ebooks</p>
                    <p className="text-xs" style={{ color: "#FFD700" }}>
                      13 books · Up to 58% off · Sale ends soon
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* ── FOOTER LINKS ── */}
              <div className="mx-4 my-3 h-px" style={{ backgroundColor: isDark ? "#223027" : "#e5e7eb" }} />
              <div className="px-2 grid grid-cols-3 gap-1">
                {[
                  { label: "❤️ Wishlist", path: "/wishlist", page: "wishlist" },
                  { label: "🛒 Store", path: "/store", page: "store" },
                  { label: "ℹ️ About", path: "/about", page: "about" },
                  { label: "📞 Contact", path: "/contact", page: "contact" },
                  { label: "🌺 Buy Fruits", path: "/buy-fruits", page: "buy-fruits" },
                  { label: "⚙️ Theme",  path: "", page: "__theme" },
                ].map(link => link.page === "__theme" ? (
                  <button
                    key="theme"
                    onClick={onToggleTheme}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: isDark ? "#1a2a1e" : "#f0fdf4",
                      color: isDark ? "#4ade80" : "#1F7A4D",
                      border: isDark ? "1px solid #223027" : "1px solid #d1fae5",
                    }}
                  >
                    <span>{isDark ? "☀️" : "🌙"}</span>
                    <span>{isDark ? "Light" : "Dark"}</span>
                  </button>
                ) : (
                  <button
                    key={link.page}
                    onClick={() => navigate(link.path)}
                    className="flex items-center justify-center px-2 py-2 rounded-xl text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: isActive(link.page)
                        ? (isDark ? "rgba(31,122,77,0.25)" : "rgba(31,122,77,0.12)")
                        : isDark ? "#151c18" : "#f8fdf9",
                      color: isActive(link.page) ? "#1F7A4D" : isDark ? "#9ca3af" : "#6b7280",
                      border: isDark ? "1px solid #223027" : "1px solid #e5f5ec",
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </header>
  );
}
