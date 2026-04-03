import { useState } from 'react';
import { navigate } from '../../App';
import { captureEmail, trackEvent, hasCapturedEmail } from '../../utils/funnelTracker';
import { creditReferralSignup } from '../../utils/referralSystem';

// ── Template engine ───────────────────────────────────────────────────────────
interface GeneratedRecipe {
  title:        string;
  emoji:        string;
  servings:     string;
  prepTime:     string;
  calories:     string;
  intro:        string;
  ingredients:  string[];
  instructions: string[];
  benefits:     string[];
  bestTime:     string;
  ebookSlug:    string;
  ebookTitle:   string;
}

type RecipeType = 'smoothie' | 'juice' | 'tonic' | 'bowl' | 'shot';

interface FruitProfile {
  name:    string;
  emoji:   string;
  flavor:  string;
  benefit: string;
  cal:     number;
}

const FRUIT_PROFILES: Record<string, FruitProfile> = {
  mango:         { name: 'Mango',         emoji: '🥭', flavor: 'sweet, tropical',          benefit: 'vitamin C, beta-carotene, digestive enzymes',     cal: 60  },
  papaya:        { name: 'Papaya',        emoji: '🍈', flavor: 'soft, buttery',             benefit: 'papain enzyme, vitamin C, anti-inflammatory',     cal: 43  },
  pineapple:     { name: 'Pineapple',     emoji: '🍍', flavor: 'tangy, bright',             benefit: 'bromelain enzyme, manganese, vitamin C',          cal: 50  },
  guava:         { name: 'Guava',         emoji: '🍐', flavor: 'sweet, slightly tart',      benefit: 'vitamin C (4× orange), fibre, potassium',         cal: 68  },
  banana:        { name: 'Banana',        emoji: '🍌', flavor: 'creamy, sweet',             benefit: 'potassium, magnesium, natural energy',             cal: 89  },
  coconut:       { name: 'Coconut',       emoji: '🥥', flavor: 'rich, nutty',              benefit: 'MCTs, electrolytes, lauric acid',                  cal: 354 },
  soursop:       { name: 'Soursop',       emoji: '🌿', flavor: 'creamy, tart',              benefit: 'acetogenins, B vitamins, anti-inflammatory',       cal: 66  },
  dragon_fruit:  { name: 'Dragon Fruit',  emoji: '🐉', flavor: 'mild, refreshing',          benefit: 'betaine, antioxidants, prebiotic fibre',          cal: 60  },
  passion_fruit: { name: 'Passion Fruit', emoji: '💜', flavor: 'intensely aromatic, tart',  benefit: 'piceatannol, slow-release carbs, vitamin A',      cal: 97  },
  lychee:        { name: 'Lychee',        emoji: '🍒', flavor: 'floral, sweet',             benefit: 'oligonol antioxidants, vitamin C, copper',        cal: 66  },
  tamarind:      { name: 'Tamarind',      emoji: '🟤', flavor: 'tangy, complex',            benefit: 'HCA, prebiotic fibre, magnesium, tartaric acid',  cal: 239 },
  breadfruit:    { name: 'Breadfruit',    emoji: '🫒', flavor: 'starchy, mildly sweet',     benefit: 'resistant starch, potassium, sustained energy',   cal: 103 },
};

const EBOOK_MAP: Record<string, { slug: string; title: string }> = {
  smoothie: { slug: 'tropical-juice-smoothie-recipes', title: 'Tropical Juice & Smoothie Recipe Book' },
  juice:    { slug: 'tropical-juice-smoothie-recipes', title: 'Tropical Juice & Smoothie Recipe Book' },
  tonic:    { slug: 'healing-drinks',                  title: 'Tropical Superfruit Healing Drinks' },
  bowl:     { slug: 'tropical-fruit-desserts',         title: 'Tropical Fruit Desserts' },
  shot:     { slug: 'pre-workout-drinks',              title: 'Island Pre-Workout Natural Drinks' },
};

function normaliseFruit(input: string): FruitProfile | null {
  const key = input.toLowerCase().trim().replace(/\s+/g, '_').replace(/-/g, '_');
  return FRUIT_PROFILES[key] ?? null;
}

function estimateCals(fruits: FruitProfile[], type: RecipeType): number {
  const base = fruits.reduce((sum, f) => sum + Math.round(f.cal * 0.6), 0);
  const extras: Record<RecipeType, number> = { smoothie: 40, juice: 20, tonic: 15, bowl: 120, shot: 10 };
  return base + extras[type];
}

