import { useState, useEffect } from 'react';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface MedicinalLeaf {
  leaf_id: string;
  common_name: string;
  scientific_name: string;
  slug: string;
  fruit_id: string;
  traditional_uses: string[];
  pregnancy_warning: boolean;
}

export function AdminLeavesPage() {
  const [leaves, setLeaves] = useState<MedicinalLeaf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAuth();
    loadLeaves();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  };

  const loadLeaves = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/leaves`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load medicinal leaves');
      }

      const data = await response.json();
      setLeaves(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (leafId: string) => {
    if (!confirm('Are you sure you want to delete this medicinal leaf?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/leaves/${leafId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete leaf');
      }

      loadLeaves();
      alert('Medicinal leaf deleted successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  const filteredLeaves = leaves.filter(leaf =>
    leaf.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leaf.scientific_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-leaf"></div>
          <p className="mt-4 text-gray-600">Loading medicinal leaves...</p>
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
              <a href="/admin/dashboard" className="text-leaf hover:text-leaf-dark">
                ← Dashboard
              </a>
              <h1 className="text-2xl font-bold text-gray-900">Medicinal Leaves</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-medium"
            >
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
              placeholder="Search leaves..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf focus:border-leaf"
            />
          </div>
          <a
            href="/admin/leaves/new"
            className="bg-leaf text-white px-6 py-2 rounded-lg hover:bg-leaf-dark transition-colors font-medium"
          >
            + Add New Leaf
          </a>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600">Total Leaves</div>
            <div className="text-2xl font-bold text-gray-900">{leaves.length}</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600">With Pregnancy Warning</div>
            <div className="text-2xl font-bold text-amber-600">
              {leaves.filter(l => l.pregnancy_warning).length}
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600">Filtered Results</div>
            <div className="text-2xl font-bold text-leaf">{filteredLeaves.length}</div>
          </div>
        </div>

        {/* Leaves Grid */}
        <div className="grid gap-4">
          {filteredLeaves.map((leaf) => (
            <div
              key={leaf.leaf_id}
              className="bg-white rounded-lg border hover:border-leaf transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{leaf.common_name}</h3>
                      {leaf.pregnancy_warning && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          ⚠️ Pregnancy Warning
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 italic mb-3">{leaf.scientific_name}</p>
                    <div className="text-sm text-gray-700 mb-3">
                      <span className="font-medium">Uses:</span> {leaf.traditional_uses[0]?.substring(0, 120)}...
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>ID: {leaf.leaf_id}</span>
                      <span>•</span>
                      <span>Slug: {leaf.slug}</span>
                      <span>•</span>
                      <span>Fruit ID: {leaf.fruit_id}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <a
                      href={`/admin/leaves/${leaf.leaf_id}`}
                      className="px-4 py-2 text-leaf border border-leaf rounded-lg hover:bg-leaf hover:text-white transition-colors"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDelete(leaf.leaf_id)}
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

        {filteredLeaves.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-600">No medicinal leaves found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}