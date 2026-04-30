'use client';
import { create } from 'zustand';
import type { Stock } from '@/domain/models';
import { STOCKS } from '@/data/stocks';
import { tickStocks } from '@/domain/services/marketSimulator';

interface MarketState {
  stocks: Stock[];
  selectedSymbol: string;
  tickInterval: ReturnType<typeof setInterval> | null;
  isMarketOpen: boolean;
  tickStocks: () => void;
  selectStock: (symbol: string) => void;
  startTicker: () => void;
  stopTicker: () => void;
  getStock: (symbol: string) => Stock | undefined;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  stocks: STOCKS,
  selectedSymbol: 'AAPL',
  tickInterval: null,
  isMarketOpen: true,

  getStock: (symbol) => get().stocks.find(s => s.symbol === symbol),

  selectStock: (symbol) => set({ selectedSymbol: symbol }),

  tickStocks: () => set(state => ({ stocks: tickStocks(state.stocks) })),

  startTicker: () => {
    const existing = get().tickInterval;
    if (existing) return;
    const interval = setInterval(() => get().tickStocks(), 2000);
    set({ tickInterval: interval });
  },

  stopTicker: () => {
    const interval = get().tickInterval;
    if (interval) clearInterval(interval);
    set({ tickInterval: null });
  },
}));
