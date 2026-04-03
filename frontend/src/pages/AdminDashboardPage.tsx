import { useState, useEffect } from 'react';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

export function useNavigate() {
  return (path: string) => {
    window.location.href = path;
  };
}

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ recipes: 0, fruits: 0, leaves: 0 });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    } catch (err) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/recipes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats({ recipes: data.count, fruits: 26, leaves: 8 });
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-charcoal">🏝️ Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-sm text-primary hover:underline">
              View Site →
            </a>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-charcoal mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Manage your IslandFruitGuide content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Recipes</p>
                <p className="text-3xl font-bold text-charcoal">{stats.recipes}</p>
              </div>
              <div className="text-4xl">🍹</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Fruits</p>
                <p className="text-3xl font-bold text-charcoal">{stats.fruits}</p>
              </div>
              <div className="text-4xl">🥭</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Medicinal Leaves</p>
                <p className="text-3xl font-bold text-charcoal">{stats.leaves}</p>
              </div>
              <div className="text-4xl">🌿</div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">📝 Manage Recipes</h3>
            <p className="mb-6 opacity-90">Add, edit, or delete recipes with ease</p>
            <a
              href="/admin/recipes"
              className="inline-block bg-white text-emerald-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Go to Recipes →
            </a>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">🥭 Manage Fruits</h3>
            <p className="mb-6 opacity-90">Add, edit, or delete tropical fruits</p>
            <a
              href="/admin/fruits"
              className="inline-block bg-white text-amber-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Go to Fruits →
            </a>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">🌿 Manage Medicinal Leaves</h3>
            <p className="mb-6 opacity-90">Add, edit, or delete medicinal leaves</p>
            <a
              href="/admin/leaves"
              className="inline-block bg-white text-green-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Go to Leaves →
            </a>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">🏪 Manage Store</h3>
            <p className="mb-6 opacity-90">Manage ebooks, recipe packs, and printables</p>
            <a
              href="/admin/products"
              className="inline-block bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Go to Products →
            </a>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">📚 Manage Ebooks</h3>
            <p className="mb-6 opacity-90">Generate and manage recipe ebooks</p>
            <a
              href="/admin/ebooks"
              className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Go to Ebooks →
            </a>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">🚀 SEO & Sitemaps</h3>
            <p className="mb-6 opacity-90">Generate sitemaps for search engines</p>
            <a
              href="/admin/seo"
              className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Go to SEO Tools →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
