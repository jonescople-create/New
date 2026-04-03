import { useState, useEffect, FormEvent } from 'react';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface RecipeFormData {
  id: string;
  title: string;
  slug: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  related_fruit_ids: string[];
  image_url: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  difficulty: string;
}

export function AdminRecipeFormPage({ recipeId }: { recipeId?: string }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState<RecipeFormData>({
    id: '',
    title: '',
    slug: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    related_fruit_ids: [],
    image_url: '',
    prep_time: '',
    cook_time: '',
    servings: 1,
    difficulty: 'Easy',
  });

  const isEditMode = !!recipeId;

  useEffect(() => {
    checkAuth();
    if (isEditMode) {
      loadRecipe();
    } else {
      // Generate new ID for create mode
      generateNewId();
    }
  }, [recipeId]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  };

  const generateNewId = () => {
    // Generate next recipe ID (r23, r24, etc.)
    const timestamp = Date.now().toString().slice(-4);
    setFormData(prev => ({ ...prev, id: `r${timestamp}` }));
  };

  const loadRecipe = async () => {
    if (!recipeId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/recipes/${recipeId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to load recipe');

      const data = await response.json();
      setFormData(data);
      setImagePreview(data.image_url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleAddField = (field: 'ingredients' | 'instructions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveField = (field: 'ingredients' | 'instructions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleFieldChange = (
    field: 'ingredients' | 'instructions',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/admin/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to upload image');
      }

      // Update form with uploaded image URL
      setFormData(prev => ({ ...prev, image_url: data.image_url }));
      setImagePreview(data.image_url);
      setSuccess('Image uploaded successfully!');
      
      // Clear success message after 3 seconds
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
      // Validation
      if (!formData.title || !formData.slug || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.ingredients.filter(i => i.trim()).length === 0) {
        throw new Error('Please add at least one ingredient');
      }

      if (formData.instructions.filter(i => i.trim()).length === 0) {
        throw new Error('Please add at least one instruction');
      }

      // Clean up empty fields
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter(i => i.trim()),
        instructions: formData.instructions.filter(i => i.trim()),
      };

      const token = localStorage.getItem('admin_token');
      const url = isEditMode
        ? `${API_URL}/api/admin/recipes/${recipeId}`
        : `${API_URL}/api/admin/recipes`;
      
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
        throw new Error(data.detail || 'Failed to save recipe');
      }

      setSuccess(isEditMode ? 'Recipe updated successfully!' : 'Recipe created successfully!');
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        window.location.href = '/admin/recipes';
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
          <p className="text-gray-600">Loading recipe...</p>
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
            <a href="/admin/recipes" className="text-primary hover:underline text-sm">
              ← Back to Recipes
            </a>
            <h1 className="text-2xl font-bold text-charcoal">
              {isEditMode ? 'Edit Recipe' : 'Add New Recipe'}
            </h1>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Recipe ID <span className="text-red-500">*</span>
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
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-generated from title</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Recipe Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Jamaican Jerk Chicken"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="A short description of the recipe..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Recipe Image <span className="text-red-500">*</span>
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 relative">
                    <img
                      src={imagePreview}
                      alt="Recipe preview"
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

                {/* Upload Button */}
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
                  <p className="text-xs text-gray-500 mt-2">
                    Max 5MB • Supports JPG, PNG, WebP
                  </p>
                </div>

                {/* Manual URL Input */}
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
                  <p className="text-xs text-gray-500 mt-1">
                    Paste full URL or path starting with /recipe-images/
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">Recipe Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Prep Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.prep_time}
                  onChange={(e) => setFormData({ ...formData, prep_time: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 15 min"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Cook Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cook_time}
                  onChange={(e) => setFormData({ ...formData, cook_time: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 30 min"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Servings <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
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

          {/* Ingredients Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal">
                Ingredients <span className="text-red-500">*</span>
              </h2>
              <button
                type="button"
                onClick={() => handleAddField('ingredients')}
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                + Add Ingredient
              </button>
            </div>

            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleFieldChange('ingredients', index, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField('ingredients', index)}
                      className="text-red-600 hover:text-red-700 px-3"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-charcoal">
                Instructions <span className="text-red-500">*</span>
              </h2>
              <button
                type="button"
                onClick={() => handleAddField('instructions')}
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                + Add Step
              </button>
            </div>

            <div className="space-y-3">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-gray-500 font-medium pt-2 min-w-[30px]">{index + 1}.</span>
                  <textarea
                    value={instruction}
                    onChange={(e) => handleFieldChange('instructions', index, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={2}
                    placeholder={`Step ${index + 1}`}
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField('instructions', index)}
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
              href="/admin/recipes"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : isEditMode ? 'Update Recipe' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
