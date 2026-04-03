// ── Referral System ───────────────────────────────────────────────────────────
// Generates unique referral codes, tracks shares, credits referrers.
// All state in localStorage — no backend required.

const KEY_CODE    = 'ifg_ref_code';
const KEY_REF_BY  = 'ifg_ref_by';      // code of person who referred this user
const KEY_CLICKS  = 'ifg_ref_clicks';  // how many times MY link was clicked
const KEY_SIGNUPS = 'ifg_ref_signups'; // how many emails captured via my link
const KEY_REWARDS = 'ifg_ref_rewards'; // XP rewards earned from referrals

export interface ReferralStats {
  code:    string;
  clicks:  number;
  signups: number;
  rewards: number; // XP
  refBy:   string; // who referred me
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function get(key: string): string { try { return localStorage.getItem(key) ?? ''; } catch { return ''; } }
function set(key: string, val: string): void { try { localStorage.setItem(key, val); } catch { /* */ } }
function getNum(key: string): number { return parseInt(get(key) || '0', 10) || 0; }

// ── Generate a short alphanumeric code ────────────────────────────────────────
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'IFG-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/** Get or create this user's referral code */
export function getMyCode(): string {
  let code = get(KEY_CODE);
  if (!code) {
    code = generateCode();
    set(KEY_CODE, code);
  }
  return code;
}

/** Build shareable referral URL */
export function getReferralUrl(path = '/'): string {
  const base = typeof window !== 'undefined'
    ? `${window.location.origin}${path}`
    : `https://islandfruitguide.com${path}`;
  return `${base}${path.includes('?') ? '&' : '?'}ref=${getMyCode()}`;
}

/** Called on page load — check if URL contains a ?ref= code */
export function processIncomingRef(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (!ref) return;
  // Don't credit self-referrals
  if (ref === get(KEY_CODE)) return;
  // Only record once
  if (!get(KEY_REF_BY)) {
    set(KEY_REF_BY, ref);
    // Credit the referrer's click count (stored under their code key)
    const refClickKey = `ifg_ref_click_${ref}`;
    set(refClickKey, String(getNum(refClickKey) + 1));
    set(KEY_CLICKS, String(getNum(KEY_CLICKS))); // reset my own
  }
}

/** Called when a referred user captures their email — credits original referrer */
export function creditReferralSignup(): void {
  const refBy = get(KEY_REF_BY);
  if (!refBy) return;
  const refSignupKey = `ifg_ref_signup_${refBy}`;
  const newCount = getNum(refSignupKey) + 1;
  set(refSignupKey, String(newCount));
  set(KEY_SIGNUPS, String(getNum(KEY_SIGNUPS)));
  // Award 50 XP bonus to user who was referred (encouragement)
  try {
    const xp = parseInt(localStorage.getItem('ifg_game_xp') ?? '0', 10) || 0;
    localStorage.setItem('ifg_game_xp', String(xp + 50));
  } catch { /* */ }
}

/** Get stats for displaying in UI */
export function getReferralStats(): ReferralStats {
  const code = getMyCode();
  return {
    code,
    clicks:  getNum(`ifg_ref_click_${code}`),
    signups: getNum(`ifg_ref_signup_${code}`),
    rewards: getNum(KEY_REWARDS),
    refBy:   get(KEY_REF_BY),
  };
}

/** Build share text for social/copy */
export function getShareText(path = '/'): { url: string; twitter: string; whatsapp: string } {
  const url = getReferralUrl(path);
  const msg = `I've been exploring Caribbean tropical fruits on IslandFruitGuide 🌴 — check it out! ${url}`;
  return {
    url,
    twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(msg)}`,
  };
}

/** Check URL for affiliate/ref param and save it */
export function getAffiliateCode(): string {
  return get(KEY_REF_BY);
}

/** Attach affiliate code to a purchase payload (simulation) */
export function attachAffiliate<T extends Record<string, unknown>>(payload: T): T & { affiliate?: string } {
  const code = get(KEY_REF_BY);
  return code ? { ...payload, affiliate: code } : payload;
}
