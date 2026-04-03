export interface GameReward {
  threshold: number;
  emoji: string;
  title: string;
  message: string;
  cta: string;
  ctaPath: string;
}

export const GAME_REWARDS: GameReward[] = [
  {
    threshold: 50,
    emoji: '🥭',
    title: 'Mango Master!',
    message: 'You caught your first 50 points! Your tropical reflexes are showing. Browse our Mango Recipe Collection for 15 delicious ways to use this golden fruit.',
    cta: 'See Mango Recipes →',
    ctaPath: '/store/mango-recipe-pack',
  },
  {
    threshold: 100,
    emoji: '🍹',
    title: 'Smoothie Champion!',
    message: '100 points! You\'re a natural at this. Unlock our Tropical Juice & Smoothie Recipe Book — 50 drinks inspired by the fruits you just caught.',
    cta: 'Get the Smoothie Book →',
    ctaPath: '/store/tropical-juice-smoothie-recipes',
  },
  {
    threshold: 200,
    emoji: '🌴',
    title: 'Island Expert!',
    message: '200 points — incredible! You clearly love Caribbean fruits. Our Caribbean Fruit Encyclopedia covers 100+ fruits in stunning detail.',
    cta: 'Explore the Encyclopedia →',
    ctaPath: '/store/caribbean-fruit-guide',
  },
  {
    threshold: 300,
    emoji: '💚',
    title: 'Healing Hands!',
    message: '300 points! Your island knowledge is growing. Discover the medicinal power of Caribbean plants in our Medicinal Leaves Guide.',
    cta: 'See Medicinal Guide →',
    ctaPath: '/store/medicinal-leaves-guide',
  },
  {
    threshold: 500,
    emoji: '🏆',
    title: 'Caribbean Legend!',
    message: '500 POINTS! You are a true island fruit legend. You\'ve earned access to our complete store — browse every guide, recipe pack, and ebook we offer.',
    cta: 'Browse the Full Store →',
    ctaPath: '/store',
  },
];

export const FRUIT_EMOJIS = ['🥭', '🍍', '🥥', '🍌', '🍊', '🍇', '🍓', '🫐', '🍋', '🍑', '🥝', '🍈'];
export const BAD_EMOJIS   = ['🪲', '🌵', '💀', '🦟'];

export const STORAGE_KEY_SCORE   = 'ifg_game_score';
export const STORAGE_KEY_REWARDS = 'ifg_game_rewards';
