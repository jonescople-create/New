import { setupPageSEO } from '../utils/seo';
import { useEffect, useState } from 'react';;
import { navigate } from "../App";
import { trackPageView } from '../utils/db';
import { medicinalLeaves, type MedicinalLeaf } from "../data/medicinalLeaves";
import { fruits } from "../data/fruits";
import { Breadcrumb } from "../components/Breadcrumb";
import { OptimizedImage } from "../components/OptimizedImage";

const DISCLAIMER_GLOBAL = "⚕️ All content on this page documents traditional Caribbean and ethnobotanical folk medicine practices only. This is NOT medical advice. Never replace conventional medical treatment with herbal remedies. Always consult a qualified healthcare provider before use.";

const schemaLD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.islandfruitguide.com/medicinal-leaves",
  "name": "Caribbean Medicinal Leaves — Traditional Plant Knowledge",
  "description": "Educational guide to traditional Caribbean uses of medicinal leaves, preparation methods, and safety notes. Not medical advice.",
  "url": "https://www.islandfruitguide.com/medicinal-leaves",
  "publisher": {
    "@type": "Organization",
    "name": "IslandFruitGuide",
    "url": "https://www.islandfruitguide.com"
  },
  "about": {
    "@type": "Thing",
    "name": "Caribbean Ethnobotany and Traditional Plant Medicine"
  },
  "hasPart": medicinalLeaves.map(l => ({
    "@type": "Article",
    "name": l.common_name,
    "url": `https://www.islandfruitguide.com/medicinal-leaves/${l.slug}`,
    "description": l.seo_description
  }))
};

