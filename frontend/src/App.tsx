import { useState, useEffect, Suspense, lazy } from "react";
import { applyTheme, getInitialTheme, toggleTheme, type ThemeMode } from "./utils/theme";
import { Header } from "./components/Header";
import { SalesBanner } from "./components/SalesBanner";
import { ExitIntentPopup } from "./components/ExitIntentPopup";
import { LiveActivityPill } from "./components/SocialProof";
import { Footer } from "./components/Footer";
import { LeadMagnetPopup } from "./components/LeadMagnetPopup";
import { FloatingFruitsyButton } from "./components/FloatingFruitsyButton";
import { processAffiliateParam, trackBehaviour } from "./utils/funnelTracker";
import { processIncomingRef } from "./utils/referralSystem";

// Route-level code splitting (reduces unused JS on initial load)
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const FruitsPage = lazy(() => import("./pages/FruitsPage").then(m => ({ default: m.FruitsPage })));
const FruitDetailPage = lazy(() => import("./pages/FruitDetailPage").then(m => ({ default: m.FruitDetailPage })));
const RecipesPage = lazy(() => import("./pages/RecipesPage").then(m => ({ default: m.RecipesPage })));
const RecipeDetailPage = lazy(() => import("./pages/RecipeDetailPage").then(m => ({ default: m.RecipeDetailPage })));
const SeasonalFruitsPage = lazy(() => import("./pages/SeasonalFruitsPage").then(m => ({ default: m.SeasonalFruitsPage })));
const BuyFruitsPage = lazy(() => import("./pages/BuyFruitsPage").then(m => ({ default: m.BuyFruitsPage })));
const FoodAIPage = lazy(() => import("./pages/FoodAIPage").then(m => ({ default: m.FoodAIPage })));
const IncomeGuidePage = lazy(() => import("./pages/IncomeGuidePage").then(m => ({ default: m.IncomeGuidePage })));
const HealthWellnessPage = lazy(() => import("./pages/HealthWellnessPage").then(m => ({ default: m.HealthWellnessPage })));
const SmartAssistantPage = lazy(() => import("./pages/SmartAssistantPage").then(m => ({ default: m.SmartAssistantPage })));
const StorePage = lazy(() => import("./pages/StorePage").then(m => ({ default: m.StorePage })));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage").then(m => ({ default: m.CheckoutPage })));
const EbookPreviewPage = lazy(() => import("./pages/EbookPreviewPage").then(m => ({ default: m.EbookPreviewPage })));
const BlogPage = lazy(() => import("./pages/BlogPage").then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage").then(m => ({ default: m.BlogPostPage })));
const FruitMatchUpPage = lazy(() => import("./pages/FruitMatchUpPage").then(m => ({ default: m.default })));
const ComparePage = lazy(() => import("./pages/ComparePage").then(m => ({ default: m.ComparePage })));
const WishlistPage = lazy(() => import("./pages/WishlistPage").then(m => ({ default: m.WishlistPage })));
const QuizPage = lazy(() => import("./pages/QuizPage").then(m => ({ default: m.QuizPage })));
const QuizResultsPage = lazy(() => import("./pages/QuizResultsPage").then(m => ({ default: m.QuizResultsPage })));
const SitemapViewerPage = lazy(() => import("./pages/SitemapViewerPage").then(m => ({ default: m.SitemapViewerPage })));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/TermsPage").then(m => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const MedicinalLeavesPage = lazy(() => import("./pages/MedicinalLeavesPage").then(m => ({ default: m.MedicinalLeavesPage })));
const MedicinalLeafDetailPage = lazy(() => import("./pages/MedicinalLeafDetailPage").then(m => ({ default: m.MedicinalLeafDetailPage })));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage").then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage").then(m => ({ default: m.AdminDashboardPage })));
const AdminRecipesPage = lazy(() => import("./pages/AdminRecipesPage").then(m => ({ default: m.AdminRecipesPage })));
const AdminRecipeFormPage = lazy(() => import("./pages/AdminRecipeFormPage").then(m => ({ default: m.AdminRecipeFormPage })));
const AdminFruitsPage = lazy(() => import("./pages/AdminFruitsPage").then(m => ({ default: m.AdminFruitsPage })));
const AdminFruitFormPage = lazy(() => import("./pages/AdminFruitFormPage").then(m => ({ default: m.AdminFruitFormPage })));
const AdminSEOPage = lazy(() => import("./pages/AdminSEOPage").then(m => ({ default: m.AdminSEOPage })));
const AdminLeavesPage = lazy(() => import("./pages/AdminLeavesPage").then(m => ({ default: m.AdminLeavesPage })));
const AdminLeafFormPage = lazy(() => import("./pages/AdminLeafFormPage").then(m => ({ default: m.AdminLeafFormPage })));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage").then(m => ({ default: m.AdminProductsPage })));
const AdminProductFormPage = lazy(() => import("./pages/AdminProductFormPage").then(m => ({ default: m.AdminProductFormPage })));
const AdminEbooksPage = lazy(() => import("./pages/AdminEbooksPageEnhanced").then(m => ({ default: m.AdminEbooksPage })));
const AdminBundlesPage = lazy(() => import("./pages/AdminBundlesPage").then(m => ({ default: m.AdminBundlesPage })));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage").then(m => ({ default: m.ProductDetailPage })));
const EditorialPolicyPage = lazy(() => import("./pages/EditorialPolicyPage").then(m => ({ default: m.EditorialPolicyPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage })));
const ToolsHubPage = lazy(() => import("./pages/ToolsHubPage").then(m => ({ default: m.ToolsHubPage })));
const FruitRecommenderPage = lazy(() => import("./pages/FruitRecommenderPage").then(m => ({ default: m.FruitRecommenderPage })));
const RecipeBuilderPage = lazy(() => import("./pages/RecipeBuilderPage").then(m => ({ default: m.RecipeBuilderPage })));
const MedicinalAdvisorPage = lazy(() => import("./pages/MedicinalAdvisorPage").then(m => ({ default: m.MedicinalAdvisorPage })));
const StoreEbooksPage = lazy(() => import("./pages/StoreEbooksPage").then(m => ({ default: m.StoreEbooksPage })));
const ExplorePage = lazy(() => import("./pages/ExplorePage").then(m => ({ default: m.ExplorePage })));
const FruitFinderPage = lazy(() => import("./pages/FruitFinderPage").then(m => ({ default: m.FruitFinderPage })));
const NutritionPage = lazy(() => import("./pages/NutritionPage").then(m => ({ default: m.NutritionPage })));
const GuidePage = lazy(() => import("./pages/GuidePage").then(m => ({ default: m.GuidePage })));
const FruitGamePage = lazy(() => import("./components/game/FruitGame").then(m => ({ default: m.FruitGame })));
const RecipeGeneratorPage = lazy(() => import("./components/ai/RecipeGenerator").then(m => ({ default: m.RecipeGenerator })));
// StoreAmazonCategoryPage removed - categories now show "coming soon" state

function PageFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
        <span className="animate-spin text-2xl">⏳</span>
        <span className="text-sm text-charcoal-light">Loading…</span>
      </div>
    </div>
  );
}


export type Route =
  | { page: "home" }
  | { page: "fruits" }
  | { page: "fruit-detail"; slug: string }
  | { page: "recipes" }
  | { page: "recipe-detail"; slug: string }
  | { page: "seasonal-fruits" }
  | { page: "buy-fruits" }
  | { page: "about" }
  | { page: "contact" }
  | { page: "food-ai" }
  | { page: "income-guide" }
  | { page: "health-wellness" }
  | { page: "assistant" }
  | { page: "store" }
  | { page: "store-ebooks" }
  | { page: "store-fruit-growing" }
  | { page: "store-kitchen-tools" }
  | { page: "store-fruit-seeds" }
  | { page: "store-wall-charts" }
  | { page: "store-bundles" }
  | { page: "product-detail"; slug: string }
  | { page: "checkout"; productId: string }
  | { page: "ebook"; bookId: string }
  | { page: "blog" }
  | { page: "blog-post"; slug: string }
  | { page: "fruit-match-up" }
  | { page: "compare" }
  | { page: "wishlist" }
  | { page: "quiz" }
  | { page: "quiz-results" }
  | { page: "sitemap-viewer" }
  | { page: "privacy" }
  | { page: "terms" }
  | { page: "medicinal-leaves" }
  | { page: "medicinal-leaf-detail"; slug: string }
  | { page: "admin-login" }
  | { page: "admin-dashboard" }
  | { page: "admin-recipes" }
  | { page: "admin-recipe-new" }
  | { page: "admin-recipe-edit"; recipeId: string }
  | { page: "admin-fruits" }
  | { page: "admin-fruit-new" }
  | { page: "admin-fruit-edit"; fruitId: string }
  | { page: "admin-leaves" }
  | { page: "admin-leaf-new" }
  | { page: "admin-leaf-edit"; leafId: string }
  | { page: "admin-products" }
  | { page: "admin-product-new" }
  | { page: "admin-product-edit"; productId: string }
  | { page: "admin-seo" }
  | { page: "admin-ebooks" }
  | { page: "admin-bundles" }
  | { page: "about" }
  | { page: "contact" }
  | { page: "editorial-policy" }
  | { page: "tools-hub" }
  | { page: "fruit-recommender" }
  | { page: "recipe-builder" }
  | { page: "medicinal-advisor" }
  | { page: "fruit-game" }
  | { page: "ai-recipe" }
  | { page: "not-found"; path: string }
  | { page: "explore" }
  | { page: "fruit-finder" }
  | { page: "nutrition"; slug: string }
  | { page: "guides"; slug: string }
  | { page: "compare-slugs"; fruitA: string; fruitB: string };

