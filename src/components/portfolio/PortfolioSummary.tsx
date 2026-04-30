'use client';
import { usePortfolioStore } from '@/store/portfolioStore';
import { fmt } from '@/lib/formatters';

export default function PortfolioSummary() {
  const { portfolio } = usePortfolioStore();
  const allocation = portfolio.totalValue > 0 ? (portfolio.equity / portfolio.totalValue) * 100 : 0;
  const pnlUp = portfolio.totalPnL >= 0;

  return (
    <div className="card">
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Portfolio Übersicht</span>
        <span className={pnlUp ? 'badge-up' : 'badge-down'} style={{ fontSize: '12px', padding: '3px 8px' }}>
          {pnlUp ? '▲' : '▼'} {fmt.currency(Math.abs(portfolio.totalPnL))} ({fmt.percent(portfolio.totalPnLPct)})
        </span>
      </div>

      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { label: 'Gesamtwert',       value: fmt.currency(portfolio.totalValue),       sub: 'inkl. Cash',       accent: 'var(--blue-500)' },
          { label: 'Investiert',       value: fmt.currency(portfolio.equity),            sub: `${allocation.toFixed(1)}% des Portfolios`, accent: '#7C3AED' },
          { label: 'Verfügbares Cash', value: fmt.currency(portfolio.cash),              sub: `${(100 - allocation).toFixed(1)}% frei`, accent: '#0EA5E9' },
          { label: 'Unrealisiert P&L', value: fmt.currency(portfolio.unrealizedPnL),    sub: 'Offene Positionen', accent: portfolio.unrealizedPnL >= 0 ? 'var(--green-text)' : 'var(--red-text)' },
          { label: 'Realisiert P&L',   value: fmt.currency(portfolio.realizedPnL),      sub: 'Abgeschlossene Trades', accent: portfolio.realizedPnL >= 0 ? 'var(--green-text)' : 'var(--red-text)' },
          { label: 'Gesamt P&L',       value: fmt.currency(portfolio.totalPnL),         sub: fmt.percent(portfolio.totalPnLPct), accent: pnlUp ? 'var(--green-text)' : 'var(--red-text)' },
        ].map(s => (
          <div key={s.label} style={{ padding: '12px', background: 'var(--surface-subtle)', borderRadius: '6px' }}>
            <div className="stat-label" style={{ marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: s.accent, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>{s.value}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Allocation bar */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '5px' }}>
          <span>Cash {fmt.currency(portfolio.cash)}</span>
          <span>Aktien {fmt.currency(portfolio.equity)}</span>
        </div>
        <div style={{ height: '8px', background: 'var(--blue-100)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${allocation}%`, height: '100%', background: 'linear-gradient(90deg, var(--blue-500), var(--blue-300))', borderRadius: '4px', transition: 'width 0.5s ease' }} />
        </div>
      </div>
    </div>
  );
}
