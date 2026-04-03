import { navigate } from "../App";
import { Breadcrumb } from "../components/Breadcrumb";

export function NotFoundPage({ path }: { path?: string }) {
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-charcoal to-charcoal/90 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Page Not Found" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">404 — Page Not Found</h1>
          <p className="text-white/80 mt-3 text-lg">
            {path ? `The page "${path}" doesn't exist.` : "The page you're looking for doesn't exist."}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="text-8xl block mb-6">🌴</span>
        <h2 className="font-heading text-3xl font-bold text-charcoal dark:text-white mb-4">
          Oops! Lost in the tropics?
        </h2>
        <p className="text-charcoal-light dark:text-gray-400 text-lg mb-10 max-w-md mx-auto">
          We couldn't find that page. It may have been moved or doesn't exist. Let's get you back on track.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { icon: "🍎", label: "Browse Fruits", path: "/fruits" },
            { icon: "🍽️", label: "Recipes", path: "/recipes" },
            { icon: "📝", label: "Blog", path: "/blog" },
            { icon: "🧠", label: "Take Quiz", path: "/quiz" },
          ].map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 hover:border-leaf hover:shadow-md transition-all group"
            >
              <span className="text-3xl block mb-2">{link.icon}</span>
              <span className="text-sm font-medium text-charcoal dark:text-white group-hover:text-leaf transition-colors">{link.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/")}
          className="btn-primary text-base px-8 py-3"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
