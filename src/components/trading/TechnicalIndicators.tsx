'use client';
import { useMemo } from 'react';
import type { Stock } from '@/domain/models';
import { calculateRSI, calculateMACD } from '@/domain/services/marketSimulator';
import { fmt } from '@/lib/formatters';

interface Props { stock: Stock }

function RSIBar({ value }: { value: number }) {
  const pct   = value;
  const color = value > 70 ? 'var(--red)' : value < 30 ? 'var(--green)' : 'var(--blue-400)';
  const label = value > 70 ? 'Überkauft' : value < 30 ? 'Überverkauft' : 'Neutral';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>RSI (14)</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color }}>{value.toFixed(1)}</span>
          <span style={{ fontSize: '10px', fontWeight: 600, color, background: value > 70 ? 'var(--red-bg)' : value < 30 ? 'var(--green-bg)' : 'var(--blue-50)', padding: '1px 5px', borderRadius: '3px' }}>{label}</span>
        </div>
      </div>
      <div style={{ height: '6px', background: 'var(--surface-border)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
        {/* Zone bands */}
        <div style={{ position: 'absolute', left: '70%', top: 0, width: '1px', height: '100%', background: 'rgba(239,68,68,0.4)' }} />
        <div style={{ position: 'absolute', left: '30%', top: 0, width: '1px', height: '100%', background: 'rgba(0,192,135,0.4)' }} />
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-faint)', marginTop: '2px' }}>
        <span>0 — Überverkauft</span>
        <span>50</span>
        <span>Überkauft — 100</span>
      </div>
    </div>
  );
}

export default function TechnicalIndicators({ stock }: Props) {
  const rsi  = useMemo(() => calculateRSI(stock.candles),  [stock.candles]);
  const macd = useMemo(() => calculateMACD(stock.candles), [stock.candles]);

  const change     = stock.currentPrice - stock.previousClose;
  const changePct  = (change / stock.previousClose) * 100;
  const isUp       = change >= 0;
  const macdBull   = macd.macd > macd.signal;

  return (
    <div style={{ background: 'var(--surface-white)', border: '1px solid var(--surface-border)', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '10px 12px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--surface-border)' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Technische Analyse</span>
      </div>

      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* OHLC row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {[
            { label: 'Eröffnung', value: fmt.currency(stock.candles.at(-1)?.open ?? stock.currentPrice), color: 'var(--text-primary)' },
            { label: 'Tages-Hoch', value: fmt.currency(stock.dayHigh), color: 'var(--green-text)' },
            { label: 'Tages-Tief', value: fmt.currency(stock.dayLow),  color: 'var(--red-text)'   },
            { label: 'Änderung',   value: `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`, color: isUp ? 'var(--green-text)' : 'var(--red-text)' },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--surface-subtle)', borderRadius: '4px', padding: '6px 8px' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{item.label}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: item.color, fontVariantNumeric: 'tabular-nums' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* RSI */}
        <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '10px' }}>
          <RSIBar value={rsi} />
        </div>

        {/* MACD */}
        <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>MACD (12,26,9)</span>
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '3px',
              background: macdBull ? 'var(--green-bg)' : 'var(--red-bg)',
              color: macdBull ? 'var(--green-text)' : 'var(--red-text)',
            }}>
              {macdBull ? '▲ Bullisch' : '▼ Bärisch'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            {[
              { label: 'MACD',    value: macd.macd.toFixed(2),      up: macd.macd >= 0 },
              { label: 'Signal',  value: macd.signal.toFixed(2),    up: true           },
              { label: 'Hist.',   value: macd.histogram.toFixed(2), up: macd.histogram >= 0 },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center', background: 'var(--surface-subtle)', borderRadius: '4px', padding: '5px' }}>
                <div style={{ fontSize: '9px', color: 'var(--text-faint)', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase' }}>{m.label}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: m.up ? 'var(--green-text)' : 'var(--red-text)' }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fundamentals */}
        <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '10px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Fundamentals
          </div>
          {[
            { label: 'KGV (P/E)',       value: stock.peRatio > 0 ? stock.peRatio.toFixed(1) : 'N/A' },
            { label: 'Dividende',       value: stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(2)}%` : '—' },
            { label: 'Marktkapitalisierung', value: stock.marketCap > 0 ? (stock.marketCap >= 1e12 ? `$${(stock.marketCap / 1e12).toFixed(2)}T` : `$${(stock.marketCap / 1e9).toFixed(1)}B`) : '—' },
            { label: 'Volumen (heute)', value: `${(stock.volume / 1e6).toFixed(1)}M` },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid var(--surface-border)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{item.value}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
