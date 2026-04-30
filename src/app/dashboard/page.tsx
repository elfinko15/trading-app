'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useMarketStore } from '@/store/marketStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useUserStore } from '@/store/userStore';
import { fmt } from '@/lib/formatters';
import Header from '@/components/layout/Header';
import DailyChallenges from '@/components/gamification/DailyChallenges';
import Sparkline from '@/components/ui/Sparkline';

function getXPForLevel(level: number): number {
  const T = [0, 0, 200, 500, 900, 1400, 2100, 3000, 4200, 5600, 7200, 9000];
  return T[Math.max(0, Math.min(level, T.length - 1))];
}

export default function DashboardPage() {
  const { stocks, startTicker } = useMarketStore();
  const { portfolio } = usePortfolioStore();
  const { user } = useUserStore();

  useEffect(() => { startTicker(); }, [startTicker]);

  const topMovers = [...stocks]
    .sort((a, b) =>
      Math.abs((b.currentPrice - b.previousClose) / b.previousClose) -
      Math.abs((a.currentPrice - a.previousClose) / a.previousClose)
    ).slice(0, 8);

  const xpCur  = user.xp - getXPForLevel(user.level - 1);
  const xpNext = getXPForLevel(user.level) - getXPForLevel(user.level - 1);
  const xpPct  = Math.min(100, Math.max(0, (xpCur / xpNext) * 100));

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header title="Dashboard" />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* KPI Row */}
        <div className="grid-5col" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          {[
            { label: 'Portfoliowert',    value: fmt.currency(portfolio.totalValue),    color: '#6D8EF7', icon: '💼' },
            { label: 'Verfügbares Cash', value: fmt.currency(portfolio.cash),          color: '#0EA5E9', icon: '💵' },
            { label: 'Unrealisiert P&L', value: fmt.currency(portfolio.unrealizedPnL), color: portfolio.unrealizedPnL >= 0 ? '#00C787' : '#F04E4E', icon: portfolio.unrealizedPnL >= 0 ? '▲' : '▼' },
            { label: 'Realisiert P&L',   value: fmt.currency(portfolio.realizedPnL),   color: portfolio.realizedPnL >= 0 ? '#00C787' : '#F04E4E', icon: portfolio.realizedPnL >= 0 ? '▲' : '▼' },
            { label: 'Win-Rate',         value: `${user.winRate}%`,                    color: '#A78BFA', icon: '🎯' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Market watchlist */}
            <div className="card">
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>Märkte</span>
                <Link href="/trading" style={{ fontSize: '12px', color: '#A78BFA', fontWeight: 600, textDecoration: 'none' }}>Alle →</Link>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th style={{ textAlign: 'right' }}>Kurs</th>
                    <th style={{ textAlign: 'right' }}>Änderung</th>
                    <th className="hide-mobile" style={{ textAlign: 'right' }}>Hoch / Tief</th>
                    <th className="hide-mobile" style={{ textAlign: 'right' }}>Volumen</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>7 Tage</th>
                  </tr>
                </thead>
                <tbody>
                  {topMovers.map(stock => {
                    const chg    = stock.currentPrice - stock.previousClose;
                    const chgPct = (chg / stock.previousClose) * 100;
                    const isUp   = chg >= 0;
                    const sparkData = stock.candles.slice(-20).map(c => c.close);
                    return (
                      <tr key={stock.symbol}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '30px', height: '30px', borderRadius: '8px',
                              background: 'rgba(109,74,232,0.20)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '10px', fontWeight: 800, color: '#A78BFA', flexShrink: 0,
                            }}>
                              {stock.symbol.slice(0, 2)}
                            </div>
                            <span style={{ fontWeight: 700 }}>{stock.symbol}</span>
                          </div>
                        </td>
                        <td className="hide-mobile" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {stock.name}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                          {stock.currentPrice >= 10000
                            ? `$${(stock.currentPrice / 1000).toFixed(2)}K`
                            : `$${stock.currentPrice.toFixed(2)}`}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={isUp ? 'badge-up' : 'badge-down'}>
                            {isUp ? '▲' : '▼'} {Math.abs(chgPct).toFixed(2)}%
                          </span>
                        </td>
                        <td className="hide-mobile" style={{ textAlign: 'right', fontSize: '11px', fontVariantNumeric: 'tabular-nums' }}>
                          <span style={{ color: '#00C787' }}>{`$${stock.dayHigh.toFixed(2)}`}</span>
                          <span style={{ color: 'rgba(255,255,255,0.22)', margin: '0 3px' }}>/</span>
                          <span style={{ color: '#F04E4E' }}>{`$${stock.dayLow.toFixed(2)}`}</span>
                        </td>
                        <td className="hide-mobile" style={{ textAlign: 'right', color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontVariantNumeric: 'tabular-nums' }}>
                          {stock.volume >= 1e9 ? `${(stock.volume / 1e9).toFixed(1)}B` : `${(stock.volume / 1e6).toFixed(0)}M`}
                        </td>
                        <td style={{ textAlign: 'center', padding: '4px 8px' }}>
                          <Sparkline data={sparkData} width={80} height={28} isUp={isUp} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Open positions */}
            {Object.keys(portfolio.positions).length > 0 && (
              <div className="card">
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>Meine Positionen</span>
                  <Link href="/portfolio" style={{ fontSize: '12px', color: '#A78BFA', fontWeight: 600, textDecoration: 'none' }}>Details →</Link>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th style={{ textAlign: 'right' }}>Menge</th>
                      <th style={{ textAlign: 'right' }}>Ø Kauf</th>
                      <th style={{ textAlign: 'right' }}>Akt. Kurs</th>
                      <th style={{ textAlign: 'right' }}>Marktwert</th>
                      <th style={{ textAlign: 'right' }}>P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(portfolio.positions).map(pos => (
                      <tr key={pos.symbol}>
                        <td><span style={{ fontWeight: 700 }}>{pos.symbol}</span></td>
                        <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pos.quantity}</td>
                        <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt.currency(pos.averagePrice)}</td>
                        <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{fmt.currency(pos.currentPrice)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmt.currency(pos.marketValue)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={pos.unrealizedPnL >= 0 ? 'badge-up' : 'badge-down'}>
                            {pos.unrealizedPnL >= 0 ? '+' : ''}{fmt.currency(pos.unrealizedPnL)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Learning CTA */}
            <div className="card" style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '3px solid #6D4AE8' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Lernpfad · Level {user.level}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>
                  {user.completedLessons.length} Lektionen · {user.achievements.filter(a => a.unlockedAt).length} Achievements
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="xp-bar-light" style={{ height: '6px', width: '140px' }}>
                    <div className="xp-fill-light" style={{ height: '100%', width: `${xpPct}%` }} />
                  </div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{xpPct.toFixed(0)}% zu Level {user.level + 1}</span>
                </div>
              </div>
              <Link href="/learn" className="btn-primary" style={{ textDecoration: 'none', flexShrink: 0 }}>
                Weiterlernen
              </Link>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6D4AE8, #4F8EF7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 800, color: 'white', flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(109,74,232,0.45)',
                }}>
                  {user.level}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{user.xp.toLocaleString('de')} XP · 🔥{user.streakDays} Tage</div>
                </div>
              </div>
              <div className="xp-bar-light" style={{ height: '7px', marginBottom: '5px' }}>
                <div className="xp-fill-light" style={{ height: '100%', width: `${xpPct}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>
                <span>Level {user.level}</span>
                <span>+{user.xpToNextLevel} XP bis Level {user.level + 1}</span>
              </div>
            </div>

            <DailyChallenges />
          </div>
        </div>
      </div>
    </div>
  );
}