export function MedicinalLeavesPage() {
  useEffect(() => {
    trackPageView('/medicinal-leaves', 'medicinal-leaves');
    setupPageSEO({
      path: '/medicinal-leaves',
      title: 'Caribbean Medicinal Leaves & Healing Plants | IslandFruitGuide',
      description: 'Complete guide to Caribbean medicinal leaves including soursop leaf, guava leaf, papaya leaf, and 36 more traditional healing plants. Preparation methods and traditional uses.',
    });
  }, []);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pregnancy-safe" | "culinary">("all");

  const filtered = medicinalLeaves.filter(leaf => {
    const matchSearch =
      leaf.common_name.toLowerCase().includes(search.toLowerCase()) ||
      leaf.scientific_name.toLowerCase().includes(search.toLowerCase()) ||
      leaf.local_names.some(n => n.toLowerCase().includes(search.toLowerCase()));
    const matchFilter =
      filter === "all" ? true :
      filter === "pregnancy-safe" ? !leaf.pregnancy_warning :
      filter === "culinary" ? leaf.preparation_methods.some(m =>
        m.allowed_with.includes("sauce") || m.allowed_with.includes("porridge")
      ) : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLD) }}
      />

      {/* SEO meta handled via runtimeMeta */}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Breadcrumb items={[
          { label: "Home", path: "/" },
          { label: "Medicinal Leaves", path: "/medicinal-leaves" }
        ]} />
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-leaf/10 to-mango/10 dark:from-leaf/20 dark:to-mango/20 border-b border-leaf/20 dark:border-leaf/30">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🌿</span>
            <span className="bg-leaf/10 dark:bg-leaf/20 text-leaf dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide border border-leaf/20">
              Traditional Knowledge
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-charcoal dark:text-white mb-4 leading-tight">
            Caribbean Medicinal Leaves
          </h1>
          <p className="text-lg text-charcoal-light dark:text-gray-300 max-w-2xl mb-6">
            An educational guide to traditional Caribbean plant knowledge — documenting folk preparation methods, cultural uses, and safety notes for 8 key medicinal leaves.
          </p>

          {/* Global Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-4 max-w-3xl">
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
              {DISCLAIMER_GLOBAL}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search leaves, local names, plants…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-charcoal dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-leaf/40"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "pregnancy-safe", "culinary"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-leaf text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-charcoal dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-leaf/40"
                }`}
              >
                {f === "all" ? "All Leaves" : f === "pregnancy-safe" ? "✅ Pregnancy Considerations" : "🍳 Culinary Use"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Documented Leaves", value: medicinalLeaves.length, icon: "🌿" },
            { label: "Preparation Methods", value: medicinalLeaves.reduce((a, l) => a + l.preparation_methods.length, 0), icon: "🫖" },
            { label: "Fruit Compatibilities", value: "25+", icon: "🍎" },
            { label: "Safety Rules", value: "10 Active", icon: "🛡️" }
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-leaf dark:text-green-400">{stat.value}</div>
              <div className="text-xs text-charcoal-light dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Leaf Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map(leaf => {
            const parentFruit = fruits.find(f => f.id === leaf.fruit_id);
            return (
              <LeafCard key={leaf.leaf_id} leaf={leaf} parentFruit={parentFruit} />
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-12 text-charcoal-light dark:text-gray-400">
              <span className="text-4xl block mb-3">🌿</span>
              No leaves match your search. Try a different term.
            </div>
          )}
        </div>

        {/* Education Blocks */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "✅",
              title: "What's Allowed",
              color: "green",
              items: [
                "Cultural and traditional use documentation",
                "Preparation methods (teas, decoctions, poultices)",
                "Culinary leaf applications",
                "Safety notes and contraindications",
                "Folklore and ethnobotanical context"
              ]
            },
            {
              icon: "❌",
              title: "What's Not Here",
              color: "red",
              items: [
                "Medical diagnoses or treatment claims",
                "\"Cures\" or \"treats disease\" language",
                "Dosage prescriptions",
                "Replacement for professional medical advice",
                "Pediatric dosing recommendations"
              ]
            },
            {
              icon: "🛡️",
              title: "Safety System",
              color: "amber",
              items: [
                "10 active safety rules (admin-managed)",
                "Leaf ↔ fruit compatibility checks",
                "Pregnancy warnings on every leaf",
                "Drug interaction flags",
                "Hard blocks on unsafe combinations"
              ]
            }
          ].map(block => (
            <div
              key={block.title}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 border ${
                block.color === "green" ? "border-green-200 dark:border-green-800" :
                block.color === "red" ? "border-red-200 dark:border-red-800" :
                "border-amber-200 dark:border-amber-800"
              }`}
            >
              <div className="text-2xl mb-3">{block.icon}</div>
              <h3 className="font-semibold text-charcoal dark:text-white mb-3">{block.title}</h3>
              <ul className="space-y-1.5">
                {block.items.map(item => (
                  <li key={item} className="text-sm text-charcoal-light dark:text-gray-300 flex items-start gap-2">
                    <span className="text-xs mt-0.5 flex-shrink-0">{block.icon}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-leaf to-leaf/80 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">🌿 Explore Individual Leaf Guides</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Each leaf has its own detailed guide with preparation methods, compatibility charts, and safety notes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {medicinalLeaves.slice(0, 4).map(l => (
              <button
                key={l.leaf_id}
                onClick={() => navigate(`/medicinal-leaves/${l.slug}`)}
                className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                {l.common_name} →
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeafCard({ leaf, parentFruit: _parentFruit }: { leaf: MedicinalLeaf; parentFruit: typeof fruits[0] | undefined }) {
  return (
    <div
      onClick={() => navigate(`/medicinal-leaves/${leaf.slug}`)}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
    >
      {/* Image or Icon */}
      <div className="bg-gradient-to-br from-leaf/10 to-mango/10 dark:from-leaf/20 dark:to-mango/20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {leaf.image_id ? (
            <OptimizedImage
              src={leaf.image_id}
              alt={`${leaf.common_name} — Caribbean medicinal leaf — IslandFruitGuide`}
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
              fallbackEmoji="🌿"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-leaf/20 flex items-center justify-center text-2xl">🌿</div>
          )}
          <div>
            <h3 className="font-bold text-charcoal dark:text-white text-base leading-tight group-hover:text-leaf dark:group-hover:text-green-400 transition-colors">
              {leaf.common_name}
            </h3>
            <p className="text-xs text-charcoal-light dark:text-gray-400 italic">{leaf.scientific_name}</p>
          </div>
        </div>
        {leaf.pregnancy_warning && (
          <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
            ⚠️ Preg
          </span>
        )}
      </div>

      <div className="p-5">
        {/* Local names */}
        {leaf.local_names.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {leaf.local_names.slice(0, 3).map(n => (
              <span key={n} className="bg-gray-100 dark:bg-gray-700 text-charcoal-light dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                {n}
              </span>
            ))}
          </div>
        )}

        {/* Plant part */}
        <p className="text-xs text-charcoal-light dark:text-gray-400 mb-3">
          <strong className="text-charcoal dark:text-gray-300">Plant part:</strong> {leaf.plant_part_used}
        </p>

        {/* Traditional uses preview */}
        <p className="text-sm text-charcoal-light dark:text-gray-300 leading-relaxed mb-4 line-clamp-2">
          {leaf.traditional_uses[0]}
        </p>

        {/* Prep methods */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {leaf.preparation_methods.map(m => (
            <span key={m.method} className="bg-leaf/10 dark:bg-leaf/20 text-leaf dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
              {m.heat_required ? "🔥" : "🌿"} {m.method}
            </span>
          ))}
        </div>

        {/* Interaction flags */}
        {leaf.interaction_flags.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-2 mb-3">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              ⚠️ Interactions: {leaf.interaction_flags.slice(0, 2).join(", ")}
              {leaf.interaction_flags.length > 2 && " + more"}
            </p>
          </div>
        )}

        <button className="w-full bg-leaf/10 dark:bg-leaf/20 hover:bg-leaf hover:text-white dark:hover:bg-leaf text-leaf dark:text-green-400 text-sm font-semibold py-2 rounded-xl transition-all border border-leaf/20 dark:border-leaf/30">
          View Full Guide →
        </button>
      </div>
    </div>
  );
}
