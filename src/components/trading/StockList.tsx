'use client';
import { useMarketStore } from '@/store/marketStore';

const CLASS_LABELS: Record<string, string> = { stock: 'Aktie', etf: 'ETF', crypto: 'Krypto' };

export default function StockList() {
  const { stocks, selectedSymbol, selectStock } = useMarketStore();

  const grouped = {
    stock:  stocks.filter(s => s.assetClass === 'stock'),
    etf:    stocks.filter(s => s.assetClass === 'etf'),
    crypto: stocks.filter(s => s.assetClass === 'crypto'),
  };

  return (
    <div style={{ background: 'var(--surface-white)', borderRight: '1px solid var(--surface-border)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-subtle)' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Watchlist
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {(Object.entries(grouped) as [string, typeof stocks][]).map(([cls, list]) => (
          <div key={cls}>
            <div style={{
              padding: '6px 12px 4px',
              fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--text-faint)',
              background: 'var(--surface-bg)',
              borderBottom: '1px solid var(--surface-border)',
              borderTop: '1px solid var(--surface-border)',
            }}>
              {CLASS_LABELS[cls]}
            </div>
            {list.map(stock => {
              const chg    = stock.currentPrice - stock.previousClose;
              const chgPct = (chg / stock.previousClose) * 100;
              const isUp   = chg >= 0;
              const active = stock.symbol === selectedSymbol;

              return (
                <button
                  key={stock.symbol}
                  onClick={() => selectStock(stock.symbol)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 12px',
                    border: 'none',
                    borderLeft: active ? '2px solid var(--blue-500)' : '2px solid transparent',
                    borderBottom: '1px solid var(--surface-border)',
                    background: active ? 'var(--blue-50)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface-subtle)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: active ? 'var(--blue-500)' : 'var(--text-primary)' }}>
                      {stock.symbol}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '1px', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {stock.name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>
                      {stock.currentPrice >= 10000
                        ? `$${(stock.currentPrice / 1000).toFixed(2)}K`
                        : `$${stock.currentPrice.toFixed(2)}`}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: isUp ? 'var(--green-text)' : 'var(--red-text)' }}>
                      {isUp ? '▲' : '▼'} {Math.abs(chgPct).toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
