// ─── Asset Types ────────────────────────────────────────────────────────────
export type AssetClass = 'stock' | 'etf' | 'crypto';
export type OrderType  = 'market' | 'limit' | 'stop-loss';
export type OrderSide  = 'buy' | 'sell';
export type OrderStatus = 'pending' | 'filled' | 'cancelled' | 'rejected';

// ─── OHLC Candle ────────────────────────────────────────────────────────────
export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ─── Stock / Asset ───────────────────────────────────────────────────────────
export interface Stock {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  sector: string;
  currentPrice: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  candles: Candle[];
  description: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  limitPrice?: number;
  stopPrice?: number;
  status: OrderStatus;
  createdAt: number;
  filledAt?: number;
  filledPrice?: number;
  strategy?: string;
  notes?: string;
}

// ─── Position ────────────────────────────────────────────────────────────────
export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
  realizedPnL: number;
  assetClass: AssetClass;
  openedAt: number;
}

// ─── Transaction ─────────────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  orderId: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  total: number;
  fee: number;
  timestamp: number;
  strategy: string;
  pnl?: number;
  pnlPct?: number;
  notes?: string;
}

// ─── Portfolio ───────────────────────────────────────────────────────────────
export interface Portfolio {
  cash: number;
  equity: number;
  totalValue: number;
  totalCost: number;
  unrealizedPnL: number;
  realizedPnL: number;
  totalPnL: number;
  totalPnLPct: number;
  positions: Record<string, Position>;
  transactions: Transaction[];
  orders: Order[];
}

// ─── Achievement ─────────────────────────────────────────────────────────────
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: number;
  progress?: number;
  target?: number;
}

// ─── Daily Challenge ─────────────────────────────────────────────────────────
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  type: 'analyze' | 'trade' | 'learn';
  target: number;
  progress: number;
}

// ─── Lesson / Module ─────────────────────────────────────────────────────────
export type LessonType = 'theory' | 'quiz' | 'simulation';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  content: string;
  xpReward: number;
  completed: boolean;
  questions?: QuizQuestion[];
  duration: number; // minutes
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  requiredLevel: number;
  completed: boolean;
  progress: number;
}

// ─── User Profile ────────────────────────────────────────────────────────────
export type UserLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  userLevel: UserLevel;
  achievements: Achievement[];
  completedLessons: string[];
  dailyChallenges: DailyChallenge[];
  joinedAt: number;
  streakDays: number;
  totalTrades: number;
  winRate: number;
}
