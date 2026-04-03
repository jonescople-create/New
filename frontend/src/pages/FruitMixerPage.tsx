import { useEffect, useMemo, useState } from "react";
import { navigate } from "../App";
import { fruits } from "../data/fruits";
import { Breadcrumb } from "../components/Breadcrumb";
import { OptimizedImage } from "../components/OptimizedImage";
import {
  type FlavorModifier,
  type MixerInput,
  type PreparationMethod,
  createMix,
  generateMixerRecipe,
  upsertMix,
} from "../utils/fruitMixer";

const METHODS: PreparationMethod[] = [
  "Juice",
  "Ice Cream",
  "Porridge",
  "Sauce / Pepper Sauce",
  "Stew",
  "Dessert",
];

const MODIFIERS: Array<{ id: FlavorModifier; label: string; hint: string }> = [
  { id: "Ginger", label: "Ginger", hint: "Warm, spicy kick" },
  { id: "Coconut milk", label: "Coconut milk", hint: "Creamy island richness" },
  { id: "Lime", label: "Lime", hint: "Bright, citrus balance" },
  { id: "Honey", label: "Honey", hint: "Natural sweetness" },
  { id: "Spices", label: "Spices", hint: "Pimento, cinnamon, nutmeg" },
];

function getQueryPrimaryId(): string | undefined {
  try {
    const qs = new URLSearchParams(window.location.search);
    const slug = qs.get("primary");
    if (!slug) return undefined;
    const f = fruits.find(x => x.slug === slug);
    return f?.id;
  } catch {
    return undefined;
  }
}