function parseRoute(pathname: string): Route {
  const path = pathname || "/";
  if (path === "/") return { page: "home" };
  if (path === "/fruits") return { page: "fruits" };
  if (path.startsWith("/fruits/")) return { page: "fruit-detail", slug: path.replace("/fruits/", "") };
  if (path === "/recipes") return { page: "recipes" };
  if (path.startsWith("/recipes/")) return { page: "recipe-detail", slug: path.replace("/recipes/", "") };
  if (path === "/seasonal-fruits") return { page: "seasonal-fruits" };
  if (path === "/buy-fruits") return { page: "buy-fruits" };
  if (path === "/about") return { page: "about" };
  if (path === "/contact") return { page: "contact" };
  if (path === "/food-ai") return { page: "food-ai" };
  if (path === "/income-guide") return { page: "income-guide" };
  if (path === "/health-wellness") return { page: "health-wellness" };
  if (path === "/assistant") return { page: "assistant" };
  if (path === "/store") return { page: "store" };
  if (path === "/store/ebooks") return { page: "store-ebooks" };
  if (path === "/store/fruit-growing") return { page: "store-fruit-growing" };
  if (path === "/store/kitchen-tools") return { page: "store-kitchen-tools" };
  if (path === "/store/fruit-seeds") return { page: "store-fruit-seeds" };
  if (path === "/store/wall-charts") return { page: "store-wall-charts" };
  if (path === "/store/bundles") return { page: "store-bundles" };
  if (path.startsWith("/store/ebooks/") || path.startsWith("/store/recipe-packs/") || path.startsWith("/store/printables/")) {
    const slug = path.split('/').pop() || '';
    return { page: "product-detail", slug };
  }
  if (path.startsWith("/store/") && !["store/fruit-growing","store/kitchen-tools","store/fruit-seeds","store/wall-charts","store/bundles","store/ebooks"].some(p => path === `/${p}`)) {
    const slug = path.replace("/store/", "");
    if (slug && !slug.includes("/")) return { page: "product-detail", slug };
  }
  if (path.startsWith("/checkout/")) return { page: "checkout", productId: path.replace("/checkout/", "") };
  if (path.startsWith("/ebook/")) return { page: "ebook", bookId: path.replace("/ebook/", "") };
  if (path === "/blog") return { page: "blog" };
  if (path.startsWith("/blog/")) return { page: "blog-post", slug: path.replace("/blog/", "") };
  if (path === "/fruit-match-up") return { page: "fruit-match-up" };
  if (path === "/compare") return { page: "compare" };
  if (path === "/wishlist") return { page: "wishlist" };
  if (path === "/quiz") return { page: "quiz" };
  if (path === "/quiz/results") return { page: "quiz-results" };
  if (path === "/sitemap-viewer") return { page: "sitemap-viewer" };
  if (path === "/privacy") return { page: "privacy" };
  if (path === "/terms") return { page: "terms" };
  if (path === "/medicinal-leaves") return { page: "medicinal-leaves" };
  if (path.startsWith("/medicinal-leaves/")) return { page: "medicinal-leaf-detail", slug: path.replace("/medicinal-leaves/", "") };
  if (path === "/admin/login") return { page: "admin-login" };
  if (path === "/admin") return { page: "admin-dashboard" };
  if (path === "/admin/recipes") return { page: "admin-recipes" };
  if (path === "/admin/recipes/new") return { page: "admin-recipe-new" };
  if (path.startsWith("/admin/recipes/edit/")) return { page: "admin-recipe-edit", recipeId: path.replace("/admin/recipes/edit/", "") };
  if (path === "/admin/fruits") return { page: "admin-fruits" };
  if (path === "/admin/fruits/new") return { page: "admin-fruit-new" };
  if (path.startsWith("/admin/fruits/edit/")) return { page: "admin-fruit-edit", fruitId: path.replace("/admin/fruits/edit/", "") };
  if (path === "/admin/leaves") return { page: "admin-leaves" };
  if (path === "/admin/leaves/new") return { page: "admin-leaf-new" };
  if (path.startsWith("/admin/leaves/")) {
    const leafId = path.replace("/admin/leaves/", "");
    if (leafId && leafId !== "new") return { page: "admin-leaf-edit", leafId };
  }
  if (path === "/admin/products") return { page: "admin-products" };
  if (path === "/admin/products/new") return { page: "admin-product-new" };
  if (path.startsWith("/admin/products/")) {
    const productId = path.replace("/admin/products/", "");
    if (productId && productId !== "new") return { page: "admin-product-edit", productId };
  }
  if (path === "/admin/seo") return { page: "admin-seo" };
  if (path === "/admin/ebooks") return { page: "admin-ebooks" };
  if (path === "/admin/bundles") return { page: "admin-bundles" };
  if (path === "/about") return { page: "about" };
  if (path === "/contact") return { page: "contact" };
  if (path === "/editorial-policy") return { page: "editorial-policy" };
  if (path === "/tools") return { page: "tools-hub" };
  if (path === "/tools/fruit-recommender") return { page: "fruit-recommender" };
  if (path === "/tools/recipe-builder") return { page: "recipe-builder" };
  if (path === "/tools/medicinal-advisor") return { page: "medicinal-advisor" };
  if (path === "/tools/fruit-finder") return { page: "fruit-finder" };
  if (path === "/explore") return { page: "explore" };
  if (path.startsWith("/nutrition/")) return { page: "nutrition", slug: path.replace("/nutrition/", "") };
  if (path === "/nutrition") return { page: "nutrition", slug: "vitamin-c-fruits" };
  if (path.startsWith("/guides/")) return { page: "guides", slug: path.replace("/guides/", "") };
  if (path === "/guides") return { page: "guides", slug: "tropical-fruits-beginners" };
  if (path.startsWith("/compare/")) {
    const parts = path.replace("/compare/", "").split("-vs-");
    if (parts.length === 2) return { page: "compare-slugs", fruitA: parts[0], fruitB: parts[1] };
  }
  if (path === "/fruit-game") return { page: "fruit-game" };
  if (path === "/ai-recipe" || path === "/recipe-generator") return { page: "ai-recipe" };
  return { page: "not-found", path };
}

