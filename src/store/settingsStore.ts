'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppSettings {
  startingCapital: number;
  tickerSpeed: number;
  showTutorial: boolean;
  tutorialCompleted: boolean;
  tutorialStep: number;
  soundEnabled: boolean;
  username: string;
  avatar: string;
  accentColor: string;
  commissionRate: number;   // 0 = kostenlos, 0.001 = 0.1%, 0.005 = 0.5%
  chartStyle: 'candlestick' | 'line';
  currency: 'USD' | 'EUR';
  riskWarnings: boolean;
  autoSaveNotes: boolean;
  showPercentages: boolean;
}

const DEFAULTS: AppSettings = {
  startingCapital: 10_000,
  tickerSpeed: 2000,
  showTutorial: true,
  tutorialCompleted: false,
  tutorialStep: 0,
  soundEnabled: false,
  username: 'Trader',
  avatar: '🧑‍💼',
  accentColor: '#6D4AE8',
  commissionRate: 0.001,
  chartStyle: 'candlestick',
  currency: 'USD',
  riskWarnings: true,
  autoSaveNotes: true,
  showPercentages: true,
};

const AVATARS = ['🧑‍💼','👩‍💼','🧑‍💻','👨‍🎓','🦊','🐺','🦁','🐉','⚡','🔥','💎','🚀','🎯','🦅','🌙','⭐'];

interface SettingsState {
  settings: AppSettings;
  update: (patch: Partial<AppSettings>) => void;
  advanceTutorial: () => void;
  skipTutorial: () => void;
  resetTutorial: () => void;
}

export const AVATARS_LIST = AVATARS;

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULTS,

      update: (patch) => set(state => ({
        settings: { ...state.settings, ...patch },
      })),

      advanceTutorial: () => set(state => ({
        settings: { ...state.settings, tutorialStep: state.settings.tutorialStep + 1 },
      })),

      skipTutorial: () => set(state => ({
        settings: { ...state.settings, showTutorial: false, tutorialCompleted: true },
      })),

      resetTutorial: () => set(state => ({
        settings: { ...state.settings, showTutorial: true, tutorialCompleted: false, tutorialStep: 0 },
      })),
    }),
    { name: 'trademaster-settings' },
  ),
);
