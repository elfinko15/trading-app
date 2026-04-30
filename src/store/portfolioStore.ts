'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Portfolio, Order } from '@/domain/models';
import {
  validateOrder,
  executeMarketOrder,
  updatePositionPrices,
  recalculatePortfolio,
} from '@/domain/services/tradingEngine';
import { getStock } from '@/data/stocks';

const INITIAL_CASH = 10_000;

const INITIAL_PORTFOLIO: Portfolio = {
  cash: INITIAL_CASH,
  equity: 0,
  totalValue: INITIAL_CASH,
  totalCost: 0,
  unrealizedPnL: 0,
  realizedPnL: 0,
  totalPnL: 0,
  totalPnLPct: 0,
  positions: {},
  transactions: [],
  orders: [],
};

interface PortfolioState {
  portfolio: Portfolio;
  lastTradeError: string | null;
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => boolean;
  updatePrices: (prices: Record<string, number>) => void;
  clearError: () => void;
  resetPortfolio: () => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      portfolio: INITIAL_PORTFOLIO,
      lastTradeError: null,

      placeOrder: (orderData) => {
        const stock = getStock(orderData.symbol);
        if (!stock) {
          set({ lastTradeError: 'Unbekanntes Symbol.' });
          return false;
        }
        const error = validateOrder(orderData, get().portfolio, stock);
        if (error) {
          set({ lastTradeError: error });
          return false;
        }
        const { portfolio, order: _order, transaction: _tx } = executeMarketOrder(
          orderData,
          get().portfolio,
          stock,
        );
        set({ portfolio, lastTradeError: null });
        return true;
      },

      updatePrices: (prices) => {
        set(state => ({
          portfolio: updatePositionPrices(state.portfolio, prices),
        }));
      },

      clearError: () => set({ lastTradeError: null }),

      resetPortfolio: () => set({ portfolio: INITIAL_PORTFOLIO }),
    }),
    { name: 'trademaster-portfolio' },
  ),
);
