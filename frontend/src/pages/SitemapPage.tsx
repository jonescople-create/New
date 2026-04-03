import { useEffect, useMemo, useState } from "react";
import { navigate } from "../App";
import { Breadcrumb } from "../components/Breadcrumb";

export function SitemapPage() {
  const [xml, setXml] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatus("loading");
        const res = await fetch("/sitemap.xml", { cache: "no-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (cancelled) return;
        setXml(text);
        setStatus("ready");
      } catch {
        if (cancelled) return;
        setStatus("error");
        setXml("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const urlCount = useMemo(() => {
    if (!xml) return 0;
    return (xml.match(/<url>/g) || []).length;
  }, [xml]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(xml);
      alert("Sitemap copied to clipboard.");
    } catch {
      alert("Copy failed. You can manually select and copy the text.");
    }
  };

  const downloadXml = () => {
    const blob = new Blob([xml], { type: "application/xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Sitemap" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">Sitemap.xml</h1>
          <p className="text-white/80 mt-3 text-lg max-w-2xl">
            View, copy, or download the sitemap for islandfruitguide.com.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-heading font-bold text-charcoal">Sitemap tools</div>
              <div className="text-xs text-charcoal-light">
                {status === "ready" ? `${urlCount} URLs detected` : status === "loading" ? "Loading…" : "Failed to load /sitemap.xml"}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                Open /sitemap.xml
              </a>
              <button
                onClick={copyToClipboard}
                disabled={status !== "ready"}
                className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Copy
              </button>
              <button
                onClick={downloadXml}
                disabled={status !== "ready"}
                className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download
              </button>
            </div>
          </div>

          <div className="p-6">
            {status === "loading" && (
              <div className="text-center py-12">
                <span className="animate-spin text-3xl inline-block">⏳</span>
                <p className="text-sm text-charcoal-light mt-3">Loading sitemap…</p>
              </div>
            )}

            {status === "error" && (
              <div className="text-center py-12">
                <span className="text-5xl block mb-4">⚠️</span>
                <h2 className="font-heading text-xl font-bold text-charcoal mb-2">Couldn’t load sitemap.xml</h2>
                <p className="text-sm text-charcoal-light max-w-md mx-auto">
                  Please ensure <code className="px-1.5 py-0.5 bg-gray-100 rounded">/sitemap.xml</code> exists in the site root. You can also open it directly.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="btn-primary">Open sitemap.xml</a>
                  <button onClick={() => navigate("/")} className="btn-secondary">Go Home</button>
                </div>
              </div>
            )}

            {status === "ready" && (
              <div>
                <p className="text-xs text-charcoal-light mb-3">
                  Tip: You can paste this into Google Search Console → Sitemaps.
                </p>
                <textarea
                  value={xml}
                  readOnly
                  spellCheck={false}
                  className="w-full h-[520px] font-mono text-xs bg-white rounded-xl border border-gray-200 p-4 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-sm text-charcoal-light hover:text-charcoal transition-colors">
            ← Back to Home
          </button>
          <div className="text-xs text-charcoal-light">
            Domain: <span className="font-mono">islandfruitguide.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
