import { useState, useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';
import { navigate } from '../App';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface Ebook {
  ebook_id: string;
  title: string;
  subtitle: string;
  category: string;
  recipe_count: number;
  page_count: number;
  price: number;
  status: string;
  created_at: string;
}

export function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    setupPageSEO({
      title: 'Ebook Management | Admin Panel',
      description: 'Manage and generate tropical fruit ebooks',
      path: '/admin/ebooks'
    });
    loadEbooks();
  }, []);

  const loadEbooks = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/ebooks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEbooks(data);
      }
    } catch (err) {
      console.error('Failed to load ebooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateEbook = async (themeKey: string, autoPublish: boolean = false) => {
    if (!confirm(`Generate "${themeKey}" ebook? This will create 25-35 new recipes.`)) {
      return;
    }

    setGenerating(themeKey);
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/ebooks/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          theme_key: themeKey,
          auto_publish: autoPublish
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Success!\n\n${result.message}\n\nCreated ${result.recipes_created} recipes!`);
        loadEbooks();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.detail}`);
      }
    } catch (err) {
      alert(`❌ Generation failed: ${err}`);
    } finally {
      setGenerating(null);
    }
  };

  const ebookThemes = [
    {
      key: 'gym-energy',
      title: 'Tropical Gym Energy Recipes',
      description: '30 recipes for workout fuel and recovery',
      icon: '💪',
      color: 'from-red-400 to-orange-500'
    },
    {
      key: 'fat-loss',
      title: 'Caribbean Smoothies for Fat Loss',
      description: '28 metabolism-boosting smoothie recipes',
      icon: '🥤',
      color: 'from-green-400 to-teal-500'
    },
    {
      key: 'healing-drinks',
      title: 'Tropical Superfruit Healing Drinks',
      description: '32 immunity and healing recipes',
      icon: '🌿',
      color: 'from-emerald-400 to-green-600'
    },
    {
      key: 'preworkout',
      title: 'Island Pre-Workout Natural Drinks',
      description: '25 pre-workout energy recipes',
      icon: '⚡',
      color: 'from-yellow-400 to-amber-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/admin')}
                className="text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                ← Back to Admin Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">📚 Ebook Management</h1>
              <p className="text-gray-600">Automated Tropical Fruit Recipe Ebook Generation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Ebook Generation Templates */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🎨 Generate New Ebook</h2>
          <p className="text-gray-600 mb-6">
            Click a theme below to automatically generate a complete ebook with 25-35 recipes, intro, conclusion, and nutritional information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ebookThemes.map((theme) => {
              const alreadyExists = ebooks.some(e => e.title.includes(theme.title.split(' ')[0]));
              const isGenerating = generating === theme.key;

              return (
                <div
                  key={theme.key}
                  className={`border-2 rounded-xl p-6 ${
                    alreadyExists ? 'border-gray-300 bg-gray-50' : 'border-caribbean-green hover:border-caribbean-green/70'
                  }`}
                >
                  <div className={`text-4xl mb-3 bg-gradient-to-br ${theme.color} w-16 h-16 rounded-full flex items-center justify-center`}>
                    {theme.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{theme.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{theme.description}</p>

                  {alreadyExists ? (
                    <div className="text-green-600 font-medium">✓ Already Generated</div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => generateEbook(theme.key, false)}
                        disabled={isGenerating}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                      >
                        {isGenerating ? 'Generating...' : 'Generate Draft'}
                      </button>
                      <button
                        onClick={() => generateEbook(theme.key, true)}
                        disabled={isGenerating}
                        className="flex-1 bg-caribbean-green text-white py-2 px-4 rounded-lg hover:bg-caribbean-green/90 disabled:opacity-50"
                      >
                        {isGenerating ? 'Generating...' : 'Generate & Publish'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Existing Ebooks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">📖 Generated Ebooks</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-caribbean-green"></div>
              <p className="mt-4 text-gray-600">Loading ebooks...</p>
            </div>
          ) : ebooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-600 text-lg">No ebooks generated yet.</p>
              <p className="text-gray-500 text-sm mt-2">Use the templates above to create your first ebook!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ebooks.map((ebook) => (
                <div
                  key={ebook.ebook_id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-caribbean-green transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{ebook.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ebook.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : ebook.status === 'generating'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {ebook.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{ebook.subtitle}</p>
                      <div className="flex gap-6 text-sm text-gray-600">
                        <span>📖 {ebook.recipe_count} recipes</span>
                        <span>📄 {ebook.page_count} pages</span>
                        <span>💰 ${ebook.price}</span>
                        <span>🏷️ {ebook.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/ebooks/${ebook.ebook_id}`)}
                        className="px-4 py-2 bg-caribbean-green text-white rounded-lg hover:bg-caribbean-green/90"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