export function navigate(path: string) {
  // History API navigation (no hash) for better SEO and consistent canonicals.
  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
  }
  // Notify listeners
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}


export function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme());
  const [route, setRoute] = useState<Route>(parseRoute(window.location.pathname));

  // Initialise affiliate + referral tracking once on mount
  useEffect(() => {
    processAffiliateParam();
    processIncomingRef();
    trackBehaviour('pageView', window.location.pathname);
  }, []);

  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  useEffect(() => {
    const handler = () => {
      const newRoute = parseRoute(window.location.pathname);
      setRoute(newRoute);
      window.scrollTo({ top: 0 });
      trackBehaviour('pageView', window.location.pathname);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const renderPage = () => {
    switch (route.page) {
      case "home": return <HomePage />;
      case "fruits": return <FruitsPage />;
      case "fruit-detail": return <FruitDetailPage slug={route.slug} />;
      case "recipes": return <RecipesPage />;
      case "recipe-detail": return <RecipeDetailPage slug={route.slug} />;
      case "seasonal-fruits": return <SeasonalFruitsPage />;
      case "buy-fruits": return <BuyFruitsPage />;
      case "about": return <AboutPage />;
      case "contact": return <ContactPage />;
      case "food-ai": return <FoodAIPage />;
      case "income-guide": return <IncomeGuidePage />;
      case "health-wellness": return <HealthWellnessPage />;
      case "assistant": return <SmartAssistantPage />;
      case "store": return <StorePage />;
      case "store-ebooks": return <StoreEbooksPage />;
      case "store-fruit-growing":
      case "store-kitchen-tools":
      case "store-fruit-seeds":
      case "store-wall-charts":
      case "store-bundles":
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl block mb-4">🚧</span>
              <h1 className="text-3xl font-bold text-gray-700 mb-2">Coming Soon!</h1>
              <p className="text-gray-500 mb-6">This section is under development. Check back soon!</p>
              <a href="/store" className="bg-caribbean-green text-white px-6 py-3 rounded-lg hover:bg-leaf transition-colors font-medium">
                ← Back to Store
              </a>
            </div>
          </div>
        );
      case "product-detail": return <ProductDetailPage slug={route.slug} />;
      case "checkout": return <CheckoutPage productId={route.productId} />;
      case "ebook": return <EbookPreviewPage bookId={route.bookId} />;
      case "blog": return <BlogPage />;
      case "blog-post": return <BlogPostPage slug={route.slug} />;
      case "fruit-match-up": return <FruitMatchUpPage />;
      case "compare": return <ComparePage />;
      case "wishlist": return <WishlistPage />;
      case "quiz": return <QuizPage />;
      case "quiz-results": return <QuizResultsPage />;
      case "sitemap-viewer": return <SitemapViewerPage />;
      case "privacy": return <PrivacyPage />;
      case "terms": return <TermsPage />;
      case "medicinal-leaves": return <MedicinalLeavesPage />;
      case "medicinal-leaf-detail": return <MedicinalLeafDetailPage slug={route.slug} />;
      case "admin-login": return <AdminLoginPage />;
      case "admin-dashboard": return <AdminDashboardPage />;
      case "admin-recipes": return <AdminRecipesPage />;
      case "admin-recipe-new": return <AdminRecipeFormPage />;
      case "admin-recipe-edit": return <AdminRecipeFormPage recipeId={route.recipeId} />;
      case "admin-fruits": return <AdminFruitsPage />;
      case "admin-fruit-new": return <AdminFruitFormPage />;
      case "admin-fruit-edit": return <AdminFruitFormPage fruitId={route.fruitId} />;
      case "admin-leaves": return <AdminLeavesPage />;
      case "admin-leaf-new": return <AdminLeafFormPage />;
      case "admin-leaf-edit": return <AdminLeafFormPage leafId={route.leafId} />;
      case "admin-products": return <AdminProductsPage />;
      case "admin-product-new": return <AdminProductFormPage />;
      case "admin-product-edit": return <AdminProductFormPage productId={route.productId} />;
      case "admin-seo": return <AdminSEOPage />;
      case "admin-ebooks": return <AdminEbooksPage />;
      case "admin-bundles": return <AdminBundlesPage />;
      case "editorial-policy": return <EditorialPolicyPage />;
      case "tools-hub": return <ToolsHubPage />;
      case "fruit-recommender": return <FruitRecommenderPage />;
      case "recipe-builder": return <RecipeBuilderPage />;
      case "medicinal-advisor": return <MedicinalAdvisorPage />;
      case "explore": return <ExplorePage />;
      case "fruit-finder": return <FruitFinderPage />;
      case "nutrition": return <NutritionPage slug={route.slug} />;
      case "guides": return <GuidePage slug={route.slug} />;
      case "compare-slugs": return <ComparePage preloadA={route.fruitA} preloadB={route.fruitB} />;
      case "fruit-game": return <FruitGamePage />;
      case "ai-recipe":  return <RecipeGeneratorPage />;
      case "not-found": return <NotFoundPage path={route.path} />;
      default: return <NotFoundPage />;
    }
  };

  // Check if current route is admin page
  const isAdminPage = route.page.startsWith("admin-");

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {!isAdminPage && <SalesBanner />}
      {!isAdminPage && (
        <Header
          currentRoute={route}
          themeMode={themeMode}
          onToggleTheme={() => setThemeMode((prev) => toggleTheme(prev))}
        />
      )}
      {!isAdminPage && <LiveActivityPill />}
      {!isAdminPage && <ExitIntentPopup />}
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          {renderPage()}
        </Suspense>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <LeadMagnetPopup />}
      {!isAdminPage && <FloatingFruitsyButton />}
    </div>
  );
}
