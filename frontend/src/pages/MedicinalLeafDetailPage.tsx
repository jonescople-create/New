import { useState, useEffect } from "react";
import { navigate } from "../App";
import { EmailCapture } from "../components/EmailCapture";
import {
  getLeafBySlug,
  getCompatibleFruitsForLeaf,
  checkSafetyRules,
  medicinalLeaves
} from "../data/medicinalLeaves";
import { fruits, getFruitById } from "../data/fruits";
import { Breadcrumb } from "../components/Breadcrumb";
import { OptimizedImage } from "../components/OptimizedImage";
import { setupPageSEO } from "../utils/seo";

export function MedicinalLeafDetailPage({ slug }: { slug: string }) {
  const leaf = getLeafBySlug(slug);
  const [activeTab, setActiveTab] = useState<"overview" | "preparation" | "compatibility" | "safety">("overview");

  useEffect(() => {
    if (leaf) {
      // Setup SEO for this medicinal leaf page
      setupPageSEO({
        path: `/medicinal-leaves/${leaf.slug}`,
        title: `${leaf.common_name} - ${leaf.seo_title} | IslandFruitGuide`,
        description: leaf.seo_description,
        image: leaf.image_id || undefined,
        type: 'article',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Medicinal Leaves', url: '/medicinal-leaves' },
          { name: leaf.common_name, url: `/medicinal-leaves/${leaf.slug}` }
        ]
      });
    }
  }, [leaf]);

  if (!leaf) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🌿</span>
        <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-4">Leaf Guide Not Found</h2>
        <p className="text-charcoal-light dark:text-gray-400 mb-6">This leaf guide doesn't exist yet.</p>
        <button onClick={() => navigate("/medicinal-leaves")} className="bg-leaf text-white px-6 py-3 rounded-xl font-semibold hover:bg-leaf/90 transition-colors">
          ← Back to All Leaves
        </button>
      </div>
    );
  }

  const parentFruit = getFruitById(leaf.fruit_id);
  const compatibilities = getCompatibleFruitsForLeaf(leaf.leaf_id);
  const allRules = checkSafetyRules([], [leaf.leaf_id]);
  const relatedLeaves = medicinalLeaves.filter(l => l.leaf_id !== leaf.leaf_id).slice(0, 3);

  // JSON-LD structured data
  const schemaLD = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://www.islandfruitguide.com/medicinal-leaves/${leaf.slug}`,
    "headline": leaf.seo_title,
    "description": leaf.seo_description,
    "url": `https://www.islandfruitguide.com/medicinal-leaves/${leaf.slug}`,
    "about": {
      "@type": "Thing",
      "name": leaf.common_name,
      "alternateName": leaf.local_names,
      "description": leaf.traditional_uses[0]
    },
    "publisher": {
      "@type": "Organization",
      "name": "IslandFruitGuide",
      "url": "https://www.islandfruitguide.com"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.islandfruitguide.com/medicinal-leaves/${leaf.slug}`
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.islandfruitguide.com/" },
        { "@type": "ListItem", "position": 2, "name": "Medicinal Leaves", "item": "https://www.islandfruitguide.com/medicinal-leaves" },
        { "@type": "ListItem", "position": 3, "name": leaf.common_name, "item": `https://www.islandfruitguide.com/medicinal-leaves/${leaf.slug}` }
      ]
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".leaf-traditional-uses", ".leaf-disclaimer"]
    }
  };

  // FAQ schema for AEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${leaf.common_name} used for traditionally?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${leaf.traditional_uses[0]} ${leaf.disclaimer}`
        }
      },
      {
        "@type": "Question",
        "name": `How do you prepare ${leaf.common_name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": leaf.preparation_methods[0]?.instructions + " " + leaf.disclaimer
        }
      },
      {
        "@type": "Question",
        "name": `Is ${leaf.common_name} safe during pregnancy?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": leaf.pregnancy_warning
            ? `${leaf.common_name} is traditionally considered unsuitable during pregnancy. Always consult a qualified healthcare provider before use.`
            : `Traditional practice does not commonly flag ${leaf.common_name} as unsuitable during pregnancy, but always consult a healthcare provider.`
        }
      }
    ]
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📖" },
    { id: "preparation", label: "Preparation", icon: "🫖" },
    { id: "compatibility", label: "Fruit Pairs", icon: "🍎" },
    { id: "safety", label: "Safety", icon: "🛡️" }
  ] as const;

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Breadcrumb items={[
          { label: "Home", path: "/" },
          { label: "Medicinal Leaves", path: "/medicinal-leaves" },
          { label: leaf.common_name, path: `/medicinal-leaves/${leaf.slug}` }
        ]} />
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-leaf/10 via-mango/5 to-leaf/10 dark:from-leaf/20 dark:via-gray-900 dark:to-leaf/20 border-b border-leaf/20 dark:border-leaf/30">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left: Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-leaf/10 dark:bg-leaf/20 text-leaf dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide border border-leaf/20">
                  🌿 Medicinal Leaf
                </span>
                {leaf.pregnancy_warning && (
                  <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 dark:border-amber-700">
                    ⚠️ Pregnancy Caution
                  </span>
                )}
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700">
                  📚 Traditional Use Only
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-charcoal dark:text-white mb-2 leading-tight">
                {leaf.common_name}
              </h1>
              <p className="text-lg italic text-charcoal-light dark:text-gray-400 mb-3">
                {leaf.scientific_name}
              </p>

              {/* Local names */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {leaf.local_names.map(n => (
                  <span key={n} className="bg-white dark:bg-gray-700 text-charcoal-light dark:text-gray-300 text-sm px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                    {n}
                  </span>
                ))}
              </div>

              {/* Plant part */}
              <div className="flex items-center gap-2 mb-4 text-sm text-charcoal-light dark:text-gray-400">
                <span>🌱</span>
                <strong className="text-charcoal dark:text-gray-300">Plant part used:</strong>
                <span>{leaf.plant_part_used}</span>
              </div>

              {/* Flavor */}
              <div className="flex items-start gap-2 mb-6 text-sm text-charcoal-light dark:text-gray-400">
                <span>👅</span>
                <div>
                  <strong className="text-charcoal dark:text-gray-300">Flavor profile:</strong>
                  <span className="ml-1">{leaf.flavor_profile}</span>
                </div>
              </div>

              {/* Parent fruit link */}
              {parentFruit && (
                <div
                  onClick={() => navigate(`/fruits/${parentFruit.slug}`)}
                  className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 hover:border-leaf/40 transition-all cursor-pointer group"
                >
                  {parentFruit.image_url && (
                    <OptimizedImage
                      src={parentFruit.image_url}
                      alt={`Fresh ${parentFruit.name} tropical fruit – IslandFruitGuide`}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      fallbackEmoji={parentFruit.emoji}
                    />
                  )}
                  <div>
                    <p className="text-xs text-charcoal-light dark:text-gray-400">From the</p>
                    <p className="text-sm font-semibold text-charcoal dark:text-white group-hover:text-leaf dark:group-hover:text-green-400 transition-colors">
                      {parentFruit.name} Plant →
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Image or visual */}
            <div className="lg:w-80 flex-shrink-0">
              {leaf.image_id ? (
                <div className="relative">
                  <div className="w-64 h-64 mx-auto rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                    <OptimizedImage
                      src={leaf.image_id}
                      alt={`${leaf.common_name} – Caribbean medicinal leaf – IslandFruitGuide`}
                      width={256}
                      height={256}
                      className="w-full h-full object-cover"
                      fallbackEmoji="🌿"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-leaf text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    🌿 {leaf.preparation_methods.length} Methods
                  </div>
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto rounded-2xl bg-gradient-to-br from-leaf/20 to-mango/20 dark:from-leaf/30 dark:to-mango/30 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-xl">
                  <span className="text-8xl">🌿</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="leaf-disclaimer bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl px-5 py-3">
          <p className="text-sm text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
            ⚕️ <strong>Educational Content Only:</strong> {leaf.disclaimer}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-1 mb-6 pb-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-leaf text-white shadow-sm"
                      : "bg-white dark:bg-gray-800 text-charcoal dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-leaf/40"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-charcoal dark:text-white mb-4 flex items-center gap-2">
                    <span>📜</span> Traditional Uses
                  </h2>
                  <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg mb-4 font-medium">
                    Traditional / Cultural Use — Not medical advice
                  </p>
                  <ul className="leaf-traditional-uses space-y-3">
                    {leaf.traditional_uses.map((use, i) => (
                      <li key={i} className="flex items-start gap-3 text-charcoal-light dark:text-gray-300 text-sm leading-relaxed">
                        <span className="text-leaf dark:text-green-400 flex-shrink-0 mt-0.5 font-bold">{i + 1}.</span>
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Source notes */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-charcoal dark:text-white mb-3 flex items-center gap-2">
                    <span>📚</span> Source Notes
                  </h3>
                  <p className="text-sm text-charcoal-light dark:text-gray-400 leading-relaxed">{leaf.source_notes}</p>
                </div>
              </div>
            )}

            {/* Tab: Preparation */}
            {activeTab === "preparation" && (
              <div className="space-y-4">
                {leaf.preparation_methods.map((method, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-charcoal dark:text-white flex items-center gap-2">
                        <span>{method.heat_required ? "🔥" : "🌿"}</span>
                        {method.method}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {method.allowed_with.map(p => (
                          <span key={p} className="bg-leaf/10 dark:bg-leaf/20 text-leaf dark:text-green-400 text-xs px-2 py-0.5 rounded-full">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    {method.heat_required && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg px-3 py-2 mb-3">
                        <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">🔥 Heat required — do not use raw/cold for this preparation</p>
                      </div>
                    )}
                    <p className="text-sm text-charcoal-light dark:text-gray-300 leading-relaxed">{method.instructions}</p>
                  </div>
                ))}
                <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                    ⚕️ {leaf.disclaimer}
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Fruit Compatibility */}
            {activeTab === "compatibility" && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 mb-4">
                  <h2 className="font-bold text-charcoal dark:text-white mb-2 flex items-center gap-2">
                    <span>🍎</span> Fruit Compatibility Chart
                  </h2>
                  <p className="text-xs text-charcoal-light dark:text-gray-400">
                    Deterministic compatibility — based on traditional practice and known pharmacological interactions, not AI-generated.
                  </p>
                </div>
                {compatibilities.map(compat => {
                  const fruit = getFruitById(compat.fruit_id);
                  if (!fruit) return null;
                  return (
                    <div
                      key={compat.fruit_id}
                      className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 ${
                        compat.compatibility_level === "safe" ? "border-green-500" :
                        compat.compatibility_level === "caution" ? "border-amber-500" :
                        "border-red-500"
                      } border border-gray-100 dark:border-gray-700`}
                    >
                      <div className="flex items-start gap-4">
                        {fruit.image_url && (
                          <OptimizedImage
                            src={fruit.image_url}
                            alt={`Fresh ${fruit.name} – IslandFruitGuide`}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            fallbackEmoji={fruit.emoji}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={() => navigate(`/fruits/${fruit.slug}`)}
                              className="font-semibold text-charcoal dark:text-white hover:text-leaf dark:hover:text-green-400 transition-colors text-sm"
                            >
                              {fruit.name}
                            </button>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              compat.compatibility_level === "safe"
                                ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                                : compat.compatibility_level === "caution"
                                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                                : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
                            }`}>
                              {compat.compatibility_level === "safe" ? "✅ Safe" :
                               compat.compatibility_level === "caution" ? "⚠️ Caution" : "❌ Avoid"}
                            </span>
                          </div>
                          <p className="text-xs text-charcoal-light dark:text-gray-400 mb-2">{compat.reason}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {compat.heat_required && (
                              <span className="text-orange-600 dark:text-orange-400 font-medium">🔥 Heat required</span>
                            )}
                            <span className="text-charcoal-light dark:text-gray-500">{compat.max_frequency_note}</span>
                          </div>
                          {compat.allowed_preparations.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {compat.allowed_preparations.map(p => (
                                <span key={p} className="bg-gray-100 dark:bg-gray-700 text-charcoal-light dark:text-gray-400 text-xs px-1.5 py-0.5 rounded">
                                  {p}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {compatibilities.length === 0 && (
                  <p className="text-center text-charcoal-light dark:text-gray-400 py-8">No compatibility data yet for this leaf.</p>
                )}
              </div>
            )}

            {/* Tab: Safety */}
            {activeTab === "safety" && (
              <div className="space-y-4">
                {/* Contraindications */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-charcoal dark:text-white mb-4 flex items-center gap-2">
                    <span>🚫</span> Contraindications
                  </h3>
                  <ul className="space-y-2">
                    {leaf.contraindications.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-charcoal-light dark:text-gray-300 leading-relaxed">
                        <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pregnancy */}
                <div className={`rounded-2xl p-6 border ${
                  leaf.pregnancy_warning
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                }`}>
                  <h3 className={`font-bold mb-2 flex items-center gap-2 ${
                    leaf.pregnancy_warning ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"
                  }`}>
                    <span>{leaf.pregnancy_warning ? "⚠️" : "✅"}</span>
                    Pregnancy & Breastfeeding
                  </h3>
                  <p className={`text-sm ${
                    leaf.pregnancy_warning ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"
                  }`}>
                    {leaf.pregnancy_warning
                      ? "Traditional practice advises avoiding this leaf preparation during pregnancy and breastfeeding. Always consult your healthcare provider."
                      : "Traditional practice does not commonly flag this leaf for pregnancy use, but always consult your healthcare provider before any herbal preparation during pregnancy."}
                  </p>
                </div>

                {/* Drug interactions */}
                {leaf.interaction_flags.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-charcoal dark:text-white mb-4 flex items-center gap-2">
                      <span>💊</span> Known Interaction Flags
                    </h3>
                    <ul className="space-y-2">
                      {leaf.interaction_flags.map((flag, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                          <span>⚠️</span> {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Active safety rules */}
                {allRules.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-charcoal dark:text-white mb-4 flex items-center gap-2">
                      <span>🛡️</span> Active Safety Rules
                    </h3>
                    <div className="space-y-3">
                      {allRules.map(rule => (
                        <div key={rule.rule_id} className={`rounded-xl p-3 border text-sm ${
                          rule.rule_type === "block"
                            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
                            : rule.rule_type === "warn"
                            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300"
                        }`}>
                          <span className="font-semibold capitalize">
                            {rule.rule_type === "block" ? "❌" : rule.rule_type === "warn" ? "⚠️" : "ℹ️"} {rule.rule_type}:
                          </span>{" "}
                          {rule.display_message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0 space-y-4">

            {/* Quick Facts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-charcoal dark:text-white mb-4 text-sm">📋 Quick Reference</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-charcoal-light dark:text-gray-400">Methods</span>
                  <span className="font-semibold text-charcoal dark:text-white text-right">{leaf.preparation_methods.length} documented</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-charcoal-light dark:text-gray-400">Heat needed</span>
                  <span className="font-semibold text-charcoal dark:text-white">
                    {leaf.preparation_methods.some(m => m.heat_required) ? "Yes (some)" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-charcoal-light dark:text-gray-400">Pregnancy</span>
                  <span className={`font-semibold ${leaf.pregnancy_warning ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                    {leaf.pregnancy_warning ? "⚠️ Caution" : "✅ No flag"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-charcoal-light dark:text-gray-400">Interactions</span>
                  <span className="font-semibold text-charcoal dark:text-white">{leaf.interaction_flags.length} flagged</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-charcoal-light dark:text-gray-400">Compatible fruits</span>
                  <span className="font-semibold text-charcoal dark:text-white">
                    {compatibilities.filter(c => c.compatibility_level !== "avoid").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Parent Fruit Link */}
            {parentFruit && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-charcoal dark:text-white mb-3 text-sm">🍎 Parent Fruit</h3>
                <div
                  onClick={() => navigate(`/fruits/${parentFruit.slug}`)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  {parentFruit.image_url && (
                    <OptimizedImage
                      src={parentFruit.image_url}
                      alt={`Fresh ${parentFruit.name} – IslandFruitGuide`}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-xl object-cover"
                      fallbackEmoji={parentFruit.emoji}
                    />
                  )}
                  <div>
                    <p className="font-semibold text-charcoal dark:text-white group-hover:text-leaf dark:group-hover:text-green-400 transition-colors text-sm">
                      {parentFruit.name}
                    </p>
                    <p className="text-xs text-charcoal-light dark:text-gray-400 italic">{parentFruit.scientific_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/fruits/${parentFruit.slug}`)}
                  className="w-full mt-3 bg-leaf/10 dark:bg-leaf/20 hover:bg-leaf hover:text-white text-leaf dark:text-green-400 text-xs font-semibold py-2 rounded-xl transition-all border border-leaf/20"
                >
                  View Fruit Guide →
                </button>
              </div>
            )}

            {/* Other Leaves */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-charcoal dark:text-white mb-3 text-sm">🌿 Other Leaf Guides</h3>
              <div className="space-y-2">
                {relatedLeaves.map(related => (
                  <button
                    key={related.leaf_id}
                    onClick={() => navigate(`/medicinal-leaves/${related.slug}`)}
                    className="w-full text-left text-sm text-charcoal dark:text-gray-300 hover:text-leaf dark:hover:text-green-400 py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
                  >
                    🌿 {related.common_name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate("/medicinal-leaves")}
                className="w-full mt-3 text-xs text-leaf dark:text-green-400 font-semibold hover:underline"
              >
                View All Leaves →
              </button>
            </div>

            {/* Disclaimer Box */}
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-2xl p-4">
              <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                ⚕️ {leaf.disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Related Leaves Section */}
        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-charcoal dark:text-white mb-6">🌿 Explore More Leaf Guides</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedLeaves.map(related => {
              const rf = fruits.find(f => f.id === related.fruit_id);
              return (
                <div
                  key={related.leaf_id}
                  onClick={() => navigate(`/medicinal-leaves/${related.slug}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-leaf/40 hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
                >
                  {rf?.image_url && (
                    <OptimizedImage
                      src={rf.image_url}
                      alt={`${related.common_name} – IslandFruitGuide`}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      fallbackEmoji="🌿"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-charcoal dark:text-white text-sm">{related.common_name}</p>
                    <p className="text-xs text-charcoal-light dark:text-gray-400 italic">{related.scientific_name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
