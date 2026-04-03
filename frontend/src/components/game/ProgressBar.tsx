import { calcLevel, xpIntoCurrentLevel, xpProgressPct, XP_PER_LEVEL } from '../../data/dailyRewards';

interface Props {
  xp: number;
  compact?: boolean;
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Seed',
  2: 'Sprout',
  3: 'Sapling',
  4: 'Grove',
  5: 'Orchardist',
  6: 'Fruit Master',
  7: 'Island Sage',
  8: 'Caribbean Legend',
  9: 'Tropical God',
  10: 'Fruit Immortal',
};

function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, 10)] ?? 'Fruit Immortal';
}

export function ProgressBar({ xp, compact = false }: Props) {
  const level    = calcLevel(xp);
  const xpIn     = xpIntoCurrentLevel(xp);
  const pct      = xpProgressPct(xp);
  const title    = levelTitle(level);

  if (compact) {
    return (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-mango/20 border border-mango/40 flex items-center justify-center">
          <span className="text-mango font-black text-xs">{level}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-white/60 text-[9px] font-bold uppercase tracking-wider">{title}</span>
            <span className="text-white/40 text-[9px]">{xpIn}/{XP_PER_LEVEL} XP</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #1F7A4D, #F9A825)',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/8 rounded-2xl p-4 border border-white/10">
      <div className="flex items-center gap-4 mb-3">
        {/* Level badge */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #1F7A4D, #F9A825)' }}
        >
          <span className="text-white font-black text-lg">{level}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-white font-bold text-sm">{title}</span>
            <span className="text-white/50 text-xs">Level {level}</span>
          </div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-white/40 text-xs">{xpIn} / {XP_PER_LEVEL} XP</span>
            <span className="text-mango text-xs font-bold">{Math.round(pct)}%</span>
          </div>
          {/* Bar */}
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #1F7A4D 0%, #2A9D5E 50%, #F9A825 100%)',
                boxShadow: '0 0 8px rgba(249,168,37,0.4)',
              }}
            />
          </div>
        </div>
      </div>

      {/* XP tip */}
      <p className="text-white/30 text-[9px] text-center">
        {XP_PER_LEVEL - xpIn} XP until Level {level + 1} · Every point caught = 1 XP
      </p>
    </div>
  );
}
