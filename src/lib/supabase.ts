import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type Profile = {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  total_trades: number;
  win_rate: number;
  streak_days: number;
  portfolio_value: number;
  total_pnl: number;
  total_pnl_pct: number;
  created_at: string;
};

export type Friendship = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  requester?: Profile;
  addressee?: Profile;
};
