'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Achievement } from '@/domain/models';
import { ALL_ACHIEVEMENTS, DAILY_CHALLENGES_POOL } from '@/data/achievements';

const XP_PER_LEVEL = [0, 200, 500, 900, 1400, 2100, 3000, 4200, 5600, 7200, 9000];

function getLevelFromXP(xp: number): number {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (xp >= XP_PER_LEVEL[i]) return i + 1;
  }
  return 1;
}

function xpToNextLevel(xp: number, currentLevel: number): number {
  const next = XP_PER_LEVEL[currentLevel] ?? XP_PER_LEVEL[XP_PER_LEVEL.length - 1] * 1.5;
  return next - xp;
}

const todayChallenges = DAILY_CHALLENGES_POOL
  .slice(0, 3)
  .map(c => ({ ...c, completed: false, progress: 0 }));

const INITIAL_USER: UserProfile = {
  id: 'user-1',
  name: 'Trader',
  avatar: '👤',
  level: 1,
  xp: 0,
  xpToNextLevel: 200,
  userLevel: 'beginner',
  achievements: ALL_ACHIEVEMENTS.map(a => ({ ...a, progress: 0 })),
  completedLessons: [],
  dailyChallenges: todayChallenges,
  joinedAt: Date.now(),
  streakDays: 1,
  totalTrades: 0,
  winRate: 0,
};

interface UserState {
  user: UserProfile;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (id: string, progress: number) => void;
  recordTrade: (won: boolean) => void;
  setName: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: INITIAL_USER,

      addXP: (amount) => set(state => {
        const newXP    = state.user.xp + amount;
        const newLevel = getLevelFromXP(newXP);
        const toNext   = xpToNextLevel(newXP, newLevel);
        const userLevel =
          newLevel >= 8 ? 'expert' :
          newLevel >= 5 ? 'advanced' :
          newLevel >= 3 ? 'intermediate' : 'beginner';
        return { user: { ...state.user, xp: newXP, level: newLevel, xpToNextLevel: toNext, userLevel } };
      }),

      completeLesson: (lessonId) => set(state => {
        if (state.user.completedLessons.includes(lessonId)) return state;
        return { user: { ...state.user, completedLessons: [...state.user.completedLessons, lessonId] } };
      }),

      unlockAchievement: (id) => set(state => {
        const achievements = state.user.achievements.map(a =>
          a.id === id && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a,
        );
        return { user: { ...state.user, achievements } };
      }),

      updateAchievementProgress: (id, progress) => set(state => {
        const achievements = state.user.achievements.map(a => {
          if (a.id !== id) return a;
          const updated = { ...a, progress };
          if (a.target && progress >= a.target && !a.unlockedAt) {
            updated.unlockedAt = Date.now();
            get().addXP(a.xpReward);
          }
          return updated;
        });
        return { user: { ...state.user, achievements } };
      }),

      recordTrade: (won) => set(state => {
        const total   = state.user.totalTrades + 1;
        const wins    = Math.round(state.user.winRate * state.user.totalTrades / 100) + (won ? 1 : 0);
        const winRate = Math.round((wins / total) * 100);
        return { user: { ...state.user, totalTrades: total, winRate } };
      }),

      setName: (name) => set(state => ({ user: { ...state.user, name } })),
    }),
    { name: 'trademaster-user' },
  ),
);
