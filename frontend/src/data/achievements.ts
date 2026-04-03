// ── Achievement System ─────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: (stats: GameStats) => boolean;
}

export interface GameStats {
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;
  fruitsTotal: number;
  gamesPlayed: number;
  powerUpsCollected: number;
  shieldsUsed: number;
  frenziesTriggered: number;
  level: number;
}

const STORAGE_KEY = 'ifg_achievements';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-blood',
    title: 'First Catch',
    description: 'Catch your first fruit',
    emoji: '🍎',
    condition: s => s.fruitsTotal >= 1,
  },
  {
    id: 'combo-starter',
    title: 'Combo Starter',
    description: 'Get a 5x combo',
    emoji: '🔥',
    condition: s => s.maxCombo >= 5,
  },
  {
    id: 'combo-king',
    title: 'Combo King',
    description: 'Get a 10x combo',
    emoji: '👑',
    condition: s => s.maxCombo >= 10,
  },
  {
    id: 'combo-god',
    title: 'Combo God',
    description: 'Get a 20x combo',
    emoji: '⚡',
    condition: s => s.maxCombo >= 20,
  },
  {
    id: 'centurion',
    title: 'Centurion',
    description: 'Score 100 points',
    emoji: '💯',
    condition: s => s.highScore >= 100,
  },
  {
    id: 'high-roller',
    title: 'High Roller',
    description: 'Score 300 points',
    emoji: '🎰',
    condition: s => s.highScore >= 300,
  },
  {
    id: 'legend',
    title: 'Caribbean Legend',
    description: 'Score 500 points',
    emoji: '🏆',
    condition: s => s.highScore >= 500,
  },
  {
    id: 'thousand',
    title: 'Fruit Immortal',
    description: 'Score 1000 points',
    emoji: '🌟',
    condition: s => s.highScore >= 1000,
  },
  {
    id: 'power-collector',
    title: 'Power Collector',
    description: 'Collect 10 power-ups total',
    emoji: '⭐',
    condition: s => s.powerUpsCollected >= 10,
  },
  {
    id: 'shield-master',
    title: 'Shield Master',
    description: 'Block 5 hits with shields',
    emoji: '🛡️',
    condition: s => s.shieldsUsed >= 5,
  },
  {
    id: 'frenzy-fan',
    title: 'Frenzy Fan',
    description: 'Trigger 3 frenzies',
    emoji: '🌪️',
    condition: s => s.frenziesTriggered >= 3,
  },
  {
    id: 'level-5',
    title: 'Getting Serious',
    description: 'Reach level 5',
    emoji: '📈',
    condition: s => s.level >= 5,
  },
  {
    id: 'level-10',
    title: 'Unstoppable',
    description: 'Reach level 10',
    emoji: '🚀',
    condition: s => s.level >= 10,
  },
  {
    id: 'veteran',
    title: 'Veteran',
    description: 'Play 10 games',
    emoji: '🎮',
    condition: s => s.gamesPlayed >= 10,
  },
  {
    id: 'fruit-hoarder',
    title: 'Fruit Hoarder',
    description: 'Catch 500 fruits total',
    emoji: '🧺',
    condition: s => s.fruitsTotal >= 500,
  },
];

// ── Persistence ────────────────────────────────────────────────────────────────

export function loadUnlockedAchievements(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

export function saveUnlockedAchievements(ids: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids])); } catch { /* */ }
}

export function loadGameStats(): GameStats {
  try {
    const raw = localStorage.getItem('ifg_game_stats');
    if (raw) return JSON.parse(raw);
  } catch { /* */ }
  return {
    score: 0, highScore: 0, combo: 0, maxCombo: 0,
    fruitsTotal: 0, gamesPlayed: 0, powerUpsCollected: 0,
    shieldsUsed: 0, frenziesTriggered: 0, level: 1,
  };
}

export function saveGameStats(stats: GameStats) {
  try { localStorage.setItem('ifg_game_stats', JSON.stringify(stats)); } catch { /* */ }
}

/** Check all achievements against current stats, return newly unlocked IDs */
export function checkAchievements(stats: GameStats, alreadyUnlocked: Set<string>): string[] {
  const newlyUnlocked: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (!alreadyUnlocked.has(ach.id) && ach.condition(stats)) {
      newlyUnlocked.push(ach.id);
    }
  }
  return newlyUnlocked;
}
