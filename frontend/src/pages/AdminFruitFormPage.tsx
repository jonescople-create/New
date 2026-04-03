import { useState, useEffect, FormEvent } from 'react';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface LeafMedicine {
  has_leaf_use: boolean;
  leaf_name: string;
  traditional_uses: string[];
  preparation: string;
  safety_warnings: string[];
  disclaimer: string;
}

interface FruitFormData {
  id: string;
  name: string;
  scientific_name: string;
  slug: string;
  description: string;
  nutrition: string;
  health_benefits: string[];
  seasonality: string;
  origin: string;
  image_url: string;
  category: string[];
  how_to_eat: string;
  storage: string;
  color: string;
  emoji: string;
  related_fruit_ids: string[];
  views: number;
  leaf_medicine?: LeafMedicine;
}

export function AdminFruitFormPage({ fruitId }: { fruitId?: string }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [hasLeafMedicine, setHasLeafMedicine] = useState(false);

  const [formData, setFormData] = useState<FruitFormData>({
    id: '',
    name: '',
    scientific_name: '',
    slug: '',
    description: '',
    nutrition: '',
    health_benefits: [''],
    seasonality: '',
    origin: '',
    image_url: '',
    category: [],
    how_to_eat: '',
    storage: '',
    color: '#FFD700',
    emoji: '🍎',
    related_fruit_ids: [],
    views: 0,
  });

  const isEditMode = !!fruitId;

  useEffect(() => {
    checkAuth();
    if (isEditMode) {
      loadFruit();
    } else {
      generateNewId();
    }
  }, [fruitId]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  };

  const generateNewId = () => {
    const timestamp = Date.now().toString().slice(-2);
    setFormData(prev => ({ ...prev, id: `${27 + parseInt(timestamp) % 10}` }));
  };

  const loadFruit = async () => {
    if (!fruitId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/fruits/${fruitId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to load fruit');

      const data = await response.json();
      setFormData(data);
      setImagePreview(data.image_url);
      setHasLeafMedicine(!!data.leaf_medicine);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleArrayFieldChange = (field: 'health_benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddArrayField = (field: 'health_benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveArrayField = (field: 'health_benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_token');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch(`${API_URL}/api/admin/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to upload image');
      }

      setFormData(prev => ({ ...prev, image_url: data.image_url }));
      setImagePreview(data.image_url);
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setImagePreview('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!formData.name || !formData.slug || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.health_benefits.filter(i => i.trim()).length === 0) {
        throw new Error('Please add at least one health benefit');
      }

      const cleanedData = {
        ...formData,
        health_benefits: formData.health_benefits.filter(i => i.trim()),
        leaf_medicine: hasLeafMedicine ? formData.leaf_medicine : undefined,
      };

      const token = localStorage.getItem('admin_token');
      const url = isEditMode
        ? `${API_URL}/api/admin/fruits/${fruitId}`
        : `${API_URL}/api/admin/fruits`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to save fruit');
      }

      setSuccess(isEditMode ? 'Fruit updated successfully!' : 'Fruit created successfully!');

      setTimeout(() => {
        window.location.href = '/admin/fruits';
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
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
          <p className="text-gray-600">Loading fruit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin/fruits" className="text-primary hover:underline text-sm">
              ← Back to Fruits
            </a>
            <h1 className="text-2xl font-bold text-charcoal">
              {isEditMode ? 'Edit Fruit' : 'Add New Fruit'}
            </h1>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700 font-medium">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Fruit ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    disabled={isEditMode}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Emoji <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-2xl text-center"
                    placeholder="🍎"
                    maxLength={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Color Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="#FFD700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Fruit Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Mango"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Scientific Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.scientific_name}
                    onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Mangifera indica"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                  placeholder="Detailed description of the fruit..."
                  required
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Fruit Image <span className="text-red-500">*</span>
                </label>

                {imagePreview && (
                  <div className="mb-4 relative">
                    <img
                      src={imagePreview}
                      alt="Fruit preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="mb-3">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="image-upload"
                    />
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="image-upload"
                        className={`cursor-pointer px-4 py-2 rounded-lg border-2 border-dashed transition ${
                          uploading
                            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                            : 'border-primary hover:border-primary-dark bg-emerald-50'
                        }`}
                      >
                        <span className="text-sm font-medium text-primary">
                          {uploading ? '📤 Uploading...' : '📁 Upload Image'}
                        </span>
                      </label>
                      {uploading && (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin text-xl">⏳</div>
                          <span className="text-sm text-gray-600">Processing...</span>
                        </div>
                      )}
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Max 5MB • Supports JPG, PNG, WebP</p>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="text-xs text-gray-500 px-2">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => {
                      setFormData({ ...formData, image_url: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Paste image URL here"
                    required={!imagePreview}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition & Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">Nutrition & Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Nutrition Information <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.nutrition}
                  onChange={(e) => setFormData({ ...formData, nutrition: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                  placeholder="Rich in vitamin C, fiber, and antioxidants..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Seasonality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.seasonality}
                    onChange={(e) => setFormData({ ...formData, seasonality: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., June–September"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Origin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., South Asia"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  How to Eat <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.how_to_eat}
                  onChange={(e) => setFormData({ ...formData, how_to_eat: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Peel and eat fresh, add to smoothies..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Storage <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                  placeholder="Store at room temperature until ripe..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Categories (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.category.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    category: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., popular, medicinal, exotic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Related Fruit IDs (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.related_fruit_ids.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    related_fruit_ids: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 1, 5, 10"
                />
              </div>
            </div>
          </div>

          {/* Health Benefits Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal">
                Health Benefits <span className="text-red-500">*</span>
              </h2>
              <button
                type="button"
                onClick={() => handleAddArrayField('health_benefits')}
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                + Add Benefit
              </button>
            </div>

            <div className="space-y-3">
              {formData.health_benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayFieldChange('health_benefits', index, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={`Health benefit ${index + 1}`}
                  />
                  {formData.health_benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayField('health_benefits', index)}
                      className="text-red-600 hover:text-red-700 px-3"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <a
              href="/admin/fruits"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : isEditMode ? 'Update Fruit' : 'Create Fruit'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
