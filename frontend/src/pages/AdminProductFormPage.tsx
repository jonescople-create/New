import { useState, useEffect } from 'react';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface Product {
  id: string;
  title: string;
  slug: string;
  category: 'ebook' | 'recipe-pack' | 'printable';
  price: number;
  short_description: string;
  long_description: string;
  cover_image: string;
  table_of_contents: string[];
  features: string[];
  page_count: number;
  file_format: string;
  file_size: string;
  download_url: string;
  related_fruits: string[];
  seo_title: string;
  seo_description: string;
  is_featured: boolean;
  created_at: string;
}

interface Props {
  productId?: string;
}

export function AdminProductFormPage({ productId }: Props) {
  const isEdit = !!productId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Product>({
    id: '',
    title: '',
    slug: '',
    category: 'ebook',
    price: 0,
    short_description: '',
    long_description: '',
    cover_image: '',
    table_of_contents: [''],
    features: [''],
    page_count: 0,
    file_format: 'PDF',
    file_size: '',
    download_url: '',
    related_fruits: [''],
    seo_title: '',
    seo_description: '',
    is_featured: false,
    created_at: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    checkAuth();
    if (isEdit) loadProduct();
  }, [productId]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) window.location.href = '/admin/login';
  };

  const loadProduct = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/products/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to load product');
      const data = await response.json();
      setFormData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_token');
      const url = isEdit ? `${API_URL}/api/admin/products/${productId}` : `${API_URL}/api/admin/products`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to save product');
      }

      alert(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
      window.location.href = '/admin/products';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Array helpers for future form fields (table_of_contents, features, related_fruits)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // @ts-expect-error - Reserved for upcoming array field UI
  const handleArrayChange = (field: 'table_of_contents' | 'features' | 'related_fruits', index: number, value: string) => {
    const array = [...formData[field]];
    array[index] = value;
    setFormData({ ...formData, [field]: array });
  };

  // @ts-expect-error - Reserved for upcoming array field UI
  const addArrayItem = (field: 'table_of_contents' | 'features' | 'related_fruits') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  // @ts-expect-error - Reserved for upcoming array field UI
  const removeArrayItem = (field: 'table_of_contents' | 'features' | 'related_fruits', index: number) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-caribbean-green"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <a href="/admin/products" className="text-caribbean-green hover:text-leaf">← Back to Products</a>
            <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit' : 'Add New'} Product</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product ID *</label>
                <input type="text" required disabled={isEdit} value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-caribbean-green" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-caribbean-green">
                  <option value="ebook">Ebook</option>
                  <option value="recipe-pack">Recipe Pack</option>
                  <option value="printable">Printable</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-caribbean-green" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input type="text" required value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-caribbean-green" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                <input type="number" required value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-caribbean-green" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL *</label>
                <input type="text" required value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-caribbean-green" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input type="checkbox" id="featured" checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Product</label>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold mb-4">Descriptions</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <textarea required value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-caribbean-green" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Long Description *</label>
                <textarea required value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-caribbean-green" rows={8} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button type="submit" disabled={saving}
              className="flex-1 bg-caribbean-green text-white py-3 rounded-lg hover:bg-leaf transition-colors font-medium disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <a href="/admin/products"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
}
