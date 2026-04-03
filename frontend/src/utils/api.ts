// ── IslandFruitGuide API Client ───────────────────────────────────────────────
// Single file that fronts all calls to the Node/Express backend.
// Import and use instead of calling fetch() directly anywhere in the app.

const BASE = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL
  || '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  let url = `${BASE}${path}`;

  if (params) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString();
    url += `?${qs}`;
  }

  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error(err.error || `API error ${res.status}`), { status: res.status });
  }

  return res.json() as Promise<T>;
}

// ── Type interfaces ────────────────────────────────────────────────────────────

export interface ApiFruit {
  id: string; name: string; slug: string; scientific_name: string;
  category: string; image_url: string; short_description: string;
  is_seasonal?: boolean;
}

export interface ApiRecipe {
  id: string; title: string; slug: string; image_url: string;
  prep_time: string; cook_time: string; difficulty: string;
  description: string; related_fruit_ids: string[];
  ingredients?: string[]; instructions?: string[];
}

export interface ApiEbook {
  id: string; title: string; slug: string; category: string;
  price: number; original_price?: number; short_description: string;
  cover_image: string; is_featured: boolean; page_count: number;
  file_format: string; features?: string[];
  long_description?: string; table_of_contents?: string[];
}

export interface ApiGameSession {
  email?: string; score: number; level?: number;
  xp?: number; rewardsUnlocked?: number[];
}

export interface ApiLeaderboardEntry {
  email: string; score: number; level: number; xp: number; played_at: string;
}

export interface ApiPaymentOrder {
  orderId: string; approvalUrl: string; paypalOrderId: string;
}

export interface ApiGeneratedRecipe {
  title: string; emoji: string; servings: string; prepTime: string;
  calories: string; intro: string; ingredients: string[];
  instructions: string[]; benefits: string[]; bestTime: string;
  culturalNote?: string;
}

// ── Fruits ─────────────────────────────────────────────────────────────────────

export const api = {

  fruits: {
    list: (params?: { page?: number; limit?: number; search?: string; category?: string }) =>
      request<{ fruits: ApiFruit[]; total: number; page: number; limit: number }>(
        'GET', '/api/fruits', undefined, params as Record<string, string | number | boolean>
      ),
    get: (slug: string) =>
      request<ApiFruit>('GET', `/api/fruits/${slug}`),
    seasonal: () =>
      request<{ fruits: ApiFruit[]; month: number }>('GET', '/api/fruits/seasonal'),
    byCategory: (category: string) =>
      request<{ fruits: ApiFruit[] }>('GET', `/api/fruits/category/${category}`),
  },

  // ── Recipes ────────────────────────────────────────────────────────────────
  recipes: {
    list: (params?: { page?: number; limit?: number; search?: string; fruitId?: string }) =>
      request<{ recipes: ApiRecipe[]; total: number }>(
        'GET', '/api/recipes', undefined, params as Record<string, string | number | boolean>
      ),
    get: (slug: string) =>
      request<ApiRecipe>('GET', `/api/recipes/${slug}`),
    featured: () =>
      request<{ recipes: ApiRecipe[] }>('GET', '/api/recipes/featured'),
    generate: (fruits: string[], recipeType = 'smoothie') =>
      request<{ recipe: ApiGeneratedRecipe }>(
        'POST', '/api/recipes/generate', { fruits, recipeType }
      ),
  },

  // ── Ebooks ─────────────────────────────────────────────────────────────────
  ebooks: {
    list: (params?: { page?: number; limit?: number; category?: string }) =>
      request<{ ebooks: ApiEbook[]; total: number }>(
        'GET', '/api/ebooks', undefined, params as Record<string, string | number | boolean>
      ),
    get: (slug: string) =>
      request<ApiEbook>('GET', `/api/ebooks/${slug}`),
    download: (slug: string, email: string) =>
      request<{ downloadUrl: string; title: string }>(
        'GET', `/api/ebooks/${slug}/download`, undefined, { email }
      ),
    captureEmail: (email: string, source = 'store', productSlug?: string) =>
      request<{ success: boolean }>(
        'POST', '/api/ebooks/capture-email', { email, source, productSlug }
      ),
  },

  // ── Game ───────────────────────────────────────────────────────────────────
  game: {
    saveSession: (session: ApiGameSession) =>
      request<{ session: ApiGameSession }>('POST', '/api/game/session', session),
    leaderboard: (limit = 20) =>
      request<{ leaderboard: ApiLeaderboardEntry[] }>(
        'GET', '/api/game/leaderboard', undefined, { limit }
      ),
    personalBest: (email: string) =>
      request<{ best: ApiGameSession | null }>(
        'GET', '/api/game/personal-best', undefined, { email }
      ),
    saveReferral: (referralCode: string, referredEmail: string, source = 'game') =>
      request<{ success: boolean }>(
        'POST', '/api/game/referral', { referralCode, referredEmail, source }
      ),
  },

  // ── Payments ───────────────────────────────────────────────────────────────
  payments: {
    createOrder: (productSlug: string, email: string, returnUrl: string, cancelUrl: string) =>
      request<ApiPaymentOrder>(
        'POST', '/api/payments/create-order',
        { productSlug, email, returnUrl, cancelUrl }
      ),
    captureOrder: (paypalOrderId: string, orderId: string) =>
      request<{ success: boolean }>(
        'POST', '/api/payments/capture-order', { paypalOrderId, orderId }
      ),
    verifyPurchase: (orderId: string) =>
      request<{ status: string; product_slug: string; email: string }>(
        'GET', `/api/payments/verify/${orderId}`
      ),
  },

  // ── Health ─────────────────────────────────────────────────────────────────
  health: () => request<{ status: string; env: string }>('GET', '/health'),
};

export default api;
