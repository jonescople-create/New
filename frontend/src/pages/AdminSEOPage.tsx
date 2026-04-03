import { useState } from 'react';

const API_URL = (import.meta as ImportMeta & { env: Record<string,string> }).env.VITE_API_URL || 'http://localhost:5000';

interface Sitemaps {
  'sitemap.xml'?: string;
  'sitemap-main.xml'?: string;
  'sitemap-fruits.xml'?: string;
  'sitemap-recipes.xml'?: string;
  'sitemap-images.xml'?: string;
  [key: string]: string | undefined;
}

export function AdminSEOPage() {
  const [generating, setGenerating] = useState(false);
  const [sitemaps, setSitemaps] = useState<Sitemaps | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerateSitemaps = async () => {
    setGenerating(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/seo/generate-sitemaps`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to generate sitemaps');

      const data = await response.json();
      setSitemaps(data.sitemaps);
      setSuccess('✅ All sitemaps generated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const downloadSitemap = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-primary hover:underline text-sm">
              ← Dashboard
            </a>
            <h1 className="text-2xl font-bold text-charcoal">SEO & Sitemaps</h1>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700 font-medium">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-charcoal mb-4">
            🗺️ Sitemap Generator (Phase 7B)
          </h2>
          <p className="text-gray-700 mb-6">
            Generate XML sitemaps for search engine submission. Submit to Google Search Console for better indexing.
          </p>

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

          <button
            onClick={handleGenerateSitemaps}
            disabled={generating}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? '⏳ Generating...' : '🚀 Generate All Sitemaps'}
          </button>
        </div>

        {sitemaps && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-charcoal mb-4">📥 Download Sitemaps</h3>
            <p className="text-sm text-gray-600 mb-6">
              Download each sitemap and upload to your web server's root directory.
              Then submit to Google Search Console.
            </p>

            <div className="space-y-3">
              {Object.entries(sitemaps).filter(([, c]) => c != null).map(([filename, content]) => (
                <div key={filename} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-charcoal">{filename}</p>
                    <p className="text-sm text-gray-600">
                      {(content as string).split('\n').length} lines • {((content as string).length / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => downloadSitemap(filename, content as string)}
                    className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-lg transition"
                  >
                    📥 Download
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-bold text-charcoal mb-2">📌 Next Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Download all sitemap files</li>
                <li>Upload them to your website's root directory</li>
                <li>Go to <a href="https://search.google.com/search-console" target="_blank" className="text-primary hover:underline">Google Search Console</a></li>
                <li>Submit sitemap.xml (it will auto-discover the others)</li>
                <li>Monitor indexing status in Search Console</li>
              </ol>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-charcoal mb-4">📊 SEO Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-charcoal mb-3">✅ Implemented (Phase 7 & 7A)</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Canonical URLs on all pages</li>
                <li>✓ Structured data (Recipe, Article, FAQ, Food)</li>
                <li>✓ Internal linking algorithm</li>
                <li>✓ EEAT authority pages</li>
                <li>✓ Robots.txt configured</li>
                <li>✓ AI search optimization</li>
                <li>✓ Image SEO ready</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal mb-3">🚀 Ready for Submission</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Main sitemap (8 pages)</li>
                <li>• Fruits sitemap (26 fruits)</li>
                <li>• Recipes sitemap (22 recipes)</li>
                <li>• Image sitemap (48 images)</li>
                <li>• Sitemap index (all combined)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}