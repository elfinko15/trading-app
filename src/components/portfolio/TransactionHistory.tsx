'use client';
import { usePortfolioStore } from '@/store/portfolioStore';
import { fmt } from '@/lib/formatters';

export default function TransactionHistory() {
  const { portfolio } = usePortfolioStore();
  const transactions = [...portfolio.transactions].reverse().slice(0, 50);

  if (transactions.length === 0) {
    return (
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Noch keine Transaktionen</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--surface-border)' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Transaktionshistorie ({transactions.length})</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Datum / Zeit</th>
              <th>Symbol</th>
              <th>Seite</th>
              <th style={{ textAlign: 'right' }}>Menge</th>
              <th style={{ textAlign: 'right' }}>Preis</th>
              <th style={{ textAlign: 'right' }}>Volumen</th>
              <th style={{ textAlign: 'right' }}>Gebühr</th>
              <th style={{ textAlign: 'right' }}>P&L</th>
              <th>Strategie</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{fmt.date(tx.timestamp)}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{fmt.time(tx.timestamp)}</div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{tx.symbol}</td>
                <td>
                  <span className={tx.side === 'buy' ? 'badge-up' : 'badge-down'} style={{ fontSize: '10px' }}>
                    {tx.side === 'buy' ? 'KAUF' : 'VERKAUF'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{tx.quantity}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt.currency(tx.price)}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt.currency(tx.total)}</td>
                <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{fmt.currency(tx.fee)}</td>
                <td style={{ textAlign: 'right' }}>
                  {tx.pnl !== undefined ? (
                    <span className={tx.pnl >= 0 ? 'badge-up' : 'badge-down'}>
                      {tx.pnl >= 0 ? '+' : ''}{fmt.currency(tx.pnl)}
                    </span>
                  ) : <span style={{ color: 'var(--text-faint)' }}>—</span>}
                </td>
                <td style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{tx.strategy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
