const STORAGE_KEY = "ifg_favorites";

export interface FavoritesState {
  fruits: string[];
  recipes: string[];
  products: string[];
}

const getEmpty = (): FavoritesState => ({ fruits: [], recipes: [], products: [] });

const read = (): FavoritesState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getEmpty();
    const parsed = JSON.parse(raw) as FavoritesState;
    return {
      fruits: Array.isArray(parsed.fruits) ? parsed.fruits : [],
      recipes: Array.isArray(parsed.recipes) ? parsed.recipes : [],
      products: Array.isArray(parsed.products) ? parsed.products : [],
    };
  } catch {
    return getEmpty();
  }
};

const write = (state: FavoritesState) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("favorites-changed"));
};

export const isFruitFavorited = (id: string): boolean => read().fruits.includes(id);
export const isRecipeFavorited = (id: string): boolean => read().recipes.includes(id);
export const isProductFavorited = (id: string): boolean => read().products.includes(id);

export const toggleFruitFavorite = (id: string): boolean => {
  const state = read();
  const idx = state.fruits.indexOf(id);
  if (idx === -1) { state.fruits.push(id); } else { state.fruits.splice(idx, 1); }
  write(state);
  return idx === -1;
};

export const toggleRecipeFavorite = (id: string): boolean => {
  const state = read();
  const idx = state.recipes.indexOf(id);
  if (idx === -1) { state.recipes.push(id); } else { state.recipes.splice(idx, 1); }
  write(state);
  return idx === -1;
};

export const toggleProductFavorite = (id: string): boolean => {
  const state = read();
  const idx = state.products.indexOf(id);
  if (idx === -1) { state.products.push(id); } else { state.products.splice(idx, 1); }
  write(state);
  return idx === -1;
};

export const getFavorites = (): FavoritesState => read();
export const getFavoriteCount = (): number => {
  const s = read();
  return s.fruits.length + s.recipes.length + s.products.length;
};
