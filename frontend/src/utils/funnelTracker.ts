// ── Funnel Tracker ────────────────────────────────────────────────────────────
// Tracks user funnel events entirely in localStorage. No backend required.
// All keys are prefixed with 'ifg_funnel_' to avoid collisions.

export type FunnelSource   = 'game' | 'store' | 'homepage' | 'recipe' | 'fruit';
export type FunnelInterest = 'smoothies' | 'fat-loss' | 'healing' | 'energy' | 'desserts' | 'recipes' | 'encyclopedia' | 'general';
export type FunnelEvent    = 'emailCaptured' | 'rewardUnlocked' | 'productViewed' | 'purchaseIntent' | 'leadMagnetDelivered' | 'offerShown' | 'upsellShown';

export interface FunnelProfile {
  email:              string;
  source:             FunnelSource;
  interest:           FunnelInterest;
  events:             Record<FunnelEvent, number>; // event → timestamp ms
  productViews:       string[];                    // slugs viewed
  lastSeen:           number;                      // timestamp ms
  sessionCount:       number;
}

const KEY = 'ifg_funnel_profile';

// ── Safe helpers ──────────────────────────────────────────────────────────────
function get(): FunnelProfile | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function set(profile: FunnelProfile): void {
  try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch { /* noop */ }
}

function blank(source: FunnelSource, interest: FunnelInterest): FunnelProfile {
  return {
    email: '',
    source,
    interest,
    events: {} as Record<FunnelEvent, number>,
    productViews: [],
    lastSeen: Date.now(),
    sessionCount: 0,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Initialise or update profile on each page load */
export function initFunnel(source: FunnelSource = 'homepage', interest: FunnelInterest = 'general'): void {
  const existing = get();
  if (existing) {
    existing.lastSeen = Date.now();
    existing.sessionCount += 1;
    set(existing);
  } else {
    const p = blank(source, interest);
    p.sessionCount = 1;
    set(p);
  }
}

/** Record a funnel event */
export function trackEvent(event: FunnelEvent): void {
  const p = get() ?? blank('homepage', 'general');
  p.events[event] = Date.now();
  p.lastSeen = Date.now();
  set(p);
}

/** Save email and source */
export function captureEmail(email: string, source: FunnelSource, interest: FunnelInterest): void {
  const p = get() ?? blank(source, interest);
  p.email    = email.trim().toLowerCase();
  p.source   = source;
  p.interest = interest;
  p.events['emailCaptured'] = Date.now();
  p.lastSeen = Date.now();
  set(p);
  // Also save to the game's email key for backward compat
  try { localStorage.setItem('ifg_game_email', p.email); } catch { /* noop */ }
}

/** Track a product page view */
export function trackProductView(slug: string): void {
  const p = get() ?? blank('store', 'general');
  if (!p.productViews.includes(slug)) p.productViews.push(slug);
  p.events['productViewed'] = Date.now();
  p.lastSeen = Date.now();
  set(p);
}

/** Mark purchase intent (checkout started) */
export function trackPurchaseIntent(): void { trackEvent('purchaseIntent'); }

/** Read full profile */
export function getProfile(): FunnelProfile | null { return get(); }

/** Check if email has been captured */
export function hasCapturedEmail(): boolean {
  const p = get();
  return !!(p?.email && p.email.length > 0);
}

/** Get captured email */
export function getCapturedEmail(): string {
  return get()?.email ?? '';
}

/** Infer interest from product slug */
export function inferInterest(slug: string): FunnelInterest {
  if (slug.includes('smoothie') || slug.includes('juice'))   return 'smoothies';
  if (slug.includes('fat-loss'))                              return 'fat-loss';
  if (slug.includes('healing') || slug.includes('medicinal')) return 'healing';
  if (slug.includes('gym') || slug.includes('pre-workout') || slug.includes('energy')) return 'energy';
  if (slug.includes('dessert'))                               return 'desserts';
  if (slug.includes('recipe') || slug.includes('pack'))       return 'recipes';
  if (slug.includes('encyclopedia') || slug.includes('guide')) return 'encyclopedia';
  return 'general';
}

/** Get a recommended product slug based on current interest */
export function getRecommendedSlug(interest: FunnelInterest): string {
  const map: Record<FunnelInterest, string> = {
    smoothies:    'tropical-juice-smoothie-recipes',
    'fat-loss':   'fat-loss-smoothies',
    healing:      'healing-drinks',
    energy:       'gym-energy-recipes',
    desserts:     'tropical-fruit-desserts',
    recipes:      'mango-recipe-pack',
    encyclopedia: 'caribbean-fruit-guide',
    general:      'tropical-juice-smoothie-recipes',
  };
  return map[interest];
}

// ── Extended behaviour tracking ───────────────────────────────────────────────
export type BehaviourEvent =
  | 'pageView'
  | 'fruitViewed'
  | 'recipeViewed'
  | 'gameStarted'
  | 'gameCompleted'
  | 'generatorUsed'
  | 'referralShared'
  | 'affiliateClick'
  | 'storeVisited'
  | 'searchPerformed';

const BEHAVIOUR_KEY = 'ifg_behaviour_log';

export interface BehaviourEntry {
  event:   BehaviourEvent;
  meta?:   string;
  ts:      number;
}

/** Append a behaviour event to the rolling log (max 100 entries) */
export function trackBehaviour(event: BehaviourEvent, meta?: string): void {
  try {
    const raw  = localStorage.getItem(BEHAVIOUR_KEY);
    const log: BehaviourEntry[] = raw ? JSON.parse(raw) : [];
    log.push({ event, meta, ts: Date.now() });
    // Keep last 100 only
    if (log.length > 100) log.splice(0, log.length - 100);
    localStorage.setItem(BEHAVIOUR_KEY, JSON.stringify(log));
  } catch { /* noop */ }
}

/** Read the full behaviour log */
export function getBehaviourLog(): BehaviourEntry[] {
  try {
    const raw = localStorage.getItem(BEHAVIOUR_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Affiliate tracking ────────────────────────────────────────────────────────
const AFFILIATE_KEY = 'ifg_affiliate';

/** Read ?ref= or ?aff= from URL and save it */
export function processAffiliateParam(): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  const code = params.get('ref') ?? params.get('aff') ?? '';
  if (code) {
    try {
      localStorage.setItem(AFFILIATE_KEY, code);
      trackBehaviour('affiliateClick', code);
    } catch { /* */ }
  }
  return code;
}

/** Get stored affiliate code (for attaching to purchase events) */
export function getAffiliateCode(): string {
  try { return localStorage.getItem(AFFILIATE_KEY) ?? ''; } catch { return ''; }
}
