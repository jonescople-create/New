import { useState, useEffect } from 'react';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface MedicinalLeaf {
  leaf_id: string;
  common_name: string;
  local_names: string[];
  scientific_name: string;
  plant_part_used: string;
  traditional_uses: string[];
  preparation_methods: Array<{
    method: string;
    instructions: string;
    heat_required: boolean;
    allowed_with: string[];
  }>;
  flavor_profile: string;
  contraindications: string[];
  pregnancy_warning: boolean;
  interaction_flags: string[];
  image_id: string | null;
  source_notes: string;
  slug: string;
  fruit_id: string;
  seo_title: string;
  seo_description: string;
  disclaimer: string;
}

interface Props {
  leafId?: string;
}

export function AdminLeafFormPage({ leafId }: Props) {
  const isEdit = !!leafId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<MedicinalLeaf>({
    leaf_id: '',
    common_name: '',
    local_names: [],
    scientific_name: '',
    plant_part_used: 'Leaves',
    traditional_uses: [''],
    preparation_methods: [{
      method: '',
      instructions: '',
      heat_required: true,
      allowed_with: ['tea']
    }],
    flavor_profile: '',
    contraindications: [''],
    pregnancy_warning: false,
    interaction_flags: [''],
    image_id: null,
    source_notes: '',
    slug: '',
    fruit_id: '',
    seo_title: '',
    seo_description: '',
    disclaimer: 'This information documents traditional folk medicine practices and is NOT medical advice. Consult a healthcare provider before use.'
  });

  useEffect(() => {
    checkAuth();
    if (isEdit) {
      loadLeaf();
    }
  }, [leafId]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  };

  const loadLeaf = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/leaves/${leafId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load leaf');
      }

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
      const url = isEdit
        ? `${API_URL}/api/admin/leaves/${leafId}`
        : `${API_URL}/api/admin/leaves`;
      
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
        throw new Error(data.detail || 'Failed to save leaf');
      }

      alert(`Medicinal leaf ${isEdit ? 'updated' : 'created'} successfully!`);
      window.location.href = '/admin/leaves';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleArrayChange = (field: keyof MedicinalLeaf, index: number, value: string) => {
    const array = formData[field] as string[];
    const newArray = [...array];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: keyof MedicinalLeaf) => {
    const array = formData[field] as string[];
    setFormData({ ...formData, [field]: [...array, ''] });
  };

  const removeArrayItem = (field: keyof MedicinalLeaf, index: number) => {
    const array = formData[field] as string[];
    setFormData({ ...formData, [field]: array.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-leaf"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <a href="/admin/leaves" className="text-leaf hover:text-leaf-dark">
              ← Back to Leaves
            </a>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit' : 'Add New'} Medicinal Leaf
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leaf ID * {!isEdit && <span className="text-xs text-gray-500">(e.g., leaf-40)</span>}
                </label>
                <input
                  type="text"
                  required
                  disabled={isEdit}
                  value={formData.leaf_id}
                  onChange={(e) => setFormData({ ...formData, leaf_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leaf"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Common Name *</label>
                <input
                  type="text"
                  required
                  value={formData.common_name}
                  onChange={(e) => setFormData({ ...formData, common_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leaf"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scientific Name *</label>
                <input
                  type="text"
                  required
                  value={formData.scientific_name}
                  onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leaf"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leaf"
                  placeholder="soursop-leaf"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fruit ID *</label>
                <input
                  type="text"
                  required
                  value={formData.fruit_id}
                  onChange={(e) => setFormData({ ...formData, fruit_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leaf"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plant Part Used</label>
                <input
                  type="text"
                  value={formData.plant_part_used}
                  onChange={(e) => setFormData({ ...formData, plant_part_used: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leaf"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Flavor Profile</label>
              <input
                type="text"
                value={formData.flavor_profile}
                onChange={(e) => setFormData({ ...formData, flavor_profile: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leaf"
                placeholder="Bitter, earthy, slightly herbal"
              />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="pregnancy_warning"
                checked={formData.pregnancy_warning}
                onChange={(e) => setFormData({ ...formData, pregnancy_warning: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="pregnancy_warning" className="text-sm font-medium text-gray-700">
                Pregnancy Warning
              </label>
            </div>
          </div>

          {/* Traditional Uses */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold mb-4">Traditional Uses</h2>
            {formData.traditional_uses.map((use, index) => (
              <div key={index} className="mb-3 flex gap-2">
                <textarea
                  value={use}
                  onChange={(e) => handleArrayChange('traditional_uses', index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leaf"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('traditional_uses', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('traditional_uses')}
              className="text-leaf hover:text-leaf-dark font-medium"
            >
              + Add Use
            </button>
          </div>

          {/* Contraindications */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold mb-4">Contraindications</h2>
            {formData.contraindications.map((contra, index) => (
              <div key={index} className="mb-3 flex gap-2">
                <input
                  type="text"
                  value={contra}
                  onChange={(e) => handleArrayChange('contraindications', index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leaf"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('contraindications', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('contraindications')}
              className="text-leaf hover:text-leaf-dark font-medium"
            >
              + Add Contraindication
            </button>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-bold mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leaf"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leaf"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-leaf text-white py-3 rounded-lg hover:bg-leaf-dark transition-colors font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Leaf' : 'Create Leaf'}
            </button>
            <a
              href="/admin/leaves"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}