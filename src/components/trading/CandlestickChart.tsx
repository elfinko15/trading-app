'use client';
import { useMemo, useRef, useState, useCallback } from 'react';
import type { Candle } from '@/domain/models';

interface Props {
  candles: Candle[];
  symbol: string;
}

const PAD = { top: 16, right: 64, bottom: 32, left: 8 };
const GREEN = '#00C087';
const RED   = '#EF4444';

function formatPrice(v: number) {
  if (v >= 10000) return `$${(v / 1000).toFixed(2)}K`;
  if (v >= 1000)  return `$${v.toFixed(1)}`;
  return `$${v.toFixed(2)}`;
}

export default function CandlestickChart({ candles, symbol }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; candle: Candle } | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const data = useMemo(() => candles.slice(-80), [candles]);

  const prices = data.flatMap(c => [c.high, c.low]);
  const minP   = Math.min(...prices);
  const maxP   = Math.max(...prices);
  const range  = maxP - minP || 1;

  const toY = useCallback((price: number, h: number) => {
    const usable = h - PAD.top - PAD.bottom;
    return PAD.top + usable * (1 - (price - minP) / range);
  }, [minP, range]);

  const W = 900;
  const H = 340;
  const usableW = W - PAD.left - PAD.right;
  const candleW = usableW / data.length;
  const bodyW   = Math.max(2, candleW * 0.6);
  const wickX   = (i: number) => PAD.left + i * candleW + candleW / 2;

  // Y-axis ticks
  const tickCount = 6;
  const yTicks = Array.from({ length: tickCount }, (_, i) =>
    minP + (range * i) / (tickCount - 1),
  );

  // X-axis ticks (every ~10 candles)
  const xTickStep = Math.max(1, Math.floor(data.length / 8));
  const xTicks = data
    .map((c, i) => ({ i, label: new Date(c.timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }) }))
    .filter((_, i) => i % xTickStep === 0);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx   = (e.clientX - rect.left) * (W / rect.width) - PAD.left;
    const idx  = Math.min(data.length - 1, Math.max(0, Math.floor(mx / candleW)));
    setHoverIdx(idx);
    const cx = wickX(idx) * (rect.width / W);
    const cy = toY((data[idx].high + data[idx].low) / 2, H) * (rect.height / H);
    setTooltip({ x: cx + rect.left - (containerRef.current?.getBoundingClientRect().left ?? 0), y: cy, candle: data[idx] });
  };
  const handleMouseLeave = () => { setHoverIdx(null); setTooltip(null); };

  const lastClose = data.at(-1)?.close ?? 0;
  const prevClose = data.at(-2)?.close ?? lastClose;
  const isUp      = lastClose >= prevClose;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', background: '#0D1B2A', borderRadius: '6px', overflow: 'hidden', minHeight: '280px' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background */}
        <rect width={W} height={H} fill="#0D1B2A" />

        {/* Grid lines */}
        {yTicks.map((price, i) => {
          const y = toY(price, H);
          return (
            <g key={i}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={W - PAD.right + 5} y={y + 4} fill="rgba(255,255,255,0.35)" fontSize={10} fontFamily="monospace">
                {formatPrice(price)}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {xTicks.map(({ i, label }) => (
          <text key={i} x={wickX(i)} y={H - 8} fill="rgba(255,255,255,0.3)" fontSize={10} textAnchor="middle" fontFamily="monospace">
            {label}
          </text>
        ))}

        {/* Current price line */}
        {(() => {
          const y = toY(lastClose, H);
          return (
            <g>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                    stroke={isUp ? GREEN : RED} strokeWidth={0.8} strokeDasharray="4 3" opacity={0.7} />
              <rect x={W - PAD.right + 2} y={y - 8} width={58} height={16} rx={3}
                    fill={isUp ? GREEN : RED} opacity={0.9} />
              <text x={W - PAD.right + 31} y={y + 4} fill="#fff" fontSize={10} textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                {formatPrice(lastClose)}
              </text>
            </g>
          );
        })()}

        {/* Hover crosshair */}
        {hoverIdx !== null && (
          <line x1={wickX(hoverIdx)} y1={PAD.top} x2={wickX(hoverIdx)} y2={H - PAD.bottom}
                stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        )}

        {/* Candles */}
        {data.map((c, i) => {
          const isGreen = c.close >= c.open;
          const color   = isGreen ? GREEN : RED;
          const cx      = wickX(i);
          const bodyTop    = toY(Math.max(c.open, c.close), H);
          const bodyBottom = toY(Math.min(c.open, c.close), H);
          const bodyH      = Math.max(1, bodyBottom - bodyTop);
          const wickTop    = toY(c.high, H);
          const wickBot    = toY(c.low, H);
          const alpha      = hoverIdx !== null && hoverIdx !== i ? 0.45 : 1;

          return (
            <g key={i} opacity={alpha}>
              {/* Wick */}
              <line x1={cx} y1={wickTop} x2={cx} y2={wickBot} stroke={color} strokeWidth={1} />
              {/* Body */}
              <rect
                x={cx - bodyW / 2}
                y={bodyTop}
                width={bodyW}
                height={bodyH}
                fill={isGreen ? color : 'transparent'}
                stroke={color}
                strokeWidth={isGreen ? 0 : 1}
                rx={1}
              />
            </g>
          );
        })}

        {/* Volume bars at bottom (subtle) */}
        {(() => {
          const maxVol = Math.max(...data.map(c => c.volume));
          const volH   = 28;
          const volY   = H - PAD.bottom - volH;
          return data.map((c, i) => {
            const isGreen = c.close >= c.open;
            const barH    = (c.volume / maxVol) * volH;
            return (
              <rect key={i}
                x={wickX(i) - bodyW / 2}
                y={volY + volH - barH}
                width={bodyW}
                height={barH}
                fill={isGreen ? GREEN : RED}
                opacity={0.25}
                rx={1}
              />
            );
          });
        })()}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: Math.min(tooltip.x + 12, (containerRef.current?.offsetWidth ?? 500) - 170),
          top: Math.max(8, tooltip.y - 60),
          background: 'rgba(10,22,40,0.96)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '11px',
          color: 'white',
          pointerEvents: 'none',
          zIndex: 10,
          minWidth: '160px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: '5px', color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>
            {new Date(tooltip.candle.timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
          {[
            { label: 'Open',   value: formatPrice(tooltip.candle.open),  color: 'rgba(255,255,255,0.8)' },
            { label: 'High',   value: formatPrice(tooltip.candle.high),  color: GREEN },
            { label: 'Low',    value: formatPrice(tooltip.candle.low),   color: RED   },
            { label: 'Close',  value: formatPrice(tooltip.candle.close), color: tooltip.candle.close >= tooltip.candle.open ? GREEN : RED },
            { label: 'Volume', value: `${(tooltip.candle.volume / 1e6).toFixed(2)}M`, color: 'rgba(255,255,255,0.6)' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '2px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{r.label}</span>
              <span style={{ color: r.color, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Symbol label */}
      <div style={{
        position: 'absolute', top: '10px', left: '12px',
        fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.8)',
        letterSpacing: '0.05em', pointerEvents: 'none',
      }}>
        {symbol}
        <span style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: '6px' }}>
          80 Kerzen · Simuliert
        </span>
      </div>
    </div>
  );
}
