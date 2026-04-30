'use client';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useUserStore } from '@/store/userStore';
import { fmt } from '@/lib/formatters';
import Header from '@/components/layout/Header';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, ReferenceLine, Area, AreaChart,
} from 'recharts';

const GREEN = '#00C087';
const RED   = '#EF4444';
const BLUE  = '#1E6FD9';

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '8px 12px', fontSize: '11px', color: 'white' }}>
      <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{p.name}</span>
          <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: typeof p.value === 'number' && p.value < 0 ? RED : GREEN }}>{typeof p.value === 'number' ? fmt.currency(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function JournalPage() {
  const { portfolio } = usePortfolioStore();
  const { user }      = useUserStore();

  const sells = portfolio.transactions.filter(t => t.side === 'sell' && t.pnl !== undefined);

  // Cumulative P&L over time
  let cumulative = 0;
  const cumulativeData = sells.map((t, i) => {
    cumulative += t.pnl ?? 0;
    return { trade: `#${i + 1}`, pnl: t.pnl ?? 0, cumulative, symbol: t.symbol };
  });

  // P&L per strategy
  const byStrategy: Record<string, { wins: number; losses: number; total: number; trades: number }> = {};
  sells.forEach(t => {
    const s = t.strategy ?? 'Unbekannt';
    if (!byStrategy[s]) byStrategy[s] = { wins: 0, losses: 0, total: 0, trades: 0 };
    byStrategy[s].trades++;
    if ((t.pnl ?? 0) > 0) byStrategy[s].wins++;
    else byStrategy[s].losses++;
    byStrategy[s].total += t.pnl ?? 0;
  });
  const stratData = Object.entries(byStrategy).map(([name, d]) => ({
    name: name.length > 12 ? name.slice(0, 12) + '…' : name,
    winRate: Math.round((d.wins / (d.wins + d.losses)) * 100),
    total: d.total,
    trades: d.trades,
  })).sort((a, b) => b.trades - a.trades);

  // KI Hints
  const hints: { icon: string; text: string }[] = [];
  if (sells.length >= 3) {
    const earlyWins = sells.filter(t => (t.pnl ?? 0) > 0 && (t.pnlPct ?? 0) < 3).length;
    if (earlyWins / sells.length > 0.5)
      hints.push({ icon: '📉', text: 'Du neigst dazu, Gewinner zu früh zu verkaufen. Halte profitable Positionen länger.' });
    if (sells.filter(t => (t.pnlPct ?? 0) < -5).length >= 2)
      hints.push({ icon: '🛡️', text: 'Mehrere Verluste über -5%. Setze konsequent Stop-Loss Orders.' });
    if (!portfolio.orders.some(o => o.type === 'stop-loss'))
      hints.push({ icon: '⚠️', text: 'Noch kein Stop-Loss genutzt. Risikomanagement ist entscheidend!' });
    if (user.winRate >= 60)
      hints.push({ icon: '🏆', text: `Gute Win-Rate von ${user.winRate}%! Versuche, deine Gewinne weiter laufen zu lassen.` });
  }

  const hasData = sells.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-bg)' }}>
      <Header title="Trade Journal" />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* KI Mentor */}
        {hints.length > 0 && (
          <div className="card" style={{ borderLeft: '3px solid var(--blue-400)', padding: '14px 16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🤖</span> KI-Mentor Analyse
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
              {hints.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '9px 11px', background: 'var(--blue-50)', border: '1px solid var(--blue-200)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '14px', flexShrink: 0 }}>{h.icon}</span>
                  <span style={{ fontSize: '11px', color: 'var(--blue-500)', lineHeight: 1.5 }}>{h.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[
            { label: 'Gesamt Trades',     value: user.totalTrades,                      color: 'var(--blue-500)' },
            { label: 'Win-Rate',          value: `${user.winRate}%`,                    color: user.winRate >= 50 ? 'var(--green-text)' : 'var(--red-text)' },
            { label: 'Realisiertes P&L',  value: fmt.currency(portfolio.realizedPnL),   color: portfolio.realizedPnL >= 0 ? 'var(--green-text)' : 'var(--red-text)' },
            { label: 'Ø P&L pro Trade',   value: sells.length > 0 ? fmt.currency(portfolio.realizedPnL / sells.length) : '—', color: 'var(--text-primary)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>{s.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Cumulative P&L */}
          <div className="card">
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-border)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Kumuliertes P&L</span>
            </div>
            <div style={{ padding: '12px', background: '#0D1B2A', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
              {hasData ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={cumulativeData}>
                    <defs>
                      <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={cumulative >= 0 ? GREEN : RED} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={cumulative >= 0 ? GREEN : RED} stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="trade" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }} tickLine={false} axisLine={false}
                           tickFormatter={v => `$${v.toFixed(0)}`} width={55} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 3" />
                    <Area type="monotone" dataKey="cumulative" name="Kumuliert" stroke={cumulative >= 0 ? GREEN : RED}
                          strokeWidth={2} fill="url(#cumGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '32px' }}>📈</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Noch keine Trades</span>
                </div>
              )}
            </div>
          </div>

          {/* P&L per Trade bars */}
          <div className="card">
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-border)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>P&L pro Trade</span>
            </div>
            <div style={{ padding: '12px', background: '#0D1B2A', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
              {hasData ? (
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={cumulativeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="trade" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }} tickLine={false} axisLine={false}
                           tickFormatter={v => `$${v.toFixed(0)}`} width={55} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.25)" />
                    <Bar dataKey="pnl" name="P&L" radius={[3, 3, 0, 0]}>
                      {cumulativeData.map((e, i) => (
                        <Cell key={i} fill={e.pnl >= 0 ? GREEN : RED} opacity={0.85} />
                      ))}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '32px' }}>📊</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Nach dem ersten Trade verfügbar</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Strategy Win-Rate */}
        {stratData.length > 0 && (
          <div className="card">
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Performance nach Strategie</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{stratData.length} Strategien</span>
            </div>
            <div style={{ padding: '0 14px 12px' }}>
              {stratData.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--surface-border)' }}>
                  <div style={{ width: '110px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>{s.name}</div>
                  <div style={{ width: '28px', textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>{s.trades}×</div>
                  <div style={{ flex: 1, height: '10px', background: 'var(--surface-border)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${s.winRate}%`, height: '100%', borderRadius: '5px', transition: 'width 0.5s ease',
                      background: s.winRate >= 60 ? GREEN : s.winRate >= 40 ? BLUE : RED,
                    }} />
                  </div>
                  <div style={{ width: '36px', textAlign: 'right', fontSize: '11px', fontWeight: 700, flexShrink: 0, color: s.winRate >= 50 ? 'var(--green-text)' : 'var(--red-text)' }}>
                    {s.winRate}%
                  </div>
                  <div style={{ width: '70px', textAlign: 'right', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                    <span className={s.total >= 0 ? 'badge-up' : 'badge-down'} style={{ fontSize: '10px' }}>
                      {s.total >= 0 ? '+' : ''}{fmt.currency(s.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trade log */}
        <div className="card">
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--surface-border)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Trade Log ({sells.length} abgeschlossene Trades)</span>
          </div>
          {sells.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-faint)', fontSize: '12px' }}>
              Noch keine abgeschlossenen Trades. Gehe zum Trading-Bereich!
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Symbol</th>
                  <th style={{ textAlign: 'right' }}>Menge</th>
                  <th style={{ textAlign: 'right' }}>Preis</th>
                  <th style={{ textAlign: 'right' }}>P&L</th>
                  <th style={{ textAlign: 'right' }}>P&L %</th>
                  <th>Strategie</th>
                  <th>Notiz</th>
                </tr>
              </thead>
              <tbody>
                {[...sells].reverse().map(tx => (
                  <tr key={tx.id}>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '11px' }}>
                      {fmt.date(tx.timestamp)}<br />
                      <span style={{ color: 'var(--text-faint)', fontSize: '10px' }}>{fmt.time(tx.timestamp)}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{tx.symbol}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{tx.quantity}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt.currency(tx.price)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={(tx.pnl ?? 0) >= 0 ? 'badge-up' : 'badge-down'}>
                        {(tx.pnl ?? 0) >= 0 ? '+' : ''}{fmt.currency(tx.pnl ?? 0)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={(tx.pnlPct ?? 0) >= 0 ? 'badge-up' : 'badge-down'}>
                        {fmt.percent(tx.pnlPct ?? 0)}
                      </span>
                    </td>
                    <td style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{tx.strategy}</td>
                    <td style={{ fontSize: '10px', color: 'var(--text-faint)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