function generateRecipe(raw: string[], type: RecipeType): GeneratedRecipe | null {
  const resolved = raw.map(normaliseFruit).filter(Boolean) as FruitProfile[];
  if (!resolved.length) return null;

  const primary   = resolved[0];
  const secondary = resolved[1];
  const allNames  = resolved.map(f => f.name);
  const emojis    = resolved.map(f => f.emoji).join('');

  const typeMeta: Record<RecipeType, { verb: string; vessel: string; prepTime: string; servings: string }> = {
    smoothie: { verb: 'Blend',  vessel: 'blender',         prepTime: '5 min',  servings: '1 glass (350ml)' },
    juice:    { verb: 'Juice',  vessel: 'juicer / blender', prepTime: '5 min',  servings: '1 glass (250ml)' },
    tonic:    { verb: 'Brew',   vessel: 'saucepan',         prepTime: '10 min', servings: '2 cups' },
    bowl:     { verb: 'Blend',  vessel: 'blender',          prepTime: '8 min',  servings: '1 bowl' },
    shot:     { verb: 'Blend',  vessel: 'blender / press',  prepTime: '3 min',  servings: '2 shots (60ml)' },
  };
  const meta = typeMeta[type];
  const cal  = estimateCals(resolved, type);

  const titles: Record<RecipeType, string> = {
    smoothie: `${primary.name} ${secondary ? `& ${secondary.name} ` : ''}Caribbean Smoothie`,
    juice:    `Fresh ${allNames.join(' & ')} Tropical Juice`,
    tonic:    `${primary.name} Healing Tonic`,
    bowl:     `${primary.name} ${secondary ? `& ${secondary.name} ` : ''}Smoothie Bowl`,
    shot:     `${primary.name} Power Shot`,
  };

  const intros: Record<RecipeType, string> = {
    smoothie: `A creamy, vibrant Caribbean smoothie built around ${resolved.map(f => `${f.emoji} ${f.name}`).join(', ')}. Each sip delivers ${primary.benefit}${secondary ? ` plus ${secondary.benefit}` : ''} — the natural energy the islands run on.`,
    juice:    `This refreshing tropical juice combines the ${primary.flavor} notes of ${primary.name}${secondary ? ` with the ${secondary.flavor} character of ${secondary.name}` : ''}, delivering a cold-pressed Caribbean experience packed with natural vitamins.`,
    tonic:    `A traditional Caribbean healing tonic featuring ${primary.name} as the hero ingredient. Rich in ${primary.benefit}, this warm drink has been used across the islands for generations to support wellness and vitality.`,
    bowl:     `A vibrant, nutrient-dense smoothie bowl that brings the Caribbean breakfast table to life. Topped with fresh fruit and seeds, it's as beautiful as it is nourishing.`,
    shot:     `A concentrated ${primary.name} power shot designed for pre-workout performance. Delivers ${primary.benefit} in 60ml — no synthetic ingredients, pure Caribbean fuel.`,
  };

  const ingredientsByType: Record<RecipeType, string[]> = {
    smoothie: [
      `${resolved[0] ? `150g ${resolved[0].name}, cubed` : ''}`,
      resolved[1] ? `100g ${resolved[1].name}, cubed` : '1 frozen banana',
      '200ml coconut water (or almond milk)',
      '1 tsp fresh ginger, grated',
      'Juice of ½ lime',
      '4–5 ice cubes',
      '1 tsp raw honey (optional)',
    ].filter(Boolean),
    juice: [
      `${resolved[0] ? `200g ${resolved[0].name}` : ''}`,
      resolved[1] ? `150g ${resolved[1].name}` : '½ cucumber',
      '1 cup water (adjust for consistency)',
      'Juice of 1 lime',
      '½ tsp fresh ginger',
      'Pinch of Himalayan salt',
    ].filter(Boolean),
    tonic: [
      `${resolved[0] ? `2–3 ${resolved[0].name} leaves or 150g fruit` : ''}`,
      '500ml filtered water',
      '1 cinnamon stick',
      '3 cloves',
      '1 tsp raw honey (add after cooling)',
      'Juice of ½ lemon',
    ].filter(Boolean),
    bowl: [
      `${resolved[0] ? `200g frozen ${resolved[0].name}` : ''}`,
      resolved[1] ? `100g ${resolved[1].name}` : '1 frozen banana',
      '100ml coconut milk',
      '2 tbsp granola (topping)',
      '1 tbsp pumpkin seeds (topping)',
      '1 tbsp raw honey (drizzle)',
      'Fresh mint to garnish',
    ].filter(Boolean),
    shot: [
      `${resolved[0] ? `150g ${resolved[0].name}` : ''}`,
      resolved[1] ? `50g ${resolved[1].name}` : '',
      '50ml coconut water',
      'Juice of ½ lime',
      '½ cm fresh ginger',
      '1 tsp raw honey',
      'Pinch of cayenne (optional)',
    ].filter(v => v),
  };

  const instructionsByType: Record<RecipeType, string[]> = {
    smoothie: [
      'Add coconut water to blender first (prevents air pockets).',
      `Add ${allNames.join(', ')} and ginger.`,
      'Squeeze in lime juice and add ice.',
      'Blend on high for 45–60 seconds until completely smooth.',
      'Taste — add honey only if needed.',
      'Pour immediately and consume fresh for maximum enzyme activity.',
    ],
    juice: [
      `Wash and prep all fruit — chop ${allNames.join(' and ')} into rough chunks.`,
      'If juicing: run through juicer. If blending: add water first, then fruit.',
      'Blend for 60 seconds, then strain through fine mesh sieve.',
      'Add lime juice, ginger, and salt. Stir well.',
      'Serve over ice immediately.',
    ],
    tonic: [
      'Bring water to 90°C (not full boil — preserves active compounds).',
      `Add ${primary.name} and spices.`,
      'Reduce heat and simmer gently for 15 minutes.',
      'Strain through fine sieve. Allow to cool slightly (5 minutes).',
      'Add honey and lemon juice only after cooling — heat destroys their enzymes.',
      'Drink warm. Store remainder in fridge for up to 24 hours.',
    ],
    bowl: [
      `Blend frozen ${allNames.join(', ')} with coconut milk until thick and smooth.`,
      'The mixture should be thick — add liquid 1 tbsp at a time only if needed.',
      'Pour into a wide bowl.',
      'Top with granola, pumpkin seeds, fresh fruit slices, and a drizzle of honey.',
      'Garnish with mint. Eat immediately before it melts.',
    ],
    shot: [
      `Blend ${allNames.join(', ')}, coconut water, and ginger on high for 30 seconds.`,
      'Strain through fine mesh to concentrate the liquid.',
      'Add lime juice, honey, and cayenne if using.',
      'Pour into shot glasses (2 x 30ml shots).',
      'Consume both shots 20–30 minutes before training.',
    ],
  };

  return {
    title:        titles[type],
    emoji:        emojis,
    servings:     meta.servings,
    prepTime:     meta.prepTime,
    calories:     `~${cal} cal`,
    intro:        intros[type],
    ingredients:  ingredientsByType[type],
    instructions: instructionsByType[type],
    benefits:     resolved.map(f => `**${f.name}:** ${f.benefit}`),
    bestTime:     type === 'smoothie' ? 'Morning or 30 min before workout'
                : type === 'tonic'   ? 'Evening or when unwell'
                : type === 'shot'    ? '20–30 min before training'
                : type === 'bowl'    ? 'Breakfast or post-workout'
                : 'Any time of day',
    ebookSlug:    EBOOK_MAP[type].slug,
    ebookTitle:   EBOOK_MAP[type].title,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  /** If provided, renders as inline section; otherwise full-page */
  compact?: boolean;
}

export function RecipeGenerator({ compact = false }: Props) {
  const [step,      setStep]      = useState<'input' | 'email' | 'result'>('input');
  const [fruits,    setFruits]    = useState('');
  const [type,      setType]      = useState<RecipeType>('smoothie');
  const [email,     setEmail]     = useState('');
  const [emailErr,  setEmailErr]  = useState('');
  const [busy,      setBusy]      = useState(false);
  const [recipe,    setRecipe]    = useState<GeneratedRecipe | null>(null);
  const [genErr,    setGenErr]    = useState('');

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleGenerate = () => {
    const raw = fruits.split(',').map(s => s.trim()).filter(Boolean);
    if (!raw.length) { setGenErr('Enter at least one fruit name.'); return; }
    const result = generateRecipe(raw, type);
    if (!result) { setGenErr('Could not recognise those fruits. Try: mango, papaya, pineapple, banana, coconut, soursop, guava, lychee, dragon fruit, passion fruit, tamarind.'); return; }
    setGenErr('');
    setRecipe(result);
    if (hasCapturedEmail()) {
      setStep('result');
    } else {
      setStep('email');
    }
  };

  const handleEmailSubmit = () => {
    if (!emailValid) { setEmailErr('Please enter a valid email.'); return; }
    setBusy(true);
    captureEmail(email.trim(), 'homepage', 'general');
    trackEvent('emailCaptured');
    creditReferralSignup();
    setTimeout(() => { setBusy(false); setStep('result'); }, 500);
  };

  const reset = () => { setStep('input'); setFruits(''); setRecipe(null); setGenErr(''); };

  const typeOptions: { value: RecipeType; label: string; emoji: string }[] = [
    { value: 'smoothie', label: 'Smoothie', emoji: '🥤' },
    { value: 'juice',    label: 'Juice',    emoji: '🍹' },
    { value: 'tonic',    label: 'Tonic',    emoji: '🌿' },
    { value: 'bowl',     label: 'Bowl',     emoji: '🫙' },
    { value: 'shot',     label: 'Shot',     emoji: '⚡' },
  ];

  const wrapper = compact
    ? 'w-full'
    : 'min-h-screen bg-cream flex flex-col items-center justify-start py-12 px-4';

  return (
    <div className={wrapper}>
      <div className="w-full max-w-2xl mx-auto">

        {/* ── STEP 1: INPUT ── */}
        {step === 'input' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-leaf/10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🤖</div>
              <div>
                <h2 className="font-heading text-xl font-black text-charcoal">AI Recipe Generator</h2>
                <p className="text-xs text-charcoal-light">Type your favourite Caribbean fruits → get a personalised recipe instantly</p>
              </div>
            </div>

            {/* Fruit input */}
            <label className="block text-sm font-bold text-charcoal mb-2">
              Which fruits do you have? <span className="text-charcoal-light font-normal">(separate with commas)</span>
            </label>
            <input
              type="text"
              value={fruits}
              onChange={e => { setFruits(e.target.value); setGenErr(''); }}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g. mango, papaya, coconut"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-leaf focus:outline-none text-charcoal text-sm mb-3"
            />

            {/* Quick-pick chips */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {['mango', 'papaya', 'pineapple', 'banana', 'coconut', 'soursop', 'guava', 'lychee', 'passion fruit', 'dragon fruit', 'tamarind'].map(f => (
                <button
                  key={f}
                  onClick={() => setFruits(v => v ? `${v}, ${f}` : f)}
                  className="text-[10px] px-2 py-1 rounded-full bg-leaf/8 text-leaf hover:bg-leaf/15 transition-colors font-semibold border border-leaf/15"
                >
                  + {f}
                </button>
              ))}
            </div>

            {/* Recipe type */}
            <label className="block text-sm font-bold text-charcoal mb-2">Recipe Type</label>
            <div className="grid grid-cols-5 gap-2 mb-5">
              {typeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                    type === opt.value
                      ? 'bg-leaf text-white border-leaf shadow-md scale-105'
                      : 'bg-white text-charcoal border-gray-200 hover:border-leaf hover:text-leaf'
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            {genErr && <p className="text-red-500 text-xs mb-3">{genErr}</p>}

            <button onClick={handleGenerate} className="w-full btn-primary py-3.5 text-base">
              🌴 Generate My Recipe
            </button>

            <p className="text-[10px] text-charcoal-light text-center mt-3">
              Powered by IslandFruitGuide's Caribbean recipe system · 100% free
            </p>
          </div>
        )}

        {/* ── STEP 2: EMAIL GATE ── */}
        {step === 'email' && recipe && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{recipe.emoji}</div>
              <h2 className="font-heading text-xl font-black text-charcoal mb-1">
                Your Recipe is Ready! 🎉
              </h2>
              <p className="text-sm font-bold text-charcoal">{recipe.title}</p>
              <p className="text-xs text-charcoal-light mt-1">
                Enter your email to unlock your personalised recipe + 5 free bonus recipes
              </p>
            </div>

            {/* Preview tease */}
            <div className="bg-leaf/5 rounded-xl p-4 mb-5 border border-leaf/15">
              <p className="text-xs text-charcoal-light italic line-clamp-2">{recipe.intro}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-leaf/40 rounded-full" style={{ width: '35%' }} />
                </div>
                <span className="text-[10px] text-charcoal-light">Recipe unlocks on email submission</span>
              </div>
            </div>

            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
              onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
              placeholder="your@email.com"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-leaf focus:outline-none text-charcoal text-sm mb-2"
            />
            {emailErr && <p className="text-red-500 text-xs mb-2">{emailErr}</p>}
            <button
              onClick={handleEmailSubmit}
              disabled={!emailValid || busy}
              className="w-full btn-primary py-3.5 mb-3 disabled:opacity-50"
            >
              {busy ? '✓ Unlocking...' : '🔓 Unlock My Recipe'}
            </button>
            <button onClick={reset} className="w-full text-xs text-charcoal-light hover:text-charcoal text-center transition-colors">
              ← Try different fruits
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">🔒 No spam. Unsubscribe anytime.</p>
          </div>
        )}

        {/* ── STEP 3: RESULT ── */}
        {step === 'result' && recipe && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-leaf to-leaf-dark px-8 py-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-3xl mb-1">{recipe.emoji}</div>
                  <h2 className="font-heading text-2xl font-black leading-tight">{recipe.title}</h2>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-white/80">
                    <span>⏱ {recipe.prepTime}</span>
                    <span>👤 {recipe.servings}</span>
                    <span>🔥 {recipe.calories}</span>
                  </div>
                </div>
                <button onClick={reset} className="text-white/60 hover:text-white text-sm flex-shrink-0 mt-1">
                  ← New Recipe
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Intro */}
              <p className="text-charcoal-light text-sm leading-relaxed">{recipe.intro}</p>

              {/* Ingredients */}
              <div>
                <h3 className="font-heading font-bold text-charcoal mb-3 flex items-center gap-2">
                  <span className="text-leaf">🧺</span> Ingredients
                </h3>
                <ul className="space-y-1.5">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-charcoal-light">
                      <span className="text-leaf mt-0.5 flex-shrink-0">✓</span>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-heading font-bold text-charcoal mb-3 flex items-center gap-2">
                  <span className="text-leaf">📋</span> Instructions
                </h3>
                <ol className="space-y-2">
                  {recipe.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-charcoal-light">
                      <span className="font-black text-leaf flex-shrink-0 w-5 text-right">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Benefits */}
              <div className="bg-leaf/5 rounded-xl p-4 border border-leaf/15">
                <h3 className="font-heading font-bold text-charcoal mb-2 text-sm flex items-center gap-2">
                  <span>💚</span> Health Benefits
                </h3>
                <ul className="space-y-1">
                  {recipe.benefits.map((b, i) => (
                    <li key={i} className="text-xs text-charcoal-light"
                      dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong class="text-charcoal">$1</strong>') }}
                    />
                  ))}
                </ul>
                <p className="text-xs text-leaf font-bold mt-3">⏰ Best time: {recipe.bestTime}</p>
              </div>

              {/* Upsell */}
              <div className="bg-gradient-to-r from-mango/10 to-amber-50 rounded-xl p-5 border border-mango/20">
                <p className="text-xs text-charcoal-light mb-1">📚 Want 50+ more recipes like this?</p>
                <p className="font-bold text-charcoal text-sm mb-3">
                  This recipe style is from our <span className="text-leaf">{recipe.ebookTitle}</span> ebook.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/store/${recipe.ebookSlug}`)}
                    className="flex-1 btn-primary py-2.5 text-sm"
                  >
                    Get the Full Ebook →
                  </button>
                  <button
                    onClick={() => navigate('/store')}
                    className="px-4 py-2.5 text-sm font-semibold text-leaf hover:text-leaf-dark border border-leaf/30 rounded-xl hover:bg-leaf/5 transition-colors"
                  >
                    Browse Store
                  </button>
                </div>
              </div>

              {/* Share */}
              <ShareRow recipeTitle={recipe.title} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Share row ─────────────────────────────────────────────────────────────────
function ShareRow({ recipeTitle }: { recipeTitle: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : 'https://islandfruitguide.com';
  const text = `Just generated "${recipeTitle}" on IslandFruitGuide! Try it free 🌴 ${url}`;

  const copy = () => {
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div>
      <p className="text-xs text-charcoal-light mb-2 font-bold">Share this recipe:</p>
      <div className="flex gap-2">
        <button
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')}
          className="flex-1 text-xs py-2 rounded-lg bg-sky-50 text-sky-600 font-bold hover:bg-sky-100 transition-colors border border-sky-100"
        >
          🐦 Twitter
        </button>
        <button
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')}
          className="flex-1 text-xs py-2 rounded-lg bg-green-50 text-green-600 font-bold hover:bg-green-100 transition-colors border border-green-100"
        >
          💬 WhatsApp
        </button>
        <button
          onClick={copy}
          className="flex-1 text-xs py-2 rounded-lg bg-gray-50 text-charcoal font-bold hover:bg-gray-100 transition-colors border border-gray-200"
        >
          {copied ? '✓ Copied!' : '🔗 Copy Link'}
        </button>
      </div>
    </div>
  );
}
