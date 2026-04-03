import { useState, useEffect } from 'react';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface Fruit {
  id: string;
  name: string;
  scientific_name: string;
  slug: string;
  image_url: string;
  category: string[];
  emoji: string;
  seasonality: string;
  origin: string;
}

export function AdminFruitsPage() {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
    loadFruits();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  };

  const loadFruits = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/fruits`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load fruits');

      const data = await response.json();
      setFruits(data.fruits);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fruitId: string) => {
    if (!confirm('Are you sure you want to delete this fruit?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/fruits/${fruitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete fruit');

      loadFruits();
      alert('Fruit deleted successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
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
          <p className="text-gray-600">Loading fruits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-primary hover:underline text-sm">
              ← Dashboard
            </a>
            <h1 className="text-2xl font-bold text-charcoal">Manage Fruits</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-charcoal">All Fruits ({fruits.length})</h2>
            <p className="text-gray-600 text-sm">View and manage your fruit collection</p>
          </div>
          <a
            href="/admin/fruits/new"
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            + Add New Fruit
          </a>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Fruits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fruits.map((fruit) => (
            <div key={fruit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="relative h-48">
                <img
                  src={fruit.image_url}
                  alt={fruit.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-white rounded-full px-3 py-1 text-2xl">
                  {fruit.emoji}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-charcoal mb-1">{fruit.name}</h3>
                <p className="text-sm text-gray-600 italic mb-2">{fruit.scientific_name}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {fruit.category.map((cat, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <p>🌍 {fruit.origin}</p>
                  <p>📅 {fruit.seasonality}</p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <a
                    href={`/fruits/${fruit.slug}`}
                    target="_blank"
                    className="flex-1 text-center px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition"
                  >
                    View
                  </a>
                  <a
                    href={`/admin/fruits/edit/${fruit.id}`}
                    className="flex-1 text-center px-3 py-2 rounded-lg bg-emerald-50 text-primary hover:bg-emerald-100 text-sm font-medium transition"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(fruit.id)}
                    className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
