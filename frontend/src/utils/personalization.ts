export interface RecentState {
  fruits: string[];
  recipes: string[];
}

const STORAGE_KEY = "ifg_recent_views";

const getEmptyState = (): RecentState => ({ fruits: [], recipes: [] });

const safeParse = (value: string | null): RecentState => {
  if (!value) return getEmptyState();
  try {
    const parsed = JSON.parse(value) as RecentState;
    return {
      fruits: Array.isArray(parsed.fruits) ? parsed.fruits : [],
      recipes: Array.isArray(parsed.recipes) ? parsed.recipes : [],
    };
  } catch {
    return getEmptyState();
  }
};

const readState = (): RecentState => {
  if (typeof window === "undefined") return getEmptyState();
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
};

const writeState = (state: RecentState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const pushUnique = (list: string[], value: string, max = 8): string[] => {
  const next = [value, ...list.filter(item => item !== value)];
  return next.slice(0, max);
};

export const recordFruitView = (id: string) => {
  const state = readState();
  const fruits = pushUnique(state.fruits, id);
  writeState({ ...state, fruits });
};

export const recordRecipeView = (id: string) => {
  const state = readState();
  const recipes = pushUnique(state.recipes, id);
  writeState({ ...state, recipes });
};

export const getRecentState = (): RecentState => readState();
