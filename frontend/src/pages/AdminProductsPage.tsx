import { useState, useEffect } from 'react';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface Product {
  id: string;
  title: string;
  slug: string;
  category: 'ebook' | 'recipe-pack' | 'printable';
  price: number;
  short_description: string;
  cover_image: string;
  is_featured: boolean;
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAuth();
    loadProducts();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  };

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load products');
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete product');
      loadProducts();
      alert('Product deleted successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-caribbean-green"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/admin" className="text-caribbean-green hover:text-leaf">
                ← Dashboard
              </a>
              <h1 className="text-2xl font-bold text-gray-900">Store Products</h1>
            </div>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            {error}
          </div>
        )}

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean-green focus:border-caribbean-green"
            />
          </div>
          <a
            href="/admin/products/new"
            className="bg-caribbean-green text-white px-6 py-2 rounded-lg hover:bg-leaf transition-colors font-medium"
          >
            + Add New Product
          </a>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600 mb-1">Total Products</div>
            <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600 mb-1">Ebooks</div>
            <div className="text-2xl font-bold text-blue-600">
              {products.filter(p => p.category === 'ebook').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600 mb-1">Recipe Packs</div>
            <div className="text-2xl font-bold text-orange-600">
              {products.filter(p => p.category === 'recipe-pack').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600 mb-1">Printables</div>
            <div className="text-2xl font-bold text-purple-600">
              {products.filter(p => p.category === 'printable').length}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border hover:border-caribbean-green transition-colors">
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Cover Image */}
                  <div className="w-24 h-36 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={product.cover_image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{product.title}</h3>
                      {product.is_featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          ⭐ Featured
                        </span>
                      )}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {product.category === 'recipe-pack' ? 'Recipe Pack' : product.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{product.short_description.substring(0, 150)}...</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="font-bold text-caribbean-green text-lg">${product.price}</span>
                      <span>ID: {product.id}</span>
                      <span>•</span>
                      <span>Slug: {product.slug}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`/admin/products/${product.id}`}
                      className="px-4 py-2 text-caribbean-green border border-caribbean-green rounded-lg hover:bg-caribbean-green hover:text-white transition-colors"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-600">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}