export function FruitMixerPage() {
  const defaultPrimary = getQueryPrimaryId() ?? fruits[0]?.id;

  const [primaryFruitId, setPrimaryFruitId] = useState<string>(defaultPrimary);
  const [secondaryFruitId, setSecondaryFruitId] = useState<string>("");
  const [method, setMethod] = useState<PreparationMethod>("Juice");
  const [modifiers, setModifiers] = useState<FlavorModifier[]>([]);
  const [generated, setGenerated] = useState<ReturnType<typeof generateMixerRecipe> | null>(null);
  const [savedMixId, setSavedMixId] = useState<string | null>(null);

  useEffect(() => {
    // Keep the page usable if user navigates with ?primary=
    if (!primaryFruitId && fruits[0]?.id) setPrimaryFruitId(fruits[0].id);
  }, [primaryFruitId]);

  const primary = useMemo(() => fruits.find(f => f.id === primaryFruitId), [primaryFruitId]);
  const secondary = useMemo(() => fruits.find(f => f.id === secondaryFruitId), [secondaryFruitId]);

  const canGenerate = Boolean(primaryFruitId) && Boolean(method);

  const onToggleModifier = (id: FlavorModifier) => {
    setModifiers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    const input: MixerInput = {
      primaryFruitId,
      secondaryFruitId: secondaryFruitId || undefined,
      method,
      modifiers,
    };
    const recipe = generateMixerRecipe(input);
    setGenerated(recipe);
    setSavedMixId(null);
  };

  const handleSave = () => {
    if (!generated) return;
    const input: MixerInput = {
      primaryFruitId,
      secondaryFruitId: secondaryFruitId || undefined,
      method,
      modifiers,
    };
    const mix = createMix(input, "submitted");
    const saved = upsertMix(mix);
    setSavedMixId(saved.id);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Tools", path: "/" }, { label: "Fruit Mixer" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">Fruit Mixer™ — Guided Recipe Creation</h1>
          <p className="text-white/85 mt-3 text-lg max-w-3xl">
            Combine Caribbean fruits using a controlled mixer (no free-form input). Generate a safe, template-driven recipe with quantified ingredients, 5–7 steps, and cultural context.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-heading text-lg font-bold text-charcoal mb-4">1) Choose your mix</h2>

              <label className="block text-sm font-medium text-charcoal mb-2">Primary Fruit (required)</label>
              <select
                value={primaryFruitId}
                onChange={(e) => setPrimaryFruitId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none"
              >
                {fruits.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              <label className="block text-sm font-medium text-charcoal mt-4 mb-2">Secondary Fruit (optional)</label>
              <select
                value={secondaryFruitId}
                onChange={(e) => setSecondaryFruitId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none"
              >
                <option value="">None</option>
                {fruits.filter(f => f.id !== primaryFruitId).map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              <label className="block text-sm font-medium text-charcoal mt-4 mb-2">Preparation Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PreparationMethod)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none"
              >
                {METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-charcoal">Flavor Modifiers</label>
                  <span className="text-xs text-charcoal-light">(optional)</span>
                </div>
                <div className="mt-3 space-y-2">
                  {MODIFIERS.map(mod => (
                    <label key={mod.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-leaf/30 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modifiers.includes(mod.id)}
                        onChange={() => onToggleModifier(mod.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-sm font-semibold text-charcoal">{mod.label}</div>
                        <div className="text-xs text-charcoal-light">{mod.hint}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Recipe
              </button>

              <div className="mt-4 text-xs text-charcoal-light leading-relaxed">
                <p className="font-semibold text-charcoal">Indexing note:</p>
                <p>
                  Fruit Mixer recipes are user-generated mixes. They are intended for learning and inspiration. Saved mixes are not included in the sitemap.
                </p>
              </div>
            </div>

            {/* Context links */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-heading font-bold text-charcoal mb-3">Helpful next steps</h3>
              <div className="space-y-2">
                <button onClick={() => navigate("/compare")} className="w-full text-left text-sm text-leaf font-semibold hover:text-leaf/80 transition-colors">
                  ⚖️ Compare fruits side-by-side
                </button>
                <button onClick={() => navigate("/fruit-match-up")} className="w-full text-left text-sm text-leaf font-semibold hover:text-leaf/80 transition-colors">
                  🏆 Use Fruit Match-Up
                </button>
                <button onClick={() => navigate("/recipes")} className="w-full text-left text-sm text-leaf font-semibold hover:text-leaf/80 transition-colors">
                  🍽️ Browse editorial recipes
                </button>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="lg:col-span-2">
            {!generated ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <div className="text-6xl mb-4">🥭</div>
                <h2 className="font-heading text-2xl font-bold text-charcoal">Generate a guided fruit recipe</h2>
                <p className="text-charcoal-light mt-3 max-w-xl mx-auto">
                  Choose your fruits, method, and modifiers to generate a safe, quantified recipe. Perfect for fast inspiration without guesswork.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-2xl lg:text-3xl font-bold text-charcoal">{generated.title}</h2>
                      <p className="text-charcoal-light mt-2">{generated.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {primary && (
                          <button onClick={() => navigate(`/fruits/${primary.slug}`)} className="text-xs bg-leaf/10 text-leaf px-2.5 py-1 rounded-full font-semibold">
                            {primary.name} guide
                          </button>
                        )}
                        {secondary && (
                          <button onClick={() => navigate(`/fruits/${secondary.slug}`)} className="text-xs bg-leaf/10 text-leaf px-2.5 py-1 rounded-full font-semibold">
                            {secondary.name} guide
                          </button>
                        )}
                        <span className="text-xs bg-mango/20 text-amber-800 px-2.5 py-1 rounded-full font-semibold">
                          {method}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-mango text-charcoal font-semibold px-4 py-2.5 rounded-xl hover:bg-amber-500 transition-colors"
                      >
                        💾 Save Mix
                      </button>
                      {savedMixId && (
                        <button
                          onClick={() => navigate(`/fruit-mixer/mix/${savedMixId}`)}
                          className="btn-secondary"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>

                  {generated.imageUrl && generated.imageAlt && (
                    <div className="mt-6 rounded-2xl overflow-hidden border border-gray-100">
                      <OptimizedImage
                        src={generated.imageUrl}
                        alt={generated.imageAlt}
                        width={1200}
                        height={720}
                        className="w-full h-60 sm:h-72 object-cover"
                        hideOnError
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="font-heading font-bold text-charcoal">Ingredients</h3>
                      <ul className="mt-3 space-y-2 text-sm text-charcoal-light">
                        {generated.ingredients.map((x, i) => (
                          <li key={i} className="flex items-start gap-2"><span className="text-leaf">•</span><span>{x}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-charcoal">Steps (5–7)</h3>
                      <ol className="mt-3 space-y-2 text-sm text-charcoal-light list-decimal list-inside">
                        {generated.steps.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="font-semibold text-charcoal text-sm">{generated.culturalNote}</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <div className="text-sm text-charcoal">{generated.nutritionSummary}</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                      <div className="text-sm text-charcoal">{generated.safetyNote}</div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button onClick={() => navigate("/store")} className="btn-primary">
                      📚 Get the full ebooks
                    </button>
                    <button onClick={() => navigate("/assistant")} className="btn-secondary">
                      🤖 Ask Fruitsy about this mix
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
