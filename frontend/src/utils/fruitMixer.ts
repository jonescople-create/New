import { fruits, type Fruit } from "../data/fruits";

export type PreparationMethod =
  | "Juice"
  | "Ice Cream"
  | "Porridge"
  | "Sauce / Pepper Sauce"
  | "Stew"
  | "Dessert";

export type FlavorModifier = "Ginger" | "Coconut milk" | "Lime" | "Honey" | "Spices";

export interface MixerInput {
  primaryFruitId: string;
  secondaryFruitId?: string;
  method: PreparationMethod;
  modifiers: FlavorModifier[];
}

export interface GeneratedMixerRecipe {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  culturalNote: string;
  nutritionSummary: string;
  safetyNote: string;
  imageUrl?: string;
  imageAlt?: string;
}

export type MixStatus = "draft" | "submitted" | "approved" | "rejected";

export interface UserMix {
  id: string;
  createdAt: string;
  updatedAt: string;
  input: MixerInput;
  recipe: GeneratedMixerRecipe;
  status: MixStatus;
  chefsPick: boolean;
  lockedUnsafe: boolean;
  adminNote?: string;
}

const LS_KEY = "ifg_user_mixes_v1";

function uid() {
  return `mix_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

export function getFruitByIdStrict(id: string): Fruit {
  const f = fruits.find(x => x.id === id);
  if (!f) throw new Error(`Fruit not found: ${id}`);
  return f;
}

const methodVerb: Record<PreparationMethod, string> = {
  "Juice": "Juice",
  "Ice Cream": "Ice Cream",
  "Porridge": "Porridge",
  "Sauce / Pepper Sauce": "Pepper Sauce",
  "Stew": "Stew",
  "Dessert": "Dessert",
};

function modifierLine(mods: FlavorModifier[]): string {
  if (mods.length === 0) return "";
  const nice = mods.join(", ");
  return ` — with ${nice}`;
}

function pickSpice(mods: FlavorModifier[]) {
  return mods.includes("Spices") ? "pimento + cinnamon + nutmeg" : "nutmeg";
}

function buildIngredients(primary: Fruit, secondary: Fruit | null, method: PreparationMethod, mods: FlavorModifier[]): string[] {
  const p = primary.name;
  const s = secondary?.name;

  const hasGinger = mods.includes("Ginger");
  const hasCoconut = mods.includes("Coconut milk");
  const hasLime = mods.includes("Lime");
  const hasHoney = mods.includes("Honey");
  const hasSpices = mods.includes("Spices");

  if (method === "Juice") {
    return [
      `2 cups ripe ${p} flesh, prepared (seeds removed where applicable)`,
      s ? `1 cup ripe ${s} flesh, prepared` : `1/2 cup pineapple chunks (optional for brightness)`,
      `2 cups cold water or coconut water`,
      hasLime ? `1 tbsp fresh lime juice` : `1 tsp vanilla extract (optional)`,
      hasGinger ? `1 tsp grated ginger` : `pinch of salt`,
      hasHoney ? `1–2 tbsp honey (to taste)` : `1–2 tbsp cane sugar (to taste)`,
      hasSpices ? `pinch of ${pickSpice(mods)}` : `ice, to serve`,
    ];
  }

  if (method === "Ice Cream") {
    return [
      `1 1/2 cups ${p} pulp (seeded and strained)`,
      s ? `1/2 cup ${s} pulp (optional)` : `1/2 cup mango or banana (optional)`,
      `2 cups heavy cream (or chilled coconut cream)`,
      `1 can (397g) sweetened condensed milk`,
      hasLime ? `1 tsp lime zest` : `1 tsp vanilla extract`,
      hasSpices ? `1/4 tsp ground nutmeg` : `pinch of salt`,
      hasHoney ? `1 tbsp honey (optional)` : ``,
    ].filter(Boolean);
  }

  if (method === "Porridge") {
    return [
      `1 cup prepared ${p} pulp (seeded)`,
      s ? `1/2 cup ${s} pulp (optional)` : `1/2 cup ripe banana (optional)`,
      `3 cups water`,
      hasCoconut ? `1 cup coconut milk` : `1 cup evaporated milk`,
      `1/2 cup fine cornmeal or oats`,
      hasSpices ? `1/2 tsp mixed spice (${pickSpice(mods)})` : `1/4 tsp ground cinnamon`,
      hasGinger ? `1/2 tsp grated ginger` : `1 tsp vanilla extract`,
      hasHoney ? `1–2 tbsp honey` : `2 tbsp brown sugar`,
      `pinch of salt`,
    ];
  }

  if (method === "Sauce / Pepper Sauce") {
    return [
      `2 cups ${p} pulp (seeded and strained if needed)`,
      s ? `1 cup ${s} pulp (optional)` : `1/2 cup mango (optional)`,
      `1/2 cup white vinegar`,
      `1 small onion, chopped`,
      hasGinger ? `1 tbsp grated ginger` : `2 cloves garlic`,
      `1–2 scotch bonnet peppers (adjust to heat)`,
      hasLime ? `1 tbsp lime juice` : `1 tbsp lemon juice`,
      hasHoney ? `1 tbsp honey or brown sugar` : `1 tbsp brown sugar`,
      hasSpices ? `1/2 tsp allspice (pimento)` : `1/4 tsp allspice`,
      `1 tsp salt`,
    ];
  }

  if (method === "Stew") {
    return [
      `1 tbsp oil`,
      `1 small onion, sliced`,
      `2 cloves garlic, minced`,
      hasGinger ? `1 tsp grated ginger` : `1 tsp thyme`,
      `2 cups diced ${p} (or prepared pulp where applicable)`,
      s ? `1 cup diced ${s}` : `1 cup diced vegetables (carrot, pumpkin, or okra)`,
      hasCoconut ? `1 cup coconut milk` : `2 cups broth or water`,
      hasSpices ? `1/2 tsp curry powder + pinch of pimento` : `1/2 tsp curry powder`,
      hasLime ? `lime wedge to finish` : `salt and pepper to taste`,
    ];
  }

  // Dessert
  return [
    `1 1/2 cups ${p} pulp (seeded/strained if needed)`,
    s ? `1/2 cup ${s} pulp (optional)` : `1/2 cup mango or banana (optional)`,
    `1 cup yogurt or coconut yogurt`,
    hasHoney ? `1–2 tbsp honey` : `2 tbsp cane sugar`,
    hasLime ? `1 tbsp lime juice` : `1 tsp vanilla extract`,
    hasSpices ? `pinch of cinnamon + nutmeg` : `pinch of salt`,
    `fresh fruit or toasted coconut to serve`,
  ];
}

function buildSteps(method: PreparationMethod): string[] {
  if (method === "Juice") {
    return [
      "Prepare the fruit: remove peel/skin and discard any inedible seeds.",
      "Blend fruit with water (or coconut water) until smooth.",
      "Strain through a fine sieve if you prefer a smoother drink.",
      "Stir in sweetener and optional modifiers (lime, ginger, spices).",
      "Serve over ice. Refrigerate leftovers up to 24 hours.",
    ];
  }
  if (method === "Ice Cream") {
    return [
      "Prepare the fruit pulp (remove and discard all black seeds where applicable).",
      "Whip cream to soft peaks.",
      "Fold in condensed milk, fruit pulp, and optional flavor modifiers.",
      "Transfer to a container, cover, and freeze 6+ hours.",
      "Scoop and serve. Store frozen up to 2 weeks.",
    ];
  }
  if (method === "Porridge") {
    return [
      "Bring water to a gentle boil in a pot.",
      "Whisk in cornmeal/oats slowly to prevent lumps.",
      "Simmer 8–10 minutes, stirring until thick.",
      "Stir in fruit pulp, milk (or coconut milk), spices, and sweetener.",
      "Cook 2–3 minutes more, then serve warm.",
    ];
  }
  if (method === "Sauce / Pepper Sauce") {
    return [
      "Strain fruit pulp if needed to remove fiber and seeds.",
      "Simmer pulp with vinegar, onion, garlic/ginger, and peppers for 15–20 minutes.",
      "Blend carefully until smooth.",
      "Season with salt, lime, and spices. Simmer 5 minutes.",
      "Cool fully, then bottle and refrigerate up to 4 weeks.",
    ];
  }
  if (method === "Stew") {
    return [
      "Sauté onion and garlic in oil until fragrant.",
      "Add fruit and vegetables; cook 3–4 minutes.",
      "Pour in coconut milk or broth; add spices.",
      "Simmer 12–15 minutes until tender.",
      "Taste and finish with lime (optional). Serve warm.",
    ];
  }
  return [
    "Prepare fruit pulp (remove seeds where applicable).",
    "Mix fruit with yogurt/coconut yogurt and sweetener.",
    "Add lime/vanilla and spices to taste.",
    "Chill 20 minutes for best texture.",
    "Serve topped with fresh fruit or toasted coconut.",
  ];
}

function safetyNoteFor(primary: Fruit, method: PreparationMethod): string {
  // Visible, cautious, non-medical.
  const seedWarning = primary.name.toLowerCase().includes("soursop") || primary.name.toLowerCase().includes("sweetsop") || primary.scientific_name.toLowerCase().includes("annona")
    ? "Remove and discard all black seeds before blending or eating."
    : "Remove any inedible seeds/pits before use.";

  const rawOk = method === "Juice" || method === "Dessert" || method === "Ice Cream";
  const cooked = method === "Porridge" || method === "Stew" || method === "Sauce / Pepper Sauce";

  return `${seedWarning} ${rawOk ? "Use ripe fruit for best flavor." : ""} ${cooked ? "Cook thoroughly and store leftovers safely." : ""}`.trim();
}

function nutritionSummary(primary: Fruit, secondary: Fruit | null, mods: FlavorModifier[]): string {
  const bonus = mods.includes("Ginger") ? "Ginger adds a warming flavor." : "";
  const citrus = mods.includes("Lime") ? "Lime adds vitamin C and brightness." : "";
  const coconut = mods.includes("Coconut milk") ? "Coconut milk adds richness and calories." : "";

  const base = `Built around ${primary.name}${secondary ? ` + ${secondary.name}` : ""}. Typical tropical fruit recipes provide fiber, potassium, and vitamin C depending on ripeness and serving size.`;
  const add = [bonus, citrus, coconut].filter(Boolean).join(" ");
  return (base + (add ? ` ${add}` : "")).trim();
}

export function selectMixerImage(primary: Fruit, method: PreparationMethod): { url: string; alt: string } | undefined {
  // Exact fruit + preparation matches (1:1). Only return an image if it truly matches.
  const slug = primary.slug;

  const map: Record<string, Partial<Record<PreparationMethod, string>>> = {
    "soursop": { "Juice": "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/recipe-images/fruit-soursop-juice.webp" },
    "june-plum": { "Juice": "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/recipe-images/fruit-june-plum-juice.webp" },
    "hog-plum": { "Sauce / Pepper Sauce": "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/recipe-images/recipe-hog-plum-pepper-sauce.png" },
    "sweetsop": { "Ice Cream": "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/recipe-images/recipe-sweetsop-icecream.png" },
    "passion-fruit": { "Dessert": "https://raguzwxnrdanynjnppze.supabase.co/storage/v1/object/public/recipe-images/recipe-passion-fruit-mousse.png" },
  };

  const url = map[slug]?.[method];
  if (!url) return undefined;

  return {
    url,
    alt: `${primary.name} ${method} – IslandFruitGuide`,
  };
}

export function generateMixerRecipe(input: MixerInput): GeneratedMixerRecipe {
  const primary = getFruitByIdStrict(input.primaryFruitId);
  const secondary = input.secondaryFruitId ? getFruitByIdStrict(input.secondaryFruitId) : null;

  const title = `${primary.name}${secondary ? ` + ${secondary.name}` : ""} ${methodVerb[input.method]}${modifierLine(input.modifiers)}`;
  const description = `A guided IslandFruitGuide mix: ${input.method.toLowerCase()} built from Caribbean-inspired fruit pairings.`;

  const ingredients = buildIngredients(primary, secondary, input.method, input.modifiers);
  const steps = buildSteps(input.method).slice(0, 7);

  const culturalNote = "Cultural note: Caribbean kitchens often balance sweet fruit with lime, ginger, and warm spices — simple ingredients that stretch flavor without wasting food.";
  const nutrition = nutritionSummary(primary, secondary, input.modifiers);
  const safety = safetyNoteFor(primary, input.method);

  const exactImage = selectMixerImage(primary, input.method);
  const fruitHero = primary.image_url ? { url: primary.image_url, alt: `Fresh ${primary.name} tropical fruit – IslandFruitGuide` } : undefined;

  const chosen = exactImage ?? fruitHero;

  return {
    title,
    description,
    ingredients,
    steps,
    culturalNote,
    nutritionSummary: `Light nutrition summary: ${nutrition}`,
    safetyNote: `Safety note: ${safety}`,
    imageUrl: chosen?.url,
    imageAlt: chosen?.alt,
  };
}

export function loadUserMixes(): UserMix[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UserMix[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserMixes(mixes: UserMix[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(mixes));
}

export function createMix(input: MixerInput, status: MixStatus = "draft"): UserMix {
  const now = new Date().toISOString();
  const recipe = generateMixerRecipe(input);
  return {
    id: uid(),
    createdAt: now,
    updatedAt: now,
    input,
    recipe,
    status,
    chefsPick: false,
    lockedUnsafe: false,
  };
}

export function upsertMix(mix: UserMix) {
  const mixes = loadUserMixes();
  const idx = mixes.findIndex(m => m.id === mix.id);
  const updated: UserMix = { ...mix, updatedAt: new Date().toISOString() };
  if (idx >= 0) mixes[idx] = updated;
  else mixes.unshift(updated);
  saveUserMixes(mixes);
  return updated;
}

export function getMixById(id: string): UserMix | undefined {
  return loadUserMixes().find(m => m.id === id);
}

export function updateMixStatus(id: string, patch: Partial<Pick<UserMix, "status" | "chefsPick" | "lockedUnsafe" | "adminNote">>) {
  const mixes = loadUserMixes();
  const idx = mixes.findIndex(m => m.id === id);
  if (idx < 0) return;
  mixes[idx] = { ...mixes[idx], ...patch, updatedAt: new Date().toISOString() };
  saveUserMixes(mixes);
}
