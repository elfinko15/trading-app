'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  username: string;
  avatar: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  signIn: (username: string, password: string) => Promise<string | null>;
  signUp: (username: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  loadSession: () => Promise<void>;
  syncStats: (stats: {
    level: number; xp: number; total_trades: number; win_rate: number;
    streak_days: number; portfolio_value: number; total_pnl: number;
    total_pnl_pct: number; avatar: string;
  }) => Promise<void>;
}

const fakeEmail = (username: string) =>
  `${username.toLowerCase().replace(/[^a-z0-9_]/g, '')}@trademaster.local`;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      initialized: false,

      loadSession: async () => {
        set({ loading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, avatar')
              .eq('id', session.user.id)
              .single();
            set({
              user: {
                id: session.user.id,
                username: profile?.username ?? 'Trader',
                avatar: profile?.avatar ?? '🧑‍💼',
              },
            });
          } else {
            set({ user: null });
          }
        } catch {
          set({ user: null });
        } finally {
          set({ loading: false, initialized: true });
        }
      },

      signIn: async (username, password) => {
        set({ loading: true });
        try {
          const email = fakeEmail(username);
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) return 'Benutzername oder Passwort falsch.';
          if (data.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, avatar')
              .eq('id', data.user.id)
              .single();
            set({
              user: {
                id: data.user.id,
                username: profile?.username ?? username,
                avatar: profile?.avatar ?? '🧑‍💼',
              },
            });
          }
          return null;
        } catch (e) {
          return (e as Error).message;
        } finally {
          set({ loading: false });
        }
      },

      signUp: async (username, password) => {
        set({ loading: true });
        try {
          const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single();
          if (existing) return 'Dieser Benutzername ist bereits vergeben.';

          const email = fakeEmail(username);
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } },
          });
          if (error) return error.message;
          if (data.user) {
            set({
              user: {
                id: data.user.id,
                username,
                avatar: '🧑‍💼',
              },
            });
          }
          return null;
        } catch (e) {
          return (e as Error).message;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null });
      },

      syncStats: async (stats) => {
        const { user } = get();
        if (!user) return;
        await supabase
          .from('profiles')
          .update({ ...stats, updated_at: new Date().toISOString() })
          .eq('id', user.id);
      },
    }),
    { name: 'trademaster-auth', partialize: (s) => ({ user: s.user }) },
  ),
);
