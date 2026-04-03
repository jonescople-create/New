import { useState, useEffect } from 'react';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface Recipe {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  difficulty: string;
  description: string;
}

export function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
    loadRecipes();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  };

  const loadRecipes = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/recipes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      // Reload recipes
      loadRecipes();
      alert('Recipe deleted successfully!');
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
          <p className="text-gray-600">Loading recipes...</p>
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
            <h1 className="text-2xl font-bold text-charcoal">Manage Recipes</h1>
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
            <h2 className="text-xl font-semibold text-charcoal">All Recipes ({recipes.length})</h2>
            <p className="text-gray-600 text-sm">View and manage your recipe collection</p>
          </div>
          <a
            href="/admin/recipes/new"
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            + Add New Recipe
          </a>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Recipes Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Recipe
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recipes.map((recipe) => (
                  <tr key={recipe.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={recipe.image_url}
                          alt={recipe.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-charcoal">{recipe.title}</p>
                          <p className="text-sm text-gray-500">ID: {recipe.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <p>⏱️ Prep: {recipe.prep_time} | Cook: {recipe.cook_time}</p>
                        <p>🍽️ Servings: {recipe.servings}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {recipe.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <a
                        href={`/recipes/${recipe.slug}`}
                        target="_blank"
                        className="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </a>
                      <a
                        href={`/admin/recipes/edit/${recipe.id}`}
                        className="inline-block text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
