'use client';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useMarketStore } from '@/store/marketStore';
import { fmt } from '@/lib/formatters';

export default function Header({ title }: { title: string }) {
  const { portfolio } = usePortfolioStore();
  const { stocks, isMarketOpen } = useMarketStore();
  const pnlUp = portfolio.totalPnL >= 0;

  return (
    <>
      {/* Ticker tape */}
      <div style={{
        background: 'rgba(2,0,12,0.85)',
        borderBottom: '1px solid rgba(120,80,255,0.12)',
        overflow: 'hidden',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div className="ticker-inner" style={{ gap: '2.5rem' }}>
            {[...stocks, ...stocks].map((s, i) => {
              const chg    = s.currentPrice - s.previousClose;
              const chgPct = (chg / s.previousClose) * 100;
              const up     = chg >= 0;
              return (
                <span key={i} style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                  <span style={{ color: 'rgba(255,255,255,0.50)', fontWeight: 600, letterSpacing: '0.03em' }}>{s.symbol}</span>
                  <span style={{ color: 'rgba(255,255,255,0.88)', fontVariantNumeric: 'tabular-nums' }}>
                    {s.currentPrice >= 10000
                      ? `$${(s.currentPrice / 1000).toFixed(2)}K`
                      : `$${s.currentPrice.toFixed(2)}`}
                  </span>
                  <span style={{ color: up ? '#00C787' : '#F04E4E', fontWeight: 600 }}>
                    {up ? '▲' : '▼'}{Math.abs(chgPct).toFixed(2)}%
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 800, color: 'rgba(255,255,255,0.95)', margin: 0 }}>{title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-indicator" style={!isMarketOpen ? { background: '#F04E4E', animation: 'none' } : {}} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{isMarketOpen ? 'Live' : 'Geschlossen'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cash</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.92)', fontVariantNumeric: 'tabular-nums' }}>
              {fmt.currency(portfolio.cash)}
            </div>
          </div>

          <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)' }} />

          <div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portfolio</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.92)', fontVariantNumeric: 'tabular-nums' }}>
              {fmt.currency(portfolio.totalValue)}
            </div>
          </div>

          <div className={pnlUp ? 'badge-up' : 'badge-down'} style={{ fontSize: '12px', padding: '5px 10px' }}>
            {pnlUp ? '▲' : '▼'} {fmt.currency(Math.abs(portfolio.totalPnL))}
          </div>
        </div>
      </header>
    </>
  );
}
