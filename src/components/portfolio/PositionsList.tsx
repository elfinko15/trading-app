'use client';
import { usePortfolioStore } from '@/store/portfolioStore';
import { fmt } from '@/lib/formatters';

export default function PositionsList() {
  const { portfolio } = usePortfolioStore();
  const positions = Object.values(portfolio.positions);

  if (positions.length === 0) {
    return (
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 4px' }}>Keine offenen Positionen</p>
        <p style={{ color: 'var(--text-faint)', fontSize: '11px', margin: 0 }}>Gehe zu Trading und kaufe deine erste Aktie</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--surface-border)' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Offene Positionen ({positions.length})</span>
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
            <th style={{ textAlign: 'right' }}>P&L %</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(pos => {
            const up = pos.unrealizedPnL >= 0;
            return (
              <tr key={pos.symbol}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '6px',
                      background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 800, color: 'var(--blue-500)', flexShrink: 0,
                    }}>
                      {pos.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{pos.symbol}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>
                        {pos.assetClass === 'crypto' ? 'Krypto' : pos.assetClass === 'etf' ? 'ETF' : 'Aktie'}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pos.quantity}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt.currency(pos.averagePrice)}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{fmt.currency(pos.currentPrice)}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmt.currency(pos.marketValue)}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className={up ? 'badge-up' : 'badge-down'}>{up ? '+' : ''}{fmt.currency(pos.unrealizedPnL)}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className={up ? 'badge-up' : 'badge-down'}>{fmt.percent(pos.unrealizedPnLPct)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
