import { useState, useEffect } from 'react';
import { navigate } from '../App';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface Ebook {
  ebook_id: string;
  title: string;
  slug: string;
  description?: string;
  recipe_count: number;
  status: string;
  cover_image_url?: string;
  created_at: string;
}

export function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRecipesModal, setShowRecipesModal] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [ebookRecipes, setEbookRecipes] = useState<any[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [editForm, setEditForm] = useState({ 
    title: '', 
    description: '', 
    cover_image_url: '' 
  });

  useEffect(() => {
    loadEbooks();
  }, []);

  const loadEbooks = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_URL}/api/admin/ebooks`, {
        headers: { 'Authorization': `Bearer ${token}` }
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

  const loadEbookRecipes = async (ebookId: string) => {
    const token = localStorage.getItem('auth_token');
    setLoadingRecipes(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/ebooks/${ebookId}/recipes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const recipes = await response.json();
        setEbookRecipes(recipes);
      }
    } catch (err) {
      console.error('Failed to load ebook recipes:', err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleEdit = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setEditForm({
      title: ebook.title,
      description: ebook.description || '',
      cover_image_url: ebook.cover_image_url || ''
    });
    setShowEditModal(true);
  };

  const handleViewRecipes = async (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setShowRecipesModal(true);
    await loadEbookRecipes(ebook.ebook_id);
  };

  const saveEdit = async () => {
    if (!selectedEbook) return;
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`${API_URL}/api/admin/ebooks/${selectedEbook.ebook_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        alert('✅ Ebook updated successfully!');
        setShowEditModal(false);
        loadEbooks();
      } else {
        alert('❌ Failed to update ebook');
      }
    } catch (err) {
      console.error('Failed to update ebook:', err);
      alert('❌ Error updating ebook');
    }
  };

  const handleGenerateAll = async () => {
    if (!confirm('Generate all ebooks? This will create 115+ recipes.')) return;
    
    setGenerating(true);
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`${API_URL}/api/admin/ebooks/generate-all`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Ebook generation started! Refresh in a moment.');
        loadEbooks();
      } else {
        alert('❌ Failed to start generation');
      }
    } catch (err) {
      console.error('Failed to generate ebooks:', err);
      alert('❌ Error generating ebooks');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-caribbean-green"></div>
          <p className="mt-4 text-gray-600">Loading ebooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-caribbean-green hover:underline text-sm mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">📚 Ebook Management</h1>
            <p className="text-gray-600 mt-1">Manage recipe ebooks and collections</p>
          </div>
          <button
            onClick={handleGenerateAll}
            disabled={generating}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
          >
            {generating ? '⏳ Generating...' : '🔄 Generate All Ebooks'}
          </button>
        </div>

        {/* Ebooks Grid */}
        {ebooks.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <span className="text-6xl block mb-4">📚</span>
            <h2 className="text-xl font-bold mb-2">No Ebooks Yet</h2>
            <p className="text-gray-600 mb-6">Generate your first ebook collection</p>
            <button
              onClick={handleGenerateAll}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Generate Ebooks
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {ebooks.map(ebook => (
              <div key={ebook.ebook_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Cover Image */}
                {ebook.cover_image_url && (
                  <div className="aspect-[16/9] bg-gray-100">
                    <img
                      src={ebook.cover_image_url}
                      alt={ebook.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{ebook.title}</h3>
                      {ebook.description && (
                        <p className="text-gray-600 text-sm mb-3">{ebook.description}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                      ebook.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {ebook.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>📖 {ebook.recipe_count} recipes</span>
                    <span className="text-gray-400">•</span>
                    <span>🗓️ {new Date(ebook.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewRecipes(ebook)}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      👁️ View Recipes
                    </button>
                    <button
                      onClick={() => handleEdit(ebook)}
                      className="flex-1 bg-purple-50 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedEbook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Edit Ebook</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={editForm.cover_image_url}
                    onChange={(e) => setEditForm({...editForm, cover_image_url: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveEdit}
                  className="flex-1 bg-caribbean-green text-white py-2 rounded-lg hover:bg-caribbean-green/90"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recipes Modal */}
        {showRecipesModal && selectedEbook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recipes in {selectedEbook.title}</h2>
                <button
                  onClick={() => setShowRecipesModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {loadingRecipes ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-caribbean-green"></div>
                  <p className="mt-2 text-gray-600">Loading recipes...</p>
                </div>
              ) : ebookRecipes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No recipes found in this ebook</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ebookRecipes.map((recipe, index) => (
                    <div key={recipe.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="text-sm font-bold text-gray-500 mr-2">#{index + 1}</span>
                          <span className="font-bold text-gray-900">{recipe.title}</span>
                        </div>
                        <a
                          href={`/recipes/${recipe.slug}`}
                          target="_blank"
                          className="text-caribbean-green hover:underline text-sm"
                        >
                          View →
                        </a>
                      </div>
                      {recipe.description && (
                        <p className="text-gray-600 text-sm mt-1 ml-8">{recipe.description}</p>
                      )}
                      <div className="flex gap-3 text-xs text-gray-500 mt-2 ml-8">
                        <span>⏱️ {recipe.prep_time}</span>
                        <span>🔥 {recipe.cook_time}</span>
                        <span>👥 {recipe.servings} servings</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowRecipesModal(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
