'use client';
import { useEffect } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import Header from '@/components/layout/Header';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import PositionsList from '@/components/portfolio/PositionsList';
import TransactionHistory from '@/components/portfolio/TransactionHistory';
import AchievementsPanel from '@/components/gamification/AchievementsPanel';
import TaxSummary from '@/components/portfolio/TaxSummary';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6D4AE8', '#4F8EF7', '#3B8BF5', '#00C787', '#F04E4E', '#F59E0B', '#A78BFA', '#06B6D4', '#0EA5E9'];

export default function PortfolioPage() {
  const { stocks, startTicker } = useMarketStore();
  const { portfolio, updatePrices } = usePortfolioStore();

  useEffect(() => { startTicker(); }, [startTicker]);
  useEffect(() => {
    const prices: Record<string, number> = {};
    stocks.forEach(s => { prices[s.symbol] = s.currentPrice; });
    updatePrices(prices);
  }, [stocks, updatePrices]);

  const positions = Object.values(portfolio.positions);
  const pieData = [
    { name: 'Cash', value: portfolio.cash },
    ...positions.map(p => ({ name: p.symbol, value: p.marketValue })),
  ].filter(d => d.value > 0);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header title="Portfolio" />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <PortfolioSummary />
            <PositionsList />
            {/* Tax section — only show if there are realized gains/losses */}
            {portfolio.realizedPnL !== 0 && (
              <TaxSummary realizedPnL={portfolio.realizedPnL} />
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pieData.length > 1 && (
              <div className="card">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>Allokation</span>
                </div>
                <div style={{ padding: '8px' }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={76}
                           paddingAngle={2} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: 'rgba(4,0,22,0.97)', border: '1px solid rgba(140,100,255,0.28)', borderRadius: '10px', color: 'rgba(255,255,255,0.92)' }}
                        formatter={(v) => [`$${Number(v ?? 0).toFixed(2)}`, '']}
                      />
                      <Legend iconSize={8} iconType="circle"
                        formatter={v => <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.60)' }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            <AchievementsPanel />
          </div>
        </div>

        <TransactionHistory />
      </div>
    </div>
  );
}
