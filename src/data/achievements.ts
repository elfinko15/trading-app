import type { Achievement } from '@/domain/models';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-trade',    title: 'Erster Trade',         description: 'Führe deinen ersten Trade durch',             icon: '🚀', xpReward: 100 },
  { id: 'first-profit',   title: 'Erster Profit',         description: 'Erziele deinen ersten Gewinn',                icon: '💰', xpReward: 150 },
  { id: 'stop-loss-hero', title: 'Risiko-Manager',        description: 'Nutze Stop-Loss in 5 Trades',                 icon: '🛡️', xpReward: 200, target: 5  },
  { id: 'diversifier',    title: 'Diversifizierer',       description: 'Halte gleichzeitig 4 verschiedene Assets',    icon: '🎯', xpReward: 200, target: 4  },
  { id: 'lesson-master',  title: 'Wissenshunger',         description: 'Schließe 10 Lektionen ab',                    icon: '📖', xpReward: 300, target: 10 },
  { id: 'streak-7',       title: '7-Tage-Streak',         description: '7 Tage in Folge eingeloggt',                  icon: '🔥', xpReward: 250, target: 7  },
  { id: 'profit-1k',      title: 'Tausender',             description: 'Erziele $1.000 realisierten Gewinn',          icon: '💎', xpReward: 500, target: 1000 },
  { id: 'win-rate-60',    title: 'Treffsicher',           description: 'Erreiche eine Win-Rate von 60%',              icon: '🎯', xpReward: 400 },
  { id: 'crypto-trader',  title: 'Krypto-Pioneer',        description: 'Handle erstmals eine Kryptowährung',          icon: '₿',  xpReward: 150 },
  { id: 'etf-investor',   title: 'Smart Investor',        description: 'Kaufe deinen ersten ETF',                     icon: '📊', xpReward: 150 },
  { id: 'journal-5',      title: 'Diszipliniert',         description: 'Dokumentiere 5 Trades im Journal',            icon: '📝', xpReward: 200, target: 5  },
  { id: 'big-win',        title: 'Volltreffer',           description: 'Erziele einen Gewinn von 10%+ in einem Trade', icon: '🏆', xpReward: 350 },
];

export const DAILY_CHALLENGES_POOL = [
  { id: 'dc-analyze-3',    title: 'Analytiker',    description: 'Analysiere 3 Tech-Aktien heute',           type: 'analyze' as const, xpReward: 75,  target: 3 },
  { id: 'dc-rsi-trade',    title: 'RSI-Trader',    description: 'Mache einen Trade mit RSI-Indikator',      type: 'trade'   as const, xpReward: 100, target: 1 },
  { id: 'dc-learn-lesson', title: 'Schüler',       description: 'Schließe eine Lektion ab',                 type: 'learn'   as const, xpReward: 60,  target: 1 },
  { id: 'dc-stop-loss',    title: 'Risikobewusst', description: 'Setze in 2 Trades einen Stop-Loss',        type: 'trade'   as const, xpReward: 80,  target: 2 },
  { id: 'dc-etf',          title: 'ETF-Tag',       description: 'Kaufe heute einen ETF',                    type: 'trade'   as const, xpReward: 70,  target: 1 },
  { id: 'dc-quiz',         title: 'Quiz-Meister',  description: 'Bestehe ein Quiz ohne Fehler',             type: 'learn'   as const, xpReward: 90,  target: 1 },
];
