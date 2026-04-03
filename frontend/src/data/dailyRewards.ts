// ── Storage keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEY_HIGH_SCORE   = 'ifg_game_high_score';
export const STORAGE_KEY_EMAIL        = 'ifg_game_email';
export const STORAGE_KEY_DAILY_DAY    = 'ifg_daily_day';      // ISO date string YYYY-MM-DD
export const STORAGE_KEY_DAILY_STREAK = 'ifg_daily_streak';   // number
export const STORAGE_KEY_XP           = 'ifg_game_xp';

// ── XP / Level system ─────────────────────────────────────────────────────────
export const XP_PER_POINT = 1;           // 1 pt caught = 1 XP
export const XP_PER_LEVEL = 100;         // every 100 XP = 1 level

export function calcLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function xpProgressPct(xp: number): number {
  return (xpIntoCurrentLevel(xp) / XP_PER_LEVEL) * 100;
}

// ── Daily reward definitions ──────────────────────────────────────────────────
export interface DailyReward {
  day: number;
  emoji: string;
  title: string;
  message: string;
  xpBonus: number;
  isPremium: boolean;  // premium = triggers email gate
}

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, emoji: '🥭', title: 'Day 1 — Welcome Back!',         message: 'You showed up! +20 bonus XP to start your streak.',               xpBonus: 20,  isPremium: false },
  { day: 2, emoji: '🍍', title: 'Day 2 — Pineapple Power!',      message: 'Two days strong! +30 XP and a sneak peek at our Smoothie Book.',   xpBonus: 30,  isPremium: false },
  { day: 3, emoji: '🥥', title: 'Day 3 — Coconut Champion!',     message: '3-day streak! +40 XP. You\'re building island momentum.',          xpBonus: 40,  isPremium: false },
  { day: 4, emoji: '🍌', title: 'Day 4 — Banana Booster!',       message: '4 days! +50 XP. Unlock a recipe preview from our Desserts ebook.', xpBonus: 50,  isPremium: false },
  { day: 5, emoji: '🌴', title: 'Day 5 — Island Streak!',        message: '5-day streak! Premium reward unlocked. Enter your email to claim.', xpBonus: 75,  isPremium: true  },
  { day: 6, emoji: '🍊', title: 'Day 6 — Citrus Fire!',          message: '6 days of dedication! +80 XP. Almost a full week, legend.',        xpBonus: 80,  isPremium: false },
  { day: 7, emoji: '🏆', title: 'Day 7 — Weekly Champion!',      message: 'A FULL WEEK! +100 XP + 10% off your first ebook purchase.',        xpBonus: 100, isPremium: true  },
];

// Loops after day 7
export function getDailyRewardForDay(day: number): DailyReward {
  const idx = ((day - 1) % DAILY_REWARDS.length);
  return DAILY_REWARDS[idx];
}

// ── Safe localStorage helpers ─────────────────────────────────────────────────
function getItem(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function setItem(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* noop */ }
}

// ── Today's date as YYYY-MM-DD ────────────────────────────────────────────────
function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Check & advance daily reward ─────────────────────────────────────────────
export interface DailyCheckResult {
  isNewDay: boolean;
  currentDay: number;
  streak: number;
  reward: DailyReward;
}

export function checkAndAdvanceDailyReward(): DailyCheckResult {
  const today    = todayStr();
  const lastDay  = getItem(STORAGE_KEY_DAILY_DAY);
  const streak   = parseInt(getItem(STORAGE_KEY_DAILY_STREAK) ?? '0', 10) || 0;
  const isNewDay = lastDay !== today;

  let newStreak = streak;
  if (isNewDay) {
    newStreak = streak + 1;
    setItem(STORAGE_KEY_DAILY_DAY, today);
    setItem(STORAGE_KEY_DAILY_STREAK, String(newStreak));
    // Award XP bonus
    const reward = getDailyRewardForDay(newStreak);
    const currentXp = parseInt(getItem(STORAGE_KEY_XP) ?? '0', 10) || 0;
    setItem(STORAGE_KEY_XP, String(currentXp + reward.xpBonus));
  }

  return {
    isNewDay,
    currentDay: newStreak,
    streak: newStreak,
    reward: getDailyRewardForDay(newStreak),
  };
}

// ── XP helpers ────────────────────────────────────────────────────────────────
export function loadXP(): number {
  return parseInt(getItem(STORAGE_KEY_XP) ?? '0', 10) || 0;
}

export function addXP(amount: number): number {
  const next = loadXP() + amount;
  setItem(STORAGE_KEY_XP, String(next));
  return next;
}

// ── Score / high score ────────────────────────────────────────────────────────
export function loadHighScore(): number {
  return parseInt(getItem(STORAGE_KEY_HIGH_SCORE) ?? '0', 10) || 0;
}

export function saveHighScore(score: number): number {
  const best = Math.max(score, loadHighScore());
  setItem(STORAGE_KEY_HIGH_SCORE, String(best));
  return best;
}

// ── Email ─────────────────────────────────────────────────────────────────────
export function loadEmail(): string {
  return getItem(STORAGE_KEY_EMAIL) ?? '';
}

export function saveEmail(email: string): void {
  setItem(STORAGE_KEY_EMAIL, email.trim().toLowerCase());
}

export function hasEmail(): boolean {
  return loadEmail().length > 0;
}
