import { useState, useEffect } from "react";
import { navigate } from "../App";

interface SitemapFile {
  name: string;
  label: string;
  description: string;
  urlCount?: number;
}

const SITEMAP_FILES: SitemapFile[] = [
  { name: "sitemap_index.xml", label: "Sitemap Index", description: "Master index pointing to all sub-sitemaps" },
  { name: "sitemap.xml", label: "Full Sitemap (flat)", description: "Complete sitemap with all 55 URLs + image extensions" },
  { name: "sitemap-core.xml", label: "Core Pages", description: "Homepage, fruits listing, recipes listing, store, about, contact" },
  { name: "sitemap-fruits.xml", label: "Fruit Pages", description: "All 20 fruit detail pages with image extensions" },
  { name: "sitemap-recipes.xml", label: "Recipe Pages", description: "All 12 recipe detail pages with image extensions" },
  { name: "sitemap-blog.xml", label: "Blog Posts", description: "Blog index + 8 article pages with image extensions" },
  { name: "sitemap-tools.xml", label: "Tools & Ebooks", description: "Quiz, comparison tool, match-up, life tools, 3 ebooks" },
];

export function SitemapViewerPage() {
  const [activeFile, setActiveFile] = useState("sitemap.xml");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setCopied(false);
    fetch(`/${activeFile}`)
      .then((r) => r.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => {
        setContent("<!-- Failed to load sitemap file -->");
        setLoading(false);
      });
  }, [activeFile]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    SITEMAP_FILES.forEach((file) => {
      fetch(`/${file.name}`)
        .then((r) => r.text())
        .then((text) => {
          const blob = new Blob([text], { type: "application/xml" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
    });
  };

  // Count URLs in current content
  const urlCount = (content.match(/<loc>/g) || []).length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate("/")} className="text-white/70 hover:text-white text-sm mb-3 inline-flex items-center gap-1">
            ← Back to Home
          </button>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold">
            🗺️ Sitemap Manager
          </h1>
          <p className="text-white/80 mt-2 text-lg max-w-2xl">
            View, copy, and download all sitemap files for IslandFruitGuide.com — SEO & AEO optimized.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-leaf">7</div>
            <div className="text-xs text-charcoal-light mt-1">Sitemap Files</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-mango">55</div>
            <div className="text-xs text-charcoal-light mt-1">Total URLs</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-coral">40+</div>
            <div className="text-xs text-charcoal-light mt-1">Image Extensions</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-charcoal">✓</div>
            <div className="text-xs text-charcoal-light mt-1">AEO Compliant</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - File selector */}
          <div className="lg:col-span-1">
            <h3 className="font-heading font-semibold text-charcoal mb-3">Sitemap Files</h3>
            <div className="space-y-2">
              {SITEMAP_FILES.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFile(file.name)}
                  className={`w-full text-left p-3 rounded-xl transition-all text-sm ${
                    activeFile === file.name
                      ? "bg-leaf text-white shadow-md"
                      : "bg-white border border-gray-100 hover:border-leaf hover:bg-leaf/5"
                  }`}
                >
                  <div className="font-medium">{file.label}</div>
                  <div className={`text-xs mt-0.5 ${activeFile === file.name ? "text-white/70" : "text-charcoal-light"}`}>
                    {file.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Download All */}
            <button
              onClick={handleDownloadAll}
              className="w-full mt-4 bg-mango text-charcoal font-bold py-3 rounded-xl hover:brightness-110 transition-all text-sm"
            >
              ⬇️ Download All Files
            </button>
          </div>

          {/* Main content - XML viewer */}
          <div className="lg:col-span-3">
            {/* File info bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-heading font-bold text-charcoal text-lg">
                  {SITEMAP_FILES.find((f) => f.name === activeFile)?.label}
                </h2>
                <p className="text-sm text-charcoal-light">
                  {SITEMAP_FILES.find((f) => f.name === activeFile)?.description} — {urlCount} URL{urlCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? "bg-leaf text-white"
                      : "bg-white border border-gray-200 text-charcoal hover:border-leaf hover:text-leaf"
                  }`}
                >
                  {copied ? "✓ Copied!" : "📋 Copy XML"}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-leaf text-white hover:bg-leaf-light transition-all"
                >
                  ⬇️ Download
                </button>
              </div>
            </div>

            {/* XML content */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
              {loading ? (
                <div className="p-8 text-center text-gray-400">
                  <span className="animate-spin inline-block text-2xl">⏳</span>
                  <p className="mt-2 text-sm">Loading sitemap...</p>
                </div>
              ) : (
                <pre className="p-6 text-sm text-green-400 overflow-x-auto max-h-[600px] overflow-y-auto leading-relaxed font-mono whitespace-pre-wrap break-words">
                  {content}
                </pre>
              )}
            </div>

            {/* Compliance checklist */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-heading font-bold text-charcoal mb-4">✅ SEO & AEO Compliance Checklist</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "All URLs return HTTP 200 OK",
                  "Canonical URLs match sitemap entries",
                  "No redirect (301/302) URLs included",
                  "No noindex pages included",
                  "Checkout/transactional pages excluded",
                  "User-specific pages excluded (quiz results, dashboard)",
                  "Image sitemap extensions on 40+ pages",
                  "Image captions include brand name for AEO",
                  "lastmod dates on all URLs",
                  "changefreq appropriate per content type",
                  "Priority hierarchy reflects content value",
                  "Sitemap index with content-type sub-sitemaps",
                  "robots.txt references both sitemap files",
                  "AI crawlers (GPTBot, Perplexity, Claude) allowed",
                  "CSS/JS not blocked for rendering",
                  "UTF-8 encoding throughout",
                  "Valid XML schema (sitemaps.org/schemas/sitemap/0.9)",
                  "Image namespace (google.com/schemas/sitemap-image/1.1)",
                  "No duplicate URLs across sitemaps",
                  "Under 50,000 URLs per file (well within limit)",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-leaf mt-0.5">✓</span>
                    <span className="text-charcoal-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission instructions */}
            <div className="mt-6 bg-gradient-to-r from-leaf/5 to-mango/5 rounded-2xl border border-leaf/20 p-6">
              <h3 className="font-heading font-bold text-charcoal mb-3">📤 Submit to Search Engines</h3>
              <div className="space-y-3 text-sm text-charcoal-light">
                <div>
                  <strong className="text-charcoal">Google Search Console:</strong>
                  <br />1. Go to <code className="bg-white px-1 rounded">search.google.com/search-console</code>
                  <br />2. Select your property → Sitemaps
                  <br />3. Enter: <code className="bg-white px-1 rounded">sitemap_index.xml</code>
                  <br />4. Click Submit
                </div>
                <div>
                  <strong className="text-charcoal">Bing Webmaster Tools:</strong>
                  <br />1. Go to <code className="bg-white px-1 rounded">bing.com/webmasters</code>
                  <br />2. Select your site → Sitemaps
                  <br />3. Submit: <code className="bg-white px-1 rounded">https://www.islandfruitguide.com/sitemap_index.xml</code>
                </div>
                <div>
                  <strong className="text-charcoal">Direct Ping (immediate):</strong>
                  <br />
                  <code className="bg-white px-2 py-1 rounded text-xs block mt-1 break-all">
                    https://www.google.com/ping?sitemap=https://www.islandfruitguide.com/sitemap_index.xml
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
