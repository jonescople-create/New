import { useState, useEffect } from 'react';
import { navigate } from '../App';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface Bundle {
  bundle_id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discount_percentage: number;
  status: string;
  product_count?: number;
  created_at: string;
}

export function AdminBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    discount_percentage: 0,
    product_ids: [] as string[]
  });

  useEffect(() => {
    loadBundles();
    loadProducts();
  }, []);

  const loadBundles = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${API_URL}/api/admin/bundles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBundles(data);
      }
    } catch (err) {
      console.error('Failed to load bundles:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        setProducts(await response.json());
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`${API_URL}/api/admin/bundles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('✅ Bundle created successfully!');
        setShowCreateModal(false);
        setFormData({
          title: '',
          slug: '',
          description: '',
          price: 0,
          discount_percentage: 0,
          product_ids: []
        });
        loadBundles();
      } else {
        alert('❌ Failed to create bundle');
      }
    } catch (err) {
      console.error('Failed to create bundle:', err);
      alert('❌ Error creating bundle');
    }
  };

  const toggleProductSelection = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter(id => id !== productId)
        : [...prev.product_ids, productId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-caribbean-green"></div>
          <p className="mt-4 text-gray-600">Loading bundles...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">🎁 Product Bundles</h1>
            <p className="text-gray-600 mt-1">Create and manage product bundles</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-caribbean-green text-white px-6 py-3 rounded-lg hover:bg-caribbean-green/90 transition-colors font-medium"
          >
            + Create Bundle
          </button>
        </div>

        {/* Bundles List */}
        {bundles.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <span className="text-6xl block mb-4">🎁</span>
            <h2 className="text-xl font-bold mb-2">No Bundles Yet</h2>
            <p className="text-gray-600 mb-6">Create your first product bundle to offer deals</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-caribbean-green text-white px-6 py-3 rounded-lg hover:bg-caribbean-green/90 transition-colors"
            >
              Create First Bundle
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bundles.map(bundle => (
              <div key={bundle.bundle_id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{bundle.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        bundle.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {bundle.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{bundle.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-gray-700">
                        💰 <strong>${bundle.price}</strong>
                      </span>
                      {bundle.discount_percentage > 0 && (
                        <span className="text-green-600">
                          🏷️ {bundle.discount_percentage}% OFF
                        </span>
                      )}
                      <span className="text-gray-500">
                        📦 {bundle.product_count || 0} products
                      </span>
                      <span className="text-gray-400 text-xs">
                        Created: {new Date(bundle.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm">
                      Edit
                    </button>
                    <button className="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">Create New Bundle</h2>
              <form onSubmit={handleCreate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Bundle Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Discount (%)</label>
                      <input
                        type="number"
                        value={formData.discount_percentage}
                        onChange={(e) => setFormData({...formData, discount_percentage: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Products</label>
                    <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                      {products.map(product => (
                        <label key={product.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.product_ids.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="rounded"
                          />
                          <span className="text-sm">{product.title} (${product.price})</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {formData.product_ids.length} products
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-caribbean-green text-white py-2 rounded-lg hover:bg-caribbean-green/90"
                  >
                    Create Bundle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
