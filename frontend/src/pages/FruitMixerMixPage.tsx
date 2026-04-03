import { setupPageSEO } from '../utils/seo';
import { useEffect, useMemo, useState } from "react";
import { navigate } from "../App";
import { Breadcrumb } from "../components/Breadcrumb";
import { OptimizedImage } from "../components/OptimizedImage";
import { getMixById, getFruitByIdStrict, updateMixStatus, type UserMix } from "../utils/fruitMixer";
import { withRuntimeMeta } from "../utils/runtimeMeta";

interface Props {
  id: string;
}

export function FruitMixerMixPage({ id }: Props) {
  const [mix, setMix] = useState<UserMix | null>(null);

  useEffect(() => {
    setupPageSEO({
      path: '/fruit-mixer',
      title: 'Saved Fruit Mix — Tropical Blend Details | IslandFruitGuide',
      description: 'View your saved tropical fruit mix from the IslandFruitGuide Fruit Mixer. See flavour profiles, nutritional breakdown, and recipe suggestions.',
    });
  }, []);

  useEffect(() => {
    const restore = withRuntimeMeta(
      {
        title: "Fruit Mixer Mix (User Generated) — IslandFruitGuide",
        robots: "noindex,follow",
      },
      () => {
        const m = getMixById(id);
        setMix(m ?? null);
      }
    );

    return restore;
  }, [id]);

  const primary = useMemo(() => {
    if (!mix) return null;
    try { return getFruitByIdStrict(mix.input.primaryFruitId); } catch { return null; }
  }, [mix]);

  const canonicalTarget = primary ? `https://islandfruitguide.com/fruits/${primary.slug}` : "https://islandfruitguide.com/fruit-mixer";

  useEffect(() => {
    // Canonical must NEVER self-canonical for unapproved mixes.
    const restore = withRuntimeMeta({ canonical: canonicalTarget }, () => {});
    return restore;
  }, [canonicalTarget]);

  if (!mix) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🧩</span>
        <h2 className="font-heading text-2xl font-bold text-charcoal">Mix Not Found</h2>
        <p className="text-charcoal-light mt-3">This mix may have been deleted or not created on this device.</p>
        <button onClick={() => navigate("/fruit-mixer")} className="btn-primary mt-6">← Back to Fruit Mixer</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Fruit Mixer", path: "/fruit-mixer" }, { label: "Saved Mix" }]} />
          <h1 className="font-heading text-3xl lg:text-4xl font-bold">Saved Fruit Mixer Mix</h1>
          <p className="text-white/85 mt-2 text-lg max-w-2xl">User-generated mix (not indexed). Canonical points to the related fruit pillar.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal">{mix.recipe.title}</h2>
                <p className="text-charcoal-light mt-2">{mix.recipe.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    mix.status === "approved" ? "bg-leaf/15 text-leaf" :
                    mix.status === "rejected" ? "bg-red-50 text-red-700" :
                    mix.status === "submitted" ? "bg-mango/20 text-amber-800" :
                    "bg-gray-100 text-charcoal"
                  }`}>{mix.status.toUpperCase()}</span>
                  {mix.chefsPick && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-semibold">Chef’s Pick</span>
                  )}
                  {mix.lockedUnsafe && (
                    <span className="text-xs bg-red-100 text-red-800 px-2.5 py-1 rounded-full font-semibold">Locked (Unsafe)</span>
                  )}
                </div>
              </div>
              {primary && (
                <button onClick={() => navigate(`/fruits/${primary.slug}`)} className="btn-secondary whitespace-nowrap">View {primary.name} guide</button>
              )}
            </div>

            {mix.recipe.imageUrl && mix.recipe.imageAlt && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-gray-100">
                <OptimizedImage
                  src={mix.recipe.imageUrl}
                  alt={mix.recipe.imageAlt}
                  width={1200}
                  height={720}
                  className="w-full h-60 sm:h-72 object-cover"
                  hideOnError
                  sizes="(max-width: 768px) 100vw, 720px"
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-heading font-bold text-charcoal">Ingredients</h3>
                <ul className="mt-3 space-y-2 text-sm text-charcoal-light">
                  {mix.recipe.ingredients.map((x, i) => (
                    <li key={i} className="flex items-start gap-2"><span className="text-leaf">•</span><span>{x}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-bold text-charcoal">Steps</h3>
                <ol className="mt-3 space-y-2 text-sm text-charcoal-light list-decimal list-inside">
                  {mix.recipe.steps.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="font-semibold text-charcoal text-sm">{mix.recipe.culturalNote}</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="text-sm text-charcoal">{mix.recipe.nutritionSummary}</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="text-sm text-charcoal">{mix.recipe.safetyNote}</div>
              </div>
            </div>

            {mix.adminNote && (
              <div className="mt-6 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <div className="text-sm text-charcoal"><span className="font-semibold">Admin note:</span> {mix.adminNote}</div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate("/fruit-mixer")} className="btn-primary">Create another mix</button>
              <button onClick={() => navigate("/recipes")} className="btn-secondary">Browse editorial recipes</button>
            </div>

            {/* Hidden admin actions for future wiring; kept minimal (not in nav) */}
            <div className="mt-8 text-xs text-gray-400">
              <button
                className="underline"
                onClick={() => {
                  // simple local-only promote for testing
                  updateMixStatus(mix.id, { chefsPick: !mix.chefsPick });
                  setMix({ ...mix, chefsPick: !mix.chefsPick });
                }}
              >
                Toggle Chef’s Pick (admin)
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-charcoal-light mt-6">
          SEO note: This user-generated mix is marked <strong>noindex, follow</strong>. Canonical points to: {canonicalTarget}.
        </p>
      </div>
    </div>
  );
}
