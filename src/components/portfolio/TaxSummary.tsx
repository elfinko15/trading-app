'use client';
import { calculateTax, TAX_FREE_AMOUNT, EFFECTIVE_RATE } from '@/domain/services/taxCalculator';
import { fmt } from '@/lib/formatters';

interface Props {
  realizedPnL: number;
}

export default function TaxSummary({ realizedPnL }: Props) {
  const tax = calculateTax(realizedPnL);

  const rows = [
    { label: 'Realisierter Gewinn/Verlust',  value: fmt.currency(tax.netGains),          color: tax.netGains >= 0 ? '#00C787' : '#F04E4E' },
    { label: `Sparerpauschbetrag (–$${TAX_FREE_AMOUNT.toLocaleString('de')})`, value: `–${fmt.currency(tax.freiBetrag)}`, color: 'rgba(255,255,255,0.60)', note: `$${tax.freiBetragRemaining.toFixed(0)} noch verfügbar` },
    { label: 'Steuerpflichtiger Betrag',      value: fmt.currency(tax.taxableAmount),     color: 'rgba(255,255,255,0.88)' },
    { label: 'Abgeltungssteuer (25%)',         value: `–${fmt.currency(tax.abgeltungsteuer)}`, color: '#F04E4E' },
    { label: 'Solidaritätszuschlag (5,5%)',   value: `–${fmt.currency(tax.solidaritaetszuschlag)}`, color: '#F04E4E' },
  ];

  return (
    <div style={{
      background: 'rgba(18,8,48,0.75)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(140,100,255,0.22)',
      borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
    }}>
      {/* Header */}
      <div style={{
        padding: '13px 20px', background: 'rgba(120,80,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🇩🇪</span>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>Steuern · Abgeltungssteuer</span>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '6px',
          background: 'rgba(245,158,11,0.18)', color: '#F59E0B',
        }}>
          26,375% effektiv
        </span>
      </div>

      <div style={{ padding: '4px 0' }}>
        {/* Info banner */}
        <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
          🇩🇪 Deutschland: 25% Abgeltungssteuer + 5,5% Soli auf Kapitalgewinne. Jährlicher Sparerpauschbetrag: $1.000 (steuerfrei).
        </div>

        {/* Breakdown rows */}
        {rows.map((r, i) => (
          <div key={r.label} style={{
            padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.70)' }}>{r.label}</div>
              {r.note && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{r.note}</div>}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: r.color, fontVariantNumeric: 'tabular-nums', flexShrink: 0, marginLeft: '16px' }}>
              {r.value}
            </div>
          </div>
        ))}

        {/* Total */}
        <div style={{ padding: '16px 20px', background: tax.taxableAmount > 0 ? 'rgba(240,78,78,0.08)' : 'rgba(0,199,135,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>Steuerlast gesamt</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', marginTop: '2px' }}>
              {tax.taxableAmount > 0
                ? `Effektiver Steuersatz: ${tax.effectiveRate.toFixed(2)}% deiner Gewinne`
                : 'Sparerpauschbetrag noch nicht ausgeschöpft — keine Steuer'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: tax.totalTax > 0 ? '#F04E4E' : '#00C787', fontVariantNumeric: 'tabular-nums' }}>
              {tax.totalTax > 0 ? `–${fmt.currency(tax.totalTax)}` : '–$0'}
            </div>
            {tax.netGains > 0 && (
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.50)', marginTop: '2px' }}>
                Netto nach Steuern: <span style={{ color: '#00C787', fontWeight: 700 }}>{fmt.currency(tax.netAfterTax)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: '10px 20px', fontSize: '11px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
          ⚠️ Simulation. Diese Berechnung dient nur zur Veranschaulichung und ersetzt keine Steuerberatung.
        </div>
      </div>
    </div>
  );
}
