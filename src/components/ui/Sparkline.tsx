'use client';
import { useMemo } from 'react';

interface Props {
  data: number[];
  width?: number;
  height?: number;
  isUp?: boolean;
}

export default function Sparkline({ data, width = 80, height = 32, isUp }: Props) {
  const path = useMemo(() => {
    if (data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pad = 2;
    const points = data.map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (width - pad * 2);
      const y = pad + (1 - (v - min) / range) * (height - pad * 2);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  }, [data, width, height]);

  const up = isUp ?? (data.at(-1)! >= data[0]);
  const color = up ? '#00C087' : '#EF4444';

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* Gradient fill */}
      <defs>
        <linearGradient id={`sg-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.03} />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <path d={`${path} L ${width - 2},${height - 2} L 2,${height - 2} Z`}
            fill={`url(#sg-${up})`} />
      {/* Line */}
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {/* Last dot */}
      <circle cx={width - 2} cy={
        2 + (1 - (data.at(-1)! - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * (height - 4)
      } r={2} fill={color} />
    </svg>
  );
}